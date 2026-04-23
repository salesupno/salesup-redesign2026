import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { allTeamMembersQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'Møt teamet bak SalesUp — Norges ledende SEO, AEO og GEO-byrå. Vi kombinerer dyp fagkunnskap med dokumenterte resultater.',
  alternates: { canonical: 'https://salesup.no/om-oss' },
  openGraph: {
    title: 'Om oss | SalesUp',
    description: 'Møt teamet bak SalesUp — Norges ledende SEO, AEO og GEO-byrå.',
    url: 'https://salesup.no/om-oss',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Forside', item: 'https://salesup.no' },
    { '@type': 'ListItem', position: 2, name: 'Om oss', item: 'https://salesup.no/om-oss' },
  ],
}

interface TeamMember {
  _id: string
  name: string
  slug: string
  title: string
  photo?: { asset: { _ref: string }; alt?: string }
  shortBio?: string
  expertiseAreas?: string[]
  linkedinUrl?: string
}

const fallbackTeam: TeamMember[] = [
  {
    _id: '1',
    name: 'Tommy Nilsen',
    slug: 'tommy-nilsen',
    title: 'Daglig leder & SEO-strateg',
    shortBio: '20 års erfaring med SEO og digital markedsføring. Hjelper norske bedrifter å bli synlige der kundene faktisk søker.',
    expertiseAreas: ['SEO', 'AEO', 'Innholdsstrategi', 'Lenkbygging'],
  },
]

export default async function OmOssPage() {
  let team = fallbackTeam
  try {
    const t = await client.fetch(allTeamMembersQuery)
    if (t?.length) team = t
  } catch { /* bruker fallback */ }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-cream">
        <div className="sc">
        <nav aria-label="Brødsmulesti" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-muted">
            <li><Link href="/" className="hover:text-green-deep transition-colors">Forside</Link></li>
            <li aria-hidden="true" className="text-black/20">›</li>
            <li className="text-black font-medium">Om oss</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Om oss
        </p>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-[-0.018em] max-w-[760px] mb-6">
          Menneskene bak synligheten
        </h1>
        <p className="text-[18px] font-light text-muted leading-[1.7] max-w-[560px]">
          Vi er et lite, spesialisert team med dyp fagkunnskap og én klar ambisjon: hjelpe norske
          bedrifter å bli synlige der kundene faktisk søker — i dag og i fremtiden.
        </p>
        </div>
      </section>

      {/* ─── VERDIER ───────────────────────────────────────────────── */}
      <section className="py-20 border-b border-black/8">
        <div className="sc">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Ærlighet fremfor salg', body: 'Vi anbefaler kun det som faktisk gir effekt for din situasjon — ikke det som genererer størst honorar for oss.' },
            { num: '02', title: 'Aktiv, ikke passiv', body: 'Vi gjør jobben selv. Tekniske tiltak, innhold, lenkbygging — ikke rapporter om hva som burde gjøres.' },
            { num: '03', title: 'Resultater teller', body: 'Rangeringer er pent, men leads og salg er målet. Alle tiltak knyttes til forretningseffekt.' },
          ].map((v) => (
            <div key={v.num} className="bg-cream rounded-2xl p-8">
              <span className="block font-display text-[13px] font-bold text-muted mb-4">{v.num}</span>
              <h3 className="font-display text-[20px] font-bold tracking-tight mb-3">{v.title}</h3>
              <p className="text-[15px] text-muted leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ─── TEAMGRID ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="sc">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Teamet
        </p>
        <h2 className="font-display text-[clamp(28px,3vw,44px)] tracking-[-0.012em] leading-[1.1] max-w-[560px] mb-14">
          Ekspertene som jobber for deg
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {team.map((member) => (
            <Link
              key={member._id}
              href={`/om-oss/${member.slug}`}
              className="group bg-cream hover:bg-[#E8E4DA] rounded-3xl overflow-hidden transition-colors block"
            >
              {/* Foto */}
              <div className="aspect-[4/3] bg-black/5 relative overflow-hidden">
                {member.photo?.asset ? (
                  <Image
                    src={urlFor(member.photo).width(600).height(450).url()}
                    alt={member.photo.alt || member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-deep/10">
                    <span className="font-display text-[48px] font-extrabold text-green-deep/20">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-7">
                <h3 className="font-display text-[20px] font-bold tracking-tight mb-1 group-hover:text-green-deep transition-colors">
                  {member.name}
                </h3>
                <p className="text-[13px] font-medium text-green-light mb-3">{member.title}</p>
                {member.shortBio && (
                  <p className="text-[14px] text-muted leading-relaxed line-clamp-3 mb-4">
                    {member.shortBio}
                  </p>
                )}
                {member.expertiseAreas && member.expertiseAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {member.expertiseAreas.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white text-green-deep border border-green-deep/15"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-24">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <h2 className="font-display text-[clamp(28px,3vw,44px)] tracking-[-0.012em] leading-[1.1] text-green-deep max-w-[540px]">
              Bli kjent med oss — uten forpliktelser
            </h2>
            <p className="text-[17px] font-light text-black/60 leading-[1.7] mt-4 max-w-[420px]">
              Book en gratis synlighetsanalyse og møt teamet som skal hjelpe deg å vokse.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Button href="/kontakt" variant="primary">Book gratis analyse →</Button>
            <Button href="/resultater" variant="outline-dark">Se resultater</Button>
          </div>
        </div>
      </section>
    </>
  )
}
