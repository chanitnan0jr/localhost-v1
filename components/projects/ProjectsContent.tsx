"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '@/components/projects/ProjectCard'
import { OPENSOURCE_PROJECTS, PERSONAL_PROJECTS } from '@/lib/projectsData'

type Accent = 'green' | 'blue' | 'white'

const HEADER_ACCENT = {
  green: {
    glow: 'bg-accent-green/5',
    iconWrap: 'bg-accent-green/10 border-accent-green/20 text-accent-green',
    pulse: 'bg-accent-green/20',
    badge: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    toggle: 'group-hover:text-accent-green',
  },
  blue: {
    glow: 'bg-accent-blue/5',
    iconWrap: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue',
    pulse: 'bg-accent-blue/20',
    badge: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    toggle: 'group-hover:text-accent-blue',
  },
  white: {
    glow: 'bg-white/5',
    iconWrap: 'bg-white/10 border-white/20 text-white',
    pulse: 'bg-white/10',
    badge: 'bg-white/10 text-white border-white/20',
    toggle: 'group-hover:text-white',
  },
}

interface SectionHeaderProps {
  label: string
  category: string
  icon: string
  description: string
  count: number
  isOpen: boolean
  onToggle: () => void
  accent: Accent
}

function SectionHeader({ label, category, icon, description, count, isOpen, onToggle, accent }: SectionHeaderProps) {
  const a = HEADER_ACCENT[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="px-6 md:px-12 max-w-7xl mx-auto"
    >
      <button
        onClick={onToggle}
        className="w-full group relative bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all duration-300 overflow-hidden cursor-pointer text-left"
      >
        {/* Glow */}
        <motion.div
          className={`absolute right-0 top-0 w-64 h-64 ${a.glow} blur-[100px] rounded-full pointer-events-none`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Left: icon + title */}
        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          <div className={`w-14 h-14 rounded-full border flex flex-shrink-0 items-center justify-center relative overflow-hidden ${a.iconWrap}`}>
            <motion.div
              className={`absolute inset-0 ${a.pulse}`}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="material-symbols-outlined text-2xl z-10">{icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="text-xl font-black uppercase text-white tracking-tighter">{category}</h3>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${a.badge}`}>
                {count} {count === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">{label}</p>
          </div>
        </div>

        {/* Right: description + toggle */}
        <div className="flex items-center gap-8 z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-bold max-w-xs group-hover:text-neutral-400 transition-colors hidden md:block">
            {description}
          </p>
          <div className={`ml-auto md:ml-0 flex items-center gap-2 text-neutral-500 transition-colors shrink-0 ${a.toggle}`}>
            <span className="text-[10px] uppercase tracking-widest font-black">
              {isOpen ? 'Collapse' : 'Expand'}
            </span>
            <motion.span
              className="material-symbols-outlined text-xl"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              expand_more
            </motion.span>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export default function ProjectsContent() {
  const [openSections, setOpenSections] = useState({ opensource: true, personal: true })

  const toggle = (key: 'opensource' | 'personal') =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="space-y-4">
      {/* Open Source Section */}
      <section className="mb-6">
        <SectionHeader
          label="Active contributions to the community"
          category="Open Source Contributions"
          icon="my_location"
          description="Passionate about architecting resilient, high-volume scalable systems."
          count={OPENSOURCE_PROJECTS.length}
          isOpen={openSections.opensource}
          onToggle={() => toggle('opensource')}
          accent="blue"
        />

        <AnimatePresence initial={false}>
          {openSections.opensource && (
            <motion.div
              key="opensource-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-12 max-w-7xl mx-auto pt-2 pb-8">
                {OPENSOURCE_PROJECTS.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} accent="blue" />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Divider */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto py-2">
        <div className="border-t border-white/5" />
      </div>

      {/* Personal Projects Section */}
      <section className="mb-6">
        <SectionHeader
          label="Systems, products & explorations"
          category="Personal Projects"
          icon="folder_open"
          description="Showcasing system design explorations and production-grade builds."
          count={PERSONAL_PROJECTS.length}
          isOpen={openSections.personal}
          onToggle={() => toggle('personal')}
          accent="white"
        />

        <AnimatePresence initial={false}>
          {openSections.personal && (
            <motion.div
              key="personal-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-12 max-w-7xl mx-auto pt-2 pb-8">
                {PERSONAL_PROJECTS.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index + OPENSOURCE_PROJECTS.length}
                    accent="white"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
