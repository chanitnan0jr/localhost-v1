'use client'

import { useState } from 'react'

const WORKFLOW_ITEMS = [
  {
    id: 1,
    number: '01',
    title: 'Architecture',
    icon: 'account_tree',
    content:
      'Whiteboarding the system design, selecting the right databases, and defining strict API contracts before writing a single line of code. Measure twice, cut once to prevent cascading technical debt.',
  },
  {
    id: 2,
    number: '02',
    title: 'Implementation',
    icon: 'code_blocks',
    content:
      'Writing clean, type-safe code with robust error handling. Implementing core business logic prioritizing readability, modularity, and O(1) computational efficiency where critical.',
  },
  {
    id: 3,
    number: '03',
    title: 'Testing & QA',
    icon: 'bug_report',
    content:
      'Developing exhaustive unit, integration, and end-to-end test suites. Simulating race conditions and load testing to ensure absolute reliability and integrity under highly concurrent usage.',
  },
  {
    id: 4,
    number: '04',
    title: 'Deployment',
    icon: 'rocket_launch',
    content:
      'Containerizing the application with Docker and orchestrating automated CI/CD pipelines. Ensuring zero-downtime rollouts and establishing continuous monitoring and alerting systems.',
  },
]

export default function Workflow() {
  const [openIds, setOpenIds] = useState<number[]>([])

  const toggle = (id: number) => setOpenIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20" id="workflow">
      <div className="flex justify-center mb-12">
        <div className="px-8 py-3 rounded-full bg-surface-container border border-white/10 text-white font-black tracking-widest uppercase text-sm">
          MY WORK FLOW
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative items-stretch">

        {/* Accordions Left */}
        <div className="lg:col-span-6 space-y-4 w-full">
          {WORKFLOW_ITEMS.map(item => (
            <div
              key={item.id}
              className="border border-white/10 rounded-2xl bg-surface-container overflow-hidden transition-all duration-500 hover:border-white/20"
            >
              <button
                className="w-full text-left p-8 flex justify-between items-start focus:outline-none cursor-pointer group"
                onClick={() => toggle(item.id)}
              >
                <div>
                  <span className="text-2xl font-black text-white/20 mb-2 block tracking-widest group-hover:text-accent-green transition-colors">
                    {item.number}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase transition-transform duration-300 group-hover:translate-x-2">
                    {item.title}
                  </h3>
                </div>
                <span className={`material-symbols-outlined text-4xl transition-all duration-300 group-hover:text-accent-green ${openIds.includes(item.id) ? 'text-accent-green -rotate-45' : 'text-white/20'}`}>
                  {item.icon}
                </span>
              </button>

              <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${openIds.includes(item.id) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="px-8 pb-8 text-neutral-400 text-lg leading-relaxed border-t border-white/5 pt-6 mt-2">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Image Right */}
        <div className="lg:col-span-6 hidden lg:block h-full w-full rounded-[2rem] overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/50 to-transparent z-10" />
          <img
            src="/images/workflow_bg.png"
            alt="Workflow"
            className="w-full h-full object-cover object-center transition-all duration-500"
          />
        </div>

      </div>
    </section>
  )
}
