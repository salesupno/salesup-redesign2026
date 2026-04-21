import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

function getWriteClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
  })
}

interface GlossaryTermInput {
  term: string
  slug?: string
  shortDefinition: string
  fullDefinition?: string
  category?: string
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.GLOSSARY_IMPORT_SECRET || secret !== process.env.GLOSSARY_IMPORT_SECRET) {
    return NextResponse.json({ error: 'Ugyldig token' }, { status: 401 })
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json({ error: 'SANITY_WRITE_TOKEN mangler' }, { status: 500 })
  }

  let terms: unknown
  try {
    terms = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ugyldig JSON' }, { status: 400 })
  }

  if (!Array.isArray(terms)) {
    return NextResponse.json({ error: 'Forventet et array av faguttrykk' }, { status: 400 })
  }

  const results = { created: 0, skipped: 0, errors: [] as string[] }
  const writeClient = getWriteClient()

  for (const item of terms) {
    if (typeof item !== 'object' || item === null) continue
    const t = item as GlossaryTermInput

    if (!t.term?.trim() || !t.shortDefinition?.trim()) {
      results.skipped++
      continue
    }

    const slug = t.slug?.trim() || toSlug(t.term)

    try {
      // Sjekk om det allerede finnes
      const existing = await writeClient.fetch(
        `*[_type == "glossaryTerm" && slug.current == $slug][0]._id`,
        { slug }
      )
      if (existing) { results.skipped++; continue }

      await writeClient.create({
        _type: 'glossaryTerm',
        term: t.term.trim(),
        slug: { _type: 'slug', current: slug },
        shortDefinition: t.shortDefinition.trim(),
        ...(t.fullDefinition && {
          fullDefinition: [
            {
              _type: 'block',
              _key: `block-${slug}`,
              style: 'normal',
              children: [{ _type: 'span', _key: `span-${slug}`, text: t.fullDefinition.trim() }],
            },
          ],
        }),
        ...(t.category && { category: t.category.trim() }),
      })
      results.created++
    } catch (err) {
      results.errors.push(`${t.term}: ${err instanceof Error ? err.message : 'ukjent feil'}`)
    }
  }

  return NextResponse.json(results)
}
