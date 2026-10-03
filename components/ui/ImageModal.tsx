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
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
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
        <span className="material-symbols-outlined text-4xl" aria-hidden="true">close</span>
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
