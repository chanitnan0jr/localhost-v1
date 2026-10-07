'use client'

import Image from 'next/image'
import { useRef, useState, type KeyboardEvent } from 'react'
import { useToggle } from '@/hooks/useToggle'
import { useModalContext } from '@/context/ModalContext'

const EXPERIENCES = [
  {
    id: 'tonkit',
    date: '2025 – Present',
    organization: 'Tonkit Lab · TU',
    role: 'Undergraduate Research Assistant',
    summary: 'Research workflows and backend infrastructure.',
    location: null,
    responsibilities: [
      { title: 'Applied research', description: 'Conduct applied research at Tonkit Lab, Thammasat University, bridging systems programming and real-world research tooling.' },
      { title: 'Research infrastructure', description: 'Collaborate on software infrastructure for research workflows, applying backend engineering principles to data-intensive pipelines.' },
    ],
    tools: [],
    certificate: null,
  },
  {
    id: 'botnoi',
    date: '2026',
    organization: 'Botnoi Trainee',
    role: 'DevOps Engineer',
    summary: null,
    location: 'Work from home',
    responsibilities: [
      { title: 'Observability', description: 'Built a containerized stack for metrics, logs, traces, and dashboards.' },
      { title: 'FinOps', description: 'Developed a Costmap proof of concept connecting CUR/FOCUS cloud costs with CPU and memory usage.' },
      { title: 'Deployment', description: 'Made setup repeatable with deployment scripts, health checks, persistent volumes, and Grafana provisioning.' },
    ],
    tools: ['Docker Compose', 'Prometheus', 'Loki', 'Tempo', 'Grafana', 'Grafana Alloy', 'FastAPI', 'DuckDB', 'LocalStack S3'],
    certificate: '/images/Botnoi/BOTNOI-CERT.png',
  },
]

export default function LabResearch() {
  const [activeIndex, setActiveIndex] = useState(1)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const [botnoiOpen, toggleBotnoi] = useToggle(false)
  const { openModal } = useModalContext()
  const experience = EXPERIENCES[activeIndex]
  const certificate = experience.certificate

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % EXPERIENCES.length
    else if (event.key === 'ArrowUp') nextIndex = (index - 1 + EXPERIENCES.length) % EXPERIENCES.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = EXPERIENCES.length - 1
    else return
    event.preventDefault()
    setActiveIndex(nextIndex)
    tabs.current[nextIndex]?.focus()
  }

  return (
    <section className="experience-section" id="research" aria-labelledby="experience-heading">
      <div className="experience-layout">
        <div className="experience-sidebar">
          <header className="experience-header stack-title-group">
            <h2 id="experience-heading" className="stack-title-row">
              <span className="stack-title-slash" aria-hidden="true">/</span>
              <span className="stack-title-core">WORK</span>
              <span className="stack-title-badge">EXPERIENCE</span>
            </h2>
            <p className="stack-subtitle">Additional info</p>
          </header>
          <div className="experience-tabs" role="tablist" aria-label="Work experience" aria-orientation="vertical">
          {EXPERIENCES.map((entry, index) => (
            <button
              key={entry.id}
              ref={(node) => { tabs.current[index] = node }}
              type="button"
              id={`experience-tab-${entry.id}`}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls="experience-panel"
              tabIndex={activeIndex === index ? 0 : -1}
              className="experience-tab"
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              <span className="experience-entry-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="experience-entry-copy">
                <span className="experience-entry-date">{entry.date}</span>
                <span className="experience-entry-organization">{entry.organization}</span>
                <span className="experience-entry-role">{entry.role}</span>
                {entry.summary && <span className="experience-entry-summary">{entry.summary}</span>}
              </span>
              {activeIndex === index && <svg className="experience-entry-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>}
            </button>
          ))}
          </div>
        </div>

        <div id="experience-panel" role="tabpanel" aria-labelledby={`experience-tab-${experience.id}`} tabIndex={0} className="experience-detail">
          <span className="experience-folder-tab" aria-hidden="true" />
          <span className="experience-corner" aria-hidden="true" />
          <header className="experience-detail-header">
            <div className="experience-meta">
              <span>{experience.date}</span>
              {experience.location && <><span className="experience-meta-dash" aria-hidden="true">—</span><span className="experience-location">{experience.location}</span></>}
            </div>
            <h3>{experience.role}</h3>
            <p>{experience.organization}</p>
          </header>
          <ol className="experience-responsibilities">
            {experience.responsibilities.map((item, index) => (
              <li key={item.title}>
                <span className="experience-responsibility-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><h4>{item.title}</h4><p>{item.description}</p></div>
              </li>
            ))}
          </ol>
          {experience.tools.length > 0 && (
            <div className="experience-used-stack">
              <h4>Core stack used</h4>
              <ul aria-label="Tools used at Botnoi">{experience.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
            </div>
          )}
          {certificate && (
            <div className="experience-certificate">
              <button type="button" onClick={toggleBotnoi} aria-expanded={botnoiOpen} aria-controls="botnoi-certificate" className="experience-certificate-toggle">
                {botnoiOpen ? 'Hide certificate' : 'View certificate'}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6" /></svg>
              </button>
              <div id="botnoi-certificate" hidden={!botnoiOpen} className="experience-certificate-image">
                {botnoiOpen && (
                  <button type="button" aria-label="View Botnoi certificate" onClick={() => openModal(certificate)}>
                    <Image src={certificate} alt="Botnoi Trainee 2026 DevOps Engineer certificate" width={800} height={579} sizes="(max-width: 760px) 100vw, 65vw" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
