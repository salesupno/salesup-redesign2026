import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { caseStudyBySlugQuery, allCaseStudiesQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const cases = await client.fetch(allCaseStudiesQuery)
    return (cases || []).map((c: { slug: string }) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const c = await client.fetch(caseStudyBySlugQuery, { slug })
    if (!c) return {}
    return {
      title: c.metaTitle || `${c.clientName} — case | SalesUp`,
      description: c.metaDescription || c.excerpt,
      alternates: { canonical: `https://salesup.no/resultater/${slug}` },
      openGraph: {
        title: `${c.clientName} | SalesUp`,
        description: c.metaDescription || c.excerpt,
        url: `https://salesup.no/resultater/${slug}`,
        ...(c.heroImage?.asset && {
          images: [{ url: urlFor(c.heroImage).width(1200).height(630).url() }],
        }),
      },
    }
  } catch {
    return {}
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  let c = null
  try {
    c = await client.fetch(caseStudyBySlugQuery, { slug })
  } catch { /* fortsetter med null */ }
  if (!c) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Resultater', item: 'https://salesup.no/resultater' },
      { '@type': 'ListItem', position: 3, name: c.clientName, item: `https://salesup.no/resultater/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-10 px-6 md:px-12 xl:px-20 bg-black text-white">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-white/40">
            <li><Link href="/" className="hover:text-white transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-white/20">›</li>
            <li><Link href="/resultater" className="hover:text-white transition-colors">Resultater</Link></li>
            <li aria-hidden="true" className="text-white/20">›</li>
            <li className="text-white/70">{c.clientName}</li>
          </ol>
        </nav>

        {c.industry && (
          <span className="inline-flex items-center bg-white/10 text-white/70 rounded-full px-3 py-1 text-[11px] font-medium mb-5">
            {c.industry}
          </span>
        )}

        <h1 className="font-display text-[clamp(36px,4.5vw,62px)] leading-[1.06] tracking-[-0.018em] max-w-[760px] mb-6">
          {c.clientName}
        </h1>
        {c.excerpt && (
          <p className="text-[18px] font-light text-white/60 leading-[1.7] max-w-[560px] mb-10">
            {c.excerpt}
          </p>
        )}

        {/* Tjenester-tags */}
        {c.services?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {c.services.map((s: { _id: string; slug: string; title: string }) => (
              <Link
                key={s._id}
                href={`/tjenester/${s.slug}`}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── COVERBILDE ────────────────────────────────────────────── */}
      {c.heroImage?.asset && (
        <div className="px-6 md:px-12 xl:px-20 -mt-1 bg-black pb-16">
          <div className="aspect-[16/7] rounded-3xl overflow-hidden relative">
            <Image
              src={urlFor(c.heroImage).width(1800).height(788).url()}
              alt={c.heroImage.alt || c.clientName}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* ─── NØKKELTALL ────────────────────────────────────────────── */}
      {c.metrics?.length > 0 && (
        <section className="px-6 md:px-12 xl:px-20 py-16 bg-green-pale">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-deep/60 mb-8">
            Dokumenterte resultater
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {c.metrics.map((m: { value: string; label: string; period?: string }, i: number) => (
              <div key={i}>
                <p className="font-display text-[clamp(36px,4vw,52px)] font-extrabold tracking-tight text-green-deep leading-none mb-2">
                  {m.value}
                </p>
                <p className="text-[14px] font-medium text-black/70">{m.label}</p>
                {m.period && <p className="text-[12px] text-muted mt-0.5">{m.period}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── UTFORDRINGEN ──────────────────────────────────────────── */}
      {c.challenge && (
        <section className="px-6 md:px-12 xl:px-20 py-14 max-w-[760px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
            Utfordringen
          </p>
          <h2 className="font-display text-[clamp(22px,2.2vw,32px)] tracking-tight mb-6 leading-[1.15]">
            Hva var situasjonen da vi startet?
          </h2>
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-green-deep">
            {/* Portable Text */}
          </div>
        </section>
      )}

      {/* ─── LØSNINGEN ─────────────────────────────────────────────── */}
      {c.solution && (
        <section className="px-6 md:px-12 xl:px-20 py-14 bg-cream max-w-none">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
              Løsningen
            </p>
            <h2 className="font-display text-[clamp(22px,2.2vw,32px)] tracking-tight mb-6 leading-[1.15]">
              Hva gjorde vi?
            </h2>
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-green-deep">
              {/* Portable Text */}
            </div>
          </div>
        </section>
      )}

      {/* ─── RESULTATENE ───────────────────────────────────────────── */}
      {c.results && (
        <section className="px-6 md:px-12 xl:px-20 py-14 max-w-[760px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
            Resultatene
          </p>
          <h2 className="font-display text-[clamp(22px,2.2vw,32px)] tracking-tight mb-6 leading-[1.15]">
            Hva ble resultatet?
          </h2>
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-green-deep">
            {/* Portable Text */}
          </div>
        </section>
      )}

      {/* ─── KUNDESITAT ────────────────────────────────────────────── */}
      {c.testimonialQuote && (
        <section className="px-6 md:px-12 xl:px-20 py-14 bg-black text-white">
          <div className="max-w-[640px]">
            <p className="font-display text-[clamp(20px,2.5vw,30px)] font-light leading-[1.5] italic mb-6">
              &ldquo;{c.testimonialQuote}&rdquo;
            </p>
            {c.testimonialAuthor && (
              <div>
                <p className="font-medium text-[14px]">{c.testimonialAuthor}</p>
                {c.testimonialTitle && (
                  <p className="text-[13px] text-white/50">{c.testimonialTitle}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-20 px-6 md:px-12 xl:px-20">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[-0.012em] leading-[1.1] text-green-deep mb-4">
            Vil du se lignende resultater?
          </h2>
          <p className="text-[17px] font-light text-black/60 leading-[1.7] mb-8">
            Book en gratis synlighetsanalyse og finn ut hva som er mulig for din bedrift.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/kontakt" variant="primary">Book gratis analyse →</Button>
            <Link href="/resultater" className="text-[15px] font-medium text-green-deep hover:text-green-mid transition-colors inline-flex items-center py-4">
              ← Alle case
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
