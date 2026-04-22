import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { faqQuestionBySlugQuery, allFaqQuestionsQuery } from '@/sanity/lib/queries'
import { FAQWidget } from '@/components/blog/FAQWidget'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const questions = await client.fetch(allFaqQuestionsQuery)
    return (questions || []).map((q: { slug: string }) => ({ slug: q.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const q = await client.fetch(faqQuestionBySlugQuery, { slug })
    if (!q) return {}
    return {
      title: q.metaTitle || q.question,
      description: q.metaDescription || q.shortAnswer,
      alternates: { canonical: `https://salesup.no/faq/${slug}` },
      openGraph: {
        title: `${q.metaTitle || q.question} | SalesUp`,
        description: q.metaDescription || q.shortAnswer,
        url: `https://salesup.no/faq/${slug}`,
      },
    }
  } catch {
    return {}
  }
}

const categoryLabels: Record<string, string> = {
  seo: 'SEO',
  aeo: 'AEO',
  geo: 'GEO',
  cro: 'CRO',
  generelt: 'Generelt',
}

export default async function FAQQuestionPage({ params }: Props) {
  const { slug } = await params
  let question = null
  try {
    question = await client.fetch(faqQuestionBySlugQuery, { slug })
  } catch { /* fortsetter med null */ }
  if (!question) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://salesup.no/faq' },
      { '@type': 'ListItem', position: 3, name: question.question, item: `https://salesup.no/faq/${slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: question.question,
        acceptedAnswer: { '@type': 'Answer', text: question.shortAnswer },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-10 px-6 md:px-12 xl:px-20 max-w-[900px]">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li><Link href="/faq" className="hover:text-green-deep transition-colors">FAQ</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium truncate max-w-[200px]">{question.question}</li>
          </ol>
        </nav>

        {question.category && (
          <span className="inline-flex items-center gap-1.5 bg-cream border border-black/10 rounded-full px-3 py-1 text-[11px] font-medium text-green-deep mb-5">
            {categoryLabels[question.category] || question.category}
          </span>
        )}

        <h1 className="font-display text-[clamp(32px,4vw,56px)] leading-[1.08] tracking-[-0.018em] mb-8">
          {question.question}
        </h1>

        {/* Kort svar — AEO-optimalisert, 40-80 ord, plukkes opp av AI */}
        <div className="bg-green-pale rounded-2xl p-8 mb-10">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-green-deep/60 mb-3">
            Kort svar
          </p>
          <p className="text-[17px] font-light text-black leading-[1.75]">
            {question.shortAnswer}
          </p>
        </div>
      </section>

      {/* ─── FULLT SVAR ────────────────────────────────────────────── */}
      {question.fullAnswer && (
        <section className="px-6 md:px-12 xl:px-20 pb-12 max-w-[760px]">
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-green-deep prose-a:no-underline hover:prose-a:underline">
            {/* Portable Text rendres her — placeholder til vi legger til PT-renderer */}
            <p className="text-[16px] text-muted leading-[1.8]">
              {/* Portable Text innhold vises her */}
            </p>
          </div>
        </section>
      )}

      {/* ─── INLINE CTA ─────────────────────────────────────────────── */}
      {question.inlineCTA?.text && (
        <section className="px-6 md:px-12 xl:px-20 py-12 max-w-[760px]">
          <div className="bg-cream border border-black/8 rounded-2xl p-8">
            <p className="text-[16px] font-light text-black leading-[1.7] mb-5">
              {question.inlineCTA.text}
            </p>
            {question.inlineCTA.href && (
              <Button href={question.inlineCTA.href} variant="primary">
                {question.inlineCTA.label || 'Les mer →'}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* ─── RELATERTE SPØRSMÅL ────────────────────────────────────── */}
      {question.relatedQuestions?.length > 0 && (
        <section className="px-6 md:px-12 xl:px-20 py-12 border-t border-black/8 max-w-[900px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-6">
            Relaterte spørsmål
          </p>
          <FAQWidget faqQuestions={question.relatedQuestions} />
        </section>
      )}

      {/* ─── RELATED CONTENT ───────────────────────────────────────── */}
      {(question.relatedServices?.length > 0 || question.relatedTerms?.length > 0) && (
        <section className="px-6 md:px-12 xl:px-20 py-12 border-t border-black/8 max-w-[900px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-6">
            Les mer
          </p>
          <div className="flex flex-wrap gap-3">
            {question.relatedServices?.map((s: { _id: string; slug: string; title: string }) => (
              <Link
                key={s._id}
                href={`/tjenester/${s.slug}`}
                className="bg-cream hover:bg-[#E8E4DA] border border-black/8 rounded-full px-4 py-2 text-[13px] font-medium text-green-deep transition-colors"
              >
                Tjeneste: {s.title} →
              </Link>
            ))}
            {question.relatedTerms?.map((t: { _id: string; slug: string; term: string }) => (
              <Link
                key={t._id}
                href={`/faguttrykk/${t.slug}`}
                className="bg-cream hover:bg-[#E8E4DA] border border-black/8 rounded-full px-4 py-2 text-[13px] font-medium text-black/70 transition-colors"
              >
                {t.term} →
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── AVSLUTNINGS-CTA ───────────────────────────────────────── */}
      <section className="bg-green-pale py-20 px-6 md:px-12 xl:px-20 mt-8">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[-0.012em] leading-[1.1] text-green-deep mb-4">
            Vil du se hva dette betyr for deg konkret?
          </h2>
          <p className="text-[17px] font-light text-black/60 leading-[1.7] mb-8">
            Book en gratis synlighetsanalyse — vi ser på situasjonen din og er ærlige om hva som
            faktisk er mulig.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/kontakt" variant="primary">Book gratis analyse →</Button>
            <Link href="/faq" className="text-[15px] font-medium text-green-deep hover:text-green-mid transition-colors inline-flex items-center gap-1.5 py-4">
              ← Alle spørsmål
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
