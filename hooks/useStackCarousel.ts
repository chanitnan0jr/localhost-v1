'use client'

import { useRef, useState } from 'react'
import { STACK_CATEGORIES } from '@/lib/stackData'

export type ViewMode = 'carousel' | 'showall'

export function useStackCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')
  const lock = useRef(false)

  // ponytail: throttle rapid clicks to match the 300ms Framer transition without extra state re-renders.
  function move(step: number) {
    if (lock.current || viewMode === 'showall') return
    lock.current = true
    setTimeout(() => { lock.current = false }, 300)
    const total = STACK_CATEGORIES.length
    setCurrentIdx((prev) => (prev + step + total) % total)
  }

  return { currentIdx, isAnimating: lock.current, viewMode, next: () => move(1), prev: () => move(-1), setMode: setViewMode }
}
