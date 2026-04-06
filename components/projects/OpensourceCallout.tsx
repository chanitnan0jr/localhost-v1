export default function OpensourceCallout() {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
      <div className="bg-surface-container border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/20 transition-colors relative overflow-hidden">
        {/* Abstract Decoration Background */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent-green/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/20 flex flex-shrink-0 items-center justify-center text-accent-green animate-pulse">
            <span className="material-symbols-outlined text-3xl">my_location</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black uppercase text-white tracking-tighter mb-1">OPENSOURCE PROJECTS</h3>
            <p className="text-sm text-neutral-400 font-bold leading-relaxed">
              Actively <span className="text-white">Contributing to Opensource projects</span>.
            </p>
          </div>
        </div>

        <div className="text-left md:text-right z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
          <p className="text-[12px] text-neutral-500 uppercase tracking-widest font-bold max-w-xs md:ml-auto">
            Passionate about architecting resilient, high-volume scalable systems and elegant backends.
          </p>
        </div>
      </div>
    </section>
  )
}
