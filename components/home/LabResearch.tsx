export default function LabResearch() {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-6" id="research">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">LAB RESEARCH &amp; CORE STACK</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Additional Info</p>
      </div>
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
          <p className="text-on-surface-variant text-sm uppercase tracking-widest font-bold mb-6">
            Undergraduate Research Assistant
          </p>
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
    </section>
  )
}
