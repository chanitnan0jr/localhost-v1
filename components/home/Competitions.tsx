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
      <button
        type="button"
        aria-label={`View ${activePhoto.alt}`}
        className="absolute inset-0 w-full h-full"
        onClick={() => onOpen(activePhoto.src)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activePhoto.src}
          src={activePhoto.src}
          loading="lazy"
          className="w-full h-full object-cover object-center hover:scale-[1.01] transition-transform"
          alt={activePhoto.alt}
        />
      </button>
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

type Competition = {
  id: string
  title: string
  href?: string
  award?: string
  subtitle: string
  details?: string[]
  description?: string
  photos?: CompetitionPhoto[]
  repoUrl?: string
}

const COMPETITIONS: Competition[] = [
  {
    id: 'cstu-spark-camp-photo', title: 'CSTU Spark Camp in AI',
    href: 'https://v0-cstu-spark-camp-landing-page.vercel.app/', award: '3rd Place',
    subtitle: 'AI-Assisted Academic Workflow', photos: CSTU_PHOTOS,
    details: [
      'Built an AI-assisted academic portal for TQF3 drafting, CLO generation, curriculum mapping, and document export.',
      'Designed a human-in-the-loop workflow that validates generated drafts against authoritative curriculum data before approval.',
      'Placed 3rd and received the Best Creative and Engaging Pitch Award.',
    ],
  },
  {
    id: 'icpc-qualifier-photo', title: 'ICPC Thailand National Round Qualifier',
    award: 'Qualified for National Round', subtitle: 'Central & Western Regional Qualifier', photos: ICPC_PHOTOS,
    details: [
      'Ranked 18th out of 52 university teams in the regional qualifier hosted by Chulalongkorn University.',
      'Advanced to the ICPC Thailand National Round.',
      'Applied algorithm design, data structures, and collaborative problem solving under contest time constraints.',
    ],
  },
  {
    id: 'pragma-photo', title: 'PRAGMA 41 Hackathon', href: 'https://www.pragma-grid.net/pragma41/',
    award: 'Excellent Teamwork Award', subtitle: 'SEAIP Collaborative Action', photos: PRAGMA_PHOTOS,
    details: [
      'Built an AI-powered clinical decision support system for ICU Sepsis management — combining real-time patient data inference with a clear, actionable alert interface.',
      'Recognized for cross-functional collaboration and system cohesion under 24-hour delivery pressure.',
    ],
  },
  {
    id: 'super-ai', title: 'Super AI Engineer Season 6', href: 'https://mysuperai.aiat.or.th/',
    subtitle: 'Participated · Level 1',
    description: 'Participated in Super AI Engineer Season 6 and submitted the Level 1 challenge solutions.',
    repoUrl: 'https://github.com/chanitnan0jr/AIAT_Super_AI_Engineer_SS6',
  },
]

function CompetitionCard({ competition }: { competition: Competition }) {
  const [isOpen, toggle] = useToggle()
  const { openModal } = useModalContext()

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
      <div className="md:col-span-4">
        <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
        <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
          {competition.href ? <a href={competition.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-green transition-colors">{competition.title}</a> : competition.title}
        </h3>
      </div>
      <div className="md:col-span-8 border-l border-neutral-800 pl-8">
        {competition.award && <h4 className="text-xl md:text-2xl font-black text-accent-green uppercase tracking-tight mb-2">{competition.award}</h4>}
        <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">{competition.subtitle}</p>
        {competition.details && (
          <ul className="space-y-6 text-on-surface-variant text-lg mb-6">
            {competition.details.map((detail) => (
              <li key={detail} className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
        {competition.description && <p className="text-on-surface-variant text-lg mb-8">{competition.description}</p>}
        {competition.photos && (
          <>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={isOpen}
              aria-controls={competition.id}
              className="flex items-center gap-2 text-accent-green hover:text-white transition-colors font-bold uppercase tracking-widest text-sm focus:outline-none cursor-pointer"
            >
              <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              <span>{isOpen ? 'Hide Photos' : 'View Photos'}</span>
            </button>
            {isOpen && (
              <div id={competition.id} className="mt-6 border-t border-white/10 pt-6">
                <StaticPhotoStrip photos={competition.photos} onOpen={openModal} />
              </div>
            )}
          </>
        )}
        {competition.repoUrl && (
          <a href={competition.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-green hover:text-white transition-colors font-bold uppercase tracking-widest text-sm">
            <span className="material-symbols-outlined text-base">code</span>
            View Submitted Code
            <span className="material-symbols-outlined text-base">open_in_new</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default function Competitions() {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" id="competitions">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">COMPETITIONS &amp; AWARDS</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Recognitions</p>
      </div>
      {/* ponytail: four existing cards use one template; content stays local to this section. */}
      <div className="space-y-8">
        {COMPETITIONS.map((competition) => <CompetitionCard key={competition.id} competition={competition} />)}
      </div>
    </section>
  )
}
