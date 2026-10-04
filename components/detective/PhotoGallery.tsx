'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { clampPhotoPosition, GALLERY_PHOTOS, PHOTO_POSITIONS, shufflePhotoOrder, swapCenterPhoto, type PhotoPosition } from '@/lib/photoGallery'

const FILTERS = ['All', 'Competitions', 'Behind the scenes'] as const
type Photo = typeof GALLERY_PHOTOS[number]

function Camera() {
  return (
    <svg viewBox="0 0 260 180" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="camera-metal" x2="0.2" y2="1"><stop stopColor="#eee9db" /><stop offset=".4" stopColor="#303030" /><stop offset="1" stopColor="#0c0b0a" /></linearGradient>
        <radialGradient id="camera-glass"><stop stopColor="#272f2f" /><stop offset=".5" stopColor="#060b0c" /><stop offset=".85" stopColor="#27241b" /><stop offset="1" stopColor="#090908" /></radialGradient>
        <pattern id="camera-leather" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#171512" /><circle cx="1" cy="1" r=".6" fill="#3c3529" /></pattern>
      </defs>
      <path d="M10 40 89 25l18-20h51l19 20 69 10v119l-10 10H22l-12-12Z" fill="url(#camera-metal)" stroke="#eee9db" strokeWidth="2" />
      <path d="M16 69h224v80H16Z" fill="url(#camera-leather)" stroke="#eee9db" />
      <path d="m99 31 14-19h38l17 20Z" fill="#24221d" stroke="#eee9db" />
      <rect x="182" y="40" width="38" height="20" rx="3" fill="#080b0c" stroke="#eee9db" strokeWidth="2" />
      <ellipse cx="48" cy="38" rx="22" ry="9" fill="#151511" stroke="#eee9db" strokeWidth="2" />
      <ellipse cx="48" cy="35" rx="14" ry="5" fill="#514632" stroke="#c2af8b" />
      <rect x="202" y="21" width="19" height="10" rx="3" fill="#e12637" />
      <circle cx="135" cy="107" r="61" fill="#100f0d" stroke="#eee9db" strokeWidth="3" />
      <circle cx="135" cy="107" r="53" fill="none" stroke="#463e2e" strokeWidth="7" strokeDasharray="2 3" />
      <circle cx="135" cy="107" r="43" fill="#171610" stroke="#e12637" strokeWidth="2" />
      <circle cx="135" cy="107" r="34" fill="url(#camera-glass)" stroke="#4f4937" strokeWidth="4" />
      <ellipse cx="125" cy="95" rx="13" ry="8" fill="#a5b6ad" opacity=".12" transform="rotate(-35 125 95)" />
      <circle cx="29" cy="137" r="4" fill="#a49676" /><path d="M26 137h6" stroke="#27231a" />
      <text x="135" y="75" textAnchor="middle" fill="#eee9db" fontSize="7" letterSpacing="2">COLLECTED MOMENTS</text>
    </svg>
  )
}

function GalleryPhoto({ photo, position, selected, expanded, inspecting, mobile, reduced, layer, onMove, onSelect }: {
  photo: Photo; position: PhotoPosition; selected: boolean; expanded: boolean; inspecting: boolean
  mobile: boolean; reduced: boolean; layer: number
  onMove: (position: PhotoPosition) => void; onSelect: () => void
}) {
  const gesture = useRef<null | { id: number; x: number; y: number; position: PhotoPosition; width: number; height: number; marginX: number; marginY: number }>(null)
  const moved = useRef(false)
  const [dragging, setDragging] = useState(false)

  function bounds(element: HTMLElement) {
    const board = element.parentElement!.getBoundingClientRect()
    const card = element.getBoundingClientRect()
    return {
      width: board.width, height: board.height,
      x: (card.left + card.width / 2 - board.left) / board.width * 100,
      y: (card.top + card.height / 2 - board.top) / board.height * 100,
      marginX: card.width / board.width * 50 + 3, marginY: card.height / board.height * 50 + 3,
    }
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    moved.current = false
    if (mobile || inspecting || event.button !== 0 || (event.pointerType !== 'mouse' && !(event.target as HTMLElement).closest('.photo-grip'))) return
    const geometry = bounds(event.currentTarget)
    gesture.current = { ...geometry, id: event.pointerId, x: event.clientX, y: event.clientY, position: { ...position, x: geometry.x, y: geometry.y } }
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const active = gesture.current
    if (!active || active.id !== event.pointerId) return
    const dx = event.clientX - active.x, dy = event.clientY - active.y
    if (!moved.current && Math.hypot(dx, dy) < 6) return
    moved.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    onMove(clampPhotoPosition({ ...active.position, x: active.position.x + dx / active.width * 100, y: active.position.y + dy / active.height * 100 }, active.marginX, active.marginY))
  }

  function finish() { gesture.current = null; setDragging(false) }

  function moveWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key]
    if (!direction) return
    event.preventDefault()
    const step = event.shiftKey ? 5 : 2
    const { x, y, marginX, marginY } = bounds(event.currentTarget.parentElement!)
    onMove(clampPhotoPosition({ ...position, x: x + direction[0] * step, y: y + direction[1] * step }, marginX, marginY))
  }

  return (
    <motion.div layout={!dragging && !mobile && !reduced} transition={{ layout: { duration: .3, ease: [.2, .8, .2, 1] } }}
      className={`gallery-photo${selected ? ' is-selected' : ''}${dragging ? ' is-dragging' : ''}`}
      data-photo={photo.id} style={{ '--photo-x': `${position.x}%`, '--photo-y': `${position.y}%`, zIndex: dragging ? 30 : selected ? 20 : layer, '--photo-rotation': `${position.rotation}deg` } as CSSProperties}
      onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}>
      <button type="button" className="photo-open" aria-label={`Read the story: ${photo.title}`} aria-expanded={expanded}
        aria-controls={expanded ? 'photo-note' : undefined} onClick={(event) => { if (event.detail === 0 || !moved.current) onSelect() }}>
        <span className="photo-image"><Image src={photo.src} alt={photo.alt} fill draggable={false} sizes="(max-width: 760px) 90vw, (max-width: 1100px) 55vw, 700px" /></span>
        <span className="photo-caption">{photo.title}</span>
      </button>
      {!mobile && !inspecting && <button type="button" className="photo-grip" aria-label={`Move ${photo.title}`} aria-describedby="gallery-instructions" onKeyDown={moveWithKeyboard}>
        <span aria-hidden="true">⠿</span>
      </button>}
      {selected && inspecting && <span key={photo.id} className="photo-wipe" aria-hidden="true" />}
    </motion.div>
  )
}

export default function PhotoGallery() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>('All')
  const [positions, setPositions] = useState(PHOTO_POSITIONS)
  const [order, setOrder] = useState<string[]>(GALLERY_PHOTOS.map((photo) => photo.id))
  const [noteOpen, setNoteOpen] = useState(true)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [front, setFront] = useState<string | null>(null)
  const [shuffle, setShuffle] = useState(0)
  const [mobile, setMobile] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const gallery = useRef<HTMLElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const visible = order.map((id) => GALLERY_PHOTOS.find((photo) => photo.id === id)!).filter((photo) => filter === 'All' || photo.category === filter)
  const selected = visible.find((photo) => photo.id === focusedId) ?? visible[0]
  const displayOrder = focusedId ? swapCenterPhoto(visible.map((photo) => photo.id), focusedId) : visible.map((photo) => photo.id)
  const inspecting = !!focusedId && !mobile

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setMobile(media.matches); setFocusedId(null); if (board.current) board.current.scrollLeft = 0 }
    const updateMotion = () => setReduced(preference.matches)
    update()
    updateMotion()
    media.addEventListener('change', update)
    preference.addEventListener('change', updateMotion)
    return () => { media.removeEventListener('change', update); preference.removeEventListener('change', updateMotion) }
  }, [])

  function select(photo: Photo, scroll = true) {
    setFocusedId(photo.id)
    setFront(null)
    setNoteOpen(true)
    setAnnouncement(`Photo note: ${photo.title}. ${photo.note}`)
    if (mobile && scroll) {
      const element = board.current?.querySelector<HTMLElement>(`[data-photo="${photo.id}"]`)
      if (element) board.current?.scrollTo({ left: element.offsetLeft, behavior: reduced ? 'instant' : 'smooth' })
    }
  }

  function close() {
    setNoteOpen(false)
    if (!mobile) setFocusedId(null)
    gallery.current?.querySelector<HTMLButtonElement>(`[data-photo="${selected.id}"] .photo-open`)?.focus({ preventScroll: true })
    setAnnouncement(mobile ? 'Calling card closed.' : 'Calling card closed. Photo returned to the table.')
  }

  function step(direction: number) {
    select(visible[(visible.indexOf(selected) + direction + visible.length) % visible.length])
  }

  function restoreView() {
    setFocusedId(null); setNoteOpen(true)
    if (board.current) board.current.scrollLeft = 0
  }

  return (
    <section className="moment-gallery" id="gallery" aria-labelledby="gallery-heading" ref={gallery}
      onKeyDown={(event) => {
        if (event.defaultPrevented) return
        if (event.key === 'Escape' && noteOpen) { event.preventDefault(); close() }
        if (['ArrowLeft', 'ArrowRight'].includes(event.key) && (event.target as HTMLElement).closest('.photo-open')) {
          event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}>
      <header className="gallery-heading">
        <button className="gallery-camera" type="button" aria-label="Shuffle photo arrangement" disabled={visible.length < 2} onClick={() => {
          const visibleIds = new Set<string>(visible.map((photo) => photo.id))
          const next = shufflePhotoOrder(order.filter((id) => visibleIds.has(id)))
          setOrder(order.map((id) => visibleIds.has(id) ? next.shift()! : id)); restoreView(); setShuffle((count) => count + 1)
          setAnnouncement('Photos shuffled. The calling card describes the center photo.')
        }}><Camera /><span>Click to shuffle ↗</span></button>
        <div className="gallery-title"><p className="gallery-eyebrow">Gallery / A few stolen moments</p><h2 id="gallery-heading">Collected <em>moments.</em></h2><p>Pick a photo. Read its story.</p></div>
        <div className="gallery-filters" role="group" aria-label="Filter photos">
          {FILTERS.map((category) => <button type="button" key={category} aria-pressed={filter === category} onClick={() => {
            const matching = GALLERY_PHOTOS.filter((photo) => category === 'All' || photo.category === category)
            setFilter(category)
            if (!matching.some((photo) => photo.id === order[0])) setOrder((current) => swapCenterPhoto(current, matching[0].id))
            restoreView(); setAnnouncement(`${category}: ${matching.length} photos.`)
          }}>{category}</button>)}
        </div>
      </header>
      <div className="gallery-table">
        <div className={`photo-board${inspecting ? ' is-inspecting' : ''}${shuffle ? ` shuffle-${shuffle % 2 ? 'one' : 'two'}` : ''}`} ref={board}
          aria-label={mobile ? 'Photo carousel. Swipe to change photos.' : 'Photographs on a table'}
          onScroll={() => {
            if (!mobile || !board.current) return
            const children = Array.from(board.current.querySelectorAll<HTMLElement>('[data-photo]'))
            const closest = children.reduce((near, item) => Math.abs(item.offsetLeft - board.current!.scrollLeft) < Math.abs(near.offsetLeft - board.current!.scrollLeft) ? item : near)
            const photo = visible.find((item) => item.id === closest.dataset.photo)
            if (photo && photo.id !== selected.id) select(photo, false)
          }}>
          {visible.map((photo) => {
            const slot = order.indexOf(photo.id)
            const focusSlot = displayOrder.indexOf(photo.id)
            const position = inspecting ? (focusSlot === 0 ? { x: 50, y: 36, rotation: -1 } : { x: 17 + (focusSlot - 1) * 33, y: 85, rotation: (focusSlot - 2) * 4 }) : positions[slot]
            return <GalleryPhoto key={photo.id} photo={photo} position={position} selected={photo.id === selected.id} expanded={photo.id === selected.id && noteOpen}
              inspecting={inspecting} mobile={mobile} reduced={reduced} layer={front === photo.id ? 25 : slot + 1}
              onSelect={() => select(photo)} onMove={(nextPosition) => {
                setFront(photo.id)
                setPositions((current) => current.map((item, index) => index === slot ? nextPosition : item))
              }} />
          })}
        </div>
        <div className="calling-card-space">
          <AnimatePresence initial={false}>
            {noteOpen && <motion.aside key="calling-card" className="photo-note" id="photo-note" aria-labelledby="photo-note-title"
              initial={{ opacity: 0, x: reduced ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -12 }}
              transition={{ duration: reduced ? 0 : .18, delay: reduced ? 0 : .08 }}>
              <div className="photo-note-top"><p className="gallery-eyebrow"><span aria-hidden="true">♦</span> Calling card</p><button type="button" aria-label="Close photo note" onClick={close}>×</button></div>
              <motion.div key={selected.id} initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .18, delay: reduced ? 0 : .1 }}>
                <h3 id="photo-note-title">{selected.title}</h3><p className="photo-story">{selected.note}</p><p className="photo-tags">{selected.tags}</p>
              </motion.div>
              <div className="photo-note-navigation">
                <button type="button" aria-label="Previous photo" disabled={visible.length < 2} onClick={() => step(-1)}>←</button>
                <span>{String(visible.indexOf(selected) + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</span>
                <button type="button" aria-label="Next photo" disabled={visible.length < 2} onClick={() => step(1)}>→</button>
              </div>
            </motion.aside>}
          </AnimatePresence>
          {!noteOpen && <button type="button" className="reopen-note" onClick={() => setNoteOpen(true)}>Read the calling card ↗</button>}
        </div>
      </div>
      <div className="gallery-tools"><p id="gallery-instructions">{mobile ? 'Swipe to explore. Tap a photo to read its calling card.' : inspecting ? 'Close the calling card to rearrange the table. Use ← / → to change photos.' : 'Drag to rearrange. Focus a photo’s grip and use the arrow keys. Shift moves farther.'}</p>
        <button type="button" onClick={() => { setPositions(PHOTO_POSITIONS); setOrder(swapCenterPhoto(GALLERY_PHOTOS.map((photo) => photo.id), GALLERY_PHOTOS.find((photo) => filter === 'All' || photo.category === filter)!.id)); restoreView(); setFront(null); setAnnouncement('Photo positions restored.') }}><span aria-hidden="true">↺</span> Reset positions</button>
      </div>
      <p className="sr-only" role="status">{announcement}</p>
    </section>
  )
}
