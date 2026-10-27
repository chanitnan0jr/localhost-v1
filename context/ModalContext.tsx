'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { MotionConfig } from 'framer-motion'

export interface ModalPhoto {
  src: string
  alt: string
}

interface ModalState {
  title?: string
  photos: ModalPhoto[]
  index: number
}

interface ModalContextValue {
  modal: ModalState | null
  openModal: (src: string) => void
  openGallery: (title: string, photos: ModalPhoto[], index?: number) => void
  showPhoto: (index: number) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null)

  const openModal = useCallback((src: string) => setModal({ photos: [{ src, alt: 'Expanded image' }], index: 0 }), [])
  const openGallery = useCallback((title: string, photos: ModalPhoto[], index = 0) => setModal({ title, photos, index }), [])
  // Wraps both ends so Previous on the first photo shows the last one.
  const showPhoto = useCallback((index: number) => setModal(current => current && {
    ...current,
    index: (index + current.photos.length) % current.photos.length,
  }), [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <MotionConfig reducedMotion="user">
      <ModalContext.Provider value={{ modal, openModal, openGallery, showPhoto, closeModal }}>
        {children}
      </ModalContext.Provider>
    </MotionConfig>
  )
}

export function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModalContext must be used within ModalProvider')
  return ctx
}
