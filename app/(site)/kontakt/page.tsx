import Link from 'next/link'
import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Ta kontakt — book gratis synlighetsanalyse',
  description:
    'Book en gratis synlighetsanalyse med Tommy Nilsen. Få konkrete anbefalinger for SEO, AEO og GEO tilpasset din bransje — uten forpliktelser.',
  alternates: { canonical: 'https://salesup.no/kontakt' },
  openGraph: {
    title: 'Ta kontakt | SalesUp',
    description: 'Book gratis synlighetsanalyse — konkrete anbefalinger uten forpliktelser.',
    url: 'https://salesup.no/kontakt',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Kontakt', item: 'https://salesup.no/kontakt' },
  ],
}

export default function KontaktPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="pt-32 pb-16 px-6 md:px-12 xl:px-20">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">Kontakt</li>
          </ol>
        </nav>

        <div className="grid xl:grid-cols-[1fr_480px] gap-16 xl:gap-24">
          {/* ─── VENSTRE: info ─────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
              Ta kontakt
            </p>
            <h1 className="font-display text-[clamp(36px,4.5vw,60px)] leading-[1.05] tracking-[-0.018em] mb-6">
              La oss se på hva som er mulig for deg
            </h1>
            <p className="text-[17px] font-light text-muted leading-[1.75] mb-10 max-w-[480px]">
              Book en gratis synlighetsanalyse og få et ærlig bilde av situasjonen din — og hva som skal til for å nå kundene dine.
            </p>

            {/* Hva du får */}
            <div className="bg-cream rounded-3xl p-8 mb-10">
              <p className="text-[12px] font-medium tracking-[0.12em] uppercase text-green-light mb-5">
                Hva du får
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  'Gjennomgang av din nåværende synlighet',
                  'Konkrete forbedringsforslag tilpasset din bransje',
                  'Estimat på potensial og tidslinje',
                  'Ingen binder deg til noe som helst',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px]">
                    <span className="w-5 h-5 rounded-full bg-green-deep flex-shrink-0 flex items-center justify-center mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-accent">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Direktekontakt */}
            <div className="flex flex-col gap-3">
              <a href="mailto:hei@salesup.no" className="flex items-center gap-3 text-[14px] hover:text-green-deep transition-colors group">
                <span className="w-9 h-9 rounded-full bg-cream flex items-center justify-center group-hover:bg-green-pale transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                hei@salesup.no
              </a>
              <a href="tel:+4790000000" className="flex items-center gap-3 text-[14px] hover:text-green-deep transition-colors group">
                <span className="w-9 h-9 rounded-full bg-cream flex items-center justify-center group-hover:bg-green-pale transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                  </svg>
                </span>
                Ring oss
              </a>
            </div>
          </div>

          {/* ─── HØYRE: skjema ─────────────────────────────────────── */}
          <div className="bg-cream rounded-3xl p-8 md:p-10">
            <p className="text-[12px] font-medium tracking-[0.12em] uppercase text-green-light mb-6">
              Send melding
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
