import { Project } from '@/lib/projectsData'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden bg-surface-container rounded-2xl aspect-[4/3] flex flex-col justify-end p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest/40 to-transparent group-hover:opacity-70 transition-opacity duration-700"></div>
      <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
        <span className="material-symbols-outlined text-[8rem] text-accent-green">{project.icon}</span>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <h4 className="text-accent-green font-black text-2xl uppercase tracking-tighter">{project.name}</h4>
          {project.badge && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-accent-green/20 text-accent-green rounded-full border border-accent-green/30">
              {project.badge}
            </span>
          )}
        </div>
        <p className="text-white text-lg font-light leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
