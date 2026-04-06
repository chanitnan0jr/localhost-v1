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
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-10" id="certifications">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">CERTIFICATIONS</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Ongoing Learning</p>
      </div>
      <div className="space-y-8">

        {/* AWS Academy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">
              2026 – Present
            </span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              AWS Academy
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
              Cloud Developing · In Progress
            </p>
            <ul className="space-y-6 text-on-surface-variant text-lg">
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Studying AWS Cloud Developing track covering S3, DynamoDB, Lambda, and API Gateway for serverless and
                  cloud-native architectures.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Supplementary DataCamp certifications: Supervised Learning (scikit-learn), FastAPI, NumPy, and pandas
                  data engineering.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* DataCamp */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">
              2025 – 2026
            </span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              DataCamp
            </h3>
            <p className="text-on-surface-variant text-sm mt-3 font-bold uppercase tracking-widest">22 Total Hours</p>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8 overflow-hidden">
            <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
              Data Science, Backend &amp; Tools
            </p>
            <ul className="space-y-6 text-on-surface-variant text-lg mb-8">
              <li className="flex gap-4 items-start">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  <strong className="text-white font-bold tracking-wide">Total Learning Effort:</strong> Completed 22+
                  hours of professional technical coursework between October 2025 and January 2026.
                </span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  <strong className="text-white font-bold tracking-wide">Backend Development:</strong> Gained
                  proficiency in building high-performance APIs using FastAPI.
                </span>
              </li>
              <li className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <span className="text-accent-green mt-1">•</span>
                  <span>
                    <strong className="text-white font-bold tracking-wide">
                      Data Science &amp; Engineering Stack:
                    </strong>
                  </span>
                </div>
                <ul className="pl-8 space-y-4 text-neutral-400 text-base">
                  <li className="flex gap-4 items-start">
                    <span className="text-neutral-600">-</span>
                    <span>Mastered high-dimensional array processing with NumPy.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-neutral-600">-</span>
                    <span>
                      Specialized in advanced data manipulation and relational data joining using pandas.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-neutral-600">-</span>
                    <span>
                      Implemented predictive modeling through Supervised Learning with scikit-learn.
                    </span>
                  </li>
                </ul>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  <strong className="text-white font-bold tracking-wide">Version Control:</strong> Achieved
                  Intermediate Git proficiency, focusing on advanced repository management and collaborative workflows.
                </span>
              </li>
            </ul>

            {/* Dropdown Button */}
            <button
              onClick={toggleDatacamp}
              className="flex items-center gap-2 text-accent-green hover:text-white transition-colors font-bold uppercase tracking-widest text-sm mb-6 focus:outline-none cursor-pointer"
            >
              <span
                className="material-symbols-outlined transition-transform duration-300"
                style={{ transform: datacampOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
              <span>{datacampOpen ? 'Hide Certificates' : 'View Certificates'}</span>
            </button>

            {/* Infinite Scroll Carousel */}
            {datacampOpen && (
              <div className="w-full relative h-[140px] rounded-xl bg-[#131313] border border-white/5 box-border overflow-hidden">
                {/* Left/Right Fades */}
                <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-[#131313] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-[#131313] to-transparent z-10 pointer-events-none"></div>

                <div className="flex items-center h-full w-max animate-datacamp-scroll hover:cursor-pointer">
                  {/* Group 1 */}
                  <div className="flex items-center gap-4 pr-4">
                    {DATACAMP_CERTS.map((cert) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={cert.src + '-1'}
                        src={cert.src}
                        className="h-[140px] w-auto rounded-lg object-contain border border-white/10 hover:border-white/40 transition-colors"
                        alt={cert.alt}
                        onClick={() => openModal(cert.src)}
                      />
                    ))}
                  </div>
                  {/* Group 2 (duplicate for loop) */}
                  <div className="flex items-center gap-4 pr-4">
                    {DATACAMP_CERTS.map((cert) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={cert.src + '-2'}
                        src={cert.src}
                        className="h-[140px] w-auto rounded-lg object-contain border border-white/10 hover:border-white/40 transition-colors"
                        alt={cert.alt}
                        onClick={() => openModal(cert.src)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
