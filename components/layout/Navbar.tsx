'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClock } from '@/hooks/useClock'

export default function Navbar() {
  const pathname = usePathname()
  const time = useClock()

  const linkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
    return [
      "font-['Inter'] tracking-tighter uppercase font-bold text-xs md:text-sm transition-all hover:scale-105",
      isActive
        ? 'text-white'
        : 'text-neutral-400 hover:text-white',
    ].join(' ')
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[800px] z-50 bg-[#131313]/50 backdrop-blur-xl border border-white/10 rounded-full flex justify-between items-center px-6 py-4 shadow-2xl">
      <div className="flex items-center gap-3 cursor-default">
        <Image
          src="/images/Mascot.png"
          alt="Mascot"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border border-white/20 object-contain bg-surface-container"
        />
        <div className="text-lg md:text-xl font-black tracking-tighter text-white">
          Chanitnan<span className="blink-fast hidden md:inline">_</span>
        </div>
      </div>

      <div className="hidden md:block font-black text-xs md:text-sm tracking-widest text-[#adabaa] tabular-nums">
        {time}
      </div>

      <div className="flex gap-4 md:gap-8 items-center pr-2">
        <Link className={linkClass('/#about')} href="/#about">
          About
        </Link>
        <Link className={linkClass('/projects')} href="/projects">
          Works
        </Link>
        <Link className={linkClass('/#experience')} href="/#experience">
          Services
        </Link>
      </div>
    </nav>
  )
}
