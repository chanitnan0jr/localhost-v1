'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { TIMELINE_CHAPTERS } from '@/lib/portfolioTimeline'

const number = (index: number) => String(index + 1).padStart(2, '0')

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ transform: back ? 'rotate(180deg)' : undefined }}><path d="m8 4 8 8-8 8" /></svg>
}

export default function PortfolioTimeline() {
  const { openGallery } = useModalContext()
  const [selected, setSelected] = useState(0)
  const swipeStart = useRef<number | null>(null)
  const swiped = useRef(false)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const chapter = TIMELINE_CHAPTERS[selected]
  const shown = chapter.timelinePhoto ?? chapter.photos[0]
  const icpcRound = chapter.title.startsWith('ICPC ') ? chapter.title.slice(5) : null

  function select(index: number, focus = false) {
    const next = (index + TIMELINE_CHAPTERS.length) % TIMELINE_CHAPTERS.length
    setSelected(next)
    if (focus) buttons.current[next]?.focus({ preventScroll: true })
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: TIMELINE_CHAPTERS.length - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <div className="portfolio-timeline" id="gallery">
      <section className="timeline-overview" aria-labelledby="timeline-heading">
        <p className="story-section-label"><span>02</span> / Competition Timeline</p>
        <header className="timeline-heading"><h2 id="timeline-heading">The story <em>so far.</em></h2></header>
        <p className="timeline-case-count">Case {number(selected)} / {String(TIMELINE_CHAPTERS.length).padStart(2, '0')}</p>
        <button type="button" className="timeline-visual" key={chapter.id} aria-label={`Open ${chapter.title} gallery, ${chapter.photos.length} photos`}
          // A swipe changes chapter; only a tap or click opens the gallery at the photo on screen.
          onClick={() => { if (!swiped.current) openGallery(chapter.title, chapter.photos, Math.max(0, chapter.photos.findIndex(photo => photo.src === shown.src))) }}
          onPointerDown={event => { swiped.current = false; if (event.pointerType === 'touch') swipeStart.current = event.clientX }}
          onPointerCancel={() => { swipeStart.current = null }} onPointerUp={event => {
            if (swipeStart.current === null) return
            const distance = event.clientX - swipeStart.current
            swipeStart.current = null
            if (Math.abs(distance) > 50) {
              swiped.current = true
              select(selected + (distance < 0 ? 1 : -1))
            }
          }}>
          <Image src={shown.src} alt={shown.alt} fill sizes="(max-width: 760px) 100vw, 75vw" />
        </button>
        <div className="timeline-copy" data-chapter={chapter.id}>
          <p className="timeline-case-label">Case file {number(selected)}</p>
          <h3 className={`timeline-title${icpcRound || chapter.title.length <= 6 ? ' is-short' : ''}`}>{icpcRound ? 'ICPC' : chapter.title}</h3>
          {icpcRound && <p className="timeline-round">{icpcRound}</p>}
          <p className="timeline-caption">{chapter.caption.split(/(?<=\.)\s+/).map(line => <span key={line}>{line}</span>)}</p>
          <p className="timeline-mood">{chapter.badgeText}</p>
          <p className="timeline-tagline">Six chapters. One evolving persona.</p>
        </div>
        <div className="timeline-bottom">
          <div className="timeline-progress" role="group" aria-label="Choose a chapter" style={{ '--chapter-count': TIMELINE_CHAPTERS.length } as CSSProperties}>
            {TIMELINE_CHAPTERS.map((item, index) => <button type="button" key={item.id} ref={node => { buttons.current[index] = node }} aria-label={`Go to chapter ${number(index)}: ${item.title}`} aria-pressed={selected === index} onClick={() => select(index)} onKeyDown={event => navigate(event, index)}><span /><strong>{number(index)}</strong><small>{item.title}</small></button>)}
          </div>
          <div className="timeline-pagination">
            <button className="timeline-arrow" type="button" aria-label="Previous chapter" onClick={() => select(selected - 1)}><Arrow back /></button>
            <span aria-hidden="true">{number(selected)} / {String(TIMELINE_CHAPTERS.length).padStart(2, '0')}</span>
            <button className="timeline-arrow" type="button" aria-label="Next chapter" onClick={() => select(selected + 1)}><Arrow /></button>
          </div>
        </div>
      </section>
      <p className="sr-only" role="status">Chapter {number(selected)} of {TIMELINE_CHAPTERS.length}: {chapter.title}. {chapter.badgeText}</p>
    </div>
  )
}
