export default function GetInTouch() {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-0" id="contact">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">GET IN TOUCH</h2>
        <p className="text-accent-green text-sm tracking-[0.2em] uppercase font-bold">Let&apos;s Connect</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Big CTA card */}
        <div className="md:col-span-12 bg-surface-container rounded-2xl p-12 flex flex-col justify-between min-h-[320px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
            <span className="material-symbols-outlined text-[10rem]">terminal</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-[0_0_8px_#BBF7D0]"></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-green">
                Open for Internship 2026
              </span>
            </div>
            <h3 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              Ready to
              <br />
              Collaborate?
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="mailto:Ch4n1tnan@gmail.com"
              className="inline-flex items-center gap-3 bg-white text-background px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform w-fit"
            >
              Email Me
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </a>
            <a
              href="tel:0613905655"
              className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors w-fit"
            >
              061-390-5655
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                call
              </span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
