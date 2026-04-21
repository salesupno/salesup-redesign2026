import Link from 'next/link'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allProductsQuery } from '@/sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Produkter | SalesUp Norway',
  description: 'Verktøy, plugins og SaaS-produkter fra SalesUp — bygget for å gjøre SEO, AEO og konvertering enklere for norske bedrifter.',
  alternates: { canonical: 'https://salesup.no/produkter' },
  openGraph: {
    title: 'Produkter | SalesUp Norway',
    description: 'SalesUps produkter: SEOTracker, Mynk, GroundRook SEO, Pro FAQ, AI Schema Markup Pro, Interne lenker og Pro FAQ for Shopify.',
    url: 'https://salesup.no/produkter',
  },
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
  sortOrder: number
}

const categoryLabel: Record<string, string> = {
  saas: 'SaaS-verktøy',
  'wordpress-plugin': 'WordPress-plugin',
  'shopify-app': 'Shopify-app',
}

const categoryColor: Record<string, string> = {
  saas: 'bg-accent text-black',
  'wordpress-plugin': 'bg-green-pale text-green-deep',
  'shopify-app': 'bg-green-glow/20 text-green-deep',
}

const fallback: Product[] = []

export default async function ProdukterPage() {
  let products: Product[] = fallback
  try {
    products = (await client.fetch(allProductsQuery)) || []
  } catch { /* fallback */ }

  const saas = products.filter(p => p.category === 'saas')
  const wpPlugins = products.filter(p => p.category === 'wordpress-plugin')
  const shopify = products.filter(p => p.category === 'shopify-app')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Produkter', item: 'https://salesup.no/produkter' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-black pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/70 text-sm tracking-widest uppercase font-medium">Produkter</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-[0.95] mb-6">
            Verktøy bygget av<br />
            <span className="text-accent">SEO-spesialister.</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
            Vi bruker disse verktøyene selv for klienter som First Camp, Jøtul og Europris. Nå kan du bruke dem også.
          </p>
        </div>
      </section>

      {/* ─── SaaS-produkter ────────────────────────────────────────────── */}
      {saas.length > 0 && (
        <section className="bg-cream py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">SaaS-verktøy</p>
              <h2 className="font-display text-4xl text-black tracking-tight">Egne plattformer</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {saas.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WordPress-plugins ─────────────────────────────────────────── */}
      {wpPlugins.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">WordPress-plugins</p>
              <h2 className="font-display text-4xl text-black tracking-tight">SEO-maskineri for WordPress</h2>
              <p className="text-lg text-muted mt-3 max-w-2xl">
                Bygget på de samme prinsippene vi bruker for SEO-klienter — automatisert, strukturert og AI-klar.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {wpPlugins.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Shopify-apps ──────────────────────────────────────────────── */}
      {shopify.length > 0 && (
        <section className="bg-cream py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">Shopify-apper</p>
              <h2 className="font-display text-4xl text-black tracking-tight">For nettbutikker</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {shopify.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-green-deep py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight mb-6">
            Trenger du hjelp med å komme i gang?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Alle produktene er bygget av teamet bak SalesUp. Ta kontakt — vi hjelper deg med oppsett, integrasjon og strategi.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-accent text-black font-semibold px-8 py-4 rounded-full hover:bg-accent-dark transition-colors"
          >
            Ta kontakt →
          </Link>
        </div>
      </section>
    </>
  )
}

function ProductCard({ product }: { product: Product }) {
  const isExternal = !!product.externalUrl
  const href = isExternal ? product.externalUrl! : `/produkter/${product.slug}`
  const catColor = categoryColor[product.category] || 'bg-green-pale text-green-deep'

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex flex-col bg-white border border-black/8 rounded-3xl p-8 hover:border-green-mid hover:shadow-xl transition-all duration-300"
    >
      {/* Badge */}
      <div className="flex items-start justify-between mb-6">
        <span className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full ${catColor}`}>
          {product.badge || categoryLabel[product.category]}
        </span>
        {isExternal && (
          <span className="text-muted text-sm group-hover:text-green-mid transition-colors">
            ekstern ↗
          </span>
        )}
      </div>

      {/* Title + tagline */}
      <h3 className="font-display text-2xl text-black tracking-tight mb-3 group-hover:text-green-deep transition-colors">
        {product.title}
      </h3>
      <p className="text-muted text-base leading-relaxed mb-6 flex-grow">
        {product.tagline}
      </p>

      {/* Features preview */}
      {product.features && product.features.length > 0 && (
        <ul className="space-y-2 mb-8">
          {product.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-black/70">
              <span className="text-green-light mt-0.5 flex-shrink-0">✓</span>
              <span>{f.title}</span>
            </li>
          ))}
          {product.features.length > 3 && (
            <li className="text-sm text-muted pl-5">+{product.features.length - 3} til</li>
          )}
        </ul>
      )}

      {/* Pitch / CTA */}
      <div className="mt-auto pt-4 border-t border-black/8">
        <p className="text-sm font-semibold text-green-deep group-hover:text-green-mid transition-colors">
          {product.pitch || `Les mer om ${product.title} →`}
        </p>
      </div>
    </a>
  )
}
