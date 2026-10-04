'use client'

import { useState, useEffect } from 'react'

function VisitorBadge() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/track', { method: 'POST', signal: controller.signal })
      .catch(() => {})
      .then(async () => {
        if (controller.signal.aborted) return
        const response = await fetch('/api/visitors', { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (typeof data.total === 'number') setCount(data.total)
      })
      .catch(() => {})
    return () => controller.abort()
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
    <section className="noir-about" id="about-detailed" aria-labelledby="about-heading">
      <div className="about-divider" aria-hidden="true"><span>♠</span></div>
      <p className="about-transition">You&apos;ve seen the work. Here&apos;s how I think.</p>
      <div className="about-label-row"><p className="about-label">About me</p><VisitorBadge /></div>
      <h2 id="about-heading">The mind<br />behind the <em>mask.</em></h2>
      <div className="about-columns">
        <div className="about-identity">
          <svg className="about-mask" viewBox="0 0 200 76" aria-hidden="true" focusable="false">
            <path d="m7 7 50 9 43 25 43-25 50-9-23 47-28 15-42-7-42 7-28-15Z" fill="currentColor" />
            <path d="m34 30 28 6 20 17-31-5Zm132 0-28 6-20 17 31-5Z" fill="#0c0b0a" />
          </svg>
          <h3>Chanitnan<br />Kitnantakhun</h3>
          <p className="about-role">Backend <span>/</span> Systems Engineer</p>
          <ul className="about-values" aria-label="Engineering focus">
            <li>Internals</li><li>Performance</li><li>Reliability</li>
          </ul>
        </div>
        <div className="about-copy">
          <p>I&apos;m fascinated by what happens in the gap between high-level abstractions and raw hardware. My approach is simple: <strong>understand the internals before using the tool.</strong></p>
          <p>I focus on the architecture of performance and reliability—whether it&apos;s manual memory management, I/O multiplexing, or ensuring data durability in distributed environments. I design systems that are <strong>predictable, fault-tolerant,</strong> and built to scale from the ground up.</p>
        </div>
      </div>
      <div className="about-philosophy">
        <p className="about-philosophy-label">Philosophy</p>
        <h3>Clarity over cleverness<span>.</span></h3>
        <blockquote>
          <p>“Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.”</p>
          <footer>— Brian Kernighan</footer>
        </blockquote>
        <p className="about-principles">Building from first principles. A deep understanding of system internals is how I approach reliable software.</p>
      </div>
      <div className="about-connect">
        <p className="about-connect-label">Social <span>/</span> Connect</p>
        <h3>Let&apos;s build something reliable<span>.</span></h3>
        <nav className="about-socials" aria-label="Social profiles">
          <a href="https://github.com/chanitnan0jr" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          <a href="https://www.linkedin.com/in/chanitnan-kitnantakhun-96a692391/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          <a href="https://discordapp.com/users/792394993817092126" target="_blank" rel="noopener noreferrer">Discord <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
        </nav>
      </div>
    </section>
  )
}
