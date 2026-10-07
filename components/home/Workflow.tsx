import Image from 'next/image'

const WORKFLOW_ITEMS = [
  {
    id: 1,
    number: '01',
    title: 'Architecture',
    content:
      'Whiteboarding the system design, selecting the right databases, and defining strict API contracts before writing a single line of code. Measure twice, cut once to prevent cascading technical debt.',
  },
  {
    id: 2,
    number: '02',
    title: 'Implementation',
    content:
      'Writing clean, type-safe code with robust error handling. Implementing core business logic prioritizing readability, modularity, and O(1) computational efficiency where critical.',
  },
  {
    id: 3,
    number: '03',
    title: 'Testing & QA',
    content:
      'Developing exhaustive unit, integration, and end-to-end test suites. Simulating race conditions and load testing to ensure absolute reliability and integrity under highly concurrent usage.',
  },
  {
    id: 4,
    number: '04',
    title: 'Deployment',
    content:
      'Containerizing the application with Docker and orchestrating automated CI/CD pipelines. Ensuring zero-downtime rollouts and establishing continuous monitoring and alerting systems.',
  },
]

export default function Workflow() {
  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-heading">
      <div className="workflow-layout">
        <div className="workflow-copy">
          <header className="workflow-header stack-title-group">
            <h2 id="workflow-heading" className="stack-title-row">
              <span className="stack-title-slash" aria-hidden="true">/</span>
              <span className="stack-title-core">WORK</span>
              <span className="stack-title-badge">FLOW</span>
            </h2>
            <p className="stack-subtitle">ENGINEERING PROCESS</p>
          </header>
          <div className="workflow-steps">
            {WORKFLOW_ITEMS.map(item => (
              <details key={item.id} name="workflow" open={item.id === 1} className="workflow-step">
                <summary>
                  <span className="workflow-step-number" aria-hidden="true">{item.number}</span>
                  <span className="workflow-step-slash" aria-hidden="true">/</span>
                  <h3>{item.title}</h3>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3 12h18" />
                    <path className="workflow-plus-stem" d="M12 3v18" />
                  </svg>
                </summary>
                <div className="workflow-step-content"><p>{item.content}</p></div>
              </details>
            ))}
          </div>
        </div>
        <div className="workflow-art">
          <div className="workflow-art-image">
            <Image
              src="/images/workflow-desk-v2.png"
              alt="Low-poly desk with a mechanical keyboard, camera, lenses, notebook and pencil"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
