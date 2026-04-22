import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { postBySlugQuery, allPostsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { FAQWidget } from '@/components/blog/FAQWidget'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await client.fetch(allPostsQuery)
    return (posts || []).map((p: { slug: string }) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await client.fetch(postBySlugQuery, { slug })
    if (!post) return {}
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      alternates: { canonical: `https://salesup.no/innsikt/${slug}` },
      openGraph: {
        title: `${post.metaTitle || post.title} | SalesUp`,
        description: post.metaDescription || post.excerpt,
        url: `https://salesup.no/innsikt/${slug}`,
        type: 'article',
        ...(post.mainImage?.asset && {
          images: [{ url: urlFor(post.mainImage).width(1200).height(630).url() }],
        }),
      },
    }
  } catch {
    return {}
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  let post = null
  try {
    post = await client.fetch(postBySlugQuery, { slug })
  } catch { /* fortsetter med null */ }
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://salesup.no/innsikt/${slug}#article`,
    headline: post.title,
    description: post.excerpt,
    url: `https://salesup.no/innsikt/${slug}`,
    datePublished: post.publishedAt,
    ...(post.mainImage?.asset && {
      image: urlFor(post.mainImage).width(1200).height(630).url(),
    }),
    publisher: {
      '@type': 'Organization',
      '@id': 'https://salesup.no/#organization',
      name: 'SalesUp Norway AS',
    },
    ...(post.author && {
      author: {
        '@type': 'Person',
        '@id': `https://salesup.no/om-oss/${post.author.slug}#person`,
        name: post.author.name,
        jobTitle: post.author.title,
        url: `https://salesup.no/om-oss/${post.author.slug}`,
      },
    }),
  }

  const faqSchema = post.faqQuestions?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqQuestions.map((q: { question: string; shortAnswer: string }) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.shortAnswer },
        })),
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Innsikt', item: 'https://salesup.no/innsikt' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://salesup.no/innsikt/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
            <li><Link href="/innsikt" className="hover:text-green-deep transition-colors">Innsikt</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {post.category && (
          <span className="inline-flex items-center bg-green-deep text-accent rounded-full px-3 py-1 text-[11px] font-medium mb-5">
            {post.category.toUpperCase()}
          </span>
        )}

        <h1 className="font-display text-[clamp(32px,4.5vw,58px)] leading-[1.08] tracking-[-0.018em] mb-8">
          {post.title}
        </h1>

        {/* Forfatter + dato */}
        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-black/8">
          {post.author && (
            <div className="flex items-center gap-3">
              {post.author.photo?.asset ? (
                <Image
                  src={urlFor(post.author.photo).width(48).height(48).url()}
                  alt={post.author.photo.alt || post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-pale flex items-center justify-center font-display font-bold text-[14px] text-green-deep">
                  {post.author.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
              <div>
                <Link
                  href={`/om-oss/${post.author.slug}`}
                  className="text-[14px] font-medium hover:text-green-deep transition-colors"
                >
                  {post.author.name}
                </Link>
                {post.author.title && (
                  <p className="text-[12px] text-muted">{post.author.title}</p>
                )}
              </div>
            </div>
          )}
          {post.publishedAt && (
            <span className="text-[13px] text-muted ml-auto">{formatDate(post.publishedAt)}</span>
          )}
        </div>
      </section>

      {/* ─── BILDE ─────────────────────────────────────────────────── */}
      {post.mainImage?.asset && (
        <section className="px-6 md:px-12 xl:px-20 mb-12 max-w-[900px]">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden relative">
            <Image
              src={urlFor(post.mainImage).width(1800).height(1013).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* ─── INGRESS ───────────────────────────────────────────────── */}
      {post.excerpt && (
        <section className="px-6 md:px-12 xl:px-20 mb-10 max-w-[760px]">
          <p className="text-[19px] font-light text-black leading-[1.75] border-l-2 border-green-deep pl-6">
            {post.excerpt}
          </p>
        </section>
      )}

      {/* ─── BRØDTEKST — Portable Text ─────────────────────────────── */}
      {post.body && (
        <section className="px-6 md:px-12 xl:px-20 mb-12 max-w-[760px]">
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-green-deep prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold">
            {/* Portable Text rendres her */}
          </div>
        </section>
      )}

      {/* ─── INLINE CTA midtveis ───────────────────────────────────── */}
      {post.inlineCTA?.text && (
        <section className="px-6 md:px-12 xl:px-20 py-10 max-w-[760px]">
          <div className="bg-green-pale rounded-2xl p-8">
            <p className="text-[16px] font-light text-black leading-[1.7] mb-5">{post.inlineCTA.text}</p>
            {post.inlineCTA.href && (
              <Button href={post.inlineCTA.href} variant="primary">
                {post.inlineCTA.label || 'Les mer →'}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* ─── FAQ WIDGET ────────────────────────────────────────────── */}
      {post.faqQuestions?.length > 0 && (
        <section className="px-6 md:px-12 xl:px-20 py-12 border-t border-black/8 max-w-[760px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
            Vanlige spørsmål
          </p>
          <h2 className="font-display text-[clamp(22px,2.2vw,32px)] tracking-[-0.012em] leading-[1.1] mb-8">
            Spørsmål knyttet til denne artikkelen
          </h2>
          <FAQWidget faqQuestions={post.faqQuestions} />
        </section>
      )}

      {/* ─── RELATERT INNHOLD ──────────────────────────────────────── */}
      {(post.relatedPosts?.length > 0 || post.relatedServices?.length > 0) && (
        <section className="px-6 md:px-12 xl:px-20 py-12 border-t border-black/8 max-w-[900px]">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-6">
            Les mer
          </p>
          <div className="flex flex-wrap gap-3">
            {post.relatedServices?.map((s: { _id: string; slug: string; title: string }) => (
              <Link
                key={s._id}
                href={`/tjenester/${s.slug}`}
                className="bg-green-deep/5 hover:bg-green-deep/10 border border-green-deep/15 rounded-2xl px-5 py-4 transition-colors"
              >
                <p className="font-display text-[14px] font-bold tracking-tight text-green-deep">
                  Tjeneste: {s.title} →
                </p>
              </Link>
            ))}
            {post.relatedPosts?.map((p: { _id: string; slug: string; title: string }) => (
              <Link
                key={p._id}
                href={`/innsikt/${p.slug}`}
                className="bg-cream hover:bg-[#E8E4DA] border border-black/8 rounded-2xl px-5 py-4 transition-colors"
              >
                <p className="font-display text-[14px] font-bold tracking-tight">{p.title} →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── AVSLUTNINGS-CTA ───────────────────────────────────────── */}
      <section className="bg-green-pale py-20 px-6 md:px-12 xl:px-20 mt-8">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[clamp(24px,2.5vw,36px)] tracking-[-0.012em] leading-[1.1] text-green-deep mb-4">
            Vil du ha hjelp til å implementere dette?
          </h2>
          <p className="text-[17px] font-light text-black/60 leading-[1.7] mb-8">
            Book en gratis synlighetsanalyse og få konkrete anbefalinger for din situasjon.
          </p>
          <Button href="/kontakt" variant="primary">Book gratis analyse →</Button>
        </div>
      </section>
    </>
  )
}
