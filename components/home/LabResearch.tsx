'use client'

import Image from 'next/image'
import { useToggle } from '@/hooks/useToggle'
import { useModalContext } from '@/context/ModalContext'

export default function LabResearch() {
  const [botnoiOpen, toggleBotnoi] = useToggle(false)
  const { openModal } = useModalContext()

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-6" id="research">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">EXPERIENCE &amp; CORE STACK</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Additional Info</p>
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">
              2025 – Present
            </span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              Tonkit Lab · TU
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-6">
              Undergraduate Research Assistant
            </h4>
            <ul className="space-y-6 text-on-surface-variant text-lg">
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Conduct applied research at Tonkit Lab, Thammasat University, bridging systems programming and
                  real-world research tooling.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Collaborate on software infrastructure for research workflows, applying backend engineering principles
                  to data-intensive pipelines.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/20 transition-colors">
          <div className="md:col-span-4">
            <span className="text-accent-green font-bold text-sm tracking-widest uppercase mb-2 block">2026</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
              Botnoi Trainee
            </h3>
          </div>
          <div className="md:col-span-8 border-l border-neutral-800 pl-8">
            <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-6">
              DevOps Engineer · <span className="text-accent-green">WORK FROM HOME</span>
            </h4>
            <ul className="space-y-4 text-on-surface-variant text-lg mb-6">
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Built and maintained a containerized observability stack with Docker Compose, Prometheus, Loki, Tempo,
                  Grafana, and Grafana Alloy for metrics, logs, traces, and dashboards.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Developed a Costmap FinOps proof of concept using FastAPI, DuckDB, LocalStack S3, and CUR/FOCUS billing
                  data to connect cloud cost with CPU and memory utilization.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent-green mt-1">•</span>
                <span>
                  Configured repeatable environment setup with deployment scripts, service health checks, persistent
                  volumes, and Grafana dashboard provisioning.
                </span>
              </li>
            </ul>
            <button
              type="button"
              onClick={toggleBotnoi}
              aria-expanded={botnoiOpen}
              aria-controls="botnoi-certificate"
              className="flex items-center gap-2 text-accent-green hover:text-white transition-colors font-bold uppercase tracking-widest text-sm focus:outline-none cursor-pointer"
            >
              <span
                className="material-symbols-outlined transition-transform duration-300"
                style={{ transform: botnoiOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
              <span>{botnoiOpen ? 'Hide Certificate' : 'View Certificate'}</span>
            </button>
            {botnoiOpen && (
              <div id="botnoi-certificate" className="mt-6 border-t border-white/10 pt-6">
                <Image
                  src="/images/Botnoi/BOTNOI-CERT.png"
                  alt="Botnoi Trainee 2026 DevOps Engineer certificate"
                  width={800}
                  height={579}
                  className="w-full h-auto rounded-xl border border-white/10 shadow-lg cursor-pointer"
                  onClick={() => openModal('/images/Botnoi/BOTNOI-CERT.png')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
