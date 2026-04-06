'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStackCarousel } from '@/hooks/useStackCarousel'
import { STACK_CATEGORIES } from '@/lib/stackData'

const iconVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.04, ease: 'easeOut' },
  }),
}

export default function CoreStack() {
  const { currentIdx, viewMode, next, prev, setMode } = useStackCarousel()
  const directionRef = useRef<1 | -1>(1)

  const isShowAll = viewMode === 'showall'

  const handleNext = () => { directionRef.current = 1; next() }
  const handlePrev = () => { directionRef.current = -1; prev() }

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto mb-10">
      <div className="bg-surface-container rounded-2xl overflow-hidden relative">

        {/* Header & Toggle */}
        <div className="px-12 pt-12 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">CORE STACK</h2>
            <p className="text-on-surface-variant text-sm tracking-widest uppercase">The tools of my trade</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant/30">
              <button
                className={
                  viewMode === 'carousel'
                    ? 'bg-surface-variant px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm transition-all'
                    : 'px-4 py-1.5 rounded-full text-xs text-neutral-500 font-bold hover:text-white transition-all'
                }
                onClick={() => setMode('carousel')}
              >
                Carousel
              </button>
              <button
                className={
                  viewMode === 'showall'
                    ? 'bg-surface-variant px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm transition-all'
                    : 'px-4 py-1.5 rounded-full text-xs text-neutral-500 font-bold hover:text-white transition-all'
                }
                onClick={() => setMode('showall')}
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        {/* Animated content area */}
        <AnimatePresence mode="wait" initial={false}>

          {!isShowAll ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Carousel nav */}
              <div className="border-t border-outline-variant/20 px-12 py-6 flex flex-row items-center justify-between bg-surface-container-low">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-white">chevron_left</span>
                </button>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h3
                    key={currentIdx}
                    initial={{ opacity: 0, y: directionRef.current * 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: directionRef.current * -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="text-xl font-bold text-accent-green uppercase tracking-widest text-center flex-1"
                  >
                    {STACK_CATEGORIES[currentIdx].title}
                  </motion.h3>
                </AnimatePresence>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-white">chevron_right</span>
                </button>
              </div>

              {/* Carousel panel */}
              <div className="relative w-full h-[280px] overflow-hidden bg-surface-container">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: directionRef.current * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: directionRef.current * -40 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute top-0 left-0 w-full h-full px-12 py-10 flex flex-wrap gap-6 items-start"
                  >
                    {STACK_CATEGORIES[currentIdx].items.map((item, i) => (
                      <motion.div
                        key={item.name}
                        custom={i}
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center gap-3 group cursor-default"
                      >
                        <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.iconUrl} className={`w-10 h-10${item.filter ? ` ${item.filter}` : ''}`} alt={item.name} />
                        </div>
                        <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                          {item.name}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

          ) : (

            <motion.div
              key="showall"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-surface-container"
            >
              {STACK_CATEGORIES.map((cat, catIdx) => (
                <div key={cat.id} className="relative w-full px-12 py-10 flex flex-wrap gap-6 items-start border-t border-outline-variant/10 first:border-t-0">
                  <h4 className="w-full text-sm font-bold text-accent-green uppercase tracking-widest mb-2">
                    {cat.title}
                  </h4>
                  {cat.items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      custom={catIdx * 4 + i}
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col items-center gap-3 group cursor-default"
                    >
                      <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.iconUrl} className={`w-10 h-10${item.filter ? ` ${item.filter}` : ''}`} alt={item.name} />
                      </div>
                      <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
