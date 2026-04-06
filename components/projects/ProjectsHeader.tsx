export default function ProjectsHeader() {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
      <h2 className="text-sm uppercase tracking-[0.4em] text-neutral-500 font-bold mb-4">Case Studies</h2>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9]">
          Selected
          <br />
          Work
        </h1>
        <p className="text-on-surface-variant max-w-sm text-sm uppercase leading-loose font-bold text-right">
          Problem → Solution → Impact.
          <br />
          Every project has a number to defend.
        </p>
      </div>
    </section>
  )
}
