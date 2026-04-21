import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlere
      { userAgent: '*', allow: '/', disallow: ['/studio/', '/api/'] },
      // AI-crawlere — eksplisitt tillatt for GEO
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: 'https://salesup.no/sitemap.xml',
    host: 'https://salesup.no',
  }
}
