import type { Metadata } from 'next'
import ProjectsHeader from '@/components/projects/ProjectsHeader'
import ProjectsContent from '@/components/projects/ProjectsContent'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work and case studies by Chanitnan Kitnantakhun.',
}

export default function ProjectsPage() {
  return (
    <main className="pt-32 pb-20">
      <ProjectsHeader />
      <ProjectsContent />
      <Footer variant="full" />
    </main>
  )
}
