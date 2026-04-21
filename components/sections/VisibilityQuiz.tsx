'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'

interface UrgencyProps {
  urgencyText?: string
}

const STEPS = [
  {
    question: 'Hva er din største utfordring akkurat nå?',
    key: 'challenge',
    options: [
      'Vi får for lite organisk trafikk',
      'Vi er ikke synlige i Google på riktige søk',
      'Konkurrentene rangerer over oss',
      'Vi vet ikke hva vi mangler',
    ],
  },
  {
    question: 'Hvilken type nettside driver dere?',
    key: 'type',
    options: [
      'Tjenestenettside / byrå',
      'Nettbutikk / e-handel',
      'B2B / bedriftsmarked',
      'Lokal bedrift',
    ],
  },
  {
    question: 'Hvor lenge har dere aktivt jobbet med SEO?',
    key: 'experience',
    options: [
      'Vi har ikke startet',
      'Under 6 måneder',
      '6 måneder–2 år',
      'Over 2 år',
    ],
  },
  {
    question: 'Har dere innhold som ranker i Google i dag?',
    key: 'content',
    options: [
      'Nei, lite eller ingenting',
      'Ja, noen sider',
      'Ja, men vi er usikre på kvaliteten',
      'Ja, og vi følger det aktivt',
    ],
  },
  {
    question: 'Hva er målet for de neste 12 månedene?',
    key: 'goal',
    options: [
      'Komme inn i Google på relevante søk',
      'Rangere topp 3 på kjøpsorienterte søk',
      'Bli synlig i AI-assistenter (AEO/GEO)',
      'Alt av det over',
    ],
  },
]

const variants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
}

export function VisibilityQuiz({ urgencyText }: UrgencyProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const total = STEPS.length

  function handleSelect(optionValue: string) {
    const current = STEPS[step]
    const updated = { ...answers, [current.key]: optionValue }
    setAnswers(updated)

    if (step < total - 1) {
      setStep((s) => s + 1)
    } else {
      setDone(true)
    }
  }

  function handleCTA() {
    const params = new URLSearchParams({ quiz: 'completed', ...answers })
    router.push(`/kontakt?${params.toString()}`)
  }

  return (
    <section className="px-6 md:px-12 xl:px-20 py-20">
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
            2-minutters sjekk
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-[-0.012em] leading-[1.1] mb-4">
            Sjekk hvor synlig bedriften din er i dag
          </h2>
          <p className="text-[17px] font-light text-muted leading-[1.7]">
            Svar på 5 spørsmål. Du får en konkret vurdering av synlighetssituasjonen din — før vi ber om noe som helst.
          </p>
        </div>

        <div className="bg-cream rounded-3xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {/* Progress */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1 h-1 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-deep rounded-full transition-all duration-500"
                      style={{ width: `${((step) / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-muted flex-shrink-0">
                    {step + 1} av {total}
                  </span>
                </div>

                <h3 className="font-display text-[clamp(18px,2vw,24px)] font-bold tracking-tight mb-6 leading-snug">
                  {STEPS[step].question}
                </h3>

                <div className="flex flex-col gap-3">
                  {STEPS[step].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className="text-left bg-white hover:bg-green-pale border border-black/8 hover:border-green-deep/20 rounded-2xl px-6 py-4 text-[15px] font-medium transition-all duration-200 group"
                    >
                      <span className="flex items-center justify-between gap-4">
                        {option}
                        <span className="w-5 h-5 rounded-full border border-black/12 group-hover:border-green-deep group-hover:bg-green-deep flex-shrink-0 flex items-center justify-center transition-all">
                          <svg
                            width="10" height="10" viewBox="0 0 24 24" fill="none"
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-green-deep flex items-center justify-center mx-auto mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-[clamp(20px,2.5vw,30px)] font-extrabold tracking-tight mb-4 leading-snug">
                  Vi har sett nok.
                </h3>
                <p className="text-[16px] font-light text-muted leading-[1.7] mb-8 max-w-[440px] mx-auto">
                  Book en gratis analyse — vi går gjennom situasjonen din konkret.
                </p>
                {urgencyText && (
                  <div className="flex justify-center mb-5">
                    <UrgencyBadge text={urgencyText} variant="light" />
                  </div>
                )}
                <button
                  onClick={handleCTA}
                  className="bg-green-deep text-accent font-medium px-8 py-4 rounded-full hover:bg-green-mid transition-colors text-[15px]"
                >
                  Book gratis synlighetsanalyse →
                </button>
                <p className="text-[12px] text-muted mt-4">Uforpliktende. Svar innen 1 arbeidsdag.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dot-navigation */}
        {!done && (
          <div className="flex justify-center gap-2 mt-6">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === step ? 'w-6 bg-green-deep' : i < step ? 'w-1.5 bg-green-deep/40' : 'w-1.5 bg-black/12'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
