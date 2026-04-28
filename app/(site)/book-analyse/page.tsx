import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { BookAnalyseWizard } from '@/components/contact/BookAnalyseWizard'

export const metadata: Metadata = {
  title: 'Book gratis synlighetsanalyse — SalesUp',
  description:
    'Få et ærlig bilde av din digitale synlighet på 20 minutter. Ingen salgspress, ingen forpliktelser — bare konkrete svar tilpasset din bransje.',
  alternates: { canonical: 'https://salesup.no/book-analyse' },
  openGraph: {
    title: 'Book gratis synlighetsanalyse | SalesUp',
    description:
      'Svar på 4 enkle spørsmål og velg en ledig tid. Gratis, uforpliktende, konkret.',
    url: 'https://salesup.no/book-analyse',
  },
  robots: { index: false }, // Funnel-side — ingen indeksering
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Book gratis analyse',
      item: 'https://salesup.no/book-analyse',
    },
  ],
}

/* ─── Tommy query ────────────────────────────────────── */
const tommyQuery = `*[_type == "teamMember" && slug.current == "tommy-van-wallinga"][0] {
  name, title,
  photo { asset->, alt }
}`

export default async function BookAnalysePage() {
  const tommy = await client.fetch<{
    name: string
    title: string
    photo?: { asset?: { url?: string }; alt?: string } | null
  } | null>(tommyQuery).catch(() => null)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Page shell ─── */}
      <div className="min-h-screen bg-[#F9F8F5]">
        {/* Minimal top bar */}
        <header className="pt-6 pb-4 px-6">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between">
            <Link href="/" className="font-display text-[18px] font-bold text-green-deep tracking-tight">
              SalesUp
            </Link>
            <a
              href="tel:+4797528712"
              className="text-[13px] text-muted/70 hover:text-green-deep transition-colors flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.5 11.5 0 003.6.6 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.5 11.5 0 00.6 3.6 1 1 0 01-.25 1L6.6 10.8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              +47 975 28 712
            </a>
          </div>
        </header>

        {/* Main grid */}
        <main id="main-content" className="max-w-[1100px] mx-auto px-6 py-10 xl:py-16">
          <div className="grid xl:grid-cols-[1fr_520px] gap-12 xl:gap-20 items-start">

            {/* ─── LEFT: Pitch ─────────────────────────────────────── */}
            <div className="xl:sticky xl:top-24">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-accent/40 rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-green-deep mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-light" aria-hidden="true" />
                Gratis synlighetsanalyse
              </div>

              <h1 className="font-display text-[clamp(30px,4vw,50px)] font-bold leading-[1.08] tracking-[-0.018em] text-green-deep mb-5">
                Se nøyaktig hva som holder deg igjen — på 20 minutter.
              </h1>

              <p className="text-[16px] font-light text-muted leading-[1.75] mb-8 max-w-[440px]">
                En kort prat med Tommy gir deg et ærlig bilde av din synlighet i Google og AI. Ingen standard-pitches. Ingen forpliktelser.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                {([
                  {
                    text: '20 minutter',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    ),
                  },
                  {
                    text: '100% gratis',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/>
                        <line x1="9" y1="3.27" x2="9" y2="21"/>
                        <line x1="15" y1="3" x2="15" y2="21"/>
                      </svg>
                    ),
                  },
                  {
                    text: 'Ingen forpliktelser',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    ),
                  },
                ] as { text: string; icon: React.ReactNode }[]).map(t => (
                  <div
                    key={t.text}
                    className="flex items-center gap-2 bg-white border border-black/8 rounded-full px-3.5 py-2 text-[13px] text-green-deep font-medium shadow-sm"
                  >
                    <span className="text-green-light">{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>

              {/* What you get */}
              <div className="bg-green-deep rounded-3xl p-7 text-white mb-8">
                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-accent mb-4">
                  Det du får med hjem
                </p>
                <ul className="flex flex-col gap-3.5">
                  {[
                    'Nåværende synlighets-score for din bransje',
                    'Hvilke søkeord og AI-spørsmål du bør eie',
                    'Konkrete quick-wins du kan starte med i dag',
                    'Realistisk estimat på potensiell vekst',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-white/85">
                      <span
                        className="w-5 h-5 rounded-full bg-accent/25 flex-shrink-0 flex items-center justify-center mt-0.5"
                        aria-hidden="true"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="var(--color-accent)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tommy card */}
              <div className="flex items-center gap-4 bg-white border border-black/8 rounded-2xl px-5 py-4 shadow-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-green-deep/10">
                  {tommy?.photo?.asset?.url ? (
                    <Image
                      src={urlFor(tommy.photo).width(96).height(96).url()}
                      alt={tommy.photo.alt || 'Tommy van Wallinga'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-deep flex items-center justify-center">
                      <span className="font-display text-[16px] font-bold text-accent select-none">T</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-green-deep">Tommy van Wallinga</p>
                  <p className="text-[12px] text-muted/70">Kommunikasjon &amp; SEO — svarer deg personlig</p>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Wizard ───────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-black/8 shadow-[0_2px_40px_rgba(2,25,60,0.07)] p-8 xl:p-10">
              <BookAnalyseWizard />
            </div>
          </div>
        </main>

        {/* Footer strip */}
        <footer className="py-8 px-6 mt-8 border-t border-black/6">
          <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[12px] text-muted/50">
            <span>© 2026 SalesUp Norway AS — Org.nr. 930 714 326</span>
            <div className="flex items-center gap-4">
              <Link href="/personvern" className="hover:text-green-deep transition-colors">
                Personvern
              </Link>
              <Link href="/" className="hover:text-green-deep transition-colors">
                Tilbake til forsiden
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
