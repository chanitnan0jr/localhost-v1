'use client'

import { useState } from 'react'
import { useToggle } from '@/hooks/useToggle'
import { useModalContext } from '@/context/ModalContext'

type CompetitionPhoto = {
  src: string
  alt: string
}

const CSTU_PHOTOS: CompetitionPhoto[] = [
  { src: '/images/CSTUSPARK/AWARD.jpg', alt: 'CSTU Spark Camp Best Creative and Engaging Pitch Award' },
  { src: '/images/CSTUSPARK/CSTUSPARK1.jpg', alt: 'CSTU Spark Camp team photo' },
  { src: '/images/CSTUSPARK/CSTUSPARK2.jpg', alt: 'CSTU Spark Camp group photo' },
]

const ICPC_PHOTOS: CompetitionPhoto[] = [
  { src: '/images/ICPC2026/Main.jpg', alt: 'ICPC Thailand Central Region group photo' },
  { src: '/images/ICPC2026/ICPC1.jpg', alt: 'ICPC Thailand qualifier team photo' },
  { src: '/images/ICPC2026/ICPC3.jpg', alt: 'ICPC Thailand qualifier team photo' },
]

const PRAGMA_PHOTOS: CompetitionPhoto[] = [
  { src: '/images/PRAGMA41/Award.png', alt: 'PRAGMA 41 Excellent in Team Work Award certificate' },
  { src: '/images/PRAGMA41/PRAGMA1.jpg', alt: 'PRAGMA 41 hackathon presentation photo' },
  { src: '/images/PRAGMA41/PRAGMA2.jpg', alt: 'PRAGMA 41 hackathon team photo' },
]

function StaticPhotoStrip({ photos, onOpen }: { photos: CompetitionPhoto[]; onOpen: (src: string) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePhoto = photos[activeIndex]

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + photos.length) % photos.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % photos.length)
  }

  return (
    <div className="w-full relative aspect-video rounded-xl bg-[#131313] border border-white/5 box-border overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={activePhoto.src}
        src={activePhoto.src}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center hover:scale-[1.01] transition-transform cursor-pointer"
        alt={activePhoto.alt}
        onClick={() => onOpen(activePhoto.src)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      <button
        type="button"
        onClick={showPrevious}
        aria-label="Previous competition photo"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-accent-green hover:text-black"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_left</span>
      </button>
      <button
        type="button"
        onClick={showNext}
        aria-label="Next competition photo"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-accent-green hover:text-black"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">chevron_right</span>
      </button>
    </div>
  )
}

export default function Competitions() {
  const [cstuOpen, toggleCstu] = useToggle(false)
  const [icpcOpen, toggleIcpc] = useToggle(false)
  const [pragmaOpen, togglePragma] = useToggle(false)
  const { openModal } = useModalContext()

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" id="competitions">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">COMPETITIONS &amp; AWARDS</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Recognitions</p>
      </div>
      <div className="space-y-8">

        {/* CSTU Spark Camp in AI */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              <a
                href="https://v0-cstu-spark-camp-landing-page.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-green transition-colors"
              >
                CSTU Spark Camp in AI
              </a>
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <div className="flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity w-fit mb-8">
              <span className="text-2xl" aria-hidden="true">🏆</span>
              <button
                type="button"
                onClick={toggleCstu}
                aria-expanded={cstuOpen}
                aria-controls="cstu-spark-camp-photo"
                className="flex items-center gap-2 focus:outline-none group cursor-pointer"
              >
                <span className="text-accent-green font-bold tracking-widest uppercase text-sm group-hover:text-white transition-colors">
                  {cstuOpen ? 'Hide Award' : '3rd Place'}
                </span>
                <span
                  className="material-symbols-outlined text-accent-green group-hover:text-white transition-colors duration-300 transform"
                  style={{ transform: cstuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>
            </div>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
              AI-Assisted Academic Workflow
            </p>
            <ul className="space-y-6 text-on-surface-variant text-lg">
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>Built an AI-assisted academic portal for TQF3 drafting, CLO generation, curriculum mapping, and document export.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>Designed a human-in-the-loop workflow that validates generated drafts against authoritative curriculum data before approval.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>Placed 3rd and received the Best Creative and Engaging Pitch Award.</span>
              </li>
            </ul>
            {cstuOpen && (
              <div id="cstu-spark-camp-photo" className="mt-8 pt-6 border-t border-white/10">
                <StaticPhotoStrip photos={CSTU_PHOTOS} onOpen={openModal} />
              </div>
            )}
          </div>
        </div>

        {/* ICPC Thailand National Round Qualifier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              ICPC Thailand National Round Qualifier
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <div className="flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity w-fit mb-8">
              <span className="text-2xl" aria-hidden="true">↗</span>
              <button
                type="button"
                onClick={toggleIcpc}
                aria-expanded={icpcOpen}
                aria-controls="icpc-qualifier-photo"
                className="flex items-center gap-2 focus:outline-none group cursor-pointer"
              >
                <span className="text-accent-green font-bold tracking-widest uppercase text-sm group-hover:text-white transition-colors">
                  {icpcOpen ? 'Hide Photo' : 'Qualified for National Round'}
                </span>
                <span
                  className="material-symbols-outlined text-accent-green group-hover:text-white transition-colors duration-300 transform"
                  style={{ transform: icpcOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>
            </div>
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
              Central &amp; Western Regional Qualifier
            </p>
            <ul className="space-y-6 text-on-surface-variant text-lg">
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>Ranked 18th out of 52 university teams in the regional qualifier hosted by Chulalongkorn University.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>Advanced to the ICPC Thailand National Round.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>Applied algorithm design, data structures, and collaborative problem solving under contest time constraints.</span>
              </li>
            </ul>
            {icpcOpen && (
              <div id="icpc-qualifier-photo" className="mt-8 pt-6 border-t border-white/10">
                <StaticPhotoStrip photos={ICPC_PHOTOS} onOpen={openModal} />
              </div>
            )}
          </div>
        </div>

        {/* PRAGMA 41 Hackathon & Awards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              <a
                href="https://www.pragma-grid.net/pragma41/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-green transition-colors"
              >
                PRAGMA 41 Hackathon
              </a>
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <div className="flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity w-fit mb-8">
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
              {pragmaOpen && (
                <div className="w-full transition-all duration-500">
                  <StaticPhotoStrip photos={PRAGMA_PHOTOS} onOpen={openModal} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Super AI Engineer Season 6 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              <a
                href="https://mysuperai.aiat.or.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-green transition-colors"
              >
                Super AI Engineer Season 6
              </a>
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
              Participated · Level 1
            </p>
            <p className="text-on-surface-variant text-lg mb-8">
              Participated in Super AI Engineer Season 6 and submitted the Level 1 challenge solutions.
            </p>
            <a
              href="https://github.com/chanitnan0jr/AIAT_Super_AI_Engineer_SS6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent-green hover:text-white transition-colors font-bold uppercase tracking-widest text-sm"
            >
              <span className="material-symbols-outlined text-base">code</span>
              View Submitted Code
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
