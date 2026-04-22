import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { allServicesQuery, featuredTestimonialsQuery, siteSettingsQuery, aiCitationsQuery } from '@/sanity/lib/queries'
import type { SanityCitation } from '@/components/hero/AICitationFeed'
import { Button } from '@/components/ui/Button'
import { AICitationFeed } from '@/components/hero/AICitationFeed'
import { VisibilityQuiz } from '@/components/sections/VisibilityQuiz'
import { ROICalculator } from '@/components/sections/ROICalculator'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'

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
  { value: '20 år', label: 'SEO-erfaring' },
  { value: '5× ROAS', label: 'dokumentert snitt' },
]

export default async function HomePage() {
  let services = fallbackServices
  let testimonials = fallbackTestimonials
  let urgencyText = '2 ledige analyseplasser denne uken'
  let citations: SanityCitation[] = []
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
    const [s, t, settings, cit] = await Promise.all([
      client.fetch(allServicesQuery),
      client.fetch(featuredTestimonialsQuery),
      client.fetch(siteSettingsQuery),
      client.fetch(aiCitationsQuery),
    ])
    if (s?.length) services = s
    if (t?.length) testimonials = t
    if (cit?.length) citations = cit
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
      <section className="min-h-screen grid xl:grid-cols-2 pt-16">
        {/* Venstre */}
        <div className="flex flex-col justify-center px-6 md:px-12 xl:px-20 py-20 xl:py-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cream border border-black/10 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-green-deep mb-9 w-fit">
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-light animate-[pulse-dot_2s_ease-in-out_infinite]"
              aria-hidden="true"
            />
            {heroBadge}
          </div>

          {/* H1 */}
          <h1 className="font-display text-[clamp(44px,5.5vw,72px)] font-extrabold leading-[1.05] tracking-[-0.018em] mb-7">
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

        {/* Høyre — AI Citation Feed */}
        <div className="hidden xl:flex flex-col justify-center bg-white border-l border-black/8 overflow-hidden">
          <AICitationFeed seedCitations={citations} />
        </div>
      </section>

      {/* ─── TJENESTER ─────────────────────────────────────────────────────── */}
      <section className="bg-cream py-24 xl:py-28 px-6 md:px-12 xl:px-20">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
          Tjenester
        </p>
        <h2 className="font-display text-[clamp(32px,3.5vw,52px)] font-extrabold tracking-[-0.012em] leading-[1.1] max-w-[660px] mb-5">
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
      </section>

      {/* ─── SLIK JOBBER VI ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 xl:px-20 py-24 xl:py-28">
        <div className="grid xl:grid-cols-2 gap-16 xl:gap-20 items-start">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-light mb-4">
              Slik jobber vi
            </p>
            <h2 className="font-display text-[clamp(32px,3.5vw,52px)] font-extrabold tracking-[-0.012em] leading-[1.1] mb-5">
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
      </section>

      {/* ─── SYNLIGHETSSJEKK-QUIZ ────────────────────────────────────────────── */}
      <VisibilityQuiz urgencyText={urgencyText} />

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="bg-black py-24 xl:py-28 px-6 md:px-12 xl:px-20">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-glow mb-4">
          Hva kundene sier
        </p>
        <h2 className="font-display text-[clamp(32px,3.5vw,52px)] font-extrabold tracking-[-0.012em] leading-[1.1] text-white max-w-[660px]">
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
      </section>

      {/* ─── ROI-KALKULATOR ────────────────────────────────────────────────── */}
      <ROICalculator urgencyText={urgencyText} />

      {/* ─── GLOBAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-green-pale py-24 xl:py-32 px-6 md:px-12 xl:px-20">
        <div className="max-w-[1280px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-green-deep/60 mb-4">
              Kom i gang
            </p>
            <h2 className="font-display text-[clamp(32px,3.5vw,52px)] font-extrabold tracking-[-0.012em] leading-[1.1] text-green-deep max-w-[600px]">
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
            <Button href="/kontakt" variant="primary">
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
