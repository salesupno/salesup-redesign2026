'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'

interface BarItem {
  name: string
  pct: number
}

const bars: BarItem[] = [
  { name: 'Google', pct: 88 },
  { name: 'ChatGPT', pct: 71 },
  { name: 'Perplexity', pct: 65 },
  { name: 'Gemini', pct: 58 },
]

const pillars = [
  { tag: 'SEO', sub: 'Søkemotor' },
  { tag: 'AEO', sub: 'AI-svar' },
  { tag: 'GEO', sub: 'Generativ' },
]

export function HeroPanel() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fills = cardRef.current?.querySelectorAll<HTMLElement>('.bar-fill')
    fills?.forEach((el, i) => {
      el.style.setProperty('--bar-width', `${bars[i].pct}%`)
      el.style.animation = `growBar 1s ${0.6 + i * 0.12}s ease both`
    })
  }, [])

  return (
    <div
      ref={cardRef}
      className="relative h-full flex flex-col justify-end p-10 xl:p-14 overflow-hidden bg-green-pale"
    >
      {/* Grid bakgrunn */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,77,46,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,77,46,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Visibility card */}
      <div className="relative z-10 bg-green-deep/6 border border-green-deep/15 rounded-2xl p-7 mb-4 backdrop-blur-sm">
        <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-green-deep/50 mb-4">
          Synlighetsindeks — Klient
        </p>
        <div className="flex flex-col gap-2.5">
          {bars.map((bar) => (
            <div key={bar.name} className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-green-deep/70 w-[70px] shrink-0">
                {bar.name}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-green-deep/12 overflow-hidden">
                <div
                  className="bar-fill h-full rounded-full bg-green-deep"
                  style={{ width: `${bar.pct}%`, transformOrigin: 'left' }}
                />
              </div>
              <span className="text-[12px] font-medium text-green-deep w-8 text-right">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar chips */}
      <div className="relative z-10 grid grid-cols-3 gap-3">
        {pillars.map((p) => (
          <div
            key={p.tag}
            className="bg-green-deep/8 border border-green-deep/12 rounded-2xl px-4 py-5 text-center"
          >
            <span className="block font-display text-[18px] font-extrabold text-green-deep tracking-tight">
              {p.tag}
            </span>
            <span className="block text-[10px] text-green-deep/50 mt-1 uppercase tracking-widest">
              {p.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
