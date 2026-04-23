import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { serviceBySlugQuery, allServicesQuery } from '@/sanity/lib/queries'
import { Button } from '@/components/ui/Button'
import { FAQWidget } from '@/components/blog/FAQWidget'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const services = await client.fetch(allServicesQuery)
    return (services || []).map((s: { slug: string }) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug })
    if (!service) return {}
    return {
      title: service.metaTitle || service.title,
      description: service.metaDescription || service.heroIngress || service.tagline,
      alternates: { canonical: `https://salesup.no/tjenester/${slug}` },
      openGraph: {
        title: `${service.metaTitle || service.title} | SalesUp`,
        description: service.metaDescription || service.heroIngress,
        url: `https://salesup.no/tjenester/${slug}`,
      },
    }
  } catch {
    return {}
  }
}

export default async function TjenestePage({ params }: Props) {
  const { slug } = await params
  let service = null
  try {
    service = await client.fetch(serviceBySlugQuery, { slug })
  } catch { /* fortsetter med null */ }
  if (!service) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Tjenester', item: 'https://salesup.no/tjenester' },
      { '@type': 'ListItem', position: 3, name: service.title, item: `https://salesup.no/tjenester/${slug}` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `https://salesup.no/tjenester/${slug}#service`,
    name: service.title,
    description: service.heroIngress || service.tagline,
    url: `https://salesup.no/tjenester/${slug}`,
    provider: {
      '@type': 'Organization',
      '@id': 'https://salesup.no/#organization',
      name: 'SalesUp Norway AS',
    },
  }

  const faqSchema = service.faqQuestions?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faqQuestions.map((q: { question: string; shortAnswer: string }) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.shortAnswer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-cream">
        <div className="sc">
        {/* Brødsmule */}
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li><Link href="/tjenester" className="hover:text-green-deep transition-colors">Tjenester</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">{service.title}</li>
          </ol>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          {service.shortCode && (
            <span className="w-11 h-11 rounded-xl bg-green-deep flex items-center justify-center font-display font-extrabold text-[12px] text-accent shrink-0">
              {service.shortCode}
            </span>
          )}
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light">
            Tjeneste
          </p>
        </div>

        <h1 className="font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-[-0.018em] max-w-[760px] mb-6">
          {service.heroHeading || service.title}
        </h1>
        {service.heroIngress && (
          <p className="text-[18px] font-light text-muted leading-[1.75] max-w-[580px] mb-10">
            {service.heroIngress}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          <Button href="/kontakt" variant="primary">Få gratis analyse →</Button>
          <Button href="/resultater" variant="ghost">Se resultater</Button>
        </div>
        </div>
      </section>

      {/* ─── LEVERANSER ────────────────────────────────────────────── */}
      {service.deliverables?.length > 0 && (
        <section className="py-20">
          <div className="sc">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">Hva du får</p>
          <h2 className="font-display text-[clamp(28px,3vw,42px)] tracking-[-0.012em] leading-[1.1] max-w-[600px] mb-12">
            Konkrete leveranser — ikke vage løfter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {service.deliverables.map((d: { title: string; description: string }, i: number) => (
              <div key={i} className="bg-cream rounded-2xl p-8">
                <div className="w-8 h-8 rounded-lg bg-green-deep flex items-center justify-center text-accent mb-5 font-display font-bold text-[12px]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-[17px] font-bold tracking-tight mb-2">{d.title}</h3>
                {d.description && (
                  <p className="text-[14px] text-muted leading-relaxed">{d.description}</p>
                )}
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* ─── PROSESS ───────────────────────────────────────────────── */}
      {service.processSteps?.length > 0 && (
        <section className="bg-cream py-20">
          <div className="sc">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">Slik jobber vi</p>
          <h2 className="font-display text-[clamp(28px,3vw,42px)] tracking-[-0.012em] leading-[1.1] max-w-[600px] mb-12">
            Vår prosess
          </h2>
          <div className="flex flex-col max-w-[680px]">
            {service.processSteps.map((step: { stepNumber: number; title: string; description: string }, i: number) => (
              <div key={i} className="flex gap-6 pb-10 relative">
                {i < service.processSteps.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-black/8" aria-hidden="true" />
                )}
                <div className="w-10 h-10 rounded-full border-2 border-green-deep flex items-center justify-center font-display text-[13px] font-bold text-green-deep shrink-0 bg-white">
                  {String(step.stepNumber || i + 1).padStart(2, '0')}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-display text-[18px] font-bold tracking-tight mb-2">{step.title}</h3>
                  {step.description && (
                    <p className="text-[15px] text-muted leading-relaxed">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* ─── RELATERTE TJENESTER ───────────────────────────────────── */}
      {service.relatedServices?.length > 0 && (
        <section className="py-16 border-t border-black/8">
          <div className="sc">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-6">Relaterte tjenester</p>
          <div className="flex flex-wrap gap-3">
            {service.relatedServices.map((r: { _id: string; slug: string; title: string; tagline?: string }) => (
              <Link
                key={r._id}
                href={`/tjenester/${r.slug}`}
                className="group bg-cream hover:bg-[#E8E4DA] border border-black/8 rounded-2xl px-6 py-4 transition-colors"
              >
                <p className="font-display text-[15px] font-bold tracking-tight group-hover:text-green-deep transition-colors">
                  {r.title}
                </p>
                {r.tagline && <p className="text-[13px] text-muted mt-0.5">{r.tagline}</p>}
              </Link>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* ─── FAQ WIDGET — like over CTA ────────────────────────────── */}
      {service.faqQuestions?.length > 0 && (
        <section className="py-16 border-t border-black/8">
          <div className="sc">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
              Vanlige spørsmål
            </p>
            <h2 className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[-0.012em] leading-[1.1] mb-10">
              Spørsmål om {service.title.toLowerCase()}
            </h2>
            <FAQWidget faqQuestions={service.faqQuestions} />
          </div>
          </div>
        </section>
      )}

      {/* ─── AVSLUTNINGS-CTA ───────────────────────────────────────── */}
      <section className="bg-green-pale py-24">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <h2 className="font-display text-[clamp(28px,3vw,44px)] tracking-[-0.012em] leading-[1.1] text-green-deep max-w-[540px]">
              {service.cta?.heading || `Klar for å komme i gang med ${service.title.toLowerCase()}?`}
            </h2>
            <p className="text-[17px] font-light text-black/60 leading-[1.7] mt-4 max-w-[440px]">
              {service.cta?.ingress ||
                'Book en uforpliktende analyse. Vi er ærlige om hva som faktisk er mulig for din bransje.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Button href="/kontakt" variant="primary">
              {service.cta?.primaryLabel || 'Book gratis analyse →'}
            </Button>
            <Button href="/resultater" variant="outline-dark">Se resultater</Button>
          </div>
        </div>
      </section>
    </>
  )
}
