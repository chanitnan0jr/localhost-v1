interface FooterProps {
  variant?: 'full' | 'minimal'
}

export default function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className="bg-[#0E0E0E] w-full py-20 px-12 mt-40">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-neutral-800/20 pt-12">
          <div className="text-lg font-bold text-white mb-8 md:mb-0">CHANITNAN_K</div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
            <a
              className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-500"
              href="https://github.com/chanitnan0jr"
              target="_blank"
              rel="noopener"
            >
              GITHUB
            </a>
            <a
              className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-500"
              href="https://www.linkedin.com/in/chanitnan-kitnantakhun"
              target="_blank"
              rel="noopener"
            >
              LINKEDIN
            </a>
            <a
              className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-500"
              href="mailto:Ch4n1tnan@gmail.com"
            >
              EMAIL
            </a>
          </div>
          <p className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-600">
            © 2026 CHANITNAN KITNANTAKHUN. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-[#0E0E0E] w-full py-10 px-6 md:px-12 mt-10">
      <div className="max-w-7xl mx-auto border-t border-neutral-800/20 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="text-lg font-bold text-white tracking-widest uppercase">
            CHANITNAN KITNANTAKHUN
          </div>
          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <p className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-600 mb-2">
                Contact
              </p>
              <a
                href="mailto:Ch4n1tnan@gmail.com"
                className="block font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-300 mb-1"
              >
                Ch4n1tnan@gmail.com
              </a>
              <a
                href="tel:0613905655"
                className="block font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-300"
              >
                061-390-5655
              </a>
            </div>
            <div>
              <p className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-600 mb-2">
                Location
              </p>
              <p className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500">
                Thammasat University · Thailand
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <a
              className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-500"
              href="https://github.com/chanitnan0jr"
              target="_blank"
              rel="noopener"
            >
              GITHUB
            </a>
            <a
              className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-500"
              href="https://www.linkedin.com/in/chanitnan-kitnantakhun"
              target="_blank"
              rel="noopener"
            >
              LINKEDIN
            </a>
            <a
              className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-500"
              href="https://discordapp.com/users/792394993817092126"
              target="_blank"
              rel="noopener"
            >
              DISCORD
            </a>
          </div>
        </div>
        <p className="font-['Inter'] text-xs tracking-widest uppercase text-neutral-700 mt-10 text-center w-full border-t border-neutral-800/20 pt-8">
          © 2026 CHANITNAN KITNANTAKHUN. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
