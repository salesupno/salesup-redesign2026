'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

const GENERATOR_URL = 'https://salesupno-antigravity-design-builde.vercel.app'

type Step = 1 | 2 | 3

interface FormData {
  industry: string
  industryLabel: string
  businessName: string
  email: string
  website: string
  notes: string
  competitor1: string
  competitor2: string
}

const INDUSTRIES = [
  { id: 'tannklinikk',      label: 'Tannklinikk',       abbr: 'TK' },
  { id: 'advokatbyraa',     label: 'Advokatbyrå',        abbr: 'JUS' },
  { id: 'takentreprenor',   label: 'Takentreprenør',     abbr: 'TAK' },
  { id: 'eiendomsmegler',   label: 'Eiendomsmegler',     abbr: 'EIE' },
  { id: 'regnskapsforer',   label: 'Regnskapsfører',     abbr: 'REG' },
  { id: 'bilverksted',      label: 'Bilverksted',        abbr: 'BIL' },
  { id: 'frisor',           label: 'Frisør & Salong',    abbr: 'SAL' },
  { id: 'restaurant',       label: 'Restaurant & Kafé',  abbr: 'MAT' },
  { id: 'treningssenter',   label: 'Treningssenter',     abbr: 'GYM' },
  { id: 'rorlegger',        label: 'Rørlegger',          abbr: 'RØR' },
  { id: 'elektriker',       label: 'Elektriker',         abbr: 'ELK' },
  { id: 'klinikk',          label: 'Klinikk & Lege',     abbr: 'MED' },
  { id: 'annet',            label: 'Annet',              abbr: '···' },
]

const STEP_LABELS = ['Bransje', 'Om bedriften', 'Konkurrenter']

export function NettsideWizard() {
  const [step, setStep] = useState<Step>(1)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState<FormData>({
    industry: '',
    industryLabel: '',
    businessName: '',
    email: '',
    website: '',
    notes: '',
    competitor1: '',
    competitor2: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  async function generate() {
    setGenerating(true)
    // Lagre lead — ikke blokkér redirect om det feiler
    try {
      await fetch('/api/nettsideutkast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: form.industryLabel,
          businessName: form.businessName,
          email: form.email,
          website: form.website,
          notes: form.notes,
          competitor1: form.competitor1,
          competitor2: form.competitor2,
        }),
      })
    } catch {
      // Redirect uansett
    }
    window.location.href = GENERATOR_URL
  }

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function validateStep2(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.businessName.trim()) e.businessName = 'Bedriftsnavn er påkrevd'
    if (!form.email.trim()) e.email = 'E-post er påkrevd'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ugyldig e-postadresse'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-12 pb-24">

      {/* ─── Topptekst ─────────────────────────────────────────── */}
      <div className="text-center mb-10 max-w-xl">
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-green-deep mb-3">
          Gratis verktøy fra SalesUp
        </p>
        <h1 className="font-display text-[clamp(28px,4vw,44px)] tracking-[-0.015em] leading-[1.1] mb-4">
          Se nettsiden konkurrentene dine<br className="hidden sm:block" />{' '}
          <span className="text-green-deep">ønsker de hadde</span>
        </h1>
        <p className="text-[15px] text-muted leading-relaxed max-w-md mx-auto">
          Vi analyserer topp&nbsp;10 i din bransje og sender deg et skreddersydd nettsidekonsept
          — med seksjonsstruktur, CTA-strategi og designretning.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-[12px] text-muted font-medium">
          <span className="flex items-center gap-1"><span className="text-green-light">●</span> Ingen kredittkort</span>
          <span className="flex items-center gap-1"><span className="text-green-light">●</span> Svar innen 24 timer</span>
          <span className="flex items-center gap-1"><span className="text-green-light">●</span> Brukt av 200+ bedrifter</span>
        </div>
      </div>

      {/* ─── Progress-indikator ───────────────────────────────── */}
      {
        <div className="flex items-center gap-0 mb-10 w-full max-w-lg">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all',
                    done  ? 'bg-green-deep border-green-deep text-white' :
                    active ? 'bg-white border-green-deep text-green-deep' :
                             'bg-white border-black/15 text-muted'
                  )}>
                    {done ? '✓' : num}
                  </div>
                  <span className={clsx(
                    'text-[10px] font-medium whitespace-nowrap',
                    active ? 'text-black' : 'text-muted'
                  )}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={clsx(
                    'flex-1 h-[2px] mx-1 mb-5 rounded-full transition-colors',
                    done ? 'bg-green-deep' : 'bg-black/10'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ─── Step 1: Bransje ─────────────────────────────────── */}
      {step === 1 && (
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <h2 className="font-display text-[24px] tracking-tight mb-1">Hvilken bransje er du i?</h2>
            <p className="text-[14px] text-muted">Vi bruker rangeringsdata fra topp&nbsp;10 i din kategori for å lage et relevant utkast.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.id}
                onClick={() => set('industry', ind.id) || set('industryLabel', ind.label)}
                className={clsx(
                  'group flex flex-col items-center gap-3 py-5 px-3 rounded-2xl border-2 text-center transition-all',
                  form.industry === ind.id
                    ? 'border-green-deep bg-green-pale/40 shadow-sm'
                    : 'border-black/8 bg-white hover:border-black/20 hover:bg-cream/50'
                )}
              >
                <div className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-wide transition-colors',
                  form.industry === ind.id
                    ? 'bg-green-deep text-accent'
                    : 'bg-black/5 text-muted group-hover:bg-black/8'
                )}>
                  {ind.abbr}
                </div>
                <span className={clsx(
                  'text-[13px] font-medium leading-tight',
                  form.industry === ind.id ? 'text-green-deep' : 'text-black/80'
                )}>{ind.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => form.industry && setStep(2)}
            disabled={!form.industry}
            className="w-full bg-black text-white rounded-xl py-4 font-medium text-[15px] hover:bg-green-deep transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Fortsett →
          </button>
        </div>
      )}

      {/* ─── Step 2: Om bedriften ───────────────────────────── */}
      {step === 2 && (
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="font-display text-[24px] tracking-tight mb-1">Hvem lager vi utkastet til?</h2>
            <p className="text-[14px] text-muted">Utkastet sendes direkte til innboksen din — ferdig til å diskutere med en designer eller webutvikler.</p>
          </div>

          <div className="flex flex-col gap-5 mb-8">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Bedriftsnavn <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.businessName}
                onChange={e => set('businessName', e.target.value)}
                placeholder="f.eks. Nordvik Tannklinikk AS"
                className={clsx(
                  'w-full border rounded-xl px-4 py-3 text-[14px] outline-none transition-colors',
                  errors.businessName ? 'border-red-400 bg-red-50' : 'border-black/15 focus:border-green-deep bg-white'
                )}
              />
              {errors.businessName && <p className="text-[12px] text-red-500 mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold mb-1.5">E-post <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="din@bedrift.no"
                className={clsx(
                  'w-full border rounded-xl px-4 py-3 text-[14px] outline-none transition-colors',
                  errors.email ? 'border-red-400 bg-red-50' : 'border-black/15 focus:border-green-deep bg-white'
                )}
              />
              {errors.email
                ? <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
                : <p className="text-[11px] text-muted mt-1">Vi sender kun utkastet — aldri spam</p>
              }
            </div>

            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Eksisterende nettside <span className="text-muted font-normal">(valgfritt)</span>
              </label>
              <input
                type="text"
                value={form.website}
                onChange={e => set('website', e.target.value)}
                placeholder="www.dinbedrift.no"
                className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-green-deep transition-colors bg-white"
              />
              <p className="text-[11px] text-muted mt-1">Har du et eksisterende nettsted vi bør ta hensyn til?</p>
            </div>

            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Noe vi bør vite? <span className="text-muted font-normal">(valgfritt)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder={'f.eks. «Vi vil fremstå mer premium enn konkurrentene»'}
                rows={3}
                className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-green-deep transition-colors resize-none bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3.5 border border-black/15 rounded-xl text-[14px] font-medium hover:bg-cream transition-colors"
            >
              ← Tilbake
            </button>
            <button
              onClick={() => validateStep2() && setStep(3)}
              className="flex-1 bg-black text-white rounded-xl py-3.5 font-medium text-[15px] hover:bg-green-deep transition-colors"
            >
              Fortsett →
            </button>
          </div>
        </div>
      )}

      {/* ─── Step 3: Konkurrenter ────────────────────────────── */}
      {step === 3 && (
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="font-display text-[24px] tracking-tight mb-1">Hvem konkurrerer du med?</h2>
            <p className="text-[14px] text-muted">
              Vet vi hvem du kjemper mot, bygger vi et utkast som <strong>skiller seg ut</strong> — ikke bare kopierer bransjemalen.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {[
              { field: 'competitor1' as keyof FormData, label: 'Konkurrent 1' },
              { field: 'competitor2' as keyof FormData, label: 'Konkurrent 2' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-[13px] font-semibold mb-1.5 text-muted">{label}</label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  placeholder="www.konkurrent.no"
                  className="w-full border border-black/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-green-deep transition-colors bg-white"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              disabled={generating}
              className="px-5 py-3.5 border border-black/15 rounded-xl text-[14px] font-medium hover:bg-cream transition-colors disabled:opacity-40"
            >
              ← Tilbake
            </button>
            <button
              onClick={generate}
              disabled={generating}
              className="flex-1 bg-black text-white rounded-xl py-3.5 font-medium text-[15px] hover:bg-green-deep transition-colors disabled:opacity-60"
            >
              {generating ? 'Starter generator...' : '✦ Generer nettside på under 60 sekunder'}
            </button>
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="w-full text-center text-[13px] text-muted mt-4 hover:text-black transition-colors disabled:opacity-40"
          >
            Hopp over konkurrenter og generer →
          </button>
        </div>
      )}
    </div>
  )
}
