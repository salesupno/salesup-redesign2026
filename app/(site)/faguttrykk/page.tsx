import Link from 'next/link'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allGlossaryTermsQuery } from '@/sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Faguttrykk — Ordliste for SEO, AEO og GEO',
  description:
    'Forklaringer på faguttrykk innen SEO, AEO, GEO og digital markedsføring. Fra A til Å — enkle svar på komplekse begreper.',
  alternates: { canonical: 'https://salesup.no/faguttrykk' },
  openGraph: {
    title: 'Faguttrykk | SalesUp',
    description: 'Ordliste for SEO, AEO, GEO og digital markedsføring.',
    url: 'https://salesup.no/faguttrykk',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Faguttrykk', item: 'https://salesup.no/faguttrykk' },
  ],
}

interface GlossaryTerm {
  _id: string
  term: string
  slug: string
  category?: string
  shortDefinition?: string
}

const fallbackTerms: GlossaryTerm[] = [
  { _id: '1', term: 'AEO', slug: 'aeo', category: 'aeo', shortDefinition: 'Answer Engine Optimization — optimalisering for AI-assistenter som ChatGPT, Perplexity og Gemini.' },
  { _id: '2', term: 'Core Web Vitals', slug: 'core-web-vitals', category: 'teknisk', shortDefinition: 'Googles tre målbare nøkkelverdier for brukeropplevelse: LCP, FID og CLS.' },
  { _id: '3', term: 'GEO', slug: 'geo', category: 'geo', shortDefinition: 'Generative Engine Optimization — synlighet i AI-genererte svar og sammendrag.' },
  { _id: '4', term: 'SERP', slug: 'serp', category: 'seo', shortDefinition: 'Search Engine Results Page — siden som vises etter et søk i Google.' },
  { _id: '5', term: 'E-E-A-T', slug: 'e-e-a-t', category: 'seo', shortDefinition: 'Experience, Expertise, Authoritativeness, Trustworthiness — Googles kvalitetsvurdering.' },
  { _id: '6', term: 'Lenkjuice', slug: 'lenkjuice', category: 'seo', shortDefinition: 'Den autoritetsverdien som overføres mellom nettsider via hyperlenker.' },
]

export default async function FaguttrykPage() {
  let terms = fallbackTerms
  try {
    const t = await client.fetch(allGlossaryTermsQuery)
    if (t?.length) terms = t
  } catch { /* bruker fallback */ }

  // Grupper A–Å
  const grouped = terms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {})

  const sortedLetters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'nb'))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 md:px-12 xl:px-20 bg-cream">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">Faguttrykk</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Faguttrykk
        </p>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.018em] max-w-[760px] mb-6">
          Alle faguttrykkene — fra A til Å
        </h1>
        <p className="text-[18px] font-light text-muted leading-[1.7] max-w-[540px]">
          Enkle forklaringer på komplekse begreper innen SEO, AEO, GEO og digital markedsføring.
        </p>
      </section>

      {/* ─── BOKSTAV-NAVIGATOR ─────────────────────────────────────── */}
      <nav aria-label="Hopp til bokstav" className="sticky top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-black/8 px-6 md:px-12 xl:px-20 py-3 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {sortedLetters.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium text-muted hover:bg-cream hover:text-green-deep transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      </nav>

      {/* ─── TERMLISTE ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 xl:px-20 py-16">
        {sortedLetters.map((letter) => (
          <div key={letter} id={letter} className="mb-12 scroll-mt-24">
            <h2 className="font-display text-[32px] font-extrabold text-green-deep/20 mb-6 border-b border-black/8 pb-2">
              {letter}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {grouped[letter].map((term) => (
                <Link
                  key={term._id}
                  href={`/faguttrykk/${term.slug}`}
                  className="group flex items-start gap-4 bg-cream hover:bg-[#E8E4DA] rounded-2xl px-5 py-5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[16px] font-bold tracking-tight group-hover:text-green-deep transition-colors mb-1">
                      {term.term}
                    </h3>
                    {term.shortDefinition && (
                      <p className="text-[13px] text-muted leading-relaxed line-clamp-2">
                        {term.shortDefinition}
                      </p>
                    )}
                  </div>
                  <svg className="shrink-0 mt-1 text-black/20 group-hover:text-green-deep transition-colors" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
