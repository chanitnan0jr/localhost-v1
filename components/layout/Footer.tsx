export default function Footer() {
  return (
    <footer className="bg-background phantom-footer w-full py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto border-t border-neutral-800/20 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="text-lg font-bold text-white tracking-widest uppercase">
            CHANITNAN KITNANTAKHUN
          </div>
          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-neutral-300 mb-2">
                Contact
              </p>
              <a
                href="mailto:Ch4n1tnan@gmail.com"
                className="block font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-300 mb-1"
              >
                Ch4n1tnan@gmail.com
              </a>
              <a
                href="tel:0613905655"
                className="block font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-300"
              >
                061-390-5655
              </a>
            </div>
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-neutral-300 mb-2">
                Location
              </p>
              <p className="font-body text-xs tracking-widest uppercase text-neutral-300">
                Thammasat University · Thailand
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <a
              className="font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-500"
              href="https://github.com/chanitnan0jr"
              target="_blank"
              rel="noopener"
            >
              GITHUB
            </a>
            <a
              className="font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-500"
              href="https://www.linkedin.com/in/chanitnan-kitnantakhun-96a692391/"
              target="_blank"
              rel="noopener"
            >
              LINKEDIN
            </a>
            <a
              className="font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-500"
              href="https://discordapp.com/users/792394993817092126"
              target="_blank"
              rel="noopener"
            >
              DISCORD
            </a>
          </div>
        </div>
        <p className="font-body text-xs tracking-widest uppercase text-neutral-400 mt-10 text-center w-full border-t border-neutral-800/20 pt-8">
          © 2026 CHANITNAN KITNANTAKHUN. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
