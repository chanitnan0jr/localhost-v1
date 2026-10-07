'use client'

import Link from 'next/link'
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import {
  DESTINATIONS,
  Destination,
  shuffleHand,
} from '@/lib/cardDeck'
import CardOrbit from './CardOrbit'
import PlayingCard from './PlayingCard'

export default function DetectiveHero() {
  const section = useRef<HTMLElement>(null)
  const [hand, setHand] = useState<Destination[]>(DESTINATIONS)
  const [dealt, setDealt] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const deal = useCallback(() => {
    setHand(shuffleHand())
    setDealt(true)
  }, [])
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
      if (!running || dealt || event.pointerType !== 'mouse') return
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
    if (reducedMotion || dealt) reset()
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
  }, [reducedMotion, dealt])
  return (
    <section
      className={`detective-hero ${dealt ? 'has-hand' : ''}`}
      id="home"
      ref={section}
      aria-labelledby="detective-heading"
      data-motion="paused"
    >
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="hero-composition">
        <span className="hero-identity">A curious mind. Always one move ahead.</span>
        <div className="hero-copy">
          <h1 id="detective-heading" tabIndex={-1}>
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
        <button type="button" className="noir-button" onClick={deal}>
          {dealt ? 'Shuffle again' : 'Deal the cards'}
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 16 16 4M5 4h11v11" />
          </svg>
        </button>
        <CardOrbit
          reducedMotion={reducedMotion}
        />
        <nav
          className={`dealt-hand ${dealt ? 'is-visible' : ''}`}
          aria-label="Card navigation"
          aria-hidden={!dealt}
        >
          {hand.map((card, index) => (
            <Link
              key={card.id}
              href={card.href}
              className="destination-card"
              tabIndex={dealt ? 0 : -1}
              style={{ '--deal-index': index } as CSSProperties}
              aria-label={`${card.rank} of ${card.suit}: ${card.label}`}
            >
              <PlayingCard card={card} />
              <span className="destination-label">{card.label}</span>
              <span className="destination-description">
                {card.description}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <p className="sr-only" aria-live="polite">
        {dealt
          ? 'Six navigation cards have been dealt. Choose a card to navigate.'
          : ''}
      </p>
    </section>
  )
}
