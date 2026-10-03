'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
const INTRO_KEY = 'localhost-detective-intro-v1'

export default function EntryScene() {
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const skip = useRef<HTMLButtonElement>(null)
  const finish = useCallback(() => {
    setVisible(false)
    try {
      sessionStorage.setItem(INTRO_KEY, 'seen')
    } catch {
      /* Private browsing can disable storage. */
    }
    document.getElementById('detective-heading')?.focus({ preventScroll: true })
  }, [])
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === 'seen'
    } catch {
      /* The scene works without storage. */
    }
    if (
      !seen &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.location.hash
    )
      setVisible(true)
  }, [])
  useEffect(() => {
    if (!visible) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    skip.current?.focus({ preventScroll: true })
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
      if (event.key === 'Tab') {
        event.preventDefault()
        skip.current?.focus()
      }
    }
    document.addEventListener('keydown', keydown)
    const timeout = window.setTimeout(finish, ready ? 3800 : 6500)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', keydown)
      window.clearTimeout(timeout)
    }
  }, [visible, ready, finish])
  if (!visible) return null
  return (
    <div
      className={`entry-scene ${ready ? 'is-ready' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="A short opening scene approaches the detective's laptop"
    >
      <div className="entry-camera">
        <Image
          src="/images/detective/entrance.webp"
          fill
          sizes="100vw"
          priority
          alt="A detective's desk with a wall of clues and a laptop"
          onLoad={() => setReady(true)}
          onError={finish}
        />
        <div className="entry-screen" aria-hidden="true">
          <span>
            Every detail
            <br />
            tells a <em>story.</em>
          </span>
          <div>♠ ♥ ♣ ♦</div>
        </div>
      </div>
      <span className="entry-caption">Follow the clues.</span>
      <button ref={skip} className="entry-skip" type="button" onClick={finish}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
