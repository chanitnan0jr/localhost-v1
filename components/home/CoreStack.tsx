'use client'

import { useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useStackCarousel, type ViewMode } from '@/hooks/useStackCarousel'
import { STACK_CATEGORIES, type TechItem } from '@/lib/stackData'

function StackIcon({ item, order, reducedMotion }: { item: TechItem; order: number; reducedMotion: boolean }) {
  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.22, delay: reducedMotion ? 0 : order * 0.02, ease: 'easeOut' }}
      className="stack-tool"
    >
      <div className="stack-tool-icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.iconUrl} width="38" height="38" loading="lazy" decoding="async" alt="" className={item.filter} />
      </div>
      <span className="stack-tool-name">{item.name}</span>
    </motion.li>
  )
}

function StackArrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d={previous ? 'm15 19-7-7 7-7' : 'm9 5 7 7-7 7'} />
    </svg>
  )
}

export default function CoreStack() {
  const { currentIdx, viewMode, next, prev, setMode } = useStackCarousel()
  const directionRef = useRef<1 | -1>(1)
  const reducedMotion = Boolean(useReducedMotion())
  const isShowAll = viewMode === 'showall'
  const category = STACK_CATEGORIES[currentIdx]
  const duration = reducedMotion ? 0 : 0.22

  const handleNext = () => { directionRef.current = 1; next() }
  const handlePrev = () => { directionRef.current = -1; prev() }

  return (
    <section className="about-core-stack" aria-labelledby="core-stack-heading">
      <header className="stack-header">
        {/* Low-poly faceted shards banner backdrop */}
        <svg className="stack-header-shards" viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="shard-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e12637" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#801018" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="shard-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1d24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0b0c0f" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polygon points="420,0 560,35 490,95 360,45" fill="url(#shard-dark)" />
          <polygon points="560,35 700,0 640,70 490,95" fill="#14171d" />
          <polygon points="700,0 870,20 790,75 640,70" fill="url(#shard-crimson)" opacity="0.45" />
          <polygon points="870,20 1000,0 930,55 790,75" fill="#20242c" />
          <polygon points="640,70 790,75 730,115 590,110" fill="#181a20" />
          <polygon points="760,25 920,30 850,68" fill="#e12637" opacity="0.6" />
          <polygon points="850,68 1020,15 950,75" fill="#a81524" opacity="0.45" />
          <polygon points="950,75 1130,0 1040,65" fill="#e12637" opacity="0.75" />
          <line x1="560" y1="35" x2="870" y2="20" stroke="#ff384c" strokeWidth="1" opacity="0.6" />
          <line x1="700" y1="0" x2="850" y2="68" stroke="#ff384c" strokeWidth="1" opacity="0.4" />
          <line x1="850" y1="68" x2="1130" y2="0" stroke="#ff384c" strokeWidth="1" opacity="0.75" />
        </svg>

        <div className="stack-title-group">
          {/* Halftone dot matrix & crimson wedge backdrop matching reference mock */}
          <svg className="stack-title-bg" viewBox="0 0 540 130" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <pattern id="core-title-dots" width="8" height="11" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2.5" r="1.3" fill="#e12637" opacity="0.7" />
                <circle cx="6" cy="8" r="1.3" fill="#e12637" opacity="0.7" />
              </pattern>
            </defs>
            <polygon points="16,0 540,0 460,130 0,130" fill="url(#core-title-dots)" />
            <polygon points="0,0 72,0 24,130 0,130" fill="#e12637" />
          </svg>
          <div className="stack-title-row">
            <span className="stack-title-core" id="core-stack-heading">CORE</span>
            <span className="stack-title-badge">STACK</span>
          </div>
          <p className="stack-subtitle">THE TOOLS OF MY TRADE</p>
        </div>

        <div className="stack-modes" role="group" aria-label="Stack display mode">
          {(['carousel', 'showall'] satisfies ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`stack-mode-btn ${viewMode === mode ? 'is-active' : ''}`}
              aria-pressed={viewMode === mode}
              aria-controls="stack-content"
              onClick={() => setMode(mode)}
            >
              {mode === 'carousel' ? 'CAROUSEL' : 'SHOW ALL'}
            </button>
          ))}
        </div>
      </header>

      <div id="stack-content" className="stack-content">
        <AnimatePresence mode="wait" initial={false}>
          {!isShowAll ? (
            <motion.div
              key="carousel"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
              className="stack-carousel-wrap"
            >
              <div className="stack-row stack-carousel-row" data-category={category.id}>
                <div className="stack-row-label">
                  <span className="stack-row-num">{String(currentIdx + 1).padStart(2, '0')}</span>
                  <span className="stack-row-slash">/</span>
                  <h4 className="stack-row-title">{category.title}</h4>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ul
                    key={category.id}
                    aria-label={category.title}
                    initial={reducedMotion ? false : { opacity: 0, x: directionRef.current * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: directionRef.current * -24 }}
                    transition={{ duration, ease: 'easeOut' }}
                    className="stack-row-items"
                  >
                    {category.items.map((item, i) => (
                      <StackIcon key={item.name} item={item} order={i} reducedMotion={reducedMotion} />
                    ))}
                  </motion.ul>
                </AnimatePresence>
                <div className="stack-carousel-nav">
                  <button type="button" aria-label="Previous category" onClick={handlePrev} className="stack-nav-arrow">
                    <StackArrow previous />
                  </button>
                  <span className="stack-nav-counter">
                    {String(currentIdx + 1).padStart(2, '0')} / {String(STACK_CATEGORIES.length).padStart(2, '0')}
                  </span>
                  <button type="button" aria-label="Next category" onClick={handleNext} className="stack-nav-arrow">
                    <StackArrow />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="stack-rows-table"
              key="showall"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
            >
              {STACK_CATEGORIES.map((cat, catIdx) => (
                <div key={cat.id} className="stack-row" data-category={cat.id}>
                  <div className="stack-row-label">
                    <span className="stack-row-num">{String(catIdx + 1).padStart(2, '0')}</span>
                    <span className="stack-row-slash">/</span>
                    <h4 className="stack-row-title">{cat.title}</h4>
                  </div>
                  <ul className="stack-row-items" aria-label={cat.title}>
                    {cat.items.map((item, i) => (
                      <StackIcon key={item.name} item={item} order={i} reducedMotion={reducedMotion} />
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
