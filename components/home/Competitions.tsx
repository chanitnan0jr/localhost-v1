'use client'

import { useToggle } from '@/hooks/useToggle'
import { useModalContext } from '@/context/ModalContext'

export default function Competitions() {
  const [pragmaOpen, togglePragma] = useToggle(false)
  const { openModal } = useModalContext()

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" id="competitions">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">COMPETITIONS &amp; AWARDS</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Recognitions</p>
      </div>
      <div className="space-y-8">

        {/* PRAGMA 41 Hackathon & Awards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              PRAGMA 41 Hackathon
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
              SEAIP Collaborative Action
            </p>
            <ul className="space-y-6 text-on-surface-variant text-lg">
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Built an AI-powered clinical decision support system for ICU Sepsis management — combining real-time
                  patient data inference with a clear, actionable alert interface.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Recognized for cross-functional collaboration and system cohesion under 24-hour delivery pressure.
                </span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity w-fit">
                <span className="text-2xl" aria-hidden="true">🏆</span>
                <button
                  onClick={togglePragma}
                  className="flex items-center gap-2 focus:outline-none group cursor-pointer"
                >
                  <span className="text-accent-green font-bold tracking-widest uppercase text-sm group-hover:text-white transition-colors">
                    {pragmaOpen ? 'Hide Certificate' : 'Excellent Teamwork Award'}
                  </span>
                  <span
                    className="material-symbols-outlined text-accent-green group-hover:text-white transition-colors duration-300 transform"
                    style={{ transform: pragmaOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </button>
              </div>
              {pragmaOpen && (
                <div className="w-full transition-all duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/PRAGMA41/Award.png"
                    loading="lazy"
                    alt="PRAGMA 41 Certificate"
                    className="w-full max-w-2xl rounded-xl border border-white/10 shadow-lg mt-2 hover:border-white/40 transition-colors cursor-pointer"
                    onClick={() => openModal('/images/PRAGMA41/Award.png')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
