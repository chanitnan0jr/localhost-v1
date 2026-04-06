'use client'

import { useEffect, useRef } from 'react'
import { useStackCarousel } from '@/hooks/useStackCarousel'
import { STACK_CATEGORIES } from '@/lib/stackData'

export default function CoreStack() {
  const { currentIdx, viewMode, next, prev, setMode } = useStackCarousel()
  const prevIdxRef = useRef(currentIdx)
  const prevModeRef = useRef(viewMode)

  // Track direction for animation
  const directionRef = useRef<'next' | 'prev'>('next')
  useEffect(() => {
    directionRef.current = 'next'
  }, [])

  const isShowAll = viewMode === 'showall'

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

        {/* Collapsible Content */}
        <div className="transition-all duration-500 ease-in-out origin-top overflow-hidden">

          {/* Carousel header */}
          {!isShowAll && (
            <div className="border-t border-outline-variant/20 px-12 py-6 flex flex-row items-center justify-between bg-surface-container-low transition-all duration-300">
              <button
                onClick={prev}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-white">chevron_left</span>
              </button>
              <h3 className="text-xl font-bold text-accent-green uppercase tracking-widest text-center flex-1">
                {STACK_CATEGORIES[currentIdx].title}
              </h3>
              <button
                onClick={next}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-white">chevron_right</span>
              </button>
            </div>
          )}

          {/* Carousel viewport */}
          {!isShowAll ? (
            <div className="relative w-full h-[280px] overflow-hidden bg-surface-container transition-all duration-300">
              {STACK_CATEGORIES.map((cat, idx) => {
                const isActive = idx === currentIdx
                return (
                  <div
                    key={cat.id}
                    className={[
                      'absolute top-0 left-0 w-full h-full px-12 py-10 flex flex-wrap gap-6 items-start transition-transform duration-500',
                      isActive ? 'translate-x-0' : 'translate-x-full',
                    ].join(' ')}
                    style={{ display: isActive ? 'flex' : 'none' }}
                  >
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex flex-col items-center gap-3 group cursor-default">
                        <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.iconUrl}
                            className={`w-10 h-10${item.filter ? ` ${item.filter}` : ''}`}
                            alt={item.name}
                          />
                        </div>
                        <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-surface-container">
              {STACK_CATEGORIES.map((cat) => (
                <div key={cat.id} className="relative w-full px-12 py-10 flex flex-wrap gap-6 items-start">
                  <h4 className="w-full text-sm font-bold text-accent-green uppercase tracking-widest mb-2">
                    {cat.title}
                  </h4>
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-3 group cursor-default">
                      <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.iconUrl}
                          className={`w-10 h-10${item.filter ? ` ${item.filter}` : ''}`}
                          alt={item.name}
                        />
                      </div>
                      <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
