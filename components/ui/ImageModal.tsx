'use client'

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react'
import { useModalContext } from '@/context/ModalContext'

const number = (index: number) => String(index + 1).padStart(2, '0')

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" d={back ? 'm16 4-8 8 8 8' : 'm8 4 8 8-8 8'} />
    </svg>
  )
}

export default function ImageModal() {
  const { modal, showPhoto, closeModal } = useModalContext()
  const isOpen = modal !== null
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<number | null>(null)
  const photo = modal?.photos[modal.index]
  const isGallery = (modal?.photos.length ?? 0) > 1

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const overflow = document.body.style.overflow
    // ponytail: native dialog handles the focus trap, Escape, and focus restoration.
    if (dialog && !dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (dialog && dialog.open) dialog.close()
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  function step(delta: number) {
    if (modal && isGallery) showPhoto(modal.index + delta)
  }

  function stepFromButton(event: MouseEvent<HTMLButtonElement>, delta: number) {
    event.stopPropagation()
    step(delta)
  }

  function navigate(event: KeyboardEvent<HTMLDialogElement>) {
    const delta = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
    if (delta === undefined || !isGallery) return
    event.preventDefault()
    step(delta)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={modal?.title ? `${modal.title} gallery` : 'Image preview'}
      className="fixed inset-0 m-0 h-screen w-screen max-h-none max-w-none open:flex items-center justify-center border-0 bg-black/90 p-4"
      onCancel={(event) => { event.preventDefault(); closeModal() }}
      onClick={closeModal}
      onKeyDown={navigate}
    >
      <button
        type="button"
        aria-label="Close image preview"
        className="absolute top-8 right-8 text-white hover:text-accent-green"
        onClick={closeModal}
      >
        <svg className="h-9 w-9" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="m19 6.41-1.41-1.41L12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
      {modal && isGallery && (
        <div className="absolute top-8 left-6 right-24 flex flex-wrap items-baseline gap-x-5 gap-y-1 font-[family-name:var(--font-display)] uppercase text-primary md:left-8">
          <p className="text-2xl font-black leading-none tracking-tight md:text-4xl">{modal.title}</p>
          <p className="text-base tracking-[.15em] text-[#ff2741] md:text-lg" aria-live="polite">
            <span className="sr-only">Photo {modal.index + 1} of {modal.photos.length}</span>
            <span aria-hidden="true">{number(modal.index)} / {String(modal.photos.length).padStart(2, '0')}</span>
          </p>
        </div>
      )}
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo.src}
          alt={photo.alt}
          draggable={false}
          className={`${isGallery ? 'max-h-[78vh] touch-pan-y' : 'max-h-[90vh]'} max-w-full rounded-xl border border-white/10 shadow-2xl transition-transform duration-300 scale-100`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(event) => { if (event.pointerType === 'touch') swipeStart.current = event.clientX }}
          onPointerCancel={() => { swipeStart.current = null }}
          onPointerUp={(event) => {
            if (swipeStart.current === null) return
            const distance = event.clientX - swipeStart.current
            swipeStart.current = null
            if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1)
          }}
        />
      )}
      {isGallery && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-primary bg-background/80 text-primary hover:text-accent-green md:left-8"
            onClick={(event) => stepFromButton(event, -1)}
          >
            <Arrow back />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-primary bg-background/80 text-primary hover:text-accent-green md:right-8"
            onClick={(event) => stepFromButton(event, 1)}
          >
            <Arrow />
          </button>
        </>
      )}
    </dialog>
  )
}
