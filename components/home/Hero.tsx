'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  const [dateStr, setDateStr] = useState<string>('')

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const mos = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    setDateStr(`${days[now.getDay()]}, ${mos[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}`)
  }, [])

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-6" id="about">
      <div
        className="relative w-full aspect-square md:aspect-[21/9] md:h-[600px] rounded-[2.5rem] bg-cover bg-center overflow-hidden flex flex-col justify-center items-center shadow-2xl"
        style={{ backgroundImage: "url('/images/Moutain.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Bottom Left: Date & Internship */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 flex flex-col gap-3">
          <p className="text-sm md:text-base font-bold text-white tracking-widest uppercase">
            {dateStr || 'Loading...'}
          </p>
          <div className="flex items-center gap-3 bg-[#131313]/60 backdrop-blur-md px-4 py-2 flex-shrink-0 rounded-full border border-white/10 w-fit">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-[0_0_8px_#BBF7D0]"></div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent-green">
              Open for Internship 2026
            </span>
          </div>
        </div>

        {/* Bottom Right: Scroll Badge */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 animate-[spin_15s_linear_infinite] opacity-70 hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28">
            <path
              id="textPath"
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              fill="transparent"
            ></path>
            <text className="text-[12px] font-black tracking-[0.3em] uppercase fill-white">
              <textPath href="#textPath" startOffset="0%">
                ....Loading.................
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
