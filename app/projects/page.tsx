import type { Metadata } from 'next'
import ProjectsHeader from '@/components/projects/ProjectsHeader'
import OpensourceCallout from '@/components/projects/OpensourceCallout'
import ProjectCard from '@/components/projects/ProjectCard'
import Footer from '@/components/layout/Footer'
import { OPENSOURCE_PROJECTS, PERSONAL_PROJECTS } from '@/lib/projectsData'

export const metadata: Metadata = {
  title: 'Projects — Chanitnan Kitnantakhun',
  description: 'Selected work and case studies by Chanitnan Kitnantakhun.',
}

export default function ProjectsPage() {
  return (
    <main className="pt-32 pb-20">
      <ProjectsHeader />
      <OpensourceCallout />

      {/* Opensource Projects Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {OPENSOURCE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Personal Projects Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">MY PROJECT</h2>
          <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Personal Portfolios</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {PERSONAL_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <Footer variant="minimal" />
    </main>
  )
}
