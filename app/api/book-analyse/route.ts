import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RECIPIENT = 'tommy@salesup.no'
const FROM = process.env.RESEND_FROM ?? 'nettsted@salesup.no'

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>]/g, '').trim().slice(0, 2000)
}

/* ─── Parse slot → Google Calendar dates ─────────────────────────── */
// Slot format: "tirsdag-2026-05-06-1300" or "onsdag-2026-05-07-1100"
function slotToGcalDates(slot: string): { start: string; end: string; label: string } | null {
  // Extract date part: e.g. "2026-05-06" and time part "1300"
  const match = slot.match(/(\d{4}-\d{2}-\d{2})-(\d{4})$/)
  if (!match) return null

  const [, datePart, timePart] = match
  const hh = timePart.slice(0, 2)
  const mm = timePart.slice(2, 4)

  // End time = start + 30 min
  const startDate = new Date(`${datePart}T${hh}:${mm}:00`)
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000)

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, '')
      // Strip the Z — Google Calendar uses local time in URL
      .slice(0, 15)

  const label = startDate.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return {
    start: fmt(startDate),
    end: fmt(endDate),
    label: `${label} kl. ${hh}:${mm}`,
  }
}

function buildGcalLink(slot: string, name: string, company: string, email: string): string {
  const dates = slotToGcalDates(slot)
  if (!dates) return ''

  const title = encodeURIComponent(`Synlighetsanalyse — ${name} (${company})`)
  const details = encodeURIComponent(
    `Gratis synlighetsanalyse booket via salesup.no\n\nKontakt:\nNavn: ${name}\nBedrift: ${company}\nE-post: ${email}`,
  )
  const location = encodeURIComponent('Telefon / Google Meet')

  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${dates.start}/${dates.end}` +
    `&details=${details}` +
    `&location=${location}`
  )
}

/* ─── HTML email template ─────────────────────────────────────────── */
function buildHtml(fields: Record<string, string>): string {
  const {
    navn, bedrift, epost, telefon,
    bransje, stilling, maal, naa,
    slot, slotLabel, gcalLink,
    source, service,
  } = fields

  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:8px 16px 8px 0;color:#5A5F70;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;color:#02193C;font-size:13px;font-weight:600;">${value}</td>
        </tr>`
      : ''

  const bransjeLabel: Record<string, string> = {
    ehandel: 'E-handel / nettbutikk',
    lokal: 'Lokal bedrift / håndverk',
    b2b: 'B2B / fagbransje',
    helse: 'Helse & velvære',
    tech: 'Tech / SaaS',
    annet: 'Annet',
  }
  const stillingLabel: Record<string, string> = {
    eier: 'Eier / daglig leder',
    markeds: 'Markedsansvarlig',
    salg: 'Salg / vekst',
    styret: 'Styremedlem / investor',
    annet: 'Annen rolle',
  }
  const maalLabel: Record<string, string> = {
    trafikk: 'Mer organisk trafikk',
    ai: 'Bli synlig i AI-svar',
    leads: 'Flere kvalifiserte leads',
    konkurrent: 'Slå konkurrentene',
    omdoemme: 'Styrke omdømmet digitalt',
  }
  const naaLabel: Record<string, string> = {
    ingenting: 'Lite eller ingenting',
    under50: 'Under 50 000 kr/mnd',
    '50-150': '50 000–150 000 kr/mnd',
    over150: 'Over 150 000 kr/mnd',
  }

  return `<!DOCTYPE html>
<html lang="no">
<head><meta charset="utf-8"><title>Ny booking</title></head>
<body style="margin:0;padding:0;background:#F9F8F5;font-family:system-ui,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(2,25,60,0.08);">

    <!-- Header -->
    <div style="background:#02193C;padding:28px 32px;">
      <p style="margin:0;color:#D2ECA3;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">SalesUp — Ny booking</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;line-height:1.2;">
        ${navn} har booket analyse
      </h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font-size:14px;">${slotLabel}</p>
    </div>

    <!-- Tidspunkt + Gcal -->
    <div style="background:#E8F5D0;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <div>
        <p style="margin:0 0 2px;color:#3A8A52;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Avtalt tidspunkt</p>
        <p style="margin:0;color:#02193C;font-size:18px;font-weight:700;">${slotLabel}</p>
        <p style="margin:4px 0 0;color:#5A5F70;font-size:12px;">30 minutter · Telefon / Google Meet</p>
      </div>
      ${gcalLink ? `<a href="${gcalLink}" target="_blank" style="display:inline-block;background:#02193C;color:#fff;text-decoration:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:600;white-space:nowrap;">
        + Legg i Google Kalender
      </a>` : ''}
    </div>

    <!-- Kontaktinfo -->
    <div style="padding:28px 32px 0;">
      <p style="margin:0 0 12px;color:#3A8A52;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Kontaktinformasjon</p>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Navn', navn)}
        ${row('Bedrift', bedrift)}
        ${row('E-post', epost)}
        ${row('Telefon', telefon || '—')}
      </table>
    </div>

    <!-- Wizard-svar -->
    <div style="padding:24px 32px 0;">
      <p style="margin:0 0 12px;color:#3A8A52;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Fra spørsmålene</p>
      <table style="border-collapse:collapse;width:100%;">
        ${row('Bransje', bransjeLabel[bransje] ?? bransje)}
        ${row('Rolle', stillingLabel[stilling] ?? stilling)}
        ${row('Viktigste mål', maalLabel[maal] ?? maal)}
        ${row('Budsjett i dag', naaLabel[naa] ?? naa)}
      </table>
    </div>

    ${source || service ? `
    <!-- Kontekst -->
    <div style="padding:20px 32px 0;">
      <p style="margin:0 0 12px;color:#3A8A52;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Kontekst</p>
      <table style="border-collapse:collapse;width:100%;">
        ${source ? row('Kom fra', source) : ''}
        ${service ? row('Tjeneste-interesse', service) : ''}
      </table>
    </div>` : ''}

    <!-- Quick reply -->
    <div style="padding:24px 32px;">
      <a href="mailto:${epost}?subject=Din%20synlighetsanalyse%20med%20SalesUp&body=Hei%20${encodeURIComponent(navn)}%2C%0A%0AVi%20sees%20${encodeURIComponent(slotLabel)}!%0A%0AMed%20vennlig%20hilsen%2C%0ATommy"
        style="display:inline-block;background:#3A8A52;color:#fff;text-decoration:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;">
        Svar ${navn} på e-post
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;border-top:1px solid rgba(2,25,60,0.08);">
      <p style="margin:0;color:#8A8F9E;font-size:11px;">Sendt fra salesup.no · SalesUp Norway AS</p>
    </div>

  </div>
</body>
</html>`
}

/* ─── Route handler ───────────────────────────────────────────────── */
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

  const b = body as Record<string, unknown>

  const navn     = sanitize(b.navn)
  const bedrift  = sanitize(b.bedrift)
  const epost    = sanitize(b.epost)
  const telefon  = sanitize(b.telefon)
  const bransje  = sanitize(b.bransje)
  const stilling = sanitize(b.stilling)
  const maal     = sanitize(b.maal)
  const naa      = sanitize(b.naa)
  const slot     = sanitize(b.slot)
  const source   = sanitize(b.source)
  const service  = sanitize(b.service)

  // Validate required fields
  if (!navn || !bedrift || !epost) {
    return NextResponse.json({ error: 'Navn, bedrift og e-post er påkrevd.' }, { status: 400 })
  }
  if (!slot) {
    return NextResponse.json({ error: 'Velg et tidspunkt.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return NextResponse.json({ error: 'Ugyldig e-postadresse.' }, { status: 400 })
  }

  const dates = slotToGcalDates(slot)
  const slotLabel = dates?.label ?? slot
  const gcalLink = buildGcalLink(slot, navn, bedrift, epost)

  const htmlBody = buildHtml({
    navn, bedrift, epost, telefon,
    bransje, stilling, maal, naa,
    slot, slotLabel, gcalLink,
    source, service,
  })

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      replyTo: epost,
      subject: `📅 ${navn} (${bedrift}) — ${slotLabel}`,
      html: htmlBody,
      text: [
        `BOOKING: ${navn} (${bedrift})`,
        `Tidspunkt: ${slotLabel}`,
        ``,
        `E-post: ${epost}`,
        telefon ? `Telefon: ${telefon}` : '',
        ``,
        `Bransje: ${bransje}`,
        `Rolle: ${stilling}`,
        `Mål: ${maal}`,
        `Budsjett: ${naa}`,
        source ? `Kom fra: ${source}` : '',
        service ? `Tjeneste-interesse: ${service}` : '',
        ``,
        gcalLink ? `Legg i Google Kalender: ${gcalLink}` : '',
      ]
        .filter((l) => l !== undefined)
        .join('\n'),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[book-analyse API]', err)
    return NextResponse.json({ error: 'Kunne ikke sende e-post' }, { status: 500 })
  }
}
