'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { MotionConfig } from 'framer-motion'

interface ModalContextValue {
  modalSrc: string | null
  openModal: (src: string) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalSrc, setModalSrc] = useState<string | null>(null)

  const closeModal = useCallback(() => setModalSrc(null), [])

  return (
    <MotionConfig reducedMotion="user">
      <ModalContext.Provider value={{ modalSrc, openModal: setModalSrc, closeModal }}>
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
