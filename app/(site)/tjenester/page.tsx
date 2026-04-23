import Link from 'next/link'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allServicesQuery } from '@/sanity/lib/queries'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Tjenester',
  description:
    'SEO, AEO, GEO, CRO og Google Ads — alt du trenger for aktiv organisk synlighet. SalesUp kombinerer tradisjonell søkemotoroptimalisering med AI-drevet synlighet.',
  alternates: { canonical: 'https://salesup.no/tjenester' },
  openGraph: {
    title: 'Tjenester | SalesUp',
    description:
      'SEO, AEO, GEO, CRO og Google Ads — koordinert som én strategi for maksimal synlighet.',
    url: 'https://salesup.no/tjenester',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Tjenester', item: 'https://salesup.no/tjenester' },
  ],
}

const fallbackServices = [
  { _id: '1', title: 'Søkemotoroptimalisering', slug: 'seo', shortCode: 'SEO', tagline: 'Teknisk SEO, innholdsstrategi og aktiv lenkbygging.', heroIngress: 'Bli funnet av de som faktisk leter etter det du tilbyr.', tags: ['Teknisk SEO', 'On-site', 'Lenkbygging'] },
  { _id: '2', title: 'AI-svarsoptimalisering', slug: 'aeo', shortCode: 'AEO', tagline: 'Bli svaret AI-assistentene gir i din bransje.', heroIngress: 'Optimaliser innholdet ditt for ChatGPT, Perplexity og Gemini.', tags: ['ChatGPT', 'Perplexity', 'Strukturert data'] },
  { _id: '3', title: 'Generativ synlighet', slug: 'geo', shortCode: 'GEO', tagline: 'Tilstedeværelse i alle AI-genererte svar.', heroIngress: 'Fremtidens synlighet starter nå — vi posisjonerer deg der AI henter informasjon.', tags: ['GEO', 'AI-kanaler', 'Autoritet'] },
  { _id: '4', title: 'Konverteringsoptimalisering', slug: 'cro', shortCode: 'CRO', tagline: 'Gjør trafikken om til faktiske leads og salg.', heroIngress: 'Vi analyserer brukeratferd og bygger konverteringssystemer som virker.', tags: ['A/B-testing', 'CRO', 'UX'] },
  { _id: '5', title: 'Google Ads', slug: 'google-ads', shortCode: 'ADS', tagline: 'Betalt synlighet som forsterker den organiske.', heroIngress: 'Presise Google Ads-kampanjer med fokus på ROAS, ikke bare klikk.', tags: ['Google Ads', 'PPC', 'ROAS'] },
  { _id: '6', title: 'WordPress & Teknisk plattform', slug: 'wordpress', shortCode: 'WP', tagline: 'Rask, teknisk solid plattform for SEO-vekst.', heroIngress: 'Core Web Vitals, sikkerhet og SEO-arkitektur bakt inn fra start.', tags: ['WordPress', 'Core Web Vitals', 'Teknisk'] },
]

export default async function TjenesterPage() {
  let services = fallbackServices
  try {
    const s = await client.fetch(allServicesQuery)
    if (s?.length) services = s
  } catch { /* bruker fallback */ }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-cream">
        <div className="sc">
        {/* Brødsmule */}
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">Tjenester</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Tjenester
        </p>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-[-0.018em] max-w-[720px] mb-6">
          Alt du trenger for aktiv organisk synlighet
        </h1>
        <p className="text-[18px] font-light text-muted leading-[1.7] max-w-[560px] mb-12">
          Vi kombinerer tradisjonell SEO med AI-drevet synlighet og konverteringsoptimalisering —
          alt koordinert som én strategi.
        </p>
        <Button href="/kontakt" variant="primary">Få gratis synlighetsanalyse →</Button>
        </div>
      </section>

      {/* ─── TJENESTELISTE ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="sc">
        <div className="flex flex-col divide-y divide-black/8">
          {services.map((s, i) => (
            <Link
              key={s._id}
              href={`/tjenester/${s.slug}`}
              className="group grid md:grid-cols-[80px_1fr_auto] gap-6 md:gap-10 py-10 hover:bg-cream/50 -mx-6 px-6 transition-colors"
            >
              <div className="text-[13px] font-medium text-muted pt-1">0{i + 1}</div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-xl bg-green-deep flex items-center justify-center font-display font-extrabold text-[11px] text-accent shrink-0">
                    {s.shortCode}
                  </span>
                  <h2 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight">
                    {s.title}
                  </h2>
                </div>
                <p className="text-[15px] text-muted leading-relaxed max-w-[560px]">
                  {s.heroIngress || s.tagline}
                </p>
                {s.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(s.tags as string[]).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-cream text-green-deep border border-green-deep/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center shrink-0 self-center">
                <span className="w-10 h-10 rounded-full border border-black/12 flex items-center justify-center text-black/30 group-hover:bg-green-deep group-hover:border-green-deep group-hover:text-white transition-all">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* ─── GLOBAL CTA ────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-24">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <h2 className="font-display text-[clamp(28px,3vw,44px)] tracking-[-0.012em] leading-[1.1] text-green-deep max-w-[540px]">
              Ikke sikker på hva du trenger?
            </h2>
            <p className="text-[17px] font-light text-black/60 leading-[1.7] mt-4 max-w-[440px]">
              Vi analyserer situasjonen din og anbefaler kun det som gir reell effekt for din bransje.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Button href="/kontakt" variant="primary">Book gratis analyse →</Button>
            <Button href="/resultater" variant="ghost">Se resultater</Button>
          </div>
        </div>
      </section>
    </>
  )
}
