import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { allServicesQuery, featuredTestimonialsQuery, siteSettingsQuery, aiCitationsQuery, allTeamMembersQuery } from '@/sanity/lib/queries'
import type { SanityCitation } from '@/components/hero/AICitationFeed'
import { Button } from '@/components/ui/Button'
import { AICitationFeed } from '@/components/hero/AICitationFeed'
import { HeroPanel } from '@/components/home/HeroPanel'
import { VisibilityQuiz } from '@/components/sections/VisibilityQuiz'
import { ROICalculator } from '@/components/sections/ROICalculator'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 3600

// ─── Fallback-data ─────────────────────────────────────────────────────────────
const fallbackServices = [
  {
    _id: '1',
    title: 'Søkemotoroptimalisering',
    slug: 'seo',
    shortCode: 'SEO',
    tagline: 'Teknisk SEO, innholdsstrategi og aktiv lenkbygging.',
    heroIngress: 'Bli funnet av de som faktisk leter etter det du tilbyr.',
    tags: ['Teknisk SEO', 'On-site', 'Lenkbygging'],
  },
  {
    _id: '2',
    title: 'AI-svarsoptimalisering',
    slug: 'aeo',
    shortCode: 'AEO',
    tagline: 'Bli svaret AI-assistentene gir i din bransje.',
    heroIngress: 'Optimaliser innholdet ditt for ChatGPT, Perplexity og Gemini.',
    tags: ['ChatGPT', 'Perplexity', 'Strukturert data'],
  },
  {
    _id: '3',
    title: 'Generativ synlighet',
    slug: 'geo',
    shortCode: 'GEO',
    tagline: 'Tilstedeværelse i alle AI-genererte svar.',
    heroIngress: 'Fremtidens synlighet starter nå — vi posisjonerer deg der AI henter informasjon.',
    tags: ['GEO', 'AI-kanaler', 'Autoritet'],
  },
  {
    _id: '4',
    title: 'Konverteringsoptimalisering',
    slug: 'cro',
    shortCode: 'CRO',
    tagline: 'Gjør trafikken om til faktiske leads og salg.',
    heroIngress: 'Vi analyserer brukeratferd og bygger konverteringssystemer som virker.',
    tags: ['A/B-testing', 'CRO', 'UX'],
  },
  {
    _id: '5',
    title: 'Google Ads',
    slug: 'google-ads',
    shortCode: 'ADS',
    tagline: 'Betalt synlighet som forsterker den organiske.',
    heroIngress: 'Presise Google Ads-kampanjer med fokus på ROAS, ikke bare klikk.',
    tags: ['Google Ads', 'PPC', 'ROAS'],
  },
  {
    _id: '6',
    title: 'WordPress & Teknisk plattform',
    slug: 'wordpress',
    shortCode: 'WP',
    tagline: 'Rask, teknisk solid plattform for SEO-vekst.',
    heroIngress: 'Core Web Vitals, sikkerhet og SEO-arkitektur bakt inn fra start.',
    tags: ['WordPress', 'Core Web Vitals', 'Teknisk'],
  },
]

const fallbackTestimonials = [
  {
    _id: 't1',
    quote:
      'Vi hadde ikke trodd at SEO kunne gjøre så stor forskjell for et lokalt håndverkerfirma. SalesUp skjønte bransjen vår og resultatet taler for seg selv.',
    author: 'Daglig leder',
    company: 'Smart Varme',
    authorTitle: 'Daglig leder',
  },
  {
    _id: 't2',
    quote:
      'SalesUp hjalp oss med å øke organisk trafikk med 21,9 % på 6 måneder. Andelen salg fra organisk søk og AI har gått fra 30 % til 41 % på 12 måneder.',
    author: 'Digital Manager',
    company: 'First Camp',
    authorTitle: 'Digital Manager',
  },
  {
    _id: 't3',
    quote:
      'Endelig en partner som snakker om leads og salg — ikke bare søkeord og rangeringer. Resultatorientert fra dag én.',
    author: 'Gründer & CEO',
    company: 'Vekstbedrift',
    authorTitle: 'CEO',
  },
]

const fallbackProcessSteps = [
  {
    num: '01',
    title: 'Synlighetsanalyse & gap-kartlegging',
    body: 'Vi ser på hele det digitale fotavtrykket ditt — Google, AI-kanaler og konkurrentlandskapet.',
  },
  {
    num: '02',
    title: 'Strategi på tvers av SEO, AEO og GEO',
    body: 'Én koordinert plan — ikke tre separate siloer.',
  },
  {
    num: '03',
    title: 'Aktiv implementering og lenkbygging',
    body: 'Vi gjør jobben. Innhold, tekniske tiltak og ekte ubetalte lenker.',
  },
  {
    num: '04',
    title: 'Rapportering på det som betyr noe',
    body: 'Rangeringer, trafikk og faktiske leads — ikke bare aktivitetsrapporter.',
  },
]

const fallbackMetrics = [
  { value: '100+', label: 'kunder hjulpet' },
  { value: '12 år', label: 'SEO-erfaring' },
  { value: '5× ROAS', label: 'dokumentert snitt' },
]

interface HomepageTeamMember {
  _id: string
  name: string
  slug: string
  title: string
  photo?: { asset: { _id?: string; _ref?: string; url?: string }; alt?: string } | null
}

const fallbackHomepageTeam: HomepageTeamMember[] = [
  { _id: 'ht1', name: 'Tommy van Wallinga', slug: 'tommy-van-wallinga', title: 'Kommunikasjon & SEO', photo: null },
  { _id: 'ht2', name: 'Erlend Osberg Nilsen', slug: 'erlend-osberg-nilsen', title: 'Kundereise-ekspert', photo: null },
]

export default async function HomePage() {
  let services = fallbackServices
  let testimonials = fallbackTestimonials
  let urgencyText = '2 ledige analyseplasser denne uken'
  let citations: SanityCitation[] = []
  let homepageTeam: HomepageTeamMember[] = fallbackHomepageTeam
  let processSteps = fallbackProcessSteps
  let metrics = fallbackMetrics
  let heroBadge = 'Norges første SEO + AEO + GEO-byrå'
  let heroHeading = 'Synlighet som bygges,'
  let heroHeadingAccent = 'ikke leies.'
  let heroIngress = 'Vi hjelper ambisiøse bedrifter å bli funnet — i Google, i AI-assistenter og på tvers av alle kanaler der kundene faktisk søker.'
  let heroPrimaryCTA = { label: 'Få gratis synlighetsanalyse →', href: '/kontakt' }
  let heroSecondaryCTA = { label: 'Se resultater', href: '/resultater' }
  let featuredCaseClientName = 'Smart Varme'
  let featuredCaseStat = '+280%'
  let featuredCaseStatLabel = 'økning i organisk trafikk over 9 måneder'
  let featuredCaseQuote = 'Vi hadde ikke trodd at SEO kunne gjøre så stor forskjell for et lokalt håndverkerfirma. SalesUp skjønte bransjen vår og resultatet taler for seg selv.'
  let featuredCaseAuthor = 'Daglig leder, Smart Varme'
  let featuredCaseSlug = 'smart-varme'

  try {
    const [s, t, settings, cit, teamData] = await Promise.all([
      client.fetch(allServicesQuery),
      client.fetch(featuredTestimonialsQuery),
      client.fetch(siteSettingsQuery),
      client.fetch(aiCitationsQuery),
      client.fetch(allTeamMembersQuery),
    ])
    if (s?.length) services = s
    if (t?.length) testimonials = t
    if (cit?.length) citations = cit
    if (teamData?.length) homepageTeam = teamData.slice(0, 2)
    if (settings) {
      if (settings.urgencyText) urgencyText = settings.urgencyText
      if (settings.heroBadge) heroBadge = settings.heroBadge
      if (settings.heroHeading) heroHeading = settings.heroHeading
      if (settings.heroHeadingAccent) heroHeadingAccent = settings.heroHeadingAccent
      if (settings.heroIngress) heroIngress = settings.heroIngress
      if (settings.heroPrimaryCTA?.label) heroPrimaryCTA = settings.heroPrimaryCTA
      if (settings.heroSecondaryCTA?.label) heroSecondaryCTA = settings.heroSecondaryCTA
      if (settings.metrics?.length) metrics = settings.metrics
      if (settings.processSteps?.length) processSteps = settings.processSteps
      if (settings.featuredCaseClientName) featuredCaseClientName = settings.featuredCaseClientName
      if (settings.featuredCaseStat) featuredCaseStat = settings.featuredCaseStat
      if (settings.featuredCaseStatLabel) featuredCaseStatLabel = settings.featuredCaseStatLabel
      if (settings.featuredCaseQuote) featuredCaseQuote = settings.featuredCaseQuote
      if (settings.featuredCaseAuthor) featuredCaseAuthor = settings.featuredCaseAuthor
      if (settings.featuredCaseSlug) featuredCaseSlug = settings.featuredCaseSlug
    }
  } catch {
    // Bruker fallback
  }

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="grid xl:grid-cols-2 pt-16 max-w-[1200px] mx-auto">
        {/* Venstre */}
        <div className="flex flex-col justify-center px-6 md:px-12 xl:px-20 pt-20 pb-16 xl:pt-24 xl:pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cream border border-black/10 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-green-deep mb-9 w-fit">
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-light animate-[pulse-dot_2s_ease-in-out_infinite]"
              aria-hidden="true"
            />
            {heroBadge}
          </div>

          {/* H1 */}
          <h1 className="font-display text-[clamp(44px,5.5vw,72px)] leading-[1.05] tracking-[-0.018em] mb-7">
            {heroHeading}{' '}
            <em className="not-italic text-green-deep relative inline-block">
              {heroHeadingAccent}
              <span
                className="absolute left-0 right-0 bottom-1 h-[3px] rounded-sm bg-accent"
                aria-hidden="true"
              />
            </em>
          </h1>

          {/* Ingress */}
          <p className="text-[18px] font-light text-muted leading-[1.7] max-w-[480px] mb-11">
            {heroIngress}
          </p>

          {/* CTAs */}
          <div id="hero-cta" className="flex flex-col gap-4">
            <UrgencyBadge text={urgencyText} variant="light" />
            <div className="flex flex-wrap gap-4 items-center">
            <Button href={heroPrimaryCTA.href} variant="primary">
              {heroPrimaryCTA.label}
            </Button>
            <Button href={heroSecondaryCTA.href} variant="ghost">
              {heroSecondaryCTA.label}
            </Button>
            </div>
          </div>

          {/* Metrikker */}
          <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-black/10">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="font-display text-[36px] font-extrabold tracking-[-0.012em] text-green-deep leading-none">
                  {m.value}
                </div>
                <div className="text-[13px] text-muted mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Høyre — Visibility panel */}
        <div className="hidden xl:block border-l border-black/8 overflow-hidden">
          <HeroPanel />
        </div>
      </section>

      {/* ─── RESULTATER ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="resultater-heading" className="bg-green-deep py-24 xl:py-28">
        <div className="sc">
          <div className="grid xl:grid-cols-2 gap-8 xl:gap-12 items-end mb-12">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent/70 mb-4">
                Resultater
              </p>
              <h2
                id="resultater-heading"
                className="font-display text-[clamp(36px,4.5vw,60px)] tracking-[-0.018em] leading-[1.06] text-white"
              >
                Resultater.<br className="hidden xl:block" /> Ikke løfter.
              </h2>
            </div>
            <p className="text-[17px] font-light text-white/55 leading-[1.7] max-w-[480px]">
              Her er konkret arbeid og målbare tall fra noen av kundene vi jobber med. Tallene er
              ekte, perioden er oppgitt, og metoden er lik på tvers — Aktiv SEO + AEO + CRO.
            </p>
          </div>

          {/* Featured case */}
          <div className="bg-white/6 border border-white/10 rounded-3xl overflow-hidden mb-4">
            <div className="grid xl:grid-cols-[1.15fr_1fr]">
              <div className="p-9 xl:p-12 border-b xl:border-b-0 xl:border-r border-white/10">
                <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-white/60 mb-7">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-glow" />
                  Hovedcase · Reise &amp; opplevelser
                </div>
                <h3 className="font-display text-[clamp(20px,2vw,28px)] font-bold tracking-tight text-white leading-[1.2] mb-4">
                  First Camp — Skandinavias største campingkjede.
                </h3>
                <p className="text-[14px] text-white/55 leading-[1.7] mb-8">
                  First Camp ønsket å øke andelen salg fra organiske flater og bygge sterkere
                  digital troverdighet i møte med nye søkevaner. SEO måtte fungere sammen med
                  AI-baserte søkeresultater — ikke bare trafikk, men reelt salg.
                </p>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Marked', value: 'Sverige & Danmark' },
                    { label: 'Tjeneste', value: 'Aktiv SEO + AEO' },
                    { label: 'Periode', value: '12 måneder' },
                    { label: 'Status', value: 'Pågående' },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">
                        {item.label}
                      </dt>
                      <dd className="text-[14px] font-medium text-white/80">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="p-9 xl:p-12 flex flex-col">
                <div className="mb-6">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/35 mb-3">
                    Andel salg fra SEO + AI
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display text-[56px] font-extrabold tracking-[-0.02em] text-accent leading-none">
                      +37%
                    </span>
                  </div>
                  <p className="text-[13px] text-white/40">Vekst i organisk salgsandel · 30% → 41%</p>
                </div>
                {/* Sparkline */}
                <div className="rounded-xl bg-white/5 border border-white/8 p-4 mb-5 flex-1 flex items-center">
                  <svg viewBox="0 0 220 55" className="w-full h-12" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D2ECA3" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#D2ECA3" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 C30,48 55,44 80,38 C105,32 130,24 155,16 C175,10 195,6 220,3"
                      stroke="#D2ECA3"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,50 C30,48 55,44 80,38 C105,32 130,24 155,16 C175,10 195,6 220,3 L220,55 L0,55 Z"
                      fill="url(#sparkGrad)"
                    />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/6 border border-white/10 rounded-xl p-4">
                    <div className="font-display text-[26px] font-extrabold text-white leading-none mb-1">
                      2.4<span className="text-[15px]">×</span>
                    </div>
                    <div className="text-[11px] text-white/45">Organiske klikk</div>
                    <div className="text-[10px] text-accent/65 mt-1">↑ vs. baseline</div>
                  </div>
                  <div className="bg-white/6 border border-white/10 rounded-xl p-4">
                    <div className="font-display text-[26px] font-extrabold text-white leading-none mb-1">
                      8<span className="text-[15px]">/10</span>
                    </div>
                    <div className="text-[11px] text-white/45">AI-sitater</div>
                    <div className="text-[10px] text-accent/65 mt-1">↑ ChatGPT + Perplexity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini cases */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              {
                tag: 'Retail',
                name: 'Europris',
                desc: 'Strategisk SEO og innholdsarbeid på en av Norges største retail-plattformer. Doblet trafikk på 12 måneder.',
                stat: '+1M',
                statLabel: 'flere klikk · 12 mnd',
              },
              {
                tag: 'B2C / E-handel',
                name: 'SparMAX',
                desc: 'Konvertering, kundereise og lokal synlighet. Doblet konverteringsrate på nøkkel-kategorier.',
                stat: '2.0×',
                statLabel: 'konverteringsrate',
              },
            ].map((c) => (
              <div
                key={c.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 flex items-start justify-between gap-6"
              >
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/35 mb-1">
                    {c.tag}
                  </p>
                  <h4 className="font-display text-[19px] font-bold text-white mb-2">{c.name}</h4>
                  <p className="text-[13px] text-white/50 leading-[1.65]">{c.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-display text-[30px] font-extrabold text-accent leading-none">
                    {c.stat}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1 whitespace-nowrap">{c.statLabel}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/resultater"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/55 hover:text-white transition-colors"
          >
            Se alle kundecaser
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7h8M8 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── TJENESTER ─────────────────────────────────────────────────────── */}
      <section className="bg-cream py-24 xl:py-28">
        <div className="sc">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Tjenester
        </p>
        <h2 className="font-display text-[clamp(32px,3.5vw,52px)] tracking-[-0.012em] leading-[1.1] max-w-[660px] mb-5">
          Alt du trenger for aktiv organisk synlighet
        </h2>
        <p className="text-[18px] font-light text-muted max-w-[520px] leading-[1.7] mb-16">
          Vi kombinerer tradisjonell SEO med AI-drevet synlighet og konverteringsoptimalisering —
          alt koordinert som én strategi.
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 rounded-2xl overflow-hidden"
          style={{ gap: '2px', background: 'var(--color-border)' }}
        >
          {services.map((s) => (
            <Link
              key={s._id}
              href={`/tjenester/${s.slug}`}
              className="group bg-white hover:bg-[#F0EDE4] px-10 py-11 transition-colors block"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-deep flex items-center justify-center mb-7 font-display font-extrabold text-[13px] text-accent tracking-tight">
                {s.shortCode}
              </div>
              <h3 className="font-display text-[22px] font-bold tracking-tight mb-3">
                {s.title}
              </h3>
              <p className="text-[15px] text-muted leading-relaxed mb-7">
                {s.heroIngress || s.tagline}
              </p>
              {s.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(s.tags as string[]).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-cream text-green-deep border border-green-deep/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* ─── AEO / AI SYNLIGHET ────────────────────────────────────────────── */}
      <section aria-labelledby="aeo-heading" className="py-24 xl:py-28">
        <div className="sc">
          <div className="grid xl:grid-cols-2 gap-12 xl:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-cream border border-black/10 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-green-deep mb-7">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-light" />
                AEO · Answer Engine Optimization
              </div>
              <h2
                id="aeo-heading"
                className="font-display text-[clamp(32px,3.8vw,52px)] tracking-[-0.016em] leading-[1.1] mb-6"
              >
                Slik svarer AI om bedriften din.
              </h2>
              <p className="text-[18px] font-light text-muted leading-[1.7] mb-8">
                Når kundene spør ChatGPT, Perplexity eller Gemini — er du svaret? Vi måler,
                optimaliserer og monitorerer hvordan AI-modellene omtaler merkevaren din.
              </p>
              <ul className="flex flex-col gap-3 mb-10" role="list">
                {[
                  'Kartlegger om du nevnes i AI-svar i din bransje',
                  'Optimaliserer innhold og struktur for AI-kildestatus',
                  'Monitorerer sitater ukentlig på tvers av modeller',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-black/70">
                    <span
                      aria-hidden="true"
                      className="w-5 h-5 rounded-full bg-green-pale flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="#3A8A52"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button href="/tjenester/aeo" variant="primary">
                Les om AEO →
              </Button>
            </div>
            {/* Right: live citation feed */}
            <div className="bg-white rounded-2xl border border-black/8 overflow-hidden shadow-[0_4px_32px_-8px_rgba(2,25,60,0.10)] h-[520px]">
              <AICitationFeed seedCitations={citations} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SAMMENLIGNING ───────────────────────────────────────────────────── */}
      <section aria-labelledby="sammenligning-heading" className="bg-cream py-24 xl:py-28">
        <div className="sc">
          <div className="grid xl:grid-cols-2 gap-8 xl:gap-12 items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-green-deep mb-6">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-light" />
                Sammenligning
              </div>
              <h2
                id="sammenligning-heading"
                className="font-display text-[clamp(32px,3.8vw,52px)] tracking-[-0.016em] leading-[1.1]"
              >
                SalesUp vs.<br className="hidden xl:block" /> tradisjonelle byråer.
              </h2>
            </div>
            <p className="text-[17px] font-light text-muted leading-[1.7] max-w-[440px]">
              Forskjellen er ikke prislappen — det er metoden. Vi har bygd om hele leveransemodellen
              rundt hvordan moderne søk faktisk fungerer.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_2px_20px_-6px_rgba(2,25,60,0.08)]">
            <table
              className="w-full min-w-[600px]"
              aria-labelledby="sammenligning-heading"
            >
              <caption className="sr-only">
                Sammenligning mellom SalesUp Aktiv SEO + AEO og klassisk SEO-byrå-modell
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-left px-7 py-5 text-[11px] font-semibold tracking-[0.14em] uppercase text-black/35 w-[40%]"
                  >
                    Egenskap
                  </th>
                  <th scope="col" className="px-6 py-5 bg-green-deep rounded-tl-xl w-[30%]">
                    <div className="text-center">
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/50 mb-1.5">
                        SalesUp
                      </p>
                      <p className="font-display text-[16px] font-bold text-white flex items-center justify-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-accent inline-block"
                        />
                        Aktiv SEO + AEO
                      </p>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-5 text-center w-[30%]">
                    <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-black/35 mb-1.5">
                      Tradisjonelt byrå
                    </p>
                    <p className="font-display text-[16px] font-medium text-black/50">
                      Klassisk SEO-modell
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Optimaliserer for AI-svar (ChatGPT, Perplexity)',
                    us: { yes: true, text: 'Innebygd i metoden' },
                    them: { yes: false, text: 'Sjelden eller aldri' },
                  },
                  {
                    feature: 'Ukentlig autoritetsbygging',
                    us: { yes: true, text: 'Aktiv SEO — fast løpende' },
                    them: { yes: false, text: 'Kvartalsvis kampanje' },
                  },
                  {
                    feature: 'Live dashboards på rangering & sitater',
                    us: { yes: true, text: '24/7 tilgang' },
                    them: { yes: false, text: 'Månedlig PDF-rapport' },
                  },
                  {
                    feature: 'Konvertering (CRO) i samme team',
                    us: { yes: true, text: 'Felles strateg' },
                    them: { yes: false, text: 'Eget byrå / silo' },
                  },
                  {
                    feature: 'Lokal synlighet (GEO)',
                    us: { yes: true, text: 'Multi-lokasjon styring' },
                    them: { yes: true, text: 'Ofte tilleggstjeneste' },
                  },
                  {
                    feature: 'Bindingstid',
                    us: { yes: true, text: 'Ingen — månedlig' },
                    them: { yes: false, text: '12 mnd standard' },
                  },
                  {
                    feature: 'Direkte tilgang til strateg',
                    us: { yes: true, text: 'Daglig kontakt' },
                    them: { yes: false, text: 'Via konsulent' },
                  },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-black/[0.02]'}>
                    <td className="px-7 py-4 text-[14px] text-black/70 border-t border-black/6">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 bg-green-deep/5 border-t border-green-deep/10">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            row.us.yes
                              ? 'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-light/15 text-green-light'
                              : 'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-red-50 text-red-400'
                          }
                          aria-label={row.us.yes ? 'Ja' : 'Nei'}
                        >
                          {row.us.yes ? (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 4l3 3 5-6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 1l6 6M7 1L1 7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="text-[13px] font-medium text-green-deep">{row.us.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-t border-black/6">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            row.them.yes
                              ? 'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-light/15 text-green-light'
                              : 'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-red-50 text-red-400'
                          }
                          aria-label={row.them.yes ? 'Ja' : 'Nei'}
                        >
                          {row.them.yes ? (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 4l3 3 5-6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 1l6 6M7 1L1 7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="text-[13px] text-black/50">{row.them.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/book-analyse" variant="primary">
              Book gratis analyse →
            </Button>
            <Button href="/tjenester" variant="outline-dark">
              Se alle tjenester
            </Button>
          </div>
        </div>
      </section>

      {/* ─── SLIK JOBBER VI ────────────────────────────────────────────────── */}
      <section className="py-24 xl:py-28">
        <div className="sc">
        <div className="grid xl:grid-cols-2 gap-16 xl:gap-20 items-start">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
              Slik jobber vi
            </p>
            <h2 className="font-display text-[clamp(32px,3.5vw,52px)] tracking-[-0.012em] leading-[1.1] mb-5">
              Aktiv synlighet er et system, ikke et stunt
            </h2>
            <p className="text-[18px] font-light text-muted leading-[1.7] mb-14">
              Vi bygger synlighet metodisk — som infrastruktur, ikke enkeltaksjoner.
            </p>

            <div className="flex flex-col">
              {processSteps.map((step, i) => (
                <div key={step.num} className="flex gap-6 pb-10 relative">
                  {i < processSteps.length - 1 && (
                    <div
                      className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-black/8"
                      aria-hidden="true"
                    />
                  )}
                  <div className="w-10 h-10 rounded-full border-2 border-green-deep flex items-center justify-center font-display text-[13px] font-bold text-green-deep shrink-0 bg-white">
                    {step.num}
                  </div>
                  <div className="pt-1.5">
                    <h4 className="font-display text-[18px] font-bold tracking-tight mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[15px] text-muted leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case-kort */}
          <div className="xl:sticky xl:top-24">
            <div className="bg-green-deep rounded-3xl p-10 text-white">
              <p className="font-display font-extrabold text-[22px] tracking-tight text-white/50 mb-8">
                {featuredCaseClientName}
              </p>
              <div className="mb-8">
                <span className="font-display text-[64px] font-extrabold tracking-[-0.02em] text-accent leading-none block">
                  {featuredCaseStat}
                </span>
                <span className="text-[14px] text-white/55 mt-1.5 block">
                  {featuredCaseStatLabel}
                </span>
              </div>
              <blockquote className="border-t border-white/12 pt-6">
                <p className="text-[15px] font-light text-white/70 leading-[1.7] italic">
                  &quot;{featuredCaseQuote}&quot;
                </p>
                <footer className="text-[13px] font-medium text-white/40 mt-3">
                  — {featuredCaseAuthor}
                </footer>
              </blockquote>
              <div className="mt-8">
                <Button href={`/resultater/${featuredCaseSlug}`} variant="outline-white">
                  Se alle resultater →
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ─── TEAM ────────────────────────────────────────────────────────────── */}
      <section aria-labelledby="team-heading" className="py-24 xl:py-28">
        <div className="sc">
          <div className="grid xl:grid-cols-2 gap-8 xl:gap-12 items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-cream border border-black/10 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-green-deep mb-6">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green-light" />
                Team
              </div>
              <h2
                id="team-heading"
                className="font-display text-[clamp(32px,3.8vw,52px)] tracking-[-0.016em] leading-[1.1]"
              >
                Ansiktene bak resultatene.
              </h2>
            </div>
            <p className="text-[17px] font-light text-muted leading-[1.7] max-w-[460px]">
              Du jobber direkte med strategen som styrer arbeidet ditt — ingen mellomledd. Liten nok
              til å være tilgjengelig, stor nok til å levere på tvers av disipliner.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {homepageTeam.slice(0, 2).map((member) => (
              <Link
                key={member._id}
                href={`/om-oss/${member.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] block bg-green-deep/8"
                aria-label={`${member.name} — ${member.title}`}
              >
                {member.photo?.asset ? (
                  <Image
                    src={urlFor(member.photo).width(600).height(800).url()}
                    alt={member.photo.alt || member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-deep/15 to-green-deep/5">
                    <span className="font-display text-[72px] font-extrabold text-green-deep/20 select-none">
                      {member.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/50 mb-1">
                    {member.title}
                  </p>
                  <p className="font-display text-[20px] font-bold text-white">{member.name}</p>
                </div>
              </Link>
            ))}
            {/* Karriere-kort */}
            <div className="bg-cream border border-black/8 rounded-2xl p-10 flex flex-col justify-between aspect-[3/4]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-black/35 mb-6">
                  Karriere
                </p>
                <h3 className="font-display text-[clamp(22px,2.5vw,32px)] font-bold tracking-tight leading-[1.15]">
                  Vi søker en SEO-spesialist.
                </h3>
              </div>
              <Button href="/om-oss#karriere" variant="primary">
                Se stilling →
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/om-oss"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-black/50 hover:text-green-deep transition-colors"
            >
              Møt hele teamet
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SYNLIGHETSSJEKK-QUIZ ────────────────────────────────────────────── */}
      <VisibilityQuiz urgencyText={urgencyText} />

      {/* ─── NETTSIDEUTKAST TEASER ───────────────────────────────────────────── */}
      <section className="bg-green-deep py-24 xl:py-28">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-12">
          <div className="max-w-[580px]">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-4">
              Gratis verktøy
            </p>
            <h2 className="font-display text-[clamp(28px,3.5vw,48px)] tracking-[-0.012em] leading-[1.1] text-white mb-5">
              Se nettsiden konkurrentene dine ønsker de hadde
            </h2>
            <p className="text-[17px] font-light text-white/65 leading-[1.7] mb-3">
              Vi analyserer topp&nbsp;10 i din bransje og sender deg et skreddersydd nettsidekonsept
              — med seksjonsstruktur, CTA-strategi og designretning. Gratis.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/45 font-medium">
              <span>✓ Ingen kredittkort</span>
              <span>✓ Svar innen 24 timer</span>
              <span>✓ Brukt av 200+ bedrifter</span>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-4">
            <Link
              href="/nettsideutkast"
              className="inline-flex items-center justify-center gap-2 bg-accent text-black font-semibold text-[15px] rounded-xl px-8 py-4 hover:bg-accent-dark transition-colors"
            >
              Lag mitt gratis utkast →
            </Link>
            <p className="text-[12px] text-white/35 text-center">Tar 60 sekunder</p>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="bg-black py-24 xl:py-28">
        <div className="sc">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-glow mb-4">
          Hva kundene sier
        </p>
        <h2 className="font-display text-[clamp(32px,3.5vw,52px)] tracking-[-0.012em] leading-[1.1] text-white max-w-[660px]">
          Resultater som taler for seg
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-16">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white/4 border border-white/8 rounded-2xl p-9 hover:bg-white/7 transition-colors"
            >
              <p className="text-accent text-[14px] tracking-widest mb-5">★★★★★</p>
              <blockquote className="text-[15px] font-light text-white/70 leading-[1.7] italic mb-7">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="text-[13px] font-medium text-white/40">
                {t.author}
                {t.company && (
                  <>
                    {' '}·{' '}
                    <span className="text-green-glow">{t.company}</span>
                  </>
                )}
              </footer>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ─── ROI-KALKULATOR ────────────────────────────────────────────────── */}
      <ROICalculator urgencyText={urgencyText} />

      {/* ─── GLOBAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-24 xl:py-32">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-deep/60 mb-4">
              Kom i gang
            </p>
            <h2 className="font-display text-[clamp(32px,3.5vw,52px)] tracking-[-0.012em] leading-[1.1] text-green-deep max-w-[600px]">
              Klar for synlighet som ikke forsvinner?
            </h2>
            <p className="text-[18px] font-light text-black/60 leading-[1.7] mt-5 max-w-[480px]">
              Book en uforpliktende synlighetsanalyse. Vi ser på situasjonen din og er ærlige om hva
              som faktisk er mulig.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <UrgencyBadge text={urgencyText} variant="light" />
            <div className="flex flex-wrap gap-4">
            <Button href="/book-analyse" variant="primary">
              Book gratis analyse →
            </Button>
            <Button href="tel:+4740000000" variant="outline-dark">
              Ring oss direkte
            </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
