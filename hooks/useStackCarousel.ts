'use client'

import { useState, useCallback } from 'react'

export type ViewMode = 'carousel' | 'showall'

interface UseStackCarouselReturn {
  currentIdx: number
  isAnimating: boolean
  viewMode: ViewMode
  next: () => void
  prev: () => void
  setMode: (mode: ViewMode) => void
}

const TOTAL_CATEGORIES = 6

export function useStackCarousel(): UseStackCarouselReturn {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')

  const next = useCallback(() => {
    if (isAnimating || viewMode === 'showall') return
    setIsAnimating(true)
    setCurrentIdx((prev) => (prev + 1) % TOTAL_CATEGORIES)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, viewMode])

  const prev = useCallback(() => {
    if (isAnimating || viewMode === 'showall') return
    setIsAnimating(true)
    setCurrentIdx((prev) => (prev - 1 + TOTAL_CATEGORIES) % TOTAL_CATEGORIES)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, viewMode])

  const setMode = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  return { currentIdx, isAnimating, viewMode, next, prev, setMode }
}
