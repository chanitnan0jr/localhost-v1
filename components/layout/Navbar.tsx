'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Projects', href: '/projects' },
  { label: 'Terminal', href: '/terminal' },
]

const TZ_COUNTRY_MAP: Record<string, string> = {
  'Asia/Bangkok': 'TH',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Singapore': 'SG',
  'Asia/Hong_Kong': 'HK',
  'Asia/Taipei': 'TW',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Jakarta': 'ID',
  'Asia/Manila': 'PH',
  'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Phnom_Penh': 'KH',
  'Asia/Vientiane': 'LA',
  'Asia/Yangon': 'MM',
  'Asia/Shanghai': 'CN',
  'Asia/Chongqing': 'CN',
  'Asia/Dubai': 'AE',
  'Asia/Kolkata': 'IN',
  'Europe/London': 'UK',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Amsterdam': 'NL',
  'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE',
  'America/New_York': 'US',
  'America/Los_Angeles': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Sao_Paulo': 'BR',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Pacific/Auckland': 'NZ',
}

function resolveVisitorZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (!tz || tz === 'UTC' || tz === 'Etc/UTC') return 'UTC'
    const parts = tz.split('/')
    const rawCity = parts[parts.length - 1]?.replace(/_/g, ' ') || ''
    let country = TZ_COUNTRY_MAP[tz]
    if (!country && typeof navigator !== 'undefined' && navigator.language) {
      const langParts = navigator.language.split('-')
      if (langParts.length > 1 && langParts[1].length === 2) {
        country = langParts[1].toUpperCase()
      }
    }
    if (country && rawCity) return `${country} ${rawCity}`
    return rawCity || tz || 'TH Bangkok'
  } catch {
    return 'TH Bangkok'
  }
}

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [time, setTime] = useState<string>('')
  const [visitorZone, setVisitorZone] = useState<string>('TH Bangkok')
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [isLiveCount, setIsLiveCount] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const root = document.documentElement
    const previousHeight = root.style.getPropertyValue('--noir-header-height')
    const updateHeight = () => root.style.setProperty('--noir-header-height', `${header.getBoundingClientRect().height}px`)
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => {
      observer.disconnect()
      if (previousHeight) root.style.setProperty('--noir-header-height', previousHeight)
      else root.style.removeProperty('--noir-header-height')
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    setVisitorZone(resolveVisitorZone())

    const updateTime = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      setTime(`${hh}:${mm}:${ss}`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    const controller = new AbortController()
    fetch('/api/track', { method: 'POST', signal: controller.signal })
      .catch(() => {})
      .then(async () => {
        if (controller.signal.aborted) return
        const response = await fetch('/api/visitors', { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) {
          setVisitorCount(1337)
          return
        }
        const data = await response.json()
        if (typeof data.total === 'number') {
          setVisitorCount(data.total)
          setIsLiveCount(true)
        } else {
          setVisitorCount(1337)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setVisitorCount(1337)
        }
      })

    return () => {
      clearInterval(timer)
      controller.abort()
    }
  }, [])

  return (
    <header ref={headerRef} className="noir-header">
      <Link className="noir-brand" href="/#home" aria-label="Chanitnan, home">
        <svg viewBox="0 0 52 28" aria-hidden="true"><path d="m2 3 24 6L50 3l-5 20-12 3-7-8-7 8-12-3Z" fill="currentColor" /><path d="m10 11 10 3-8 4Zm32 0-10 3 8 4Z" fill="#0c0b0a" /></svg> <span>CHANITNAN<span className="noir-brand-cursor" aria-hidden="true">_</span></span>
      </Link>
      <div className="persona-header-hud" role="region" aria-label="Metaverse HUD">
        <div className="persona-header-clock" aria-label="System clock" title={`Persona Time (${visitorZone})`}>
          <span className="persona-clock-tag" suppressHydrationWarning>
            {visitorZone}
          </span>
          <span className="persona-clock-time" suppressHydrationWarning>
            {mounted && time ? time : '--:--:--'}
          </span>
        </div>
        <div
          className="persona-header-visitor"
          aria-label={`Visitor count: ${visitorCount !== null ? visitorCount.toLocaleString() : 'Loading'}`}
          title={isLiveCount ? `${visitorCount?.toLocaleString()} Infiltrators / Unique Visitors` : '1,337 Infiltrators (Local Demo · Redis offline)'}
        >
          <span className="persona-visitor-tag">
            <svg className="persona-visitor-icon" viewBox="0 0 24 14" aria-hidden="true" focusable="false">
              <path d="M1 1.5 L12 4.5 L23 1.5 L20.5 11 L15 13 L12 8.5 L9 13 L3.5 11 Z" fill="currentColor" />
              <path d="M5 6 L9 7 L7.5 9 Z" fill="#0c0b0a" />
              <path d="M19 6 L15 7 L16.5 9 Z" fill="#0c0b0a" />
            </svg>
            <span className="persona-visitor-label">VISITOR</span>
          </span>
          <span className="persona-visitor-count" suppressHydrationWarning>
            {mounted && visitorCount !== null ? visitorCount.toLocaleString() : '--'}
          </span>
        </div>
      </div>
      <nav aria-label="Main navigation">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              (link.label === 'Home' && pathname === '/') ||
              (link.label === 'Projects' && pathname.startsWith('/projects')) ||
              (link.label === 'Terminal' && pathname.startsWith('/terminal'))
                ? 'is-active'
                : undefined
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
