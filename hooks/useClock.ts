'use client'

import { useState, useEffect } from 'react'

export function useClock(): string {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    function updateClock() {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}
