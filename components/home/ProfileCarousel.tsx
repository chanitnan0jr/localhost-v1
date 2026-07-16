'use client'

import { useState } from 'react'
import Image from 'next/image'

const PROFILE_IMAGES = [
  { src: '/images/Profilepic.png', alt: 'CSTU Spark Camp in AI group photo' },
  { src: '/images/Profilepic.jpg', alt: 'Chanitnan working with teammates in a computer lab' },
  { src: '/images/Profilepic-2.png', alt: 'CSTU Spark Camp welcome group photo' },
  { src: '/images/Profilepic-3.png', alt: 'Chanitnan with teammates at a university event' },
]

export default function ProfileCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = PROFILE_IMAGES[activeIndex]

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + PROFILE_IMAGES.length) % PROFILE_IMAGES.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % PROFILE_IMAGES.length)
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0" role="region" aria-label="Profile photos">
      <Image
        key={activeImage.src}
        src={activeImage.src}
        fill
        priority={activeIndex === 0}
        sizes="(max-width: 768px) 100vw, 58vw"
        className="object-cover object-center filter drop-shadow-2xl"
        alt={activeImage.alt}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

      <button
        type="button"
        onClick={showPrevious}
        aria-label="Previous profile photo"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-accent-green hover:text-black"
      >
        <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <button
        type="button"
        onClick={showNext}
        aria-label="Next profile photo"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-accent-green hover:text-black"
      >
        <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>

      <div className="absolute top-6 right-8 z-20 flex gap-2">
        {PROFILE_IMAGES.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show profile photo ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === activeIndex ? 'bg-accent-green' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
