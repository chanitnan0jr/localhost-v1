'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Projects', href: '/projects' },
  { label: 'Terminal', href: '/#terminal' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className="noir-header">
      <Link className="noir-brand" href="/#home" aria-label="Chanitnan, home">
        <svg viewBox="0 0 52 28" aria-hidden="true"><path d="m2 3 24 6L50 3l-5 20-12 3-7-8-7 8-12-3Z" fill="currentColor" /><path d="m10 11 10 3-8 4Zm32 0-10 3 8 4Z" fill="#0c0b0a" /></svg> CHANITNAN
      </Link>
      <nav aria-label="Main navigation">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              (link.label === 'Home' && pathname === '/') ||
              (link.label === 'Projects' && pathname.startsWith('/projects'))
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
