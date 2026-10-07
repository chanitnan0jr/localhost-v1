'use client'

import Image from 'next/image'
import CoreStack from '@/components/home/CoreStack'
import { useState, useEffect, useCallback } from 'react'

function VisitorBadge() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/track', { method: 'POST', signal: controller.signal })
      .catch(() => {})
      .then(async () => {
        if (controller.signal.aborted) return
        const response = await fetch('/api/visitors', { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (typeof data.total === 'number') setCount(data.total)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  if (count === null) return null

  return (
    <div className="about-visitor-badge" aria-label={`Visitor count: ${count}`}>
      <span className="material-symbols-outlined text-sm leading-none" aria-hidden="true">visibility</span>
      <span className="about-visitor-text">
        VISIT ({count.toLocaleString()})
      </span>
    </div>
  )
}

const ABOUT_PHOTOS = [
  {
    src: '/images/CSTUSPARK/CSTUSPARK1.jpg',
    alt: 'Chanitnan and team collaborating at CSTU Spark Camp Hackathon',
    caption: 'CSTU SPARK CAMP',
  },
  {
    src: '/images/CSTUSPARK/CSTUSPARK2.jpg',
    alt: 'CSTU Spark Camp cohort at KBTG and KBank event',
    caption: 'CSTU SPARK CAMP',
  },
]

export default function About() {
  // Start on index 1 (CSTUSPARK2.jpg - 02 / 02) matching the reference photograph
  const [currentIndex, setCurrentIndex] = useState(1)

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? ABOUT_PHOTOS.length - 1 : prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === ABOUT_PHOTOS.length - 1 ? 0 : prev + 1))
  }, [])

  const currentPhoto = ABOUT_PHOTOS[currentIndex]

  return (
    <section
      className="noir-about"
      id="about-detailed"
      aria-labelledby="about-heading"
    >
      {/* Top-Left Section Marker */}
      <div className="about-header-bar">
        <p className="story-section-label">
          <span>03</span> / ABOUT ME
        </p>
        <VisitorBadge />
      </div>

      <div className="about-main">
        <div className="about-layout-grid">
          {/* Left Column: Identity & Philosophy (Approx 42% width) */}
          <div className="about-left-col">
            <h2 id="about-heading" className="about-hero-title">
              <span className="about-title-line">THE MIND</span>
              <span className="about-title-line">BEHIND THE</span>
              <span className="about-title-line about-title-crimson">MASK.</span>
            </h2>

            <div className="about-author-block">
              <h3 className="about-author-name">CHANITNAN KITNANTAKHUN</h3>
              <p className="about-author-role">
                Backend <span className="about-role-slash">/</span> Systems Engineer
              </p>
            </div>

            <div className="about-social-row" aria-label="Social profiles">
              <a
                href="https://github.com/chanitnan0jr"
                target="_blank"
                rel="noopener noreferrer"
                className="about-icon-btn about-btn-github"
                aria-label="GitHub profile (opens in a new tab)"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/chanitnan-kitnantakhun-96a692391/"
                target="_blank"
                rel="noopener noreferrer"
                className="about-icon-btn about-btn-dark"
                aria-label="LinkedIn profile (opens in a new tab)"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://discordapp.com/users/792394993817092126"
                target="_blank"
                rel="noopener noreferrer"
                className="about-icon-btn about-btn-dark"
                aria-label="Discord profile (opens in a new tab)"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>

            {/* Unboxed Philosophy Block */}
            <div className="about-philosophy-block">
              <span className="about-philosophy-tag">PHILOSOPHY</span>
              <blockquote className="about-philosophy-quote">
                <p>
                  “Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.”
                </p>
                <footer className="about-philosophy-author">— Brian Kernighan</footer>
              </blockquote>
            </div>
          </div>

          {/* Right Gallery: Persona-Inspired Framing (Approx 58% width) */}
          <div className="about-right-col" role="group" aria-label="Moments photographs">
            <div className="about-persona-card">
              <p className="about-moments-label">Moments</p>
              {/* Crimson Backing Plate */}
              <div className="about-persona-backing" aria-hidden="true" />

              {/* Angular Ivory Silhouette Frame */}
              <div className="about-persona-border">
                <div className="about-persona-inner">
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.alt}
                    fill
                    sizes="(max-width: 960px) 100vw, 58vw"
                    priority={currentIndex === 1}
                    className="about-persona-img"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Controls */}
            <div className="about-gallery-controls">
              <div className="about-gallery-meta">
                <span className="about-gallery-caption">{currentPhoto.caption}</span>
                <span className="about-gallery-counter">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(ABOUT_PHOTOS.length).padStart(2, '0')}
                </span>
                <div className="about-gallery-dots" role="group" aria-label="Photo pagination">
                  {ABOUT_PHOTOS.map((photo, idx) => (
                    <button
                      key={photo.src}
                      type="button"
                      aria-pressed={idx === currentIndex}
                      aria-label={`Go to photograph ${idx + 1}`}
                      className={`about-gallery-dot ${idx === currentIndex ? 'is-active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              </div>

              <div className="about-gallery-arrows">
                <button
                  type="button"
                  className="about-arrow-btn"
                  aria-label="Previous photograph"
                  onClick={handlePrev}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="about-arrow-btn"
                  aria-label="Next photograph"
                  onClick={handleNext}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="about-thumbnails" role="group" aria-label="Choose a moment">
              {ABOUT_PHOTOS.map((photo, idx) => (
                <button
                  key={photo.src}
                  type="button"
                  className="about-thumbnail"
                  aria-label={`Select photograph ${idx + 1}: ${photo.caption}`}
                  aria-pressed={idx === currentIndex}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <Image src={photo.src} alt="" fill sizes="(max-width: 960px) 45vw, 24vw" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="about-stack-wrap"><CoreStack /></div>
    </section>
  )
}
