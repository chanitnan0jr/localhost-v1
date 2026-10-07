'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { FULL_DECK } from '@/lib/cardDeck'
import PlayingCard from './PlayingCard'

function orbitPose(angle: number, ring: number) {
  const depth = Math.sin(angle)
  return {
    ring,
    depth,
    x: 50 + Math.cos(angle) * (47 - ring * 1.5),
    y: 52 + depth * (36 - ring * 3.5),
    scale: ring === 0 ? .58 + (depth + 1) * .5 : .44 + (depth + 1) * .28,
    yaw: -Math.cos(angle) * 32,
    tilt: Math.cos(angle) * 22 + Math.sin(angle * 2 + ring) * 8,
  }
}

function orbitLayers(poses: ReturnType<typeof orbitPose>[]) {
  let back = 0
  let front = 50
  const layers: number[] = []
  // Sort exact depths, rather than rounding them into colliding z-index buckets.
  poses.map((pose, index) => ({ ...pose, index }))
    .sort((a, b) => Number(a.ring === 0) - Number(b.ring === 0) || a.depth - b.depth || a.index - b.index)
    .forEach(({ depth, index }) => { layers[index] = depth <= 0 ? ++back : ++front })
  return layers
}

// The server and first animation frame use the same pose, also when motion is disabled.
const INITIAL_ORBIT = FULL_DECK.map((_, index) => {
  const ring = index % 3
  const count = Math.ceil((FULL_DECK.length - ring) / 3)
  const slot = Math.floor(index / 3)
  const angle = slot / count * Math.PI * 2 + ring * .58
  return { angle, ...orbitPose(angle, ring) }
})
const INITIAL_LAYERS = orbitLayers(INITIAL_ORBIT)

export default function CardOrbit({
  reducedMotion,
}: {
  reducedMotion: boolean
}) {
  const stage = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLSpanElement | null)[]>([])
  const clock = useRef(0)
  useEffect(() => {
    const root = stage.current
    if (!root) return
    let width = root.clientWidth
    let height = root.clientHeight
    let frame = 0
    let previous = 0
    let visible = true
    const paint = () => {
      const poses = INITIAL_ORBIT.map((initial) => orbitPose(initial.angle + clock.current * (.075 + initial.ring * .012), initial.ring))
      const layers = orbitLayers(poses)
      for (let index = 0; index < FULL_DECK.length; index++) {
        const node = nodes.current[index]
        if (!node) continue
        const initial = INITIAL_ORBIT[index]
        const pose = poses[index]
        node.style.transform = `translate3d(${width * (pose.x - initial.x) / 100}px,${height * (pose.y - initial.y) / 100}px,0) translate(-50%,-50%) perspective(750px) rotateY(${pose.yaw}deg) rotateZ(${pose.tilt}deg) scale(${pose.scale})`
        node.style.zIndex = String(layers[index])
      }
    }
    const tick = (time: number) => {
      const delta = previous ? Math.min((time - previous) / 1000, 0.064) : 0
      previous = time
      if (!reducedMotion) clock.current += delta
      paint()
      if (visible && !document.hidden && !reducedMotion)
        frame = requestAnimationFrame(tick)
      else frame = 0
    }
    const start = () => {
      if (visible && !document.hidden && !frame) {
        previous = 0
        frame = requestAnimationFrame(tick)
      }
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else start()
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
    document.addEventListener('visibilitychange', onVisibilityChange)
    paint()
    start()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [reducedMotion])
  return (
    <div
      ref={stage}
      className="card-orbit"
      role="img"
      aria-label="Fifty-two playing cards orbit an original masked phantom thief in a black cape"
    >
      <div className="detective-ground" />
      <Image
        className="detective-figure"
        src="/images/phantom/cardsharp-hero.webp"
        width={1536}
        height={1024}
        priority
        decoding="sync"
        alt=""
        sizes="(max-width: 700px) 145vw, (max-width: 1680px) 96vw, 1613px"
      />
      {FULL_DECK.map((card, index) => (
        <span
          key={card.id}
          data-orbit-card={card.id}
          className="orbit-card"
          style={{
            left: `${INITIAL_ORBIT[index].x}%`, top: `${INITIAL_ORBIT[index].y}%`,
            transform: `translate3d(0,0,0) translate(-50%,-50%) perspective(750px) rotateY(${INITIAL_ORBIT[index].yaw}deg) rotateZ(${INITIAL_ORBIT[index].tilt}deg) scale(${INITIAL_ORBIT[index].scale})`,
            opacity: 1,
            zIndex: INITIAL_LAYERS[index],
            filter: INITIAL_ORBIT[index].ring === 0 ? 'none' : 'brightness(.6)',
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
