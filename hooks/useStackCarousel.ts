'use client'

import { useEffect, useState } from 'react'
import { STACK_CATEGORIES } from '@/lib/stackData'

export type ViewMode = 'carousel' | 'showall'

export function useStackCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')

  useEffect(() => {
    if (!isAnimating) return
    const timeout = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timeout)
  }, [isAnimating])

  function move(step: number) {
    if (isAnimating || viewMode === 'showall') return
    setIsAnimating(true)
    const total = STACK_CATEGORIES.length
    setCurrentIdx((prev) => (prev + step + total) % total)
  }

  return { currentIdx, isAnimating, viewMode, next: () => move(1), prev: () => move(-1), setMode: setViewMode }
}
