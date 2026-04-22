import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { glossaryTermBySlugQuery, allGlossaryTermsQuery } from '@/sanity/lib/queries'
import { FAQWidget } from '@/components/blog/FAQWidget'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const terms = await client.fetch(allGlossaryTermsQuery)
    return (terms || []).map((t: { slug: string }) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const term = await client.fetch(glossaryTermBySlugQuery, { slug })
    if (!term) return {}
    return {
      title: term.metaTitle || `Hva er ${term.term}?`,
      description: term.metaDescription || term.shortDefinition,
      alternates: { canonical: `https://salesup.no/faguttrykk/${slug}` },
      openGraph: {
        title: `${term.term} — hva betyr det? | SalesUp`,
        description: term.metaDescription || term.shortDefinition,
        url: `https://salesup.no/faguttrykk/${slug}`,
      },
    }
  } catch {
    return {}
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  let term = null
  try {
    term = await client.fetch(glossaryTermBySlugQuery, { slug })
  } catch { /* fortsetter med null */ }
  if (!term) notFound()

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.shortDefinition,
    url: `https://salesup.no/faguttrykk/${slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'SalesUp Faguttrykk',
      url: 'https://salesup.no/faguttrykk',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Faguttrykk', item: 'https://salesup.no/faguttrykk' },
      { '@type': 'ListItem', position: 3, name: term.term, item: `https://salesup.no/faguttrykk/${slug}` },
    ],
  }

  const faqSchema = term.faqQuestions?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: term.faqQuestions.map((q: { question: string; shortAnswer: string }) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.shortAnswer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-10 px-6 md:px-12 xl:px-20 max-w-[900px]">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li><Link href="/faguttrykk" className="hover:text-green-deep transition-colors">Faguttrykk</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">{term.term}</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Faguttrykk
        </p>
        <h1 className="font-display text-[clamp(36px,4.5vw,60px)] leading-[1.05] tracking-[-0.018em] mb-8">
          Hva er {term.term}?
        </h1>

        {/* Kort definisjon — AEO-optimalisert */}
        <div className="bg-green-pale rounded-2xl p-8 mb-10">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-green-deep/60 mb-3">
            Kort definisjon
          </p>
          <p className="text-[17px] font-light text-black leading-[1.75]">
            {term.shortDefinition}
          </p>
        </div>
      </section>

      {/* ─── FULL DEFINISJON ───────────────────────────────────────── */}
      {term.fullDefinition && (
        <section className="px-6 md:px-12 xl:px-20 pb-12 max-w-[760px]">
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-green-deep prose-a:no-underline hover:prose-a:underline">
            {/* Portable Text innhold vises her */}
          </div>
        </section>
      )}

      {/* ─── RELATERTE TERMER ──────────────────────────────────────── */}
      {term.relatedTerms?.length > 0 && (
        <section className="px-6 md:px-12 xl:px-20 py-10 border-t border-black/8 max-w-[900px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-5">
            Relaterte faguttrykk
          </p>
          <div className="flex flex-wrap gap-3">
            {term.relatedTerms.map((t: { _id: string; slug: string; term: string; shortDefinition?: string }) => (
              <Link
                key={t._id}
                href={`/faguttrykk/${t.slug}`}
                className="group bg-cream hover:bg-[#E8E4DA] border border-black/8 rounded-2xl px-5 py-4 transition-colors"
              >
                <p className="font-display text-[14px] font-bold tracking-tight group-hover:text-green-deep transition-colors">
                  {t.term}
                </p>
                {t.shortDefinition && (
                  <p className="text-[12px] text-muted mt-0.5 line-clamp-1">{t.shortDefinition}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── RELATERTE TJENESTER ───────────────────────────────────── */}
      {term.relatedServices?.length > 0 && (
        <section className="px-6 md:px-12 xl:px-20 py-10 border-t border-black/8 max-w-[900px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-5">
            Relaterte tjenester
          </p>
          <div className="flex flex-wrap gap-3">
            {term.relatedServices.map((s: { _id: string; slug: string; title: string; tagline?: string }) => (
              <Link
                key={s._id}
                href={`/tjenester/${s.slug}`}
                className="bg-green-deep/5 hover:bg-green-deep/10 border border-green-deep/15 rounded-2xl px-5 py-4 transition-colors"
              >
                <p className="font-display text-[14px] font-bold tracking-tight text-green-deep">
                  {s.title} →
                </p>
                {s.tagline && (
                  <p className="text-[12px] text-muted mt-0.5">{s.tagline}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── FAQ ───────────────────────────────────────────────────── */}
      {term.faqQuestions?.length > 0 && (
        <section className="px-6 md:px-12 xl:px-20 py-12 border-t border-black/8 max-w-[760px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
            Vanlige spørsmål
          </p>
          <h2 className="font-display text-[clamp(22px,2.2vw,32px)] tracking-[-0.012em] leading-[1.1] mb-8">
            Spørsmål om {term.term}
          </h2>
          <FAQWidget faqQuestions={term.faqQuestions} />
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-20 px-6 md:px-12 xl:px-20 mt-8">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[-0.012em] leading-[1.1] text-green-deep mb-4">
            Vil du bruke {term.term} aktivt for din bedrift?
          </h2>
          <p className="text-[17px] font-light text-black/60 leading-[1.7] mb-8">
            Book en gratis analyse og få konkrete anbefalinger tilpasset din bransje og situasjon.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/kontakt" variant="primary">Book gratis analyse →</Button>
            <Link href="/faguttrykk" className="text-[15px] font-medium text-green-deep hover:text-green-mid transition-colors inline-flex items-center gap-1.5 py-4">
              ← Alle faguttrykk
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
