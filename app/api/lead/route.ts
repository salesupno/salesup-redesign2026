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

  const { name, company, email, message } = body as Record<string, unknown>

  const cleanName = sanitize(name)
  const cleanCompany = sanitize(company)
  const cleanEmail = sanitize(email)
  const cleanMessage = sanitize(message)

  // Valider
  if (!cleanName || !cleanCompany || !cleanEmail || !cleanMessage) {
    return NextResponse.json({ error: 'Alle felter er påkrevd' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: 'Ugyldig e-postadresse' }, { status: 400 })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      replyTo: cleanEmail,
      subject: `Ny henvendelse fra ${cleanName} (${cleanCompany})`,
      text: [
        `Navn: ${cleanName}`,
        `Bedrift: ${cleanCompany}`,
        `E-post: ${cleanEmail}`,
        '',
        cleanMessage,
      ].join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Kunne ikke sende e-post' }, { status: 500 })
  }
}
