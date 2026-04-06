'use client'

import { useEffect, useRef } from 'react'
import { useModalContext } from '@/context/ModalContext'

export default function ImageModal() {
  const { modalSrc, closeModal } = useModalContext()
  const isOpen = modalSrc !== null
  const prevOpen = useRef(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal])

  useEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300 opacity-100"
      onClick={closeModal}
    >
      <button
        className="absolute top-8 right-8 text-white hover:text-accent-green focus:outline-none"
        onClick={closeModal}
      >
        <span className="material-symbols-outlined text-4xl">close</span>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={modalSrc ?? ''}
        alt="Certificate"
        className="max-h-[90vh] max-w-full rounded-xl border border-white/10 shadow-2xl transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
