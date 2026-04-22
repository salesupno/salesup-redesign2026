import type { Metadata } from 'next'
import { NettsideWizard } from '@/components/tools/NettsideWizard'

export const metadata: Metadata = {
  title: 'Gratis nettsidekonsept for din bransje | SalesUp',
  description:
    'Få et gratis nettsideutkast basert på hva som faktisk ranker i din bransje. Vi analyserer topp 10 konkurrenter og sender deg et skreddersydd konsept innen 24 timer.',
  alternates: {
    canonical: 'https://salesup.no/nettsideutkast',
  },
  openGraph: {
    title: 'Gratis nettsidekonsept — se hva som ranker i din bransje',
    description:
      'Vi analyserer topp 10 i din kategori og sender deg et gratis nettsidekonsept med seksjonsstruktur og CTA-strategi. Innen 24 timer.',
    url: 'https://salesup.no/nettsideutkast',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Gratis nettsidekonsept', item: 'https://salesup.no/nettsideutkast' },
  ],
}

export default function NettsideutkastPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NettsideWizard />
    </>
  )
}
