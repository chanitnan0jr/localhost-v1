'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { FULL_DECK } from '@/lib/cardDeck'
import PlayingCard from './PlayingCard'

// Static positions keep the full ring visible before hydration, including reduced motion.
const INITIAL_ORBIT = FULL_DECK.map((_, index) => {
  const ring = index % 3
  const count = Math.ceil((FULL_DECK.length - ring) / 3)
  const angle = Math.floor(index / 3) / count * Math.PI * 2 + ring * .58
  const depth = Math.sin(angle)
  return { ring, angle, depth, x: 51 + Math.cos(angle) * (40.5 + ring * 1.2), y: 46 + (ring - 1) * 14.5 + depth * 24.5 }
})

export default function CardOrbit({
  dealt,
  paused,
  reducedMotion,
}: {
  dealt: boolean
  paused: boolean
  reducedMotion: boolean
}) {
  const stage = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLSpanElement | null)[]>([])
  const animation = useRef({ clock: 0, progress: 0 })
  useEffect(() => {
    const root = stage.current
    if (!root) return
    let width = root.clientWidth
    let height = root.clientHeight
    let frame = 0
    let previous = 0
    let visible = true
    const paint = () => {
      const { clock, progress } = animation.current
      for (let index = 0; index < FULL_DECK.length; index++) {
        const node = nodes.current[index]
        if (!node) continue
        const initial = INITIAL_ORBIT[index]
        const ring = initial.ring
        const angle = initial.angle + clock * 0.085
        const depth = Math.sin(angle)
        const x =
          width * 0.51 +
          Math.cos(angle) *
            width *
            (0.405 + ring * 0.012) *
            (1 - progress * 0.82)
        const y =
          height * (0.46 + (ring - 1) * 0.145) +
          depth * height * 0.245 +
          Math.sin(angle * 3 + ring) * 15
        const scale = (0.6 + (depth + 1) * 0.2) * (1 - progress * 0.65)
        node.style.transform = `translate3d(${x - width * initial.x / 100}px,${y - height * initial.y / 100}px,0) translate(-50%,-50%) perspective(750px) rotateY(${-Math.cos(angle) * 42}deg) rotateZ(${Math.cos(angle) * 12}deg) scale(${scale})`
        node.style.zIndex = String(Math.round(50 + depth * 45))
        node.style.opacity = String((0.5 + (depth + 1) * 0.25) * (1 - progress))
      }
    }
    const tick = (time: number) => {
      const delta = previous ? Math.min((time - previous) / 1000, 0.064) : 0
      previous = time
      if (!paused && !reducedMotion) animation.current.clock += delta
      animation.current.progress = reducedMotion
        ? Number(dealt)
        : animation.current.progress +
          (Number(dealt) - animation.current.progress) * Math.min(delta * 7, 1)
      paint()
      if (
        visible &&
        !document.hidden &&
        ((!paused && !reducedMotion && !dealt) ||
          Math.abs(animation.current.progress - Number(dealt)) > 0.001)
      )
        frame = requestAnimationFrame(tick)
      else frame = 0
    }
    const start = () => {
      if (visible && !document.hidden && !frame) {
        previous = 0
        frame = requestAnimationFrame(tick)
      }
    }
    const resize = new ResizeObserver(() => {
      width = root.clientWidth
      height = root.clientHeight
      paint()
    })
    resize.observe(root)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    observer.observe(root)
    document.addEventListener('visibilitychange', start)
    paint()
    start()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      observer.disconnect()
      document.removeEventListener('visibilitychange', start)
    }
  }, [paused, reducedMotion, dealt])
  return (
    <div
      ref={stage}
      className={`card-orbit ${dealt ? 'is-dealt' : ''}`}
      role="img"
      aria-label="Fifty-two playing cards orbit an original masked phantom thief in a black cape"
    >
      <div className="detective-ground" />
      <Image
        className="detective-figure"
        src="/images/phantom/thief.png"
        width={1024}
        height={1536}
        priority
        alt=""
        sizes="(max-width: 700px) 290px, 390px"
      />
      {FULL_DECK.map((card, index) => (
        <span
          key={card.id}
          data-orbit-card={card.id}
          className="orbit-card"
          style={{
            left: `${INITIAL_ORBIT[index].x}%`, top: `${INITIAL_ORBIT[index].y}%`,
            transform: `translate(-50%,-50%) rotate(${Math.cos(INITIAL_ORBIT[index].angle) * 12}deg) scale(${.6 + (INITIAL_ORBIT[index].depth + 1) * .2})`,
            opacity: .5 + (INITIAL_ORBIT[index].depth + 1) * .25,
            zIndex: Math.round(50 + INITIAL_ORBIT[index].depth * 45),
          }}
          ref={(node) => {
            nodes.current[index] = node
          }}
        >
          <PlayingCard card={card} back={index % 3 === 1} />
        </span>
      ))}
    </div>
  )
}
