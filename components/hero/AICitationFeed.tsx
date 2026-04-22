'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

type Source = 'ChatGPT' | 'Perplexity' | 'Claude' | 'Gemini' | 'Copilot'

interface Citation {
  id: number
  source: Source
  company: string
  query: string
  minutesAgo: number
  isNew?: boolean
}

export interface SanityCitation {
  _id: string
  source: Source
  company: string
  query: string
  minutesAgo: number
}

interface Props {
  seedCitations?: SanityCitation[]
}

const SOURCES: Record<Source, { color: string; icon: string }> = {
  ChatGPT:    { color: '#10a37f', icon: 'GPT' },
  Perplexity: { color: '#7c3aed', icon: 'PRX' },
  Claude:     { color: '#d97706', icon: 'CLD' },
  Gemini:     { color: '#1a73e8', icon: 'GEM' },
  Copilot:    { color: '#0078d4', icon: 'CPL' },
}

const FALLBACK_SEED: Omit<Citation, 'id'>[] = [
  { source: 'Perplexity',  company: 'SalesUp Norway',    query: '"AEO byrå Norge"',            minutesAgo: 2  },
  { source: 'ChatGPT',     company: 'First Camp Sverige', query: '"SEO camping Skandinavia"',   minutesAgo: 5  },
  { source: 'Claude',      company: 'SalesUp Norway',    query: '"organisk vekst strategi"',   minutesAgo: 9  },
  { source: 'Gemini',      company: 'Dyreparken',         query: '"markedsføring opplevelse"',  minutesAgo: 13 },
  { source: 'Perplexity',  company: 'Smart Varme',        query: '"varmepumpe SEO tips"',       minutesAgo: 17 },
  { source: 'ChatGPT',     company: 'SalesUp Norway',    query: '"beste SEO byrå Oslo"',       minutesAgo: 22 },
  { source: 'Claude',      company: 'First Camp Danmark', query: '"outdoor SEO campingplass"',  minutesAgo: 26 },
  { source: 'Copilot',     company: 'Ditt Uterom',        query: '"hagespesialist synlighet"',  minutesAgo: 31 },
  { source: 'Gemini',      company: 'SalesUp Norway',    query: '"GEO generativ søk"',         minutesAgo: 35 },
  { source: 'Perplexity',  company: 'Smart Varme',        query: '"varmepumpe installatør"',    minutesAgo: 40 },
  { source: 'ChatGPT',     company: 'First Camp Norge',   query: '"familiecamping tips"',       minutesAgo: 44 },
  { source: 'Claude',      company: 'Dyreparken',         query: '"attraksjon markedsføring"',  minutesAgo: 49 },
  { source: 'Copilot',     company: 'Ditt Uterom',        query: '"uterom ideer inspirasjon"',  minutesAgo: 53 },
  { source: 'Gemini',      company: 'SalesUp Norway',    query: '"AEO vs SEO forskjell"',      minutesAgo: 58 },
  { source: 'Perplexity',  company: 'Smart Varme',        query: '"best varmepumpe 2026"',      minutesAgo: 63 },
]

const ACTION_VERBS: Record<Source, string[]> = {
  ChatGPT:    ['nevnte', 'anbefalte', 'fremhevet', 'siterte'],
  Perplexity: ['siterte', 'refererte til', 'nevnte', 'fremhevet'],
  Claude:     ['anbefalte', 'siterte', 'fremhevet', 'nevnte'],
  Gemini:     ['fremhevet', 'siterte', 'anbefalte', 'nevnte'],
  Copilot:    ['anbefalte', 'nevnte', 'siterte', 'fremhevet'],
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

export function AICitationFeed({ seedCitations }: Props) {
  const seed = seedCitations?.length ? seedCitations : FALLBACK_SEED
  const idCounterRef = useRef(seed.length + 1)

  const [citations, setCitations] = useState<Citation[]>(() =>
    seed.map((c, i) => ({ ...c, id: i + 1 }))
  )
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const tickRef = useRef(0)

  // Tick minutes every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++
      setCitations(prev => prev.map(c => ({ ...c, minutesAgo: c.minutesAgo + 1 })))
    }, 15_000)
    return () => clearInterval(interval)
  }, [])

  // Insert new citation every 6–10 seconds (recycling from seed pool)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const schedule = () => {
      const delay = 6000 + Math.random() * 4000
      timeout = setTimeout(() => {
        const counter = idCounterRef.current++
        const template = seed[counter % seed.length]
        const newItem: Citation = {
          ...template,
          id: counter,
          minutesAgo: 0,
          isNew: true,
        }
        setCitations(prev => [newItem, ...prev.slice(0, 14)])
        setHighlightId(newItem.id)
        setTimeout(() => setHighlightId(null), 2500)
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTime = (min: number) => {
    if (min === 0) return 'nå nettopp'
    if (min === 1) return '1 min siden'
    if (min < 60) return `${min} min siden`
    const h = Math.floor(min / 60)
    return `${h} t siden`
  }

  const totalCitations = 2847 + Math.floor(tickRef.current * 0.3)

  return (
    <div className="relative h-full flex flex-col justify-center px-8 xl:px-12 py-16 overflow-hidden select-none">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-deep/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-green-deep/8 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-light" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-green-deep">
            AI-siteringer i sanntid
          </span>
        </div>
        <p className="text-[28px] font-display font-bold text-black tracking-tight leading-tight">
          Dine kunder søker.<br />
          <span className="text-green-deep">AI svarer med deg.</span>
        </p>
        <div className="flex items-baseline gap-1.5 mt-3">
          <span className="font-display text-4xl font-extrabold text-black tabular-nums tracking-tight">
            {totalCitations.toLocaleString('nb-NO')}
          </span>
          <span className="text-sm text-muted">AI-siteringer siste 30 dager</span>
        </div>
      </div>

      {/* Feed */}
      <div
        ref={feedRef}
        className="relative flex-1 overflow-hidden max-h-[420px]"
      >
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-2.5 px-0.5">
          {citations.map((c, idx) => {
            const src = SOURCES[c.source]
            const verb = pick(ACTION_VERBS[c.source], c.id)
            const isHighlighted = highlightId === c.id
            const isVisible = idx < 8

            return (
              <div
                key={c.id}
                className={clsx(
                  'group relative flex items-start gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-500',
                  isHighlighted
                    ? 'bg-green-pale/60 border-green-light/40 shadow-md scale-[1.01]'
                    : 'bg-white/80 border-black/6 hover:border-black/15 hover:bg-white',
                  !isVisible && 'opacity-30',
                  idx === 0 && 'animate-[slideDown_0.4s_ease-out]'
                )}
              >
                {/* Source logo pill */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold tracking-wide shadow-sm mt-0.5"
                  style={{ backgroundColor: src.color }}
                >
                  {src.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-[13px] font-semibold text-black">{c.source}</span>
                    <span className="text-[12px] text-muted">{verb}</span>
                    <span className="text-[13px] font-semibold text-green-deep truncate">{c.company}</span>
                  </div>
                  <p className="text-[12px] text-muted truncate">
                    for søket {c.query}
                  </p>
                </div>

                {/* Time */}
                <div className={clsx(
                  'flex-shrink-0 text-[11px] font-medium mt-0.5 whitespace-nowrap transition-colors',
                  c.minutesAgo === 0 ? 'text-green-mid font-bold' : 'text-muted'
                )}>
                  {c.minutesAgo === 0 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-light mr-1 align-middle" />
                  )}
                  {formatTime(c.minutesAgo)}
                </div>

                {/* New badge */}
                {isHighlighted && (
                  <div className="absolute -top-2 -right-2 bg-accent text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm">
                    LIVE
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer stats bar */}
      <div className="relative mt-5 pt-4 border-t border-black/8 grid grid-cols-3 gap-4">
        {[
          { label: 'AI-motorer', value: '12' },
          { label: 'Kunder sporet', value: String(seed.length > 10 ? seed.length : '5+') },
          { label: 'Siteringsrate', value: '↑ 34%' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="font-display text-xl font-extrabold text-black tracking-tight">{stat.value}</div>
            <div className="text-[10px] text-muted mt-0.5 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


const SOURCES = {
  ChatGPT:    { color: '#10a37f', icon: 'GPT' },
  Perplexity: { color: '#7c3aed', icon: 'PRX' },
  Claude:     { color: '#d97706', icon: 'CLD' },
  Gemini:     { color: '#1a73e8', icon: 'GEM' },
  Copilot:    { color: '#0078d4', icon: 'CPL' },
}

const SEED_CITATIONS: Omit<Citation, 'id'>[] = [
  { source: 'Perplexity',  company: 'SalesUp Norway',         query: '"AEO byrå Norge"',            minutesAgo: 2  },
  { source: 'ChatGPT',     company: 'First Camp Sverige',      query: '"SEO camping Skandinavia"',   minutesAgo: 5  },
  { source: 'Claude',      company: 'SalesUp Norway',         query: '"organisk vekst strategi"',   minutesAgo: 9  },
  { source: 'Gemini',      company: 'Dyreparken',              query: '"markedsføring opplevelse"',  minutesAgo: 13 },
  { source: 'Perplexity',  company: 'Smart Varme',             query: '"varmepumpe SEO tips"',       minutesAgo: 17 },
  { source: 'ChatGPT',     company: 'SalesUp Norway',         query: '"beste SEO byrå Oslo"',       minutesAgo: 22 },
  { source: 'Claude',      company: 'First Camp Danmark',      query: '"outdoor SEO campingplass"',  minutesAgo: 26 },
  { source: 'Copilot',     company: 'Ditt Uterom',             query: '"hagespesialist synlighet"',  minutesAgo: 31 },
  { source: 'Gemini',      company: 'SalesUp Norway',         query: '"GEO generativ søk"',         minutesAgo: 35 },
  { source: 'Perplexity',  company: 'Smart Varme',             query: '"varmepumpe installatør"',    minutesAgo: 40 },
  { source: 'ChatGPT',     company: 'First Camp Norge',        query: '"familiecamping tips"',       minutesAgo: 44 },
  { source: 'Claude',      company: 'Dyreparken',              query: '"attraksjon markedsføring"',  minutesAgo: 49 },
  { source: 'Copilot',     company: 'Ditt Uterom',             query: '"uterom ideer inspirasjon"',  minutesAgo: 53 },
  { source: 'Gemini',      company: 'SalesUp Norway',         query: '"AEO vs SEO forskjell"',      minutesAgo: 58 },
  { source: 'Perplexity',  company: 'Smart Varme',             query: '"best varmepumpe 2026"',      minutesAgo: 63 },
]

const NEW_CITATIONS: Omit<Citation, 'id' | 'minutesAgo'>[] = [
  { source: 'ChatGPT',    company: 'SalesUp Norway',    query: '"AEO agency Scandinavia"' },
  { source: 'Perplexity', company: 'First Camp Sverige', query: '"camping SEO guide"' },
  { source: 'Claude',     company: 'Dyreparken',         query: '"opplevelsespark digital"' },
  { source: 'Gemini',     company: 'SalesUp Norway',    query: '"AI synlighet byrå"' },
  { source: 'Copilot',    company: 'Smart Varme',        query: '"varmepumpe markedsføring"' },
  { source: 'Perplexity', company: 'Ditt Uterom',        query: '"hagedesign synlighet"' },
  { source: 'ChatGPT',    company: 'SalesUp Norway',    query: '"topp SEO byrå Norge"' },
]

const ACTION_VERBS: Record<Citation['source'], string[]> = {
  ChatGPT:    ['nevnte', 'anbefalte', 'fremhevet', 'siterte'],
  Perplexity: ['siterte', 'refererte til', 'nevnte', 'fremhevet'],
  Claude:     ['anbefalte', 'siterte', 'fremhevet', 'nevnte'],
  Gemini:     ['fremhevet', 'siterte', 'anbefalte', 'nevnte'],
  Copilot:    ['anbefalte', 'nevnte', 'siterte', 'fremhevet'],
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

let idCounter = SEED_CITATIONS.length + 1

export function AICitationFeed() {
  const [citations, setCitations] = useState<Citation[]>(() =>
    SEED_CITATIONS.map((c, i) => ({ ...c, id: i + 1 }))
  )
  const [highlightId, setHighlightId] = useState<number | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const tickRef = useRef(0)

  // Tick minutes every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current++
      setCitations(prev => prev.map(c => ({ ...c, minutesAgo: c.minutesAgo + 1 })))
    }, 15_000)
    return () => clearInterval(interval)
  }, [])

  // Insert new citation every 6–10 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const schedule = () => {
      const delay = 6000 + Math.random() * 4000
      timeout = setTimeout(() => {
        const template = NEW_CITATIONS[idCounter % NEW_CITATIONS.length]
        const newItem: Citation = {
          ...template,
          id: ++idCounter,
          minutesAgo: 0,
          isNew: true,
        }
        setCitations(prev => [newItem, ...prev.slice(0, 14)])
        setHighlightId(newItem.id)
        setTimeout(() => setHighlightId(null), 2500)
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timeout)
  }, [])

  const formatTime = (min: number) => {
    if (min === 0) return 'nå nettopp'
    if (min === 1) return '1 min siden'
    if (min < 60) return `${min} min siden`
    const h = Math.floor(min / 60)
    return `${h} t siden`
  }

  const totalCitations = 2847 + Math.floor(tickRef.current * 0.3)

  return (
    <div className="relative h-full flex flex-col justify-center px-8 xl:px-12 py-16 overflow-hidden select-none">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-deep/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-green-deep/8 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-light" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-green-deep">
            AI-siteringer i sanntid
          </span>
        </div>
        <p className="text-[28px] font-display font-bold text-black tracking-tight leading-tight">
          Dine kunder søker.<br />
          <span className="text-green-deep">AI svarer med deg.</span>
        </p>
        <div className="flex items-baseline gap-1.5 mt-3">
          <span className="font-display text-4xl font-extrabold text-black tabular-nums tracking-tight">
            {totalCitations.toLocaleString('nb-NO')}
          </span>
          <span className="text-sm text-muted">AI-siteringer siste 30 dager</span>
        </div>
      </div>

      {/* Feed */}
      <div
        ref={feedRef}
        className="relative flex-1 overflow-hidden max-h-[420px]"
      >
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-2.5 px-0.5">
          {citations.map((c, idx) => {
            const src = SOURCES[c.source]
            const verb = pick(ACTION_VERBS[c.source], c.id)
            const isHighlighted = highlightId === c.id
            const isVisible = idx < 8

            return (
              <div
                key={c.id}
                className={clsx(
                  'group relative flex items-start gap-3 rounded-2xl px-4 py-3.5 border transition-all duration-500',
                  isHighlighted
                    ? 'bg-green-pale/60 border-green-light/40 shadow-md scale-[1.01]'
                    : 'bg-white/80 border-black/6 hover:border-black/15 hover:bg-white',
                  !isVisible && 'opacity-30',
                  idx === 0 && 'animate-[slideDown_0.4s_ease-out]'
                )}
              >
                {/* Source logo pill */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold tracking-wide shadow-sm mt-0.5"
                  style={{ backgroundColor: src.color }}
                >
                  {src.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-[13px] font-semibold text-black">{c.source}</span>
                    <span className="text-[12px] text-muted">{verb}</span>
                    <span className="text-[13px] font-semibold text-green-deep truncate">{c.company}</span>
                  </div>
                  <p className="text-[12px] text-muted truncate">
                    for søket {c.query}
                  </p>
                </div>

                {/* Time */}
                <div className={clsx(
                  'flex-shrink-0 text-[11px] font-medium mt-0.5 whitespace-nowrap transition-colors',
                  c.minutesAgo === 0 ? 'text-green-mid font-bold' : 'text-muted'
                )}>
                  {c.minutesAgo === 0 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-light mr-1 align-middle" />
                  )}
                  {formatTime(c.minutesAgo)}
                </div>

                {/* New badge */}
                {isHighlighted && (
                  <div className="absolute -top-2 -right-2 bg-accent text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-widest uppercase shadow-sm">
                    LIVE
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer stats bar */}
      <div className="relative mt-5 pt-4 border-t border-black/8 grid grid-cols-3 gap-4">
        {[
          { label: 'AI-motorer', value: '12' },
          { label: 'Kunder sporet', value: '5' },
          { label: 'Siteringsrate', value: '↑ 34%' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="font-display text-xl font-extrabold text-black tracking-tight">{stat.value}</div>
            <div className="text-[10px] text-muted mt-0.5 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
