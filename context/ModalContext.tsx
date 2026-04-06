'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface ModalContextValue {
  modalSrc: string | null
  openModal: (src: string) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalSrc, setModalSrc] = useState<string | null>(null)

  const openModal = useCallback((src: string) => {
    setModalSrc(src)
  }, [])

  const closeModal = useCallback(() => {
    setModalSrc(null)
  }, [])

  return (
    <ModalContext.Provider value={{ modalSrc, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModalContext must be used within ModalProvider')
  return ctx
}
