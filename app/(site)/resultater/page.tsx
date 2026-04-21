import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allCaseStudiesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Resultater — dokumenterte case fra SalesUp',
  description:
    'Se hva vi har levert for norske bedrifter. Reelle tall på SEO, AEO og konverteringsoptimalisering — ikke fluffy løfter.',
  alternates: { canonical: 'https://salesup.no/resultater' },
  openGraph: {
    title: 'Resultater | SalesUp',
    description: 'Dokumenterte resultater fra SEO, AEO og CRO for norske bedrifter.',
    url: 'https://salesup.no/resultater',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Resultater', item: 'https://salesup.no/resultater' },
  ],
}

interface Metric { value: string; label: string; period?: string }
interface Service { _id: string; slug: string; title: string }
interface CaseStudy {
  _id: string
  clientName: string
  slug: string
  industry?: string
  heroImage?: { asset: { _ref: string }; alt?: string }
  excerpt?: string
  featured?: boolean
  metrics?: Metric[]
  services?: Service[]
}

const fallbackCases: CaseStudy[] = [
  {
    _id: '1', clientName: 'Jøtul AS', slug: 'jotul', industry: 'Industri / E-handel',
    excerpt: 'Fra usynlig til markedsleder på peisovner og peiseinnsatser i Norden.',
    metrics: [
      { value: '+312%', label: 'organisk trafikk', period: '12 mnd' },
      { value: '+87%', label: 'organiske leads', period: '12 mnd' },
      { value: '#1', label: 'peisovner Google NO' },
    ],
    services: [{ _id: 's1', slug: 'seo', title: 'SEO' }],
  },
  {
    _id: '2', clientName: 'Nordic Eiendom', slug: 'nordic-eiendom', industry: 'Eiendom',
    excerpt: 'Dobling av kontorleie-leads gjennom lokal SEO og innholdsoptimalisering.',
    metrics: [
      { value: '2×', label: 'leads per mnd', period: '6 mnd' },
      { value: '-34%', label: 'kostnad per lead' },
    ],
  },
  {
    _id: '3', clientName: 'Komplett Helse', slug: 'komplett-helse', industry: 'Helse',
    excerpt: 'AI-drevet innholdsstrategi som plasserte merkevaren i ChatGPT-svar.',
    metrics: [
      { value: '+54%', label: 'AI-synlighet', period: '8 mnd' },
      { value: '+23%', label: 'nettstedstrafikk' },
    ],
  },
]

export default async function ResultaterPage() {
  let cases = fallbackCases
  try {
    const c = await client.fetch(allCaseStudiesQuery)
    if (c?.length) cases = c
  } catch { /* bruker fallback */ }

  const featured = cases.filter((c) => c.featured)
  const rest = cases.filter((c) => !c.featured)
  const all = featured.length ? [...featured, ...rest] : cases

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 md:px-12 xl:px-20 bg-black text-white">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-white/40">
            <li><Link href="/" className="hover:text-white transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-white/20">›</li>
            <li className="text-white/70">Resultater</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent mb-4">
          Case / Resultater
        </p>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.018em] max-w-[760px] mb-6">
          Resultater vi faktisk kan stå inne for
        </h1>
        <p className="text-[18px] font-light text-white/60 leading-[1.7] max-w-[540px]">
          Ingen vage løfter. Her er hva vi har levert — med tall, tidsrammer og ærlige forklaringer.
        </p>
      </section>

      {/* ─── CASES ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {all.map((c) => (
            <Link
              key={c._id}
              href={`/resultater/${c.slug}`}
              className="group flex flex-col bg-cream hover:bg-[#E8E4DA] rounded-3xl overflow-hidden transition-colors"
            >
              {/* Bilde */}
              <div className="aspect-[16/9] bg-green-pale/60 relative overflow-hidden">
                {c.heroImage?.asset ? (
                  <Image
                    src={urlFor(c.heroImage).width(600).height(338).url()}
                    alt={c.heroImage.alt || c.clientName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end p-6">
                    <p className="font-display text-[22px] font-extrabold tracking-tight text-green-deep/20">
                      {c.clientName}
                    </p>
                  </div>
                )}
                {c.industry && (
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {c.industry}
                  </span>
                )}
              </div>

              <div className="p-7 flex flex-col flex-1">
                <h2 className="font-display text-[20px] font-bold tracking-tight mb-3 group-hover:text-green-deep transition-colors leading-snug">
                  {c.clientName}
                </h2>
                {c.excerpt && (
                  <p className="text-[14px] text-muted leading-relaxed line-clamp-2 mb-5 flex-1">
                    {c.excerpt}
                  </p>
                )}

                {/* Nøkkeltall */}
                {c.metrics?.length && (
                  <div className="grid grid-cols-3 gap-3 pt-5 border-t border-black/8">
                    {c.metrics.slice(0, 3).map((m, i) => (
                      <div key={i}>
                        <p className="font-display text-[22px] font-extrabold tracking-tight text-green-deep">
                          {m.value}
                        </p>
                        <p className="text-[11px] text-muted leading-tight">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-20 px-6 md:px-12 xl:px-20">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[clamp(24px,2.5vw,36px)] font-extrabold tracking-[-0.012em] leading-[1.1] text-green-deep mb-4">
            Klar for å bli neste case?
          </h2>
          <p className="text-[17px] font-light text-black/60 leading-[1.7] mb-8">
            Book en gratis synlighetsanalyse og se hva som er mulig for din bedrift.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 bg-green-deep text-accent font-medium px-8 py-4 rounded-full hover:bg-green-mid transition-colors text-[15px]"
            >
              Book gratis analyse →
            </Link>
            <Link
              href="/tjenester"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-green-deep hover:text-green-mid transition-colors py-4"
            >
              Se hva vi tilbyr →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
