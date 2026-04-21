import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Ugyldig token' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ugyldig JSON' }, { status: 400 })
  }

  const { _type } = (body as Record<string, unknown>) ?? {}

  const pathMap: Record<string, string[]> = {
    service: ['/tjenester', '/tjenester/[slug]'],
    post: ['/innsikt', '/innsikt/[slug]'],
    teamMember: ['/om-oss', '/om-oss/[slug]'],
    glossaryTerm: ['/faguttrykk', '/faguttrykk/[slug]'],
    faqQuestion: ['/faq', '/faq/[slug]'],
    caseStudy: ['/resultater', '/resultater/[slug]'],
    siteSettings: ['/'],
    testimonial: ['/'],
  }

  const paths = typeof _type === 'string' ? (pathMap[_type] ?? ['/']) : ['/']

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths })
}
