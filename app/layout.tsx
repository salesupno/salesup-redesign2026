import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://salesup.no'),
  title: {
    default: 'SalesUp — SEO, AEO & GEO byrå Norge',
    template: '%s | SalesUp',
  },
  description:
    'SalesUp hjelper norske bedrifter å bli synlige i Google og AI-assistenter. Spesialist på SEO, AEO og GEO — aktiv organisk synlighet som gir målbare resultater.',
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'SalesUp',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://salesup.no' },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://salesup.no/#organization',
  name: 'SalesUp Norway AS',
  url: 'https://salesup.no',
  logo: { '@type': 'ImageObject', url: 'https://salesup.no/logo.png' },
  description:
    'Norsk SEO-, AEO- og GEO-byrå. Aktiv organisk synlighet som bygges, ikke leies.',
  address: { '@type': 'PostalAddress', addressCountry: 'NO' },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'tommy@salesup.no',
    contactType: 'customer service',
  },
  sameAs: ['https://www.linkedin.com/company/salesup-norway'],
  knowsAbout: [
    'SEO',
    'AEO',
    'GEO',
    'CRO',
    'søkemotoroptimalisering',
    'LLM-optimalisering',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="nb"
      className={`${syne.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  )
}
