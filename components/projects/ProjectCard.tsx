import type { Project } from '@/lib/projectsData'

function ProjectArtwork({ id }: { id: string }) {
  const dots = `work-dots-${id}`
  return (
    <svg viewBox="0 0 480 300" aria-hidden="true" focusable="false" className="selected-work-art">
      <defs>
        <pattern id={dots} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <path fill="#0c0b0a" d="M0 0h480v300H0z" />
      <path fill="#e12637" d="M0 0h390l-60 72 150 48v143l-83-30-83 67H0z" />
      <path fill={`url(#${dots})`} color="#0c0b0a" d="M0 0h380L302 300H0z" />
      <path fill="#eee9db" d="m89 40 185-17 105 252-243-23z" />
      <path fill={`url(#${dots})`} color="#eee9db" d="m331 0 149 55v245H298z" />
      {id === 'agriscanpro' ? (
        <>
          <path fill="#000" d="m12 256 165-54 126 41-41 37z" />
          <path d="M195 253c-6-61-6-116 31-173M191 204c-33-53-54-81-88-101" fill="none" stroke="#eee9db" strokeWidth="6" />
          <path d="M189 186C111 184 59 121 65 63c84 20 130 51 124 123Z" fill="#0c0b0a" stroke="#eee9db" strokeWidth="3" />
          <path d="M203 169c-8-77 42-114 96-113-4 63-46 110-96 113Z" fill="#eee9db" stroke="#0c0b0a" strokeWidth="5" />
          <path d="m89 87 95 99m94-111-74 100" fill="none" stroke="#ad3b36" strokeWidth="2" />
          <g transform="translate(316 88) rotate(7)">
            <path d="m7 9 102-3 12 175H-9z" fill="#000" />
            <path d="M0 0h106v163H0z" fill="#eee9db" stroke="#0c0b0a" strokeWidth="3" />
            <path d="M15 16h18v12H15zm27 0h49v8H42zM15 49h76v9H15zm0 45h76v9H15zm0 46h49v7H15z" fill="#0c0b0a" />
            <path d="M15 66h55v6H15zm0 47h62v6H15z" fill="#e12637" />
          </g>
          <path fill="#0c0b0a" d="m112 255 20-23 26 17 14-11 41 13-16 24z" />
        </>
      ) : id === 'mini-redis' ? (
        <>
          <path fill="#000" d="m87 269 244-31 100 48-277 14z" />
          {[198, 133, 68].map((y) => (
            <g key={y} transform={`translate(137 ${y})`} stroke="#eee9db" strokeWidth="3" strokeLinejoin="round">
              <path fill="#eee9db" d="m0 0 179-32 71 39-184 34z" />
              <path fill="#e12637" d="m179-32 71 39v53l-71-31z" />
              <path fill="#0c0b0a" d="m0 0 179-32v61L0 62z" />
              <path d="m-40 21 26-4m-23 27 23-4m175-4 7-1" stroke="#e12637" strokeWidth="7" />
            </g>
          ))}
          <path d="m164 83 12 11-12 16m29-4 25-4" fill="none" stroke="#e12637" strokeWidth="7" />
          <path d="m302 50 60 20m-60-8 60 21m-60-9 60 21" fill="none" stroke="#0c0b0a" strokeWidth="2" />
        </>
      ) : id === 'pythainlp' ? (
        <>
          <g transform="translate(70 51) rotate(4)">
            <path fill="#000" d="m13 14 302-6v204L13 232z" />
            <path fill="#eee9db" stroke="#0c0b0a" strokeWidth="4" d="M0 0h300v207H0z" />
            <path fill="#e12637" d="M0 0h300v34H0z" />
            <path fill="#0c0b0a" d="M14 10h12v12H14zm24 0h12v12H38zm24 0h12v12H62z" />
            <path d="m97 78-39 38 39 34m105-72 39 38-39 34m-65 13 29-106" fill="none" stroke="#0c0b0a" strokeWidth="12" />
            <path fill={`url(#${dots})`} color="#0c0b0a" d="M243 35h57v172h-57z" />
          </g>
          <g transform="translate(354 173) rotate(-10)">
            <path d="M-18 7v-22a27 27 0 0 1 54 0V7" fill="none" stroke="#0c0b0a" strokeWidth="19" />
            <path d="M-23 1v-22a27 27 0 0 1 54 0V1" fill="none" stroke="#e12637" strokeWidth="14" />
            <path fill="#000" d="M-37 8h99v78h-99z" />
            <path fill="#e12637" stroke="#eee9db" strokeWidth="3" d="M-45 0h99v78h-99z" />
            <path fill="#0c0b0a" d="M4 21a11 11 0 0 1 6 20l5 17H-6l5-17a11 11 0 0 1 5-20Z" />
          </g>
        </>
      ) : id === 'tpsystem' ? (
        <>
          <g transform="translate(68 55) rotate(-5)">
            <path fill="#000" d="M10 10h190v180H10z" />
            <path fill="#eee9db" stroke="#0c0b0a" strokeWidth="5" d="M0 0h190v180H0z" />
            <circle cx="95" cy="90" r="72" fill="#0c0b0a" stroke="#eee9db" strokeWidth="4" />
            <circle cx="95" cy="90" r="54" fill="#e12637" stroke="#0c0b0a" strokeWidth="3" />
            <circle cx="95" cy="90" r="28" fill="#eee9db" stroke="#0c0b0a" strokeWidth="4" />
            <circle cx="95" cy="90" r="10" fill="#0c0b0a" />
            <path d="M95 24v38M95 118v38M29 90h38M123 90h38M48 43l27 27M115 110l27 27M48 137l27-27M115 70l27-27" stroke="#0c0b0a" strokeWidth="8" strokeLinecap="round" />
          </g>
          <g transform="translate(265 95) rotate(8)">
            <path fill="#000" d="M8 8h150v140H8z" />
            <path fill="#eee9db" stroke="#0c0b0a" strokeWidth="4" d="M0 0h150v140H0z" />
            <path fill="#e12637" d="M0 0h150v32H0z" />
            <text x="12" y="22" fill="#eee9db" fontFamily="monospace" fontWeight="900" fontSize="13">#TX // ACID</text>
            <path d="M15 48h120v6H15zm0 18h95v6H15zm0 18h110v6H15zm0 18h70v6H15z" fill="#0c0b0a" />
            <path fill="#e12637" d="M15 118h50v8H15z" />
            <path d="M-22 65h35" stroke="#0c0b0a" strokeWidth="10" strokeLinecap="round" />
            <path d="M-22 65h35" stroke="#e12637" strokeWidth="4" strokeLinecap="round" />
          </g>
        </>
      ) : id === 'specbot' ? (
        <>
          <g transform="translate(85 45) rotate(-6)">
            <path fill="#000" d="M10 10h140v215H10z" />
            <path fill="#0c0b0a" stroke="#eee9db" strokeWidth="4" d="M0 0h140v215H0z" />
            <path fill="#eee9db" d="M10 18h120v175H10z" />
            <circle cx="70" cy="9" r="3" fill="#eee9db" />
            <path d="M55 204h30" stroke="#eee9db" strokeWidth="4" strokeLinecap="round" />
            <path fill="#e12637" d="M20 30h75v18H20z" />
            <path fill="#0c0b0a" d="M20 56h100v6H20zm0 14h85v6H20zm0 14h95v6H20z" />
            <path fill="#e12637" d="M45 105h65v18H45z" />
            <path fill="#0c0b0a" d="M20 135h100v6H20zm0 14h70v6H20z" />
          </g>
          <g transform="translate(255 70) rotate(5)">
            <path fill="#000" d="M8 8h165v120H8z" />
            <path fill="#eee9db" stroke="#0c0b0a" strokeWidth="4" d="M0 0h165v120H0z" />
            <path fill="#e12637" d="M0 0h165v30H0z" />
            <text x="12" y="21" fill="#eee9db" fontFamily="monospace" fontWeight="900" fontSize="13">RAG // LLM</text>
            <path d="M25 85l35-35 45 40 35-25" fill="none" stroke="#0c0b0a" strokeWidth="3" />
            <circle cx="25" cy="85" r="7" fill="#e12637" stroke="#0c0b0a" strokeWidth="3" />
            <circle cx="60" cy="50" r="7" fill="#0c0b0a" />
            <circle cx="105" cy="90" r="7" fill="#e12637" stroke="#0c0b0a" strokeWidth="3" />
            <circle cx="140" cy="65" r="7" fill="#0c0b0a" />
            <path d="M-15 45L0 35v25Z" fill="#eee9db" stroke="#0c0b0a" strokeWidth="3" />
          </g>
        </>
      ) : (
        /* Monitoring graphic; generic title for other project domains. */
        <>
          <g transform="translate(60 50) rotate(3)">
            <path fill="#000" d="M12 12h320v190H12z" />
            <path fill="#eee9db" stroke="#0c0b0a" strokeWidth="4" d="M0 0h320v190H0z" />
            <path fill="#0c0b0a" d="M0 0h320v32H0z" />
            <circle cx="16" cy="16" r="5" fill="#e12637" />
            <circle cx="32" cy="16" r="5" fill="#eee9db" />
            <circle cx="48" cy="16" r="5" fill="#534d47" />
            <text x="65" y="21" fill="#eee9db" fontFamily="monospace" fontWeight="800" fontSize="12">{id === 'agriscan-monitor' ? 'AWS // GRAFANA OBSERVE' : id === 'sme-costmap' ? 'FINOPS // COSTMAP' : id === 'lms-obe-evidence' ? 'LMS // OBE EVIDENCE' : id === 'ntcir-semantic-retrieval' ? 'VIDEO // SEMANTIC RETRIEVAL' : 'APPLIED AI // S6'}</text>
            <path d="M20 140h280M20 90h280" stroke="#d8d1c2" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M20 140l50-5 25-35 20 60 25-90 20 110 30-40 40 0 50 0" fill="none" stroke="#e12637" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <g transform="translate(250 85)">
              <circle cx="28" cy="28" r="24" fill="#0c0b0a" stroke="#eee9db" strokeWidth="3" />
              <path d="M28 28l14-14" stroke="#e12637" strokeWidth="4" strokeLinecap="round" />
              <circle cx="28" cy="28" r="4" fill="#eee9db" />
            </g>
          </g>
        </>
      )}
    </svg>
  )
}

interface ProjectCardProps {
  project: Project
  index?: number
  accent?: 'green' | 'blue' | 'white'
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const categoryDisplay = project.category
    .replace(' & ', ' / ')
    .replace('Open Source Security', 'Open Source / Security')

  return (
    <article className="selected-work-card" data-project={project.id}>
      <ProjectArtwork id={project.id} />
      <div className="selected-work-content">
        <p className="selected-work-category">{categoryDisplay}</p>
        <h3>{project.name}</h3>
        <p className="selected-work-description">{project.description}</p>
        {project.contribution && <p className="selected-work-contribution"><strong>{project.type === 'personal' ? 'My work' : 'My contribution'}</strong>{project.contribution}</p>}
        {project.badge && (
          <p className="selected-work-badge">
            <span aria-hidden="true">⑂</span> {project.badge}
          </p>
        )}
        <ul className="selected-work-tags" aria-label={`${project.name} technologies`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="selected-work-actions">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="selected-work-link"
            >
              <span>View {project.type === 'opensource' ? 'contribution' : 'project'}</span>
              <span aria-hidden="true">↗</span>
              <span className="sr-only">: {project.name} (opens in a new tab)</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="selected-work-link live-demo-link"
            >
              <span>Live Demo</span>
              <span aria-hidden="true">↗</span>
              <span className="sr-only">: {project.name} live demo (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
