import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personvernerklæring | SalesUp',
  description: 'Informasjon om hvordan SalesUp Norway AS behandler personopplysninger.',
  alternates: { canonical: 'https://salesup.no/personvern' },
}

export default function PersonvernPage() {
  return (
    <section className="pt-32 pb-20 px-6 md:px-12 xl:px-20">
      <nav aria-label="Brødsmulesti" className="mb-10">
        <ol className="flex items-center gap-2 text-[13px] text-muted">
          <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
          <li aria-hidden="true" className="text-black/20">›</li>
          <li className="text-black font-medium">Personvern</li>
        </ol>
      </nav>

      <div className="max-w-[760px]">
        <h1 className="font-display text-[clamp(32px,4vw,52px)] leading-[1.08] tracking-[-0.018em] mb-6">
          Personvernerklæring
        </h1>
        <p className="text-[15px] text-muted mb-10">Sist oppdatert: april 2026</p>

        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-green-deep prose-a:no-underline hover:prose-a:underline">
          <h2>1. Behandlingsansvarlig</h2>
          <p>
            SalesUp Norway AS (org.nr. 932 XXX XXX), heretter kalt «SalesUp», er behandlingsansvarlig for
            personopplysningene som samles inn via salesup.no.
          </p>
          <p>Kontakt: <a href="mailto:hei@salesup.no">hei@salesup.no</a></p>

          <h2>2. Hvilke opplysninger samler vi inn?</h2>
          <p>Når du fyller ut kontaktskjemaet samler vi inn:</p>
          <ul>
            <li>Navn</li>
            <li>Bedriftsnavn</li>
            <li>E-postadresse</li>
            <li>Innholdet i meldingen din</li>
          </ul>
          <p>
            Vi samler ikke inn sensitive personopplysninger, og vi ber ikke om mer informasjon enn nødvendig.
          </p>

          <h2>3. Formål og rettslig grunnlag</h2>
          <p>
            Opplysningene brukes utelukkende for å svare på din henvendelse og eventuelt inngå en
            avtale. Rettslig grunnlag er berettiget interesse (GDPR art. 6 nr. 1 f) og eventuelt
            oppfyllelse av avtale (art. 6 nr. 1 b).
          </p>

          <h2>4. Lagring og sletting</h2>
          <p>
            E-postkorrespondanse lagres i maks 24 måneder med mindre en avtale er inngått eller du
            ber om lengre lagring. Du kan når som helst be om sletting.
          </p>

          <h2>5. Tredjeparter</h2>
          <p>
            Vi bruker <strong>Resend</strong> (Resend Inc.) for utsending av e-post. Resend behandler
            e-postinnholdet for leveringsformål. Ingen andre tredjeparter mottar dine
            personopplysninger uten din samtykke.
          </p>
          <p>
            Nettstedet er hostet på <strong>Vercel</strong> (Vercel Inc., USA) med EU/EØS-databehandling
            i henhold til Standard Contractual Clauses.
          </p>
          <p>
            Innhold administreres via <strong>Sanity</strong> (Sanity Inc., USA) som databehandler
            under DPA.
          </p>

          <h2>6. Dine rettigheter</h2>
          <p>Du har rett til å:</p>
          <ul>
            <li>Kreve innsyn i opplysningene vi har om deg</li>
            <li>Kreve retting eller sletting</li>
            <li>Protestere mot behandlingen</li>
            <li>Klage til <a href="https://www.datatilsynet.no" target="_blank" rel="noreferrer">Datatilsynet</a></li>
          </ul>
          <p>
            Kontakt oss på <a href="mailto:hei@salesup.no">hei@salesup.no</a> for å utøve dine rettigheter.
          </p>

          <h2>7. Informasjonskapsler (cookies)</h2>
          <p>
            salesup.no bruker kun teknisk nødvendige cookies (sesjonsdata). Vi bruker ikke tredjeparts
            sporings- eller reklame-cookies.
          </p>

          <h2>8. Endringer</h2>
          <p>
            Vi forbeholder oss retten til å oppdatere denne erklæringen. Vesentlige endringer varsles
            på nettstedet. Dato for siste oppdatering fremgår øverst.
          </p>
        </div>
      </div>
    </section>
  )
}
