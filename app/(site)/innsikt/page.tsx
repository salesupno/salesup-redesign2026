import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allPostsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Innsikt — artikler om SEO, AEO og GEO',
  description:
    'Fagartikler, guider og analyser om søkemotoroptimalisering, AI-drevet synlighet og konverteringsoptimalisering fra SalesUps eksperter.',
  alternates: { canonical: 'https://salesup.no/innsikt' },
  openGraph: {
    title: 'Innsikt | SalesUp',
    description: 'Fagartikler og guider om SEO, AEO og GEO fra SalesUps eksperter.',
    url: 'https://salesup.no/innsikt',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Innsikt', item: 'https://salesup.no/innsikt' },
  ],
}

interface Post {
  _id: string
  title: string
  slug: string
  author?: { name: string; slug: string; title?: string; photo?: { asset: { _ref: string }; alt?: string } }
  category?: string
  publishedAt?: string
  mainImage?: { asset: { _ref: string }; alt?: string }
  excerpt?: string
  tags?: string[]
}

const fallbackPosts: Post[] = [
  { _id: '1', title: 'Hva er AEO og hvorfor er det viktig for norske bedrifter?', slug: 'hva-er-aeo', category: 'aeo', publishedAt: '2026-01-15', excerpt: 'AI-assistenter endrer måten folk søker etter informasjon. Her forklarer vi hva AEO er, og hva du kan gjøre for å bli svaret ChatGPT gir.' },
  { _id: '2', title: 'Slik bygger du et SEO-fundament som varer i 2026', slug: 'seo-fundament-2026', category: 'seo', publishedAt: '2026-02-01', excerpt: 'Teknisk SEO, innholdsstrategi og lenkbygging — vi går gjennom de viktigste tiltakene for varig organisk synlighet.' },
  { _id: '3', title: 'GEO: Fremtidens synlighet starter nå', slug: 'geo-fremtidens-synlighet', category: 'geo', publishedAt: '2026-03-10', excerpt: 'Generativ AI endrer søkelandskapet fundamentalt. Vi forklarer GEO og hvordan du posisjonerer deg der AI henter informasjon.' },
]

const categoryLabels: Record<string, string> = {
  seo: 'SEO',
  aeo: 'AEO',
  geo: 'GEO',
  cro: 'CRO',
  analyse: 'Analyse',
  case: 'Case',
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function InnsiktPage() {
  let posts = fallbackPosts
  try {
    const p = await client.fetch(allPostsQuery)
    if (p?.length) posts = p
  } catch { /* bruker fallback */ }

  const [featured, ...rest] = posts

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 md:px-12 xl:px-20 bg-cream">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">Innsikt</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Innsikt
        </p>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-[-0.018em] max-w-[760px] mb-6">
          Faglig innsikt fra de som gjør det
        </h1>
        <p className="text-[18px] font-light text-muted leading-[1.7] max-w-[540px]">
          Guider, analyser og perspektiver på SEO, AEO, GEO og konverteringsoptimalisering.
          Skrevet av folk som faktisk gjør dette til daglig.
        </p>
      </section>

      <section className="px-6 md:px-12 xl:px-20 py-16">
        {/* ─── FEATURED ──────────────────────────────────────────── */}
        {featured && (
          <Link
            href={`/innsikt/${featured.slug}`}
            className="group grid xl:grid-cols-[1fr_480px] gap-10 xl:gap-16 mb-16 pb-16 border-b border-black/8"
          >
            <div className="order-2 xl:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                {featured.category && (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-deep text-accent">
                    {categoryLabels[featured.category] || featured.category}
                  </span>
                )}
                {featured.publishedAt && (
                  <span className="text-[12px] text-muted">{formatDate(featured.publishedAt)}</span>
                )}
              </div>
              <h2 className="font-display text-[clamp(28px,3.5vw,48px)] tracking-[-0.012em] leading-[1.1] mb-5 group-hover:text-green-deep transition-colors">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="text-[16px] text-muted leading-[1.75] mb-6 max-w-[520px]">
                  {featured.excerpt}
                </p>
              )}
              {featured.author && (
                <div className="flex items-center gap-3">
                  {featured.author.photo?.asset ? (
                    <Image
                      src={urlFor(featured.author.photo).width(40).height(40).url()}
                      alt={featured.author.photo.alt || featured.author.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-pale flex items-center justify-center font-display font-bold text-[13px] text-green-deep">
                      {featured.author.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-medium">{featured.author.name}</p>
                    {featured.author.title && (
                      <p className="text-[12px] text-muted">{featured.author.title}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="order-1 xl:order-2 aspect-[16/10] rounded-3xl overflow-hidden bg-cream relative">
              {featured.mainImage?.asset ? (
                <Image
                  src={urlFor(featured.mainImage).width(960).height(600).url()}
                  alt={featured.mainImage.alt || featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-green-pale flex items-center justify-center">
                  <span className="font-display text-[80px] font-extrabold text-green-deep/10">
                    {featured.category?.toUpperCase() || ''}
                  </span>
                </div>
              )}
            </div>
          </Link>
        )}

        {/* ─── RESTEN ────────────────────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {rest.map((post) => (
              <Link
                key={post._id}
                href={`/innsikt/${post.slug}`}
                className="group flex flex-col bg-cream hover:bg-[#E8E4DA] rounded-3xl overflow-hidden transition-colors"
              >
                <div className="aspect-[16/9] bg-green-pale/50 relative overflow-hidden">
                  {post.mainImage?.asset ? (
                    <Image
                      src={urlFor(post.mainImage).width(600).height(338).url()}
                      alt={post.mainImage.alt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-[40px] font-extrabold text-green-deep/15">
                        {post.category?.toUpperCase() || ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {post.category && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-deep text-accent">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="text-[11px] text-muted">{formatDate(post.publishedAt)}</span>
                    )}
                  </div>
                  <h3 className="font-display text-[18px] font-bold tracking-tight mb-3 group-hover:text-green-deep transition-colors leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-[14px] text-muted leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  {post.author && (
                    <p className="text-[12px] font-medium text-muted mt-4 pt-4 border-t border-black/8">
                      {post.author.name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
