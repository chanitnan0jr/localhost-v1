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
        <span aria-hidden="true">♠</span> CHANITNAN
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
