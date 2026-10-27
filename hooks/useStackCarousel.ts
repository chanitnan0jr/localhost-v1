'use client'

import { useRef, useState } from 'react'
import { STACK_CATEGORIES } from '@/lib/stackData'

export type ViewMode = 'carousel' | 'showall'

export function useStackCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('showall')
  const lastMoveAt = useRef<number | null>(null)

  // ponytail: timestamp throttle matches the 300ms Framer transition without timer cleanup or state.
  function move(step: number) {
    const now = performance.now()
    if (viewMode === 'showall' || (lastMoveAt.current !== null && now - lastMoveAt.current < 300)) return
    lastMoveAt.current = now
    const total = STACK_CATEGORIES.length
    setCurrentIdx((prev) => (prev + step + total) % total)
  }

  return { currentIdx, viewMode, next: () => move(1), prev: () => move(-1), setMode: setViewMode }
}
