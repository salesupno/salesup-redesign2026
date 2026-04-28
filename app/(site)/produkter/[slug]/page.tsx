import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allProductsQuery, productBySlugQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

interface SanityImage {
  asset: { _id: string; url: string; metadata: { dimensions: { width: number; height: number } } }
  alt?: string
  caption?: string
}

interface Product {
  _id: string
  title: string
  slug: string
  category: string
  badge: string
  tagline: string
  pitch: string
  description: string
  externalUrl?: string
  features?: { title: string; description: string }[]
  body?: unknown[]
  mainImage?: SanityImage
  screenshots?: SanityImage[]
  metaTitle?: string
  metaDescription?: string
}

export async function generateStaticParams() {
  try {
    const products = await client.fetch(allProductsQuery)
    return (products || [])
      .filter((p: Product) => !p.externalUrl)
      .map((p: Product) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product: Product = await client.fetch(productBySlugQuery, { slug })
    if (!product) return {}
    return {
      title: product.metaTitle || `${product.title} | SalesUp`,
      description: product.metaDescription || product.tagline,
      alternates: { canonical: `https://salesup.no/produkter/${slug}` },
      openGraph: {
        title: product.metaTitle || `${product.title} | SalesUp`,
        description: product.metaDescription || product.tagline,
        url: `https://salesup.no/produkter/${slug}`,
      },
    }
  } catch {
    return {}
  }
}

const categoryColor: Record<string, { bg: string; text: string; border: string }> = {
  saas:             { bg: 'bg-accent',            text: 'text-black',      border: 'border-accent' },
  'wordpress-plugin': { bg: 'bg-green-pale',      text: 'text-green-deep', border: 'border-green-pale' },
  'shopify-app':    { bg: 'bg-accent/15',            text: 'text-black',      border: 'border-accent/30' },
}

const portableComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-3xl text-black tracking-tight mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-semibold text-xl text-black mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-black/75 leading-relaxed mb-4">{children}</p>
    ),
  },
}

export default async function ProduktPage({ params }: Props) {
  const { slug } = await params
  let product: Product | null = null
  try {
    product = await client.fetch(productBySlugQuery, { slug })
  } catch { /* fallback */ }
  if (!product) notFound()

  const colors = categoryColor[product.category] || categoryColor['wordpress-plugin']

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Produkter', item: 'https://salesup.no/produkter' },
      { '@type': 'ListItem', position: 3, name: product.title, item: `https://salesup.no/produkter/${slug}` },
    ],
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.title,
    description: product.description || product.tagline,
    url: product.externalUrl || `https://salesup.no/produkter/${slug}`,
    applicationCategory: product.category === 'saas' ? 'BusinessApplication' : 'UtilitiesApplication',
    operatingSystem: product.category === 'wordpress-plugin' ? 'WordPress' : product.category === 'shopify-app' ? 'Shopify' : 'Web',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NOK',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      '@id': 'https://salesup.no/#organization',
      name: 'SalesUp Norway AS',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* ─── Breadcrumb ───────────────────────────────────────────────── */}
      <div className="mt-16 bg-cream border-b border-black/8 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-black transition-colors">Forside</Link>
          <span>/</span>
          <Link href="/produkter" className="hover:text-black transition-colors">Produkter</Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </div>
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-black pt-20 pb-28 px-6 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-8">
            <span className={`inline-block text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full ${colors.bg} ${colors.text}`}>
              {product.badge || product.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-[0.95] mb-6 max-w-3xl">
            {product.title}
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed mb-10">
            {product.tagline}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            {product.externalUrl ? (
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-8 py-4 rounded-full hover:bg-accent-dark transition-colors text-lg"
              >
                Besøk {product.title} ↗
              </a>
            ) : (
              <Link
                href="/book-analyse"
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-8 py-4 rounded-full hover:bg-accent-dark transition-colors text-lg"
              >
                Kom i gang →
              </Link>
            )}
            <Link
              href="/book-analyse"
              className="text-white/60 hover:text-white transition-colors font-medium"
            >
              Spør oss om dette produktet
            </Link>
          </div>

          {/* Hovedbilde */}
          {product.mainImage?.asset?.url && (
            <div className="mt-14 rounded-2xl overflow-hidden border border-white/8 shadow-2xl">
              <Image
                src={product.mainImage.asset.url}
                alt={product.mainImage.alt || product.title}
                width={product.mainImage.asset.metadata.dimensions.width}
                height={product.mainImage.asset.metadata.dimensions.height}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* ─── Pitch + beskrivelse ──────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {product.pitch && (
            <p className="font-display text-2xl md:text-3xl text-green-deep tracking-tight mb-8 leading-snug">
              &ldquo;{product.pitch}&rdquo;
            </p>
          )}
          {product.description && (
            <p className="text-lg text-black/70 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </section>

      {/* ─── Nøkkelfunksjoner ─────────────────────────────────────────── */}
      {product.features && product.features.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">Hva du får</p>
              <h2 className="font-display text-4xl text-black tracking-tight">Nøkkelfunksjoner</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.features.map((feature, i) => (
                <div
                  key={i}
                  className="group bg-cream rounded-2xl p-8 hover:bg-green-deep transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-5">
                    <span className="text-black font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-semibold text-black group-hover:text-white text-lg mb-2 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted group-hover:text-white/70 text-sm leading-relaxed transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Brødtekst ────────────────────────────────────────────────── */}
      {product.body && (product.body as unknown[]).length > 0 && (
        <section className="bg-cream py-24 px-6">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <PortableText value={product.body as never} components={portableComponents as never} />
          </div>
        </section>
      )}

      {/* ─── Screenshots-galleri ──────────────────────────────────────── */}
      {product.screenshots && product.screenshots.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">I praksis</p>
              <h2 className="font-display text-4xl text-black tracking-tight">Se produktet i bruk</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {product.screenshots.map((img, i) => (
                <figure key={img.asset._id} className="rounded-2xl overflow-hidden border border-black/8 bg-cream">
                  <Image
                    src={img.asset.url}
                    alt={img.alt || `${product.title} skjermbilde ${i + 1}`}
                    width={img.asset.metadata.dimensions.width}
                    height={img.asset.metadata.dimensions.height}
                    className="w-full h-auto object-cover"
                  />
                  {img.caption && (
                    <figcaption className="px-5 py-3 text-[13px] text-muted">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA / Bunnlinje ──────────────────────────────────────────── */}
      <section className="bg-black py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/60 text-sm">SalesUp Norway</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight mb-6">
            {product.externalUrl
              ? `Prøv ${product.title} i dag`
              : `Klar for ${product.title}?`}
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Bygget av SEO-spesialistene bak SalesUp. Trenger du hjelp med oppsett eller strategi, ta kontakt — vi er her.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {product.externalUrl ? (
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-8 py-4 rounded-full hover:bg-accent-dark transition-colors"
              >
                Besøk {product.title} ↗
              </a>
            ) : (
              <Link
                href="/book-analyse"
                className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-8 py-4 rounded-full hover:bg-accent-dark transition-colors"
              >
                Kom i gang →
              </Link>
            )}
            <Link
              href="/produkter"
              className="text-white/50 hover:text-white transition-colors"
            >
              ← Alle produkter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
