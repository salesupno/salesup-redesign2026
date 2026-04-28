'use client'

import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

/* ─── Types ───────────────────────────────────────────────────────── */

interface WizardAnswers {
  source?: string        // from URL param — where they came from
  service?: string       // from URL param — which service page
  bedrift?: string
  bransje?: string
  stilling?: string
  maal?: string
  naa?: string
  tid?: string
  navn?: string
  epost?: string
  telefon?: string
  slot?: string
}

interface Step {
  id: string
  question: string
  subtext?: string
  type: 'choice' | 'input' | 'timeslot'
  field: keyof WizardAnswers
  options?: { label: string; emoji?: string; value: string }[]
  inputFields?: { field: keyof WizardAnswers; placeholder: string; type?: string; required?: boolean }[]
}

/* ─── Time slots (always next Tuesday and Wednesday) ──────────────── */

function getSlots(): { label: string; day: string; time: string; value: string }[] {
  const now = new Date()
  // Find next Tuesday
  const daysUntilTue = (2 - now.getDay() + 7) % 7 || 7
  const tue = new Date(now)
  tue.setDate(now.getDate() + daysUntilTue)

  const wed = new Date(tue)
  wed.setDate(tue.getDate() + 1)

  const fmt = (d: Date) =>
    d.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })

  return [
    {
      value: `tirsdag-${tue.toISOString().slice(0, 10)}-1300`,
      day: `Tirsdag ${tue.getDate()}. ${tue.toLocaleDateString('nb-NO', { month: 'long' })}`,
      time: '13:00',
      label: `Tirsdag kl. 13:00`,
    },
    {
      value: `onsdag-${wed.toISOString().slice(0, 10)}-1100`,
      day: `Onsdag ${wed.getDate()}. ${wed.toLocaleDateString('nb-NO', { month: 'long' })}`,
      time: '11:00',
      label: `Onsdag kl. 11:00`,
    },
    {
      value: `onsdag-${wed.toISOString().slice(0, 10)}-1400`,
      day: `Onsdag ${wed.getDate()}. ${wed.toLocaleDateString('nb-NO', { month: 'long' })}`,
      time: '14:00',
      label: `Onsdag kl. 14:00`,
    },
  ]
}

/* ─── Source labels (from URL) ────────────────────────────────────── */

const sourceLabels: Record<string, string> = {
  seo: 'SEO-siden',
  aeo: 'AEO-siden',
  geo: 'GEO-siden',
  content: 'innholdsmarkedsføring-siden',
  cro: 'CRO-siden',
  resultater: 'resultat-casen',
  blogg: 'bloggen',
  faq: 'FAQ-siden',
  forside: 'forsiden',
  quiz: 'synlighetsquizen',
  kalkulator: 'ROI-kalkulatoren',
}

/* ─── Main component ──────────────────────────────────────────────── */

export function BookAnalyseWizard() {
  const [answers, setAnswers] = useState<WizardAnswers>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const updates: WizardAnswers = {}
    const src = params.get('fra') || params.get('source') || params.get('utm_source')
    const svc = params.get('tjeneste') || params.get('service')
    if (src) updates.source = src
    if (svc) updates.service = svc
    if (Object.keys(updates).length) setAnswers(prev => ({ ...prev, ...updates }))
  }, [])

  const slots = getSlots()

  const steps: Step[] = [
    {
      id: 'bransje',
      question: 'Hvilken bransje er du i?',
      subtext: 'Vi tilpasser analysen til hva som faktisk fungerer i din bransje.',
      type: 'choice',
      field: 'bransje',
      options: [
        { value: 'ehandel', label: 'E-handel / nettbutikk', emoji: '🛍️' },
        { value: 'lokal', label: 'Lokal bedrift / håndverk', emoji: '🏠' },
        { value: 'b2b', label: 'B2B / fagbransje', emoji: '🤝' },
        { value: 'helse', label: 'Helse & velvære', emoji: '🩺' },
        { value: 'tech', label: 'Tech / SaaS', emoji: '💻' },
        { value: 'annet', label: 'Annet', emoji: '✨' },
      ],
    },
    {
      id: 'stilling',
      question: 'Hva er din rolle?',
      subtext: 'Så vi snakker med riktig person om riktige ting fra første sekund.',
      type: 'choice',
      field: 'stilling',
      options: [
        { value: 'eier', label: 'Eier / daglig leder', emoji: '👑' },
        { value: 'markeds', label: 'Markedsansvarlig', emoji: '📣' },
        { value: 'salg', label: 'Salg / vekst', emoji: '📈' },
        { value: 'styret', label: 'Styremedlem / investor', emoji: '💼' },
        { value: 'annet', label: 'Annen rolle', emoji: '🙋' },
      ],
    },
    {
      id: 'maal',
      question: 'Hva er viktigst for deg akkurat nå?',
      subtext: 'Vi starter der du trenger det mest.',
      type: 'choice',
      field: 'maal',
      options: [
        { value: 'trafikk', label: 'Mer organisk trafikk', emoji: '🚀' },
        { value: 'ai', label: 'Bli synlig i AI-svar', emoji: '🤖' },
        { value: 'leads', label: 'Flere kvalifiserte leads', emoji: '🎯' },
        { value: 'konkurrent', label: 'Slå konkurrentene', emoji: '🏆' },
        { value: 'omdoemme', label: 'Styrke omdømmet digitalt', emoji: '⭐' },
      ],
    },
    {
      id: 'naa',
      question: 'Hva bruker dere på digital markedsføring i dag?',
      subtext: 'Ingen feil svar — vi bare lager riktig sammenligningsgrunnlag.',
      type: 'choice',
      field: 'naa',
      options: [
        { value: 'ingenting', label: 'Lite eller ingenting', emoji: '😬' },
        { value: 'under50', label: 'Under 50 000 kr/mnd', emoji: '💰' },
        { value: '50-150', label: '50 000–150 000 kr/mnd', emoji: '💰💰' },
        { value: 'over150', label: 'Over 150 000 kr/mnd', emoji: '💰💰💰' },
      ],
    },
    {
      id: 'kontakt',
      question: 'Hvem skal vi sende analysen til?',
      subtext: 'Du får analysen på e-post samme dag som praten.',
      type: 'input',
      field: 'navn',
      inputFields: [
        { field: 'navn', placeholder: 'Navn', required: true },
        { field: 'bedrift', placeholder: 'Bedriftsnavn', required: true },
        { field: 'epost', placeholder: 'E-post', type: 'email', required: true },
        { field: 'telefon', placeholder: 'Telefon (valgfritt)', type: 'tel' },
      ],
    },
    {
      id: 'tid',
      question: 'Velg tidspunkt for en 20-minutters prat',
      subtext: 'Disse tre slottene er fortsatt ledige denne uken.',
      type: 'timeslot',
      field: 'slot',
    },
  ]

  const totalSteps = steps.length
  const step = steps[currentStep]
  const progress = ((currentStep) / totalSteps) * 100

  function answer(field: keyof WizardAnswers, value: string) {
    setAnswers(prev => ({ ...prev, [field]: value }))
    if (step.type === 'choice') goNext({ ...answers, [field]: value })
  }

  function goNext(withAnswers?: WizardAnswers) {
    if (animating) return
    const a = withAnswers ?? answers
    // Validate input step
    if (step.type === 'input') {
      for (const f of step.inputFields ?? []) {
        if (f.required && !a[f.field as keyof WizardAnswers]) {
          setError(`Fyll inn ${f.placeholder.toLowerCase()}.`)
          return
        }
      }
      if (a.epost && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.epost)) {
        setError('Ugyldig e-postadresse.')
        return
      }
    }
    setError('')
    setDirection('forward')
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(s => Math.min(s + 1, totalSteps - 1))
      setAnimating(false)
    }, 220)
  }

  function goBack() {
    if (animating || currentStep === 0) return
    setDirection('back')
    setAnimating(true)
    setTimeout(() => {
      setCurrentStep(s => Math.max(s - 1, 0))
      setAnimating(false)
    }, 220)
  }

  async function submit() {
    if (!answers.slot) { setError('Velg et tidspunkt.'); return }
    setSubmitting(true)
    setError('')

    const slotObj = slots.find(s => s.value === answers.slot)
    const contextNote = [
      answers.source ? `Kom fra: ${sourceLabels[answers.source] ?? answers.source}` : null,
      answers.service ? `Tjeneste-interesse: ${answers.service}` : null,
    ].filter(Boolean).join(' | ')

    const body = {
      name: answers.navn ?? '',
      company: answers.bedrift ?? '',
      email: answers.epost ?? '',
      message: [
        `📅 Tidspunkt: ${slotObj ? `${slotObj.day} kl. ${slotObj.time}` : answers.slot}`,
        `🏷️ Bransje: ${answers.bransje ?? '—'}`,
        `👤 Rolle: ${answers.stilling ?? '—'}`,
        `🎯 Mål: ${answers.maal ?? '—'}`,
        `💰 Budsjett nå: ${answers.naa ?? '—'}`,
        answers.telefon ? `📱 Tlf: ${answers.telefon}` : null,
        contextNote ? `\n🔗 Kontekst: ${contextNote}` : null,
      ].filter(Boolean).join('\n'),
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Noe gikk galt. Prøv igjen eller ring oss på +47 913 49 916.')
    } finally {
      setSubmitting(false)
    }
  }

  // Focus first input on input steps
  useEffect(() => {
    if (step?.type === 'input' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [currentStep, step?.type])

  // ─── Submitted state ───────────────────────────────────────────────

  if (submitted) {
    const slotObj = slots.find(s => s.value === answers.slot)
    return (
      <div className="min-h-[520px] flex flex-col items-center justify-center text-center px-4 py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-8 shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="var(--color-green-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight leading-[1.1] mb-4 text-green-deep">
          Vi sees {slotObj?.day.toLowerCase()}!
        </h2>
        <p className="text-[17px] font-light text-muted leading-[1.7] max-w-[480px] mb-2">
          Kl. <strong className="font-semibold text-green-deep">{slotObj?.time}</strong> — Tommy ringer deg opp.
        </p>
        <p className="text-[15px] text-muted/70 max-w-[400px] mb-10">
          Du får en bekreftelse på e-post innen få minutter, med lenke til å endre tid om noe dukker opp.
        </p>
        <div className="bg-cream rounded-2xl px-8 py-6 text-left max-w-[420px] w-full">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-green-light mb-3">Forberedelse</p>
          <ul className="flex flex-col gap-2.5 text-[14px] text-muted">
            {[
              'Tenk på 1–2 konkurrenter du ønsker å slå',
              'Hvilke søkeord er viktigst for deg?',
              'Hva er den typiske verdien av en ny kunde?',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-green-deep/15 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-deep block" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ─── Context banner (if came from elsewhere) ───────────────────────

  const sourceBanner = answers.source && sourceLabels[answers.source]

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-10" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Steg ${currentStep + 1} av ${totalSteps}`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] font-medium text-muted/60">
            Steg {currentStep + 1} av {totalSteps}
          </span>
          <span className="text-[12px] font-semibold text-green-deep">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}% ferdig
          </span>
        </div>
        <div className="h-1.5 bg-black/6 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-light rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Context banner */}
      {sourceBanner && currentStep === 0 && (
        <div className="mb-8 px-4 py-3 bg-accent/30 border border-accent rounded-xl flex items-center gap-3 text-[13px] text-green-deep">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Vi så at du kom fra <strong>{sourceLabels[answers.source!]}</strong> — vi tar utgangspunkt i det.</span>
        </div>
      )}

      {/* Step content */}
      <div
        className={clsx(
          'transition-all duration-200',
          animating && direction === 'forward' && 'opacity-0 translate-x-4',
          animating && direction === 'back' && 'opacity-0 -translate-x-4',
          !animating && 'opacity-100 translate-x-0',
        )}
        style={{ transform: animating ? undefined : 'translateX(0)' }}
      >
        <h2 className="font-display text-[clamp(22px,3vw,34px)] font-bold tracking-tight leading-[1.15] mb-2 text-green-deep">
          {step.question}
        </h2>
        {step.subtext && (
          <p className="text-[15px] font-light text-muted mb-8 leading-[1.6]">{step.subtext}</p>
        )}

        {/* CHOICE */}
        {step.type === 'choice' && (
          <div className="grid sm:grid-cols-2 gap-3">
            {step.options?.map(opt => (
              <button
                key={opt.value}
                onClick={() => answer(step.field, opt.value)}
                className={clsx(
                  'group flex items-center gap-3.5 text-left rounded-2xl border px-5 py-4 text-[15px] font-medium transition-all duration-150',
                  answers[step.field] === opt.value
                    ? 'bg-green-deep text-white border-green-deep shadow-lg scale-[1.01]'
                    : 'bg-white border-black/10 text-green-deep hover:border-green-deep/40 hover:bg-green-pale/40 hover:scale-[1.005]',
                )}
                aria-pressed={answers[step.field] === opt.value}
              >
                {opt.emoji && (
                  <span className="text-[20px] leading-none flex-shrink-0" aria-hidden="true">{opt.emoji}</span>
                )}
                <span>{opt.label}</span>
                <svg
                  className={clsx(
                    'ml-auto w-4 h-4 flex-shrink-0 transition-opacity',
                    answers[step.field] === opt.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-30',
                  )}
                  viewBox="0 0 24 24" fill="none" aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* INPUT */}
        {step.type === 'input' && (
          <div className="flex flex-col gap-4 max-w-[480px]">
            {step.inputFields?.map((f, i) => (
              <div key={String(f.field)}>
                <input
                  ref={i === 0 ? inputRef : undefined}
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  value={(answers[f.field as keyof WizardAnswers] as string) ?? ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [f.field]: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && i === (step.inputFields?.length ?? 1) - 1) goNext()
                  }}
                  autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'off'}
                  className={clsx(
                    'w-full rounded-xl border bg-white px-5 py-4 text-[15px] placeholder:text-black/30 transition-all duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-green-light/50 focus:border-green-light',
                    'border-black/12 hover:border-black/20',
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* TIMESLOT */}
        {step.type === 'timeslot' && (
          <div className="flex flex-col gap-4">
            {/* Scarcity signal */}
            <p className="text-[13px] text-muted/70 flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" aria-hidden="true" />
              12 av 15 mulige tidspunkter denne uken er opptatt.
            </p>

            {slots.map(slot => (
              <button
                key={slot.value}
                onClick={() => setAnswers(prev => ({ ...prev, slot: slot.value }))}
                className={clsx(
                  'group flex items-center justify-between rounded-2xl border px-6 py-5 text-left transition-all duration-150',
                  answers.slot === slot.value
                    ? 'bg-green-deep text-white border-green-deep shadow-lg'
                    : 'bg-white border-black/10 text-green-deep hover:border-green-deep/40 hover:bg-green-pale/30',
                )}
                aria-pressed={answers.slot === slot.value}
              >
                <div>
                  <p className={clsx(
                    'text-[13px] font-medium mb-0.5',
                    answers.slot === slot.value ? 'text-white/60' : 'text-muted',
                  )}>
                    {slot.day}
                  </p>
                  <p className="font-display text-[22px] font-bold tracking-tight">
                    Kl. {slot.time}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={clsx(
                    'text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full',
                    answers.slot === slot.value
                      ? 'bg-white/20 text-white'
                      : 'bg-green-pale text-green-deep',
                  )}>
                    Ledig
                  </span>
                  <span className={clsx(
                    'text-[11px]',
                    answers.slot === slot.value ? 'text-white/50' : 'text-muted/50',
                  )}>
                    20 min
                  </span>
                </div>
              </button>
            ))}

            {/* Social proof */}
            <div className="mt-2 pt-4 border-t border-black/6 flex items-center gap-3 text-[13px] text-muted/70">
              <div className="flex -space-x-1.5" aria-hidden="true">
                {['T', 'S', 'M'].map(l => (
                  <div key={l} className="w-6 h-6 rounded-full bg-green-deep text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {l}
                  </div>
                ))}
              </div>
              <span>3 andre booket analyse denne uken</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p role="alert" className="mt-4 text-[13px] text-red-500 font-medium flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        {currentStep > 0 ? (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-[13px] text-muted/60 hover:text-green-deep transition-colors"
            aria-label="Gå tilbake"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tilbake
          </button>
        ) : (
          <span />
        )}

        {(step.type === 'input') && (
          <button
            onClick={() => goNext()}
            className="bg-green-deep hover:bg-green-mid text-white rounded-full px-8 py-3.5 text-[15px] font-medium transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Neste steg
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {step.type === 'timeslot' && (
          <button
            onClick={submit}
            disabled={!answers.slot || submitting}
            className={clsx(
              'rounded-full px-8 py-3.5 text-[15px] font-semibold transition-all flex items-center gap-2',
              answers.slot && !submitting
                ? 'bg-green-light hover:bg-green-deep text-white hover:-translate-y-0.5 shadow-lg'
                : 'bg-black/10 text-black/30 cursor-not-allowed',
            )}
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Bekrefter…
              </>
            ) : (
              <>
                Bekreft tidspunkt
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
