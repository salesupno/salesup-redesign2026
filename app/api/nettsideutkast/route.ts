import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RECIPIENT = 'tommy@salesup.no'
const FROM = 'nettsted@salesup.no'

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>]/g, '').trim().slice(0, 2000)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
  }

  const { industry, businessName, email, website, notes, competitor1, competitor2 } =
    body as Record<string, unknown>

  const cleanIndustry = sanitize(industry)
  const cleanBusiness = sanitize(businessName)
  const cleanEmail = sanitize(email)
  const cleanWebsite = sanitize(website)
  const cleanNotes = sanitize(notes)
  const cleanC1 = sanitize(competitor1)
  const cleanC2 = sanitize(competitor2)

  if (!cleanBusiness || !cleanEmail || !cleanIndustry) {
    return NextResponse.json({ error: 'Mangler påkrevde felt' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: 'Ugyldig e-postadresse' }, { status: 400 })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Varsle Tommy
    await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      replyTo: cleanEmail,
      subject: `✦ Nytt nettsideutkast — ${cleanBusiness} (${cleanIndustry})`,
      text: [
        `NYTT NETTSIDEUTKAST`,
        `──────────────────────`,
        `Bedrift:    ${cleanBusiness}`,
        `Bransje:    ${cleanIndustry}`,
        `E-post:     ${cleanEmail}`,
        `Nettside:   ${cleanWebsite || '(ikke oppgitt)'}`,
        ``,
        `Notater:`,
        cleanNotes || '(ingen)',
        ``,
        `Konkurrenter:`,
        `  1: ${cleanC1 || '(ikke oppgitt)'}`,
        `  2: ${cleanC2 || '(ikke oppgitt)'}`,
      ].join('\n'),
    })

    // Bekreftelse til bruker
    await resend.emails.send({
      from: FROM,
      to: cleanEmail,
      subject: `Vi bygger nettsidekonseptet ditt, ${cleanBusiness.split(' ')[0]}!`,
      text: [
        `Hei!`,
        ``,
        `Takk for at du brukte SalesUps nettsideverktøy.`,
        ``,
        `Vi er nå i gang med å analysere topp 10 aktører innen "${cleanIndustry}" og setter`,
        `sammen et skreddersydd nettsidekonsept for ${cleanBusiness}.`,
        ``,
        `Du vil høre fra oss innen 24 timer.`,
        ``,
        `Mens du venter — vil du forstå hvorfor utkastet blir som det blir?`,
        `Book en gratis 30-minutters gjennomgang:`,
        `https://salesup.no/kontakt`,
        ``,
        `Beste hilsen,`,
        `Tommy`,
        `SalesUp Norway AS`,
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Kunne ikke sende e-post' }, { status: 500 })
  }
}
