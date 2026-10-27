'use client'
import { Fragment, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '@/components/projects/ProjectCard'
import { OPENSOURCE_PROJECTS, PERSONAL_PROJECTS, COLLABORATIVE_PROJECTS } from '@/lib/projectsData'

// All project sections share the same cards and collapse interaction.
const SECTIONS = [
  {
    id: 'opensource', subtitle: 'Open Source', category: 'OSS Contribute',
    description: 'Passionate about architecting resilient, high-volume scalable systems.',
    projects: OPENSOURCE_PROJECTS,
  },
  {
    id: 'collaborative', subtitle: 'Built Together', category: 'Collaborative Project',
    description: 'Course authoring, semantic video retrieval and FinOps contributions.',
    projects: COLLABORATIVE_PROJECTS,
  },
  {
    id: 'personal', subtitle: 'Case Studies', category: 'Personal Projects',
    description: 'Showcasing system design explorations and production-grade builds.',
    projects: PERSONAL_PROJECTS,
  },
] as const

interface SectionHeaderProps {
  subtitle: string
  category: string
  description: string
  count: number
  isOpen: boolean
  onToggle: () => void
}

function SectionHeader({ subtitle, category, description, count, isOpen, onToggle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="projects-header mb-8"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full text-left group cursor-pointer focus:outline-none"
      >
        <span className="text-sm uppercase tracking-[0.4em] text-neutral-500 font-bold mb-3 block">
          {subtitle}
        </span>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div className="flex items-center gap-3.5 flex-wrap">
            <h3 className="projects-title-badge text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-[0.9]">
              {category}
            </h3>
            <span className="projects-count-badge font-mono text-xs font-bold tracking-widest px-2.5 py-1 border border-neutral-700 bg-black/60 text-neutral-300 uppercase">
              {count} {count === 1 ? 'project' : 'projects'}
            </span>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0">
            <p className="text-on-surface-variant max-w-xs text-xs uppercase leading-relaxed font-bold text-right hidden lg:block text-neutral-400">
              {description}
            </p>
            <div className="flex items-center gap-2 px-3.5 py-2 border border-neutral-700 bg-black/60 text-neutral-300 group-hover:border-[#c91c2c] group-hover:text-white transition-all text-xs font-bold uppercase tracking-widest ml-auto md:ml-0">
              <span>{isOpen ? 'Collapse' : 'Expand'}</span>
              <motion.svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <path d="m6 9 6 6 6-6" />
              </motion.svg>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export default function ProjectsContent() {
  const [openSections, setOpenSections] = useState({ opensource: true, collaborative: true, personal: true })

  const toggle = (key: typeof SECTIONS[number]['id']) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="space-y-12">
      {SECTIONS.map(({ id, projects, ...header }, sectionIndex) => (
        <Fragment key={id}>
          {sectionIndex > 0 && (
            <div className="projects-header py-6">
              <div className="border-t border-white/10" />
            </div>
          )}
          <section className="mb-10" data-project-section={id}>
            <SectionHeader {...header} count={projects.length} isOpen={openSections[id]} onToggle={() => toggle(id)} />
            <AnimatePresence initial={false}>
              {openSections[id] && (
                <motion.div
                  key={`${id}-content`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="projects-header pt-2 pb-8">
                    <div className="selected-work-grid">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </Fragment>
      ))}
    </div>
  )
}
