'use client'

import Link from 'next/link'
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import {
  DESTINATIONS,
  Destination,
  shuffleHand,
  SUIT_SYMBOLS,
} from '@/lib/cardDeck'
import CardOrbit from './CardOrbit'
import PlayingCard from './PlayingCard'

export default function DetectiveHero() {
  const section = useRef<HTMLElement>(null)
  const hasDealt = useRef(false)
  const [hand, setHand] = useState<Destination[]>(DESTINATIONS)
  const [dealt, setDealt] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const deal = useCallback(() => {
    hasDealt.current = true
    setHand(shuffleHand())
    setDealt(true)
  }, [])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    const onScroll = () => {
      if (
        !hasDealt.current &&
        section.current &&
        section.current.getBoundingClientRect().top < -65
      )
        deal()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      media.removeEventListener('change', update)
      window.removeEventListener('scroll', onScroll)
    }
  }, [deal])
  return (
    <section
      className={`detective-hero ${dealt ? 'has-hand' : ''}`}
      id="home"
      ref={section}
      aria-labelledby="detective-heading"
    >
      <div className="hero-composition">
        <div className="hero-copy">
          <h1 id="detective-heading" tabIndex={-1}>
            Every detail
            <br />
            tells a <em>story.</em>
          </h1>
          <p>An engineer. A curious mind. Follow the clues.</p>
          <button type="button" className="noir-button" onClick={deal}>
            {dealt ? 'Shuffle again' : 'Deal the cards'}
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 16 16 4M5 4h11v11" />
            </svg>
          </button>
        </div>
        <CardOrbit
          dealt={dealt}
          paused={paused}
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
        {!reducedMotion ? (
          <button
            type="button"
            className="motion-toggle"
            aria-pressed={paused}
            aria-label={
              paused ? 'Resume card animation' : 'Pause card animation'
            }
            onClick={() => setPaused((value) => !value)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {paused ? (
                <path d="m7 4 9 6-9 6Z" />
              ) : (
                <path d="M7 4v12M13 4v12" />
              )}
            </svg>
          </button>
        ) : null}
      </div>
      <button type="button" className="draw-divider" onClick={deal}>
        <span>{SUIT_SYMBOLS.spades}</span>
        <span className="red-suit">{SUIT_SYMBOLS.hearts}</span>
        <span className="draw-label">
          {dealt
            ? 'Pick a card. Follow your curiosity.'
            : 'Scroll to draw your hand'}
        </span>
        <span className="red-suit">{SUIT_SYMBOLS.diamonds}</span>
        <span>{SUIT_SYMBOLS.clubs}</span>
      </button>
      <p className="sr-only" aria-live="polite">
        {dealt
          ? 'Six navigation cards have been dealt. Choose a card to navigate.'
          : ''}
      </p>
    </section>
  )
}
