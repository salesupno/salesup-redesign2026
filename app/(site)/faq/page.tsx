import Link from 'next/link'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allFaqQuestionsQuery } from '@/sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Vanlige spørsmål om SEO, AEO og GEO',
  description:
    'Svar på de vanligste spørsmålene om søkemotoroptimalisering, AI-svarsoptimalisering og generativ synlighet. Grundige svar fra SalesUps eksperter.',
  alternates: { canonical: 'https://salesup.no/faq' },
  openGraph: {
    title: 'FAQ — Vanlige spørsmål | SalesUp',
    description: 'Svar på de vanligste spørsmålene om SEO, AEO og GEO.',
    url: 'https://salesup.no/faq',
  },
}

interface FAQQuestion {
  _id: string
  question: string
  slug: string
  category: string
  shortAnswer: string
  featured?: boolean
}

const fallbackFAQ: FAQQuestion[] = [
  { _id: '1', question: 'Hva er SEO?', slug: 'hva-er-seo', category: 'seo', shortAnswer: 'SEO (søkemotoroptimalisering) er prosessen med å forbedre et nettsted slik at det rangerer høyere i organiske søkeresultater. Det inkluderer tekniske tiltak, innholdsstrategi og lenkbygging.' },
  { _id: '2', question: 'Hva er AEO?', slug: 'hva-er-aeo', category: 'aeo', shortAnswer: 'AEO (Answer Engine Optimization) er optimalisering for å bli svaret AI-assistenter som ChatGPT, Perplexity og Gemini gir når noen stiller spørsmål i din bransje.' },
  { _id: '3', question: 'Hva er GEO?', slug: 'hva-er-geo', category: 'geo', shortAnswer: 'GEO (Generative Engine Optimization) handler om å sikre at merkevaren din er representert i AI-genererte svar og sammendrag på tvers av alle AI-plattformer.' },
  { _id: '4', question: 'Hva koster SEO?', slug: 'hva-koster-seo', category: 'seo', shortAnswer: 'Prisen på SEO varierer etter ambisjoner, bransje og konkurranse. Vi tilbyr pakker fra kr 9 900/mnd — book gratis analyse for å få et konkret estimat tilpasset din situasjon.' },
  { _id: '5', question: 'Hvor lang tid tar det å se resultater av SEO?', slug: 'hvor-lang-tid-tar-seo', category: 'seo', shortAnswer: 'De fleste ser tydelige resultater etter 3–6 måneder. Tekniske forbedringer gir raskere effekt, mens innholds- og autoritetstiltak bygger seg opp over tid.' },
  { _id: '6', question: 'Hva er forskjellen på SEO og Google Ads?', slug: 'seo-vs-google-ads', category: 'seo', shortAnswer: 'Google Ads gir umiddelbar synlighet som varer så lenge du betaler. SEO bygger varig organisk synlighet som ikke forsvinner når budsjettet stopper.' },
]

const categoryLabels: Record<string, string> = {
  seo: 'SEO',
  aeo: 'AEO',
  geo: 'GEO',
  cro: 'CRO',
  generelt: 'Generelt',
}

export default async function FAQPage() {
  let questions = fallbackFAQ
  try {
    const q = await client.fetch(allFaqQuestionsQuery)
    if (q?.length) questions = q
  } catch { /* bruker fallback */ }

  // Grupper etter kategori
  const grouped = questions.reduce<Record<string, FAQQuestion[]>>((acc, q) => {
    const cat = q.category || 'generelt'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(q)
    return acc
  }, {})

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.shortAnswer },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://salesup.no/faq' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-cream">
        <div className="sc">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">FAQ</li>
          </ol>
        </nav>
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Vanlige spørsmål
        </p>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-[-0.018em] max-w-[760px] mb-6">
          Svar på det du lurer på
        </h1>
        <p className="text-[18px] font-light text-muted leading-[1.7] max-w-[540px]">
          Grundige svar på de vanligste spørsmålene om SEO, AEO, GEO og digital synlighet — skrevet
          av folk som faktisk gjør dette til daglig.
        </p>
        </div>
      </section>

      {/* ─── FAQ ETTER KATEGORI ────────────────────────────────────── */}
      <section className="py-20">
        <div className="sc">
        {Object.entries(grouped).map(([category, qs]) => (
          <div key={category} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-7 h-7 rounded-lg bg-green-deep flex items-center justify-center text-accent font-display font-bold text-[10px]">
                {categoryLabels[category] || category.toUpperCase()}
              </span>
              <h2 className="font-display text-[20px] font-bold tracking-tight text-green-deep">
                {categoryLabels[category] || category}
              </h2>
            </div>

            <div className="flex flex-col divide-y divide-black/8">
              {qs.map((q) => (
                <Link
                  key={q._id}
                  href={`/faq/${q.slug}`}
                  className="group grid md:grid-cols-[1fr_auto] gap-4 py-6 hover:bg-cream/60 -mx-4 px-4 rounded-xl transition-colors"
                >
                  <div>
                    <h3 className="font-display text-[17px] font-semibold tracking-tight mb-2 group-hover:text-green-deep transition-colors">
                      {q.question}
                    </h3>
                    <p className="text-[14px] text-muted leading-relaxed line-clamp-2">
                      {q.shortAnswer}
                    </p>
                  </div>
                  <div className="flex items-center self-center shrink-0">
                    <span className="w-9 h-9 rounded-full border border-black/12 flex items-center justify-center text-black/30 group-hover:bg-green-deep group-hover:border-green-deep group-hover:text-white transition-all">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-20">
        <div className="sc">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[-0.012em] leading-[1.1] text-green-deep mb-4">
            Fant du ikke svaret du lette etter?
          </h2>
          <p className="text-[17px] font-light text-black/60 leading-[1.7] mb-8">
            Ring oss eller book en gratis analyse — vi svarer på alle spørsmål uten forpliktelser.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book-analyse"
              className="bg-green-deep hover:bg-green-mid text-white rounded-full px-7 py-4 text-[15px] font-medium transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Ta kontakt →
            </Link>
          </div>
        </div>
        </div>
      </section>
    </>
  )
}
