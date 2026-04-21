import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { sitemapQuery } from '@/sanity/lib/queries'

const BASE = 'https://salesup.no'

interface SitemapData {
  services: { slug: string }[]
  posts: { slug: string; publishedAt?: string }[]
  teamMembers: { slug: string }[]
  glossaryTerms: { slug: string }[]
  faqQuestions: { slug: string }[]
  caseStudies: { slug: string }[]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: SitemapData = {
    services: [],
    posts: [],
    teamMembers: [],
    glossaryTerms: [],
    faqQuestions: [],
    caseStudies: [],
  }

  try {
    data = await client.fetch(sitemapQuery)
  } catch { /* bruker tom data */ }

  const now = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/tjenester`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/innsikt`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/om-oss`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/faguttrykk`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/resultater`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/kontakt`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = (data.services || []).map((s) => ({
    url: `${BASE}/tjenester/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const postRoutes: MetadataRoute.Sitemap = (data.posts || []).map((p) => ({
    url: `${BASE}/innsikt/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt).toISOString() : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const teamRoutes: MetadataRoute.Sitemap = (data.teamMembers || []).map((t) => ({
    url: `${BASE}/om-oss/${t.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  const glossaryRoutes: MetadataRoute.Sitemap = (data.glossaryTerms || []).map((g) => ({
    url: `${BASE}/faguttrykk/${g.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const faqRoutes: MetadataRoute.Sitemap = (data.faqQuestions || []).map((f) => ({
    url: `${BASE}/faq/${f.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  const caseRoutes: MetadataRoute.Sitemap = (data.caseStudies || []).map((c) => ({
    url: `${BASE}/resultater/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...postRoutes,
    ...teamRoutes,
    ...glossaryRoutes,
    ...faqRoutes,
    ...caseRoutes,
  ]
}
