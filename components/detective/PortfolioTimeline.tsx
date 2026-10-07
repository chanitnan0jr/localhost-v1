'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useModalContext } from '@/context/ModalContext'
import { TIMELINE_CHAPTERS } from '@/lib/portfolioTimeline'

const number = (index: number) => String(index + 1).padStart(2, '0')
const scrollBehavior = (): ScrollBehavior => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ transform: back ? 'rotate(180deg)' : undefined }}><path d="m8 4 8 8-8 8" /></svg>
}

export default function PortfolioTimeline() {
  const { openModal } = useModalContext()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [selected, setSelected] = useState(2)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const swipeStart = useRef<number | null>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const heading = useRef<HTMLHeadingElement>(null)
  const chapter = TIMELINE_CHAPTERS[selected]
  const icpcRound = chapter.title.startsWith('ICPC ') ? chapter.title.slice(5) : null
  const [titleLead, ...titleRest] = chapter.title.split(' ')
  const photoOrder = [photoIndex, ...chapter.photos.map((_, index) => index).filter(index => index !== photoIndex)].slice(0, 3)
  const photoLabels = chapter.id === 'sustainovation' ? ['With my team', 'Team moments', 'A moment to keep'] : ['Main evidence', 'More from this chapter', 'A moment to keep']

  function select(index: number, focus = false) {
    const next = (index + TIMELINE_CHAPTERS.length) % TIMELINE_CHAPTERS.length
    setSelected(next)
    setPhotoIndex(0)
    setEvidenceOpen(false)
    if (focus) buttons.current[next]?.focus({ preventScroll: true })
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: TIMELINE_CHAPTERS.length - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  function openEvidence(index = selected) {
    select(index)
    setEvidenceOpen(true)
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true })
      document.getElementById('timeline-evidence')?.scrollIntoView({ block: 'start', behavior: scrollBehavior() })
    })
  }

  function backToTimeline() {
    setEvidenceOpen(false)
    buttons.current[selected]?.focus({ preventScroll: true })
    document.getElementById('gallery')?.scrollIntoView({ block: 'start', behavior: scrollBehavior() })
  }

  return (
    <div className="portfolio-timeline" id="gallery">
      <section className="timeline-overview" aria-labelledby="timeline-heading">
        <p className="story-section-label"><span>02</span> / Competition Timeline</p>
        <header className="timeline-heading"><h2 id="timeline-heading">The story <em>so far.</em></h2></header>
        <p className="timeline-case-count">Case {number(selected)} / {String(TIMELINE_CHAPTERS.length).padStart(2, '0')}</p>
        <div className="timeline-visual" key={chapter.id} onPointerDown={event => { if (event.pointerType === 'touch') swipeStart.current = event.clientX }}
          onPointerCancel={() => { swipeStart.current = null }} onPointerUp={event => {
            if (swipeStart.current === null) return
            const distance = event.clientX - swipeStart.current
            swipeStart.current = null
            if (Math.abs(distance) > 50) select(selected + (distance < 0 ? 1 : -1))
          }}>
          <Image src={chapter.timelinePhoto?.src ?? chapter.photos[0].src} alt={chapter.timelinePhoto?.alt ?? chapter.photos[0].alt} fill sizes="(max-width: 760px) 100vw, 75vw" />
        </div>
        <div className="timeline-copy" data-chapter={chapter.id}>
          <p className="timeline-case-label">Case file {number(selected)}</p>
          <h3 className={`timeline-title${icpcRound || chapter.title.length <= 6 ? ' is-short' : ''}`}>{icpcRound ? 'ICPC' : chapter.title}</h3>
          {icpcRound && <p className="timeline-round">{icpcRound}</p>}
          <p className="timeline-caption">{chapter.caption.split(/(?<=\.)\s+/).map(line => <span key={line}>{line}</span>)}</p>
          <p className="timeline-mood">{chapter.badgeText}</p>
          <p className="timeline-tagline">Five chapters. One evolving persona.</p>
        </div>
        <button className="timeline-view-evidence" type="button" aria-expanded={evidenceOpen} aria-controls="timeline-evidence" onClick={() => openEvidence()}><span>View evidence</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7" /></svg></button>
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
      <section id="timeline-evidence" className="timeline-evidence" aria-labelledby="evidence-heading" hidden={!evidenceOpen} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); backToTimeline() } }}>
        <div className="evidence-topline">
          <p className="story-section-label"><span>04</span> / Evidence</p>
          <header className="evidence-heading">
            <h3 id="evidence-heading" ref={heading} tabIndex={-1}>{titleLead}{titleRest.length > 0 && <> <em>{titleRest.join(' ')}</em></>}</h3>
            <p>Case {number(selected)} / {chapter.mood}</p>
          </header>
        </div>
        <div className="evidence-board" key={chapter.id} data-evidence={chapter.id}>
          <svg className="evidence-threads" viewBox="0 0 1200 650" preserveAspectRatio="none" aria-hidden="true"><path d="M210 70 600 60 960 35M600 60 1110 420M960 35 940 360 1110 420" /></svg>
          <aside className="evidence-field-notes" aria-label="Chapter field notes">
            <h4>Field notes</h4>
            <p className="field-case">Case {number(selected)}<strong>{chapter.mood}</strong></p>
            <p>{chapter.caption}</p>
            <p>The people behind<br />the work.</p>
          </aside>
          {photoOrder.map((imageIndex, slot) => {
            const photo = chapter.photos[imageIndex]
            return <figure className={`evidence-print evidence-print-${slot + 1}`} key={slot}>
              <i className="evidence-pin" aria-hidden="true" />
              <button type="button" onClick={() => slot === 0 ? openModal(photo.src) : setPhotoIndex(imageIndex)} aria-label={`${slot === 0 ? 'Expand' : 'Show'} photo ${number(imageIndex)}: ${photo.alt}`}>
                <span className="evidence-photo"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1400px) 50vw, 900px" /></span>
                <span className="evidence-photo-caption"><strong>{number(imageIndex)} /</strong> {photoLabels[imageIndex] ?? 'A moment away'}{slot === 0 && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-8 8M10 20H4v-6M4 20l8-8" /></svg>}</span>
              </button>
            </figure>
          })}
          <p className="evidence-note evidence-note-1">{chapter.notes[0]}</p>
          <p className="evidence-note evidence-note-2">{chapter.notes[1]}</p>
        </div>
        <div className="evidence-footer">
          <p>{chapter.summary}</p>
          <div className="evidence-photo-navigation">
            <button type="button" aria-label="Previous evidence photo" onClick={() => setPhotoIndex((photoIndex + chapter.photos.length - 1) % chapter.photos.length)}><Arrow back /></button>
            <span className="evidence-count" aria-live="polite">{number(photoIndex)} / {String(chapter.photos.length).padStart(2, '0')}</span>
            <button type="button" aria-label="Next evidence photo" onClick={() => setPhotoIndex((photoIndex + 1) % chapter.photos.length)}><Arrow /></button>
          </div>
          <button type="button" onClick={backToTimeline}><Arrow back /> Back to timeline</button>
        </div>
      </section>
      <p className="sr-only" role="status">Chapter {number(selected)} of {TIMELINE_CHAPTERS.length}: {chapter.title}. {chapter.badgeText}</p>
    </div>
  )
}
