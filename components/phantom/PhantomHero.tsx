'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CardOrbit from './CardOrbit'

export default function PhantomHero() {
  const section = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const root = section.current
    if (!root) return
    let visible = true
    let running = false
    const update = () => {
      running = visible && !document.hidden && !reducedMotion
      root.dataset.motion = running ? 'running' : 'paused'
    }
    const reset = () => {
      root.style.setProperty('--hero-pointer-x', '0px')
      root.style.setProperty('--hero-pointer-y', '0px')
    }
    const follow = (event: PointerEvent) => {
      if (!running || event.pointerType !== 'mouse') return
      const rect = root.getBoundingClientRect()
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
      root.style.setProperty('--hero-pointer-x', `${x * 12}px`)
      root.style.setProperty('--hero-pointer-y', `${y * 6}px`)
    }
    const leave = () => { if (running) reset() }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(root)
    if (reducedMotion) reset()
    update()
    root.addEventListener('pointermove', follow, { passive: true })
    root.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      root.removeEventListener('pointermove', follow)
      root.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', update)
      root.dataset.motion = 'paused'
    }
  }, [reducedMotion])
  return (
    <section
      className="phantom-hero"
      id="home"
      ref={section}
      aria-labelledby="phantom-heading"
      data-motion="paused"
    >
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="hero-composition">
        <span className="hero-identity">A curious mind. Always one move ahead.</span>
        <div className="hero-copy">
          <h1 id="phantom-heading" tabIndex={-1}>
            <span>Every detail</span>
            <br />
            <span>Tells your</span>
            <br />
            <em>story.</em>
          </h1>
        </div>
        <p className="hero-manifesto">
          <span>Every story</span>
          <br />
          <span>Shapes your</span>
          <br />
          <em>persona.</em>
        </p>
        {/* Opens the terminal, which types and runs play for the visitor. */}
        <Link href="/terminal?run=play" className="noir-button" aria-label="Play the card duel in the terminal">
          Play
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 16 16 4M5 4h11v11" />
          </svg>
        </Link>
        <CardOrbit
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  )
}
