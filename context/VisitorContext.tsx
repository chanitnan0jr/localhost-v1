'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface VisitorStats {
  total: number | null
  loading: boolean
}

const VisitorContext = createContext<VisitorStats | null>(null)

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        await fetch('/api/track', { method: 'POST', signal: controller.signal }).catch(() => {})
        if (controller.signal.aborted) return
        const response = await fetch('/api/visitors', { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (typeof data.total === 'number') setTotal(data.total)
      } catch {
        // Unavailable stats use each consumer's existing fallback.
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return <VisitorContext.Provider value={{ total, loading }}>{children}</VisitorContext.Provider>
}

export function useVisitorStats() {
  const stats = useContext(VisitorContext)
  if (!stats) throw new Error('useVisitorStats must be used within VisitorProvider')
  return stats
}
