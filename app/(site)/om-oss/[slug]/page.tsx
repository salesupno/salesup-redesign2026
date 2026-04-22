import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { teamMemberBySlugQuery, allTeamMembersQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const members = await client.fetch(allTeamMembersQuery)
    return (members || []).map((m: { slug: string }) => ({ slug: m.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const member = await client.fetch(teamMemberBySlugQuery, { slug })
    if (!member) return {}
    return {
      title: member.metaTitle || member.name,
      description: member.metaDescription || member.shortBio,
      alternates: { canonical: `https://salesup.no/om-oss/${slug}` },
      openGraph: {
        title: `${member.name} — ${member.title} | SalesUp`,
        description: member.metaDescription || member.shortBio,
        url: `https://salesup.no/om-oss/${slug}`,
      },
    }
  } catch {
    return {}
  }
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params
  let member = null
  try {
    member = await client.fetch(teamMemberBySlugQuery, { slug })
  } catch { /* fortsetter med null */ }
  if (!member) notFound()

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://salesup.no/om-oss/${slug}#person`,
    name: member.name,
    jobTitle: member.title,
    url: `https://salesup.no/om-oss/${slug}`,
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://salesup.no/#organization',
      name: 'SalesUp Norway AS',
    },
    ...(member.photo?.asset && {
      image: urlFor(member.photo).width(400).height(400).url(),
    }),
    ...(member.linkedinUrl && { sameAs: [member.linkedinUrl] }),
    ...(member.expertiseAreas?.length && { knowsAbout: member.expertiseAreas }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
      { '@type': 'ListItem', position: 2, name: 'Om oss', item: 'https://salesup.no/om-oss' },
      { '@type': 'ListItem', position: 3, name: member.name, item: `https://salesup.no/om-oss/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-0 px-6 md:px-12 xl:px-20">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li><Link href="/om-oss" className="hover:text-green-deep transition-colors">Om oss</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">{member.name}</li>
          </ol>
        </nav>

        <div className="grid xl:grid-cols-[380px_1fr] gap-14 xl:gap-20 pb-20">
          {/* Foto */}
          <div>
            {member.photo?.asset ? (
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-cream relative">
                <Image
                  src={urlFor(member.photo).width(760).height(1013).url()}
                  alt={member.photo.alt || member.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-3xl bg-green-pale flex items-center justify-center">
                <span className="font-display text-[80px] font-extrabold text-green-deep/20">
                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
            )}

            {/* Kontakt-info */}
            <div className="mt-6 flex flex-col gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-[14px] text-muted hover:text-green-deep transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-md bg-cream flex items-center justify-center text-[10px]">@</span>
                  {member.email}
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone.replace(/\s/g, '')}`}
                  className="text-[14px] text-muted hover:text-green-deep transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-md bg-cream flex items-center justify-center text-[10px]">☎</span>
                  {member.phone}
                </a>
              )}
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-muted hover:text-green-deep transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-md bg-cream flex items-center justify-center text-[10px] font-bold">in</span>
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Innhold */}
          <div className="pt-2">
            <p className="text-[13px] font-medium text-green-light uppercase tracking-widest mb-3">
              {member.title}
            </p>
            <h1 className="font-display text-[clamp(36px,4.5vw,64px)] leading-[1.05] tracking-[-0.018em] mb-6">
              {member.name}
            </h1>

            {member.shortBio && (
              <p className="text-[18px] font-light text-muted leading-[1.75] max-w-[540px] mb-8">
                {member.shortBio}
              </p>
            )}

            {member.expertiseAreas?.length > 0 && (
              <div className="mb-10">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-black/40 mb-3">
                  Spesialkompetanse
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.expertiseAreas.map((area: string) => (
                    <span
                      key={area}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-green-pale text-green-deep border border-green-deep/15"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.yearsOfExperience && (
              <div className="inline-flex items-center gap-3 bg-cream rounded-2xl px-6 py-4 mb-10">
                <span className="font-display text-[36px] font-extrabold text-green-deep leading-none">
                  {member.yearsOfExperience}
                </span>
                <span className="text-[14px] text-muted leading-tight">
                  års erfaring<br />med digital markedsføring
                </span>
              </div>
            )}

            <Button href="/kontakt" variant="primary">
              Ta kontakt med {member.name.split(' ')[0]} →
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
