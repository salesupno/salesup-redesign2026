import Link from 'next/link'
import { Logo } from '@/components/Logo'

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  heading: string
  links: FooterLink[]
}

interface FooterProps {
  footerColumns: FooterColumn[]
  email: string
  phone: string
  orgNr: string
  linkedinUrl?: string
}

export function Footer({ footerColumns, email, phone, orgNr, linkedinUrl }: FooterProps) {
  return (
    <footer className="bg-black text-white">
      {/* Hoved-grid */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr] gap-12 xl:gap-16">
          {/* Brand-kolonne */}
          <div>
            <Logo variant="light" width={120} />
            <p className="mt-6 text-[14px] text-white/60 leading-relaxed max-w-xs">
              Norges ledende byrå for SEO, AEO og GEO. Vi bygger organisk synlighet som varer.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={`mailto:${email}`}
                className="text-[14px] text-white/60 hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="text-[14px] text-white/60 hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.25a16 16 0 0 0 6.29 6.29l1.31-1.31a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16.5l.42.42z" />
                </svg>
                {phone}
              </a>
            </div>
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
            )}
          </div>

          {/* Dynamiske kolonner fra Sanity */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[12px] font-medium tracking-[0.12em] uppercase text-white/40 mb-5">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bunnen */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/35">
            © {new Date().getFullYear()} SalesUp Norway AS · Org.nr. {orgNr}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/personvern" className="text-[13px] text-white/35 hover:text-white/70 transition-colors">
              Personvern
            </Link>
            <Link href="/kontakt" className="text-[13px] text-white/35 hover:text-white/70 transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
