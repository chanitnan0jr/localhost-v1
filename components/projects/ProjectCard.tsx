"use client"
import { motion } from 'framer-motion'
import { Project } from '@/lib/projectsData'

interface ProjectCardProps {
  project: Project
  index?: number
  accent?: 'green' | 'blue' | 'white'
}

const ACCENT = {
  green: {
    badge: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    tag: 'group-hover:border-white/20 group-hover:text-neutral-300',
    nameHover: 'group-hover:text-accent-green',
    metric: 'text-accent-green',
    icon: 'text-accent-green/10 group-hover:text-accent-green/20',
    line: 'bg-accent-green/40',
    glow: 'bg-accent-green/5',
    pulse: 'bg-accent-green/20',
    iconBorder: 'bg-accent-green/10 border-accent-green/20 text-accent-green',
    countBadge: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  },
  blue: {
    badge: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    tag: 'group-hover:border-accent-blue/20 group-hover:text-accent-blue/80',
    nameHover: 'group-hover:text-accent-blue',
    metric: 'text-accent-blue',
    icon: 'text-accent-blue/10 group-hover:text-accent-blue/20',
    line: 'bg-accent-blue/40',
    glow: 'bg-accent-blue/5',
    pulse: 'bg-accent-blue/20',
    iconBorder: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue',
    countBadge: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  },
  white: {
    badge: 'bg-white/10 text-white border-white/20',
    tag: 'group-hover:border-white/20 group-hover:text-white',
    nameHover: 'group-hover:text-white',
    metric: 'text-white',
    icon: 'text-white/10 group-hover:text-white/20',
    line: 'bg-white/20',
    glow: 'bg-white/5',
    pulse: 'bg-white/10',
    iconBorder: 'bg-white/10 border-white/20 text-white',
    countBadge: 'bg-white/10 text-white border-white/20',
  },
}

export default function ProjectCard({ project, index = 0, accent = 'green' }: ProjectCardProps) {
  const num = String(index + 1).padStart(2, '0')
  const a = ACCENT[accent]

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="group relative border-t border-white/10 pt-10 pb-12 hover:border-white/20 transition-colors duration-500"
    >
      {/* Number + Category */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className={`text-xs font-black tracking-[0.3em] uppercase ${a.metric} opacity-60`}>
          {num}
        </span>
        <span className="text-xs font-black tracking-[0.3em] text-neutral-500 uppercase">/</span>
        <span className="text-xs font-black tracking-[0.3em] text-neutral-500 uppercase">
          {project.category}
        </span>
        {project.badge && (
          <span className={`ml-auto text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${a.badge}`}>
            {project.badge}
          </span>
        )}
      </div>

      {/* Name + Tags */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <h2 className={`text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none transition-colors duration-500 ${a.nameHover}`}>
          {project.name}
        </h2>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-neutral-400 transition-all ${a.tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3-column content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x md:divide-white/10">

        {/* Core Achievement */}
        <div className="md:pr-8 pb-8 md:pb-0">
          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-neutral-600 mb-3">
            Core Achievement
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {project.achievement}
          </p>
        </div>

        {/* Technical Edge */}
        <div className="md:px-8 py-8 md:py-0 border-t border-white/10 md:border-t-0">
          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-neutral-600 mb-3">
            Technical Edge
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {project.technicalEdge}
          </p>
        </div>

        {/* Metric */}
        <div className="md:pl-8 pt-8 md:pt-0 border-t border-white/10 md:border-t-0">
          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-neutral-600 mb-3">
            Metric
          </p>
          <p className={`text-sm font-bold leading-relaxed ${a.metric}`}>
            {project.metric}
          </p>
          <div className={`mt-6 transition-colors duration-500 ${a.icon}`}>
            <span className="material-symbols-outlined text-[4rem]">{project.icon}</span>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <motion.div
        className={`absolute bottom-0 left-0 h-px ${a.line}`}
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: index * 0.1 + 0.4, ease: "easeOut" }}
      />
    </motion.article>
  )
}
