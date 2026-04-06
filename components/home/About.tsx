'use client'

import { useState, useEffect } from 'react'

function VisitorBadge() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/track', { method: 'POST' })
      .catch(() => {})
      .finally(() => {
        fetch('/api/visitors')
          .then((r) => r.json())
          .then((data) => { if (typeof data.total === 'number') setCount(data.total) })
          .catch(() => {})
      })
  }, [])

  if (count === null) return null

  return (
    <div className="flex items-center gap-2 text-neutral-500 group-hover:text-neutral-400 transition-colors">
      <span className="material-symbols-outlined text-lg">visibility</span>
      <span className="text-xs font-black tracking-widest uppercase">
        Visit ({count.toLocaleString()})
      </span>
    </div>
  )
}

export default function About() {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" id="about-detailed">
      <div className="bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/20 transition-colors relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-10 opacity-5 group-hover:opacity-[0.02] transition-opacity duration-700 pointer-events-none">
          <span className="material-symbols-outlined text-[15rem]">fingerprint</span>
        </div>
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">ABOUT</h2>
            <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">The Core</p>
          </div>
          <VisitorBadge />
        </div>
        <div className="max-w-3xl space-y-6 text-neutral-400 text-lg leading-relaxed font-bold">
          <p>
            I&apos;m fascinated by what happens in the gap between high-level abstractions and raw hardware. My approach
            is simple:{' '}
            <span className="text-white">understand the internals before using the tool.</span>
          </p>
          <p>
            I focus on the architecture of performance and reliability—whether it&apos;s manual memory management, I/O
            multiplexing, or ensuring data durability in distributed environments. I don&apos;t just write code;{' '}
            <span className="text-white">
              I design systems that are predictable, fault-tolerant, and built to scale from the ground up.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
