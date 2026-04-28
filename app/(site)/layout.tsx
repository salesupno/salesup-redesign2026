import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { StickyBar } from '@/components/layout/StickyBar'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

// Fallback-data brukt til Nav og Footer inntil Sanity-innhold er satt opp
const fallbackSettings = {
  navLinks: [
    { label: 'Tjenester', href: '/tjenester' },
    { label: 'Produkter', href: '/produkter' },
    { label: 'Resultater', href: '/resultater' },
    {
      label: 'Ressurser',
      href: '#',
      children: [
        { label: 'Innsikt', href: '/innsikt', description: 'Artikler og guider om SEO, AEO og GEO' },
        { label: 'FAQ', href: '/faq', description: 'Svar på de vanligste spørsmålene' },
        { label: 'Faguttrykk', href: '/faguttrykk', description: 'Ordliste A–Å for digital markedsføring' },
        { label: 'Om oss', href: '/om-oss', description: 'Teamet bak SalesUp Norway' },
      ],
    },
  ],
  navCTA: { label: 'Book analyse', href: '/kontakt' },
  footerColumns: [
    {
      heading: 'Tjenester',
      links: [
        { label: 'SEO', href: '/tjenester/seo' },
        { label: 'AEO', href: '/tjenester/aeo' },
        { label: 'GEO', href: '/tjenester/geo' },
        { label: 'CRO', href: '/tjenester/cro' },
        { label: 'Google Ads', href: '/tjenester/google-ads' },
      ],
    },
    {
      heading: 'Selskapet',
      links: [
        { label: 'Om oss', href: '/om-oss' },
        { label: 'Resultater', href: '/resultater' },
        { label: 'Innsikt', href: '/innsikt' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      heading: 'Ressurser',
      links: [
        { label: 'Faguttrykk', href: '/faguttrykk' },
        { label: 'Kontakt', href: '/kontakt' },
        { label: 'Personvern', href: '/personvern' },
      ],
    },
  ],
  email: 'hei@salesup.no',
  phone: '+47 400 00 000',
  orgNr: '924 871 088',
  linkedinUrl: 'https://www.linkedin.com/company/salesup-norway',
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Henter siteSettings fra Sanity — graceful fallback om ingen data ennå
  let settings = null
  try {
    settings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 3600 } })
  } catch {
    // Sanity er ikke konfigurert ennå — bruk fallback
  }

  // navLinks er alltid hardkodet — Sanity støtter ikke dropdown-hierarki
  const navLinks = fallbackSettings.navLinks
  const navCTA = settings?.navCTA ?? fallbackSettings.navCTA
  const footerColumns = settings?.footerColumns ?? fallbackSettings.footerColumns
  const email = settings?.email ?? fallbackSettings.email
  const phone = settings?.phone ?? fallbackSettings.phone
  const orgNr = settings?.orgNr ?? fallbackSettings.orgNr
  const linkedinUrl = settings?.linkedinUrl ?? fallbackSettings.linkedinUrl

  return (
    <>
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>
      <Nav navLinks={navLinks} navCTA={navCTA} />
      <main id="main-content">{children}</main>
      <StickyBar />
      <Footer
        footerColumns={footerColumns}
        email={email}
        phone={phone}
        orgNr={orgNr}
        linkedinUrl={linkedinUrl}
      />
    </>
  )
}
