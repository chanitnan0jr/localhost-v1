'use client'

import { useToggle } from '@/hooks/useToggle'
import { useModalContext } from '@/context/ModalContext'

const DATACAMP_CERTS = [
  { src: '/images/Datacamp/Scikit-learn.png', alt: 'Supervised Learning' },
  { src: '/images/Datacamp/FastAPI.png', alt: 'FastAPI' },
  { src: '/images/Datacamp/numpy.png', alt: 'NumPy' },
  { src: '/images/Datacamp/Pandas.png', alt: 'Joining Pandas' },
  { src: '/images/Datacamp/Pandas2.png', alt: 'Data Man Pandas' },
  { src: '/images/Datacamp/IntermediateGit.png', alt: 'Git' },
]

export default function Certifications() {
  const [datacampOpen, toggleDatacamp] = useToggle(false)
  const { openModal } = useModalContext()

  return (
    <section className="certifications-section" id="certifications" aria-labelledby="certifications-heading">
      <div className="certifications-inner">
        <header className="certifications-header stack-title-group">
          <h2 id="certifications-heading" className="certifications-title">
            <span className="stack-title-slash" aria-hidden="true">/</span>
            <span>CERTIFICATIONS</span>
          </h2>
          <p className="stack-subtitle">ONGOING LEARNING</p>
        </header>

        <div className="certifications-layout">
          {/* Left Metadata Column */}
          <div className="certifications-metadata">
            <p className="certifications-date">2025 – 2026</p>
            <h3 className="certifications-org">
              <a href="https://app.datacamp.com/" target="_blank" rel="noopener noreferrer">
                DATACAMP
              </a>
            </h3>
            <div className="certifications-bar" aria-hidden="true" />
            <div className="certifications-stat">
              <span className="certifications-stat-number">22</span>
              <span className="certifications-stat-label">TOTAL HOURS</span>
            </div>
          </div>

          {/* Right Column: Reused experience-detail Card */}
          <div className="experience-detail certifications-card">
            <span className="experience-folder-tab" aria-hidden="true" />
            <span className="experience-corner" aria-hidden="true" />

            <div className="certifications-card-header">
              <p className="certifications-eyebrow">DATA SCIENCE, BACKEND &amp; TOOLS</p>
            </div>

            <ol className="experience-responsibilities">
              <li>
                <span className="experience-responsibility-number" aria-hidden="true">01</span>
                <div>
                  <h4>BACKEND DEVELOPMENT</h4>
                  <p>API development with FastAPI.</p>
                </div>
              </li>
              <li>
                <span className="experience-responsibility-number" aria-hidden="true">02</span>
                <div>
                  <h4>DATA SCIENCE &amp; ENGINEERING</h4>
                  <p>
                    NumPy · pandas · scikit-learn
                    <br />
                    <span>Array processing, data manipulation, and supervised learning.</span>
                  </p>
                </div>
              </li>
              <li>
                <span className="experience-responsibility-number" aria-hidden="true">03</span>
                <div>
                  <h4>VERSION CONTROL</h4>
                  <p>Intermediate Git, repository management, and collaborative workflows.</p>
                </div>
              </li>
            </ol>

            <div className="experience-certificate">
              <button
                type="button"
                onClick={toggleDatacamp}
                aria-expanded={datacampOpen}
                aria-controls="datacamp-certificates"
                className="experience-certificate-toggle"
              >
                {datacampOpen ? 'Hide certificates' : 'View certificates'}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14m-6-6 6 6 6-6" />
                </svg>
              </button>
            </div>

            <div id="datacamp-certificates" hidden={!datacampOpen} className="certificates-gallery">
              {datacampOpen && DATACAMP_CERTS.map((cert) => (
                <button
                  key={cert.src}
                  type="button"
                  onClick={() => openModal(cert.src)}
                  aria-label={`View ${cert.alt} certificate`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cert.src} alt={cert.alt} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="certifications-bottom-line" aria-hidden="true">
          <span className="certifications-bottom-notch" />
        </div>
      </div>
    </section>
  )
}
