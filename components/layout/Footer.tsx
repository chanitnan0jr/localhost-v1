import { CONTACT } from '@/lib/contact'

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
                href={`mailto:${CONTACT.email}`}
                className="block font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-300 mb-1"
              >
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone.replaceAll('-', '')}`}
                className="block font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-300"
              >
                {CONTACT.phone}
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
              href={CONTACT.github}
              target="_blank"
              rel="noopener"
            >
              GITHUB
            </a>
            <a
              className="font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-500"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener"
            >
              LINKEDIN
            </a>
            <a
              className="font-body text-xs tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-500"
              href={CONTACT.discord}
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
