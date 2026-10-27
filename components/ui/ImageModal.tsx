'use client'

import { useEffect, useRef } from 'react'
import { useModalContext } from '@/context/ModalContext'

export default function ImageModal() {
  const { modalSrc, closeModal } = useModalContext()
  const isOpen = modalSrc !== null
  const dialogRef = useRef<HTMLDialogElement>(null)

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

  return (
    <dialog
      ref={dialogRef}
      aria-label="Image preview"
      className="fixed inset-0 m-0 h-screen w-screen max-h-none max-w-none open:flex items-center justify-center border-0 bg-black/90 p-4"
      onCancel={(event) => { event.preventDefault(); closeModal() }}
      onClick={closeModal}
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
      {modalSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={modalSrc}
          alt="Expanded image"
          className="max-h-[90vh] max-w-full rounded-xl border border-white/10 shadow-2xl transition-transform duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </dialog>
  )
}
