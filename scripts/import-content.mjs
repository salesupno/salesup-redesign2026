/**
 * SalesUp — Komplett Sanity-innholdsimport
 * Kjøres med: node scripts/import-content.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim().replace(/^"|"$/g, '')))
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xlo44g1n',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-04-22',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// ─── Helpers ────────────────────────────────────────────────────────────────
let kc = 0
const k = () => `k${++kc}`
const p   = (text) => ({ _type: 'block', _key: k(), style: 'normal',  markDefs: [], children: [{ _type: 'span', _key: k(), text }] })
const h2  = (text) => ({ _type: 'block', _key: k(), style: 'h2',      markDefs: [], children: [{ _type: 'span', _key: k(), text }] })
const h3  = (text) => ({ _type: 'block', _key: k(), style: 'h3',      markDefs: [], children: [{ _type: 'span', _key: k(), text }] })
const slug = (s) => ({ _type: 'slug', current: s })
const bold = (text) => ({ _type: 'span', _key: k(), text, marks: ['strong'] })
const bblock = (...spans) => ({ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: spans })

async function upsert(doc) {
  return client.createOrReplace(doc)
}

async function importAll() {
  console.log('🚀 Starter SalesUp-innholdsimport...\n')

  // ── 1. siteSettings ────────────────────────────────────────────────────────
  console.log('📋 Importerer siteSettings...')
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    navLinks: [
      { _key: k(), label: 'Tjenester',    href: '/tjenester' },
      { _key: k(), label: 'Resultater',   href: '/resultater' },
      { _key: k(), label: 'Innsikt',      href: '/innsikt' },
      { _key: k(), label: 'Faguttrykk',   href: '/faguttrykk' },
      { _key: k(), label: 'Om oss',       href: '/om-oss' },
      { _key: k(), label: 'FAQ',          href: '/faq' },
    ],
    navCTA: { label: 'Book gratis analyse →', href: '/kontakt' },
    heroBadge: 'Norges første SEO + AEO + GEO-byrå',
    heroHeading: 'Synlighet som bygges,',
    heroHeadingAccent: 'ikke leies.',
    heroIngress: 'Vi hjelper ambisiøse bedrifter å bli funnet — i Google, i AI-assistenter og på tvers av alle kanaler der kundene faktisk søker.',
    heroPrimaryCTA: { label: 'Få gratis synlighetsanalyse →', href: '/kontakt' },
    heroSecondaryCTA: { label: 'Se resultater', href: '/resultater' },
    metrics: [
      { _key: k(), value: '100+',   label: 'kunder hjulpet' },
      { _key: k(), value: '12 år',  label: 'byrå-erfaring' },
      { _key: k(), value: '5× ROAS', label: 'dokumentert snitt' },
    ],
    globalCTAHeading: 'Klar for synlighet som ikke forsvinner?',
    globalCTAIngress: 'Book en uforpliktende synlighetsanalyse. Vi ser på situasjonen din og er ærlige om hva som faktisk er mulig.',
    globalCTAPrimary: { label: 'Book gratis analyse →', href: '/kontakt' },
    urgencyText: '2 ledige analyseplasser denne uken',
    footerColumns: [
      {
        _key: k(), heading: 'Tjenester',
        links: [
          { _key: k(), label: 'Søkemotoroptimalisering', href: '/tjenester/seo' },
          { _key: k(), label: 'AI-svarsoptimalisering (AEO)', href: '/tjenester/aeo' },
          { _key: k(), label: 'Generativ synlighet (GEO)', href: '/tjenester/geo' },
          { _key: k(), label: 'Konverteringsoptimalisering', href: '/tjenester/cro' },
          { _key: k(), label: 'Google Ads', href: '/tjenester/google-ads' },
          { _key: k(), label: 'WordPress & teknisk plattform', href: '/tjenester/wordpress' },
        ],
      },
      {
        _key: k(), heading: 'Ressurser',
        links: [
          { _key: k(), label: 'Innsikt',     href: '/innsikt' },
          { _key: k(), label: 'FAQ',         href: '/faq' },
          { _key: k(), label: 'Faguttrykk',  href: '/faguttrykk' },
          { _key: k(), label: 'Resultater',  href: '/resultater' },
        ],
      },
      {
        _key: k(), heading: 'Selskapet',
        links: [
          { _key: k(), label: 'Om oss',     href: '/om-oss' },
          { _key: k(), label: 'Kontakt',    href: '/kontakt' },
          { _key: k(), label: 'Personvern', href: '/personvern' },
        ],
      },
    ],
    footerTagline: 'Synlighet som bygges, ikke leies.',
    footerEmail: 'tommy@salesup.no',
    footerPhone: '+47 975 28 712',
    linkedinUrl: 'https://www.linkedin.com/company/salesup-no/',
    instagramUrl: 'https://www.instagram.com/pushsalesup',
  })
  console.log('  ✅ siteSettings\n')

  // ── 2. Tjenester ──────────────────────────────────────────────────────────
  console.log('🛠  Importerer tjenester (6 stk)...')

  const services = [
    {
      _id: 'service-seo',
      _type: 'service',
      title: 'Søkemotoroptimalisering',
      slug: slug('seo'),
      shortCode: 'SEO',
      tagline: 'Teknisk SEO, innholdsstrategi og aktiv lenkbygging.',
      heroHeading: 'Søkemotoroptimalisering (SEO) som faktisk gir vekst',
      heroIngress: 'SEO handler om å bli funnet av de som faktisk leter etter det du tilbyr. Vi kombinerer teknisk fundament, relevant innhold og autoritativ lenkbygging — og rapporterer på leads, ikke bare rangeringer.',
      tags: ['Teknisk SEO', 'On-site', 'Lenkbygging', 'Søkeordsanalyse'],
      deliverables: [
        { _key: k(), title: 'Teknisk SEO-gjennomgang og implementering', description: 'Fullstendig teknisk audit med prioriterte tiltak — Core Web Vitals, crawlability, indeksering og sidestruktur.' },
        { _key: k(), title: 'Søkeordsanalyse med fokus på kjøpshensikt', description: 'Vi kartlegger søkeord der kundene dine faktisk er klare til å kjøpe eller ta kontakt.' },
        { _key: k(), title: 'On-site optimalisering av struktur og innhold', description: 'Titler, meta-beskrivelser, intern lenking og innholdsstruktur optimalisert for Google og AI.' },
        { _key: k(), title: 'Aktiv, redaksjonell lenkbygging', description: 'Ubetalte lenker fra relevante norske og internasjonale publikasjoner og bransjenettsteder.' },
        { _key: k(), title: 'Månedlig rapport med rangeringer, trafikk og leads', description: 'Rapportering på det som faktisk betyr noe for virksomheten — ikke bare søkeordposisjoner.' },
      ],
      body: [
        h2('Hva er søkemotoroptimalisering?'),
        p('Søkemotoroptimalisering (SEO) er prosessen med å gjøre nettsiden din mer synlig i organiske søkeresultater på Google, Bing og andre søkemotorer. I 2026 inkluderer dette også AI-genererte søkeresultater (AIO/SGE) der Google velger én kilde å presentere.'),
        p('SalesUp har jobbet med SEO i over 12 år og hjulpet over 100 norske og skandinaviske bedrifter med å bygge varig synlighet. Vår tilnærming kombinerer teknisk presisjon, strategisk innhold og aktiv lenkbygging som faktisk gir rangeringer.'),
        h2('Slik jobber vi med SEO'),
        p('Vi starter alltid med en synlighetsanalyse — en fullstendig gjennomgang av nettstedets tekniske tilstand, nåværende rangeringer og konkurrentlandskapet. Deretter lager vi en prioritert handlingsplan med tiltak som gir størst effekt.'),
        p('Teknisk SEO handler om fundament: crawling, indeksering, sidestruktur og Core Web Vitals. Innholdsoptimalisering handler om å produsere og forbedre tekster som matcher kjøpshensikten til målgruppen. Lenkbygging handler om å skaffe autoritative, ubetalte lenker fra relevante norske og internasjonale nettsteder.'),
        h2('Resultater du kan forvente'),
        p('De fleste klienter ser målbar endring i rangeringer og trafikk innen 3–4 måneder. First Camp økte organisk trafikk med 21,9 % på 6 måneder. Jøtul opplevde 340 % vekst i organisk trafikk over 8 måneder. Europris fikk over 1 million flere organiske visninger sammenlignet med året før.'),
        p('Full effekt av en koordinert SEO-strategi bygges opp over 6–12 måneder — avhengig av bransjekonkurransen og utgangspunktet.'),
        h2('SEO i kombinasjon med AEO og GEO'),
        p('I 2026 er det ikke lenger nok å rangere i Google. Kundene dine søker i ChatGPT, Perplexity og Gemini. En komplett synlighetsstrategi krever at du er tilstede og autoritativ på tvers av alle kanaler. Vi koordinerer SEO, AEO og GEO som ett system — ikke tre separate tjenester.'),
      ],
      metaTitle: 'Søkemotoroptimalisering (SEO) | SalesUp Norway',
      metaDescription: 'SalesUp leverer SEO som faktisk gir vekst. Teknisk SEO, innholdsstrategi og lenkbygging. Over 100 norske bedrifter har valgt oss. Book gratis analyse.',
    },
    {
      _id: 'service-aeo',
      _type: 'service',
      title: 'AI-svarsoptimalisering (AEO)',
      slug: slug('aeo'),
      shortCode: 'AEO',
      tagline: 'Strukturert for ChatGPT, Gemini, Perplexity og Copilot.',
      heroHeading: 'Answer Engine Optimization (AEO) — bli svaret AI gir',
      heroIngress: 'AI-assistenter velger én kilde — ikke ti lenker. AEO handler om å strukturere data, innhold og autoritet slik at AI-modeller velger deg som svaret. Det er den nye toppen av søketrakten.',
      tags: ['FAQ-struktur', 'Entitetsbygging', 'Schema.org', 'Structured Data'],
      deliverables: [
        { _key: k(), title: 'FAQ-struktur og Schema.org FAQPage-implementering', description: 'Strukturert FAQ-innhold i JSON-LD som AI-modeller kan lese og sitere direkte.' },
        { _key: k(), title: 'Entitetsbygging: Wikipedia, Wikidata og sameAs-koblinger', description: 'Vi hjelper deg å etablere merkevaren som en autoritativ entitet AI-modeller gjenkjenner.' },
        { _key: k(), title: 'Innholdsformat optimalisert for AI-lesbarhet', description: 'Innhold strukturert med direkte svar, definerte termer og klar attributtering.' },
        { _key: k(), title: 'Sanity-basert FAQ-system med strukturert data', description: 'Hvert spørsmål er et eget dokument med kort svar (AI-klart) og utdypende svar.' },
        { _key: k(), title: 'Løpende overvåking av AI-synlighet', description: 'Vi sjekker regelmessig om du nevnes og siteres i ChatGPT, Gemini og Perplexity.' },
      ],
      body: [
        h2('Hva er Answer Engine Optimization (AEO)?'),
        p('AEO er optimalisering for AI-assistenter — verktøy som ChatGPT, Gemini, Perplexity og Microsoft Copilot. Der tradisjonell SEO handler om å rangere i en liste med ti lenker, handler AEO om å bli valgt som det ene svaret AI presenterer for brukeren.'),
        p('Ifølge forskning starter 40 % av alle søk nå i AI-verktøy fremfor Google. Denne andelen vil bare øke. Bedrifter som er strukturert for AEO i dag vil eie sin kategori i morgen.'),
        h2('Hvordan velger AI hvilke kilder den bruker?'),
        p('Språkmodeller som GPT-4 og Gemini Ultra er trent på store tekstmengder fra internett. De lærte fra Wikipedia, fagartikler, pressemeldinger og nettsteder med klar, autoritativ struktur. For å bli valgt som kilde må innholdet ditt være: direkte (spørsmål → svar), autoritativt (sitert av andre), strukturert (Schema.org, FAQPage) og konsistent (samme informasjon på tvers av nettet).'),
        h2('Slik implementerer vi AEO'),
        p('Vi starter med å kartlegge hvilke spørsmål målgruppen din stiller AI-assistenter. Deretter bygger vi et FAQ-system der hvert spørsmål har et kort, direkte svar (40–80 ord) og et utdypende svar med intern lenking. Hvert spørsmål eksponeres via FAQPage-schema i JSON-LD slik at alle AI-crawlere kan lese det.'),
        p('I tillegg jobber vi med entitetsbygging — å etablere merkevaren din som en gjenkjent enhet i AI-modellers kunnskapsgraf. Det skjer gjennom Wikipedia-tilstedeværelse, Wikidata-oppføringer og konsistente tredjepartsomtaler.'),
        h2('AEO + SEO + GEO som ett system'),
        p('AEO virker best i kombinasjon med SEO (teknisk autoritet i Google) og GEO (tilstedeværelse i LLM-treningsdatasett). SalesUp koordinerer alle tre som én strategi — fordi det er slik moderne synlighet fungerer.'),
      ],
      metaTitle: 'AEO — Answer Engine Optimization | SalesUp Norway',
      metaDescription: 'Bli svaret ChatGPT, Gemini og Perplexity gir om din bransje. SalesUp leverer AEO med FAQ-struktur, Schema.org og entitetsbygging. Book gratis analyse.',
    },
    {
      _id: 'service-geo',
      _type: 'service',
      title: 'Generativ synlighet (GEO)',
      slug: slug('geo'),
      shortCode: 'GEO',
      tagline: 'Bli den naturlige kilden AI-modeller trekker på.',
      heroHeading: 'Generative Engine Optimization (GEO) — eie din kategori i LLM-svar',
      heroIngress: 'Generative søkemotorer og store språkmodeller (LLM-er) lærer fra autoritetskilder. GEO handler om å posisjonere merkevaren din der LLM-er trenes og henter informasjon — ikke bare der de søker.',
      tags: ['LLM-optimalisering', 'Wikipedia', 'Datakilde', 'Merkevarekonsistens'],
      deliverables: [
        { _key: k(), title: 'LLM-synlighetsanalyse', description: 'Vi tester systematisk hva ChatGPT, Gemini og Perplexity sier om deg og konkurrentene dine.' },
        { _key: k(), title: 'Wikipedia og Wikidata-tilstedeværelse', description: 'Etablerer merkevaren som en gjenkjent entitet i AI-modellers kunnskapsgraf.' },
        { _key: k(), title: 'Tredjepartsomtaler fra pressemeldinger og fagartikler', description: 'Autoritative omtaler på nettsteder som LLM-er trekker fra under trening og RAG.' },
        { _key: k(), title: 'Reddit og fagforum-deltakelse', description: 'Organisk tilstedeværelse på plattformer LLM-er vekter høyt som treningsdata.' },
        { _key: k(), title: 'Merkevarekonsistens på tvers av alle digitale kilder', description: 'Ens beskrivelse av hvem dere er, hva dere gjør og for hvem — på tvers av alle kanaler.' },
      ],
      body: [
        h2('Hva er Generative Engine Optimization (GEO)?'),
        p('GEO er optimalisering for den nye generasjonen av AI-drevne søkemotorer og chatboter — verktøy som ChatGPT, Claude, Gemini og Perplexity. Der AEO fokuserer på å strukturere eksisterende innhold for AI-lesbarhet, handler GEO om å påvirke hvilke kilder LLM-er trekker på når de genererer svar.'),
        p('Språkmodeller som GPT-4 er trent på enorme datamengder fra internett. De lærte hvem som er autoritative stemmer i ulike bransjer basert på dette treningsdatasettet. GEO handler om å sørge for at din bedrift er godt representert i disse datakildene.'),
        h2('Hva skiller GEO fra SEO og AEO?'),
        p('SEO handler om å rangere i Google. AEO handler om å strukturere innhold for AI-svar. GEO handler om å påvirke selve kunnskapsgrunnlaget LLM-er trekker på. Det er en mer langsiktig og strategisk disiplin som krever tilstedeværelse langt utover eget nettsted.'),
        h2('Konkret GEO-arbeid'),
        p('GEO-arbeid inkluderer: Wikipedia-artikkelen om bedriften (eller bransjen der dere nevnes), Wikidata-oppføringer som kobler entiteter sammen, pressedekning fra autoritære medier, deltakelse i fagfora som Reddit, Quora og norske bransje-communities, og konsistente tredjepartsomtaler i fagpublikasjoner.'),
        p('Et viktig prinsipp: LLM-er stoler på konsistens. Hvis fem uavhengige, troverdige kilder beskriver deg på samme måte, vil modellen gjøre det samme. Vi bygger denne konsistensen metodisk over tid.'),
      ],
      metaTitle: 'GEO — Generativ synlighet | SalesUp Norway',
      metaDescription: 'Bli nevnt av ChatGPT, Claude og Gemini om din bransje. SalesUp leverer GEO — generativ engine optimization for norske bedrifter. Book analyse.',
    },
    {
      _id: 'service-cro',
      _type: 'service',
      title: 'Konverteringsoptimalisering',
      slug: slug('cro'),
      shortCode: 'CRO',
      tagline: 'Trafikk uten konvertering er støy.',
      heroHeading: 'Konverteringsoptimalisering (CRO) — trafikk som faktisk gir kunder',
      heroIngress: 'God trafikk er bare halvparten av jobben. CRO handler om å gjøre det enklest mulig for besøkende å ta kontakt, bestille eller kjøpe — uten friksjon, tvil eller forvirring.',
      tags: ['A/B-testing', 'Landingssider', 'UX-analyse', 'Heatmaps'],
      deliverables: [
        { _key: k(), title: 'UX-analyse av eksisterende nettside', description: 'Vi kartlegger hvor brukere faller av og hva som skaper friksjon i konverteringsflyten.' },
        { _key: k(), title: 'Heatmaps og brukeratferdsanalyse', description: 'Klikkdata, scroll-analyse og session recordings avslører hva brukerne faktisk gjør.' },
        { _key: k(), title: 'A/B-testing av CTA, skjema og landingssider', description: 'Systematisk testing av hypoteser — bare det som faktisk fungerer beholdes.' },
        { _key: k(), title: 'Optimalisering av konverteringsflyt', description: 'Fra første klikk til utfylt skjema eller gjennomført kjøp — vi fjerner alle hindre.' },
        { _key: k(), title: 'Rapport med konkrete forbedringspunkter', description: 'Prioritert handlingsplan med estimert konverteringseffekt for hvert tiltak.' },
      ],
      body: [
        h2('Hva er konverteringsoptimalisering (CRO)?'),
        p('CRO er prosessen med å øke andelen besøkende som gjennomfører ønsket handling — ta kontakt, bestille, kjøpe eller laste ned. Mange bedrifter bruker store summer på å drive trafikk uten å spørre: hva skjer når besøkende faktisk lander på siden?'),
        p('En konverteringsrate på 2 % betyr at 98 av 100 besøkende forlater uten å gjøre noe. En forbedring til 4 % dobler antall leads — uten å endre annonsebudsjettet.'),
        h2('Datadrevet CRO — ikke synsing'),
        p('Vi starter alltid med data. Heatmaps avslører hva besøkende klikker på og ignorerer. Session recordings viser brukeradferd i sanntid. Analytics viser hvor i funnelen folk faller av. Først etter å ha forstått problemet lager vi en hypotese og tester.'),
        h2('CRO og SEO — to sider av samme sak'),
        p('SEO gir deg trafikken. CRO gjør noe med den. For klienter som investerer i SEO vil CRO-arbeid typisk øke ROI med 30–80 % uten å øke trafikken. Det er den mest effektive måten å vokse på — og det er grunnen til at vi alltid anbefaler å kombinere dem.'),
      ],
      metaTitle: 'Konverteringsoptimalisering (CRO) | SalesUp Norway',
      metaDescription: 'Gjør mer ut av trafikken du allerede har. SalesUp leverer CRO med A/B-testing, UX-analyse og heatmaps. Book gratis analyse i dag.',
    },
    {
      _id: 'service-google-ads',
      _type: 'service',
      title: 'Google Ads',
      slug: slug('google-ads'),
      shortCode: 'ADS',
      tagline: 'Betalt annonsering med fokus på salgsutløsende kampanjer.',
      heroHeading: 'Google Ads som forsterker — ikke erstatter — organisk synlighet',
      heroIngress: 'Vi bruker Google Ads strategisk — for å hente raske resultater mens SEO bygges, og for å forsterke organisk synlighet i konkurranseutsatte søk. Målet er alltid lønnsom vekst, ikke klikk.',
      tags: ['Google Ads', 'Smart Bidding', 'ROAS', 'Remarketing'],
      deliverables: [
        { _key: k(), title: 'Søkekampanjer med fokus på kjøpshensikt', description: 'Vi targeterer søk der kunden er klar til å kjøpe — ikke bare informasjonssøk som aldri konverterer.' },
        { _key: k(), title: 'Smart Bidding-strategi og ROAS-optimalisering', description: 'Budregel og konverteringssporing satt opp for maksimal avkastning, ikke bare klikk.' },
        { _key: k(), title: 'Remarketing og kundematch', description: 'Remarketing til besøkende og kundematch-kampanjer mot eksisterende kunder og lookalikes.' },
        { _key: k(), title: 'Løpende optimalisering og budsjettstyring', description: 'Ukentlig optimalisering av søkeord, annonsetekster, budstrategier og budsjettfordeling.' },
        { _key: k(), title: 'Månedlig rapport med ROAS og konverteringer', description: 'Tydelig rapportering på hva pengene gir — ROAS, konverteringer og kostnad per lead.' },
      ],
      body: [
        h2('Google Ads som del av en helhetlig strategi'),
        p('Google Ads alene er aldri svaret. Betalt annonsering er en ferskvare — stopper du betaling, stopper trafikken. Men brukt strategisk er Ads et kraftig verktøy for å hente raske resultater mens langsiktig SEO bygges opp.'),
        p('SalesUps tilnærming: bruk Ads for å vinne i dag, bruk SEO for å eie kategorien i morgen. De to forsterker hverandre — og gir deg full synlighet i søkeresultatene.'),
        h2('ROAS — det eneste tallet som betyr noe'),
        p('Vi rapporterer alltid på avkastning på annonsekroner (ROAS), ikke bare klikk og visninger. Et dokumentert ROAS på 5× betyr at for hver 1 000 kr du bruker, henter du 5 000 kr i inntekter. Gjennomsnittet for SalesUps klienter er 5× ROAS — basert på faktiske tall.'),
      ],
      metaTitle: 'Google Ads | SalesUp Norway',
      metaDescription: 'Google Ads-kampanjer med fokus på ROAS og salg — ikke bare klikk. SalesUp kombinerer betalt annonsering med SEO for maksimal synlighet. Book analyse.',
    },
    {
      _id: 'service-wordpress',
      _type: 'service',
      title: 'WordPress & Teknisk plattform',
      slug: slug('wordpress'),
      shortCode: 'WP',
      tagline: 'Rask, teknisk solid plattform for SEO-vekst.',
      heroHeading: 'WordPress-nettsider bygget for synlighet og konvertering',
      heroIngress: 'En god nettside er ikke et design-prosjekt — det er et salgs- og synlighetsverktøy. Vi bygger WordPress-løsninger der teknisk SEO, Core Web Vitals og konvertering er integrert fra start.',
      tags: ['WordPress', 'Core Web Vitals', 'Schema', 'Headless'],
      deliverables: [
        { _key: k(), title: 'Skreddersydd WordPress-tema eller block-basert utvikling', description: 'Bygg fra bunnen eller videreutvikling av eksisterende løsning — alltid med SEO og ytelse som premiss.' },
        { _key: k(), title: 'Core Web Vitals-optimalisering', description: 'LCP, INP og CLS optimalisert for grønn score i Google PageSpeed Insights.' },
        { _key: k(), title: 'SEO-teknisk fundament', description: 'Schema.org-implementering, XML-sitemap, hreflang og teknisk SEO bakt inn fra start.' },
        { _key: k(), title: 'Integrasjon med analytics og lead-systemer', description: 'GA4, Search Console, CRM-integrasjon og konverteringssporing satt opp korrekt.' },
        { _key: k(), title: 'Opplæring i CMS-bruk', description: 'Du lærer å publisere, redigere og administrere innholdet selv — uten å måtte be om hjelp.' },
      ],
      body: [
        h2('WordPress for SEO og konvertering'),
        p('WordPress er verdens mest brukte publiseringsplattform med 43 % av alle nettsteder. Det betyr et enormt økosystem av plugins, integrasjoner og utviklerkompetanse. Men WordPress uten riktig oppsett er ikke SEO-vennlig — det krever riktig konfigurasjon, tema og teknisk implementering.'),
        p('SalesUp bygger WordPress-løsninger der SEO-fundament, Core Web Vitals og konvertering er integrert fra første dag — ikke lagt til som et ettertanke.'),
        h2('Ytelse som rangerer'),
        p('Google bruker Core Web Vitals som rangeringsfaktor. LCP (Largest Contentful Paint) under 2,5 sekunder, INP (Interaction to Next Paint) under 200ms og CLS (Cumulative Layout Shift) under 0,1 er mål vi alltid leverer på. Rask nettside gir bedre rangering, lavere bounce rate og høyere konvertering.'),
      ],
      metaTitle: 'WordPress & Teknisk plattform | SalesUp Norway',
      metaDescription: 'WordPress-nettsider bygget for SEO og konvertering. Core Web Vitals, Schema.org og teknisk fundament fra dag én. Book gratis vurdering.',
    },
  ]

  for (const svc of services) {
    await upsert(svc)
    console.log(`  ✅ Tjeneste: ${svc.title}`)
  }

  // ── 3. Teammedlemmer ───────────────────────────────────────────────────────
  console.log('\n👥 Importerer teammedlemmer...')

  await upsert({
    _id: 'team-tommy',
    _type: 'teamMember',
    name: 'Tommy van Wallinga',
    slug: slug('tommy-van-wallinga'),
    title: 'Daglig leder & SEO-strateg',
    email: 'tommy@salesup.no',
    phone: '+47 975 28 712',
    linkedinUrl: 'https://www.linkedin.com/in/tommy-van-wallinga/',
    shortBio: 'Daglig leder og grunnlegger av SalesUp Norway AS. Over 12 års erfaring med SEO, AEO og GEO for norske og skandinaviske bedrifter. Spesialist på organisk synlighet og forretningsstrategisk SEO.',
    fullBio: [
      p('Tommy van Wallinga er daglig leder og grunnlegger av SalesUp Norway AS. Med over 12 år i bransjen har han hjulpet norske og internasjonale bedrifter med å bygge varig synlighet og lønnsom vekst gjennom SEO, AEO og GEO.'),
      p('Karrieren startet med eksperimentering på performance-markedsføring, der systematisk datadrevet tilnærming ga innsikten som nå er grunnmuren i SalesUps metodikk. Gjennom samarbeid med kunder som Jøtul, First Camp og Europris ble det tydelig hvor kraftig en koordinert SEO-strategi kan være i konkurrerende markeder.'),
      h2('Ekspertise og spesialiteter'),
      p('Tommy er ett av de første i Norge som tilbyr LLM-optimalisering (GEO) som strukturert tjeneste, og kombinerer tradisjonell SEO-ekspertise med AI-drevet synlighet. Han er spesielt opptatt av å koble SEO-arbeid til faktiske forretningsresultater — ikke bare rangeringer og trafikk.'),
      p('Som rådgiver og strateg hjelper Tommy klienter med å forstå hele synlighetslandskapet: Google-søk, AI-assistenter, sosiale plattformer og direktetrafikk. Han tror på langvarige klientforhold basert på ærlighet om hva som er mulig og hva som tar tid.'),
      h2('Bakgrunn'),
      p('Tommy etablerte SalesUp for over 12 år siden etter å ha innset hvilken kraft som ligger i kombinasjonen av teknisk SEO og strategisk innholdsarbeid. Siden da har selskapet vokst til å hjelpe over 100 norske bedrifter med å oppnå varig digital vekst.'),
    ],
    expertiseAreas: ['SEO', 'AEO', 'GEO', 'CRO', 'Strategi', 'Lenkbygging', 'Teknisk SEO'],
    yearsOfExperience: 12,
    sortOrder: 1,
    metaTitle: 'Tommy van Wallinga — SEO-strateg & daglig leder | SalesUp',
    metaDescription: 'Tommy van Wallinga er daglig leder og SEO-strateg i SalesUp. Over 12 års erfaring med søkemotoroptimalisering, AEO og GEO for norske bedrifter.',
  })
  console.log('  ✅ Tommy van Wallinga')

  await upsert({
    _id: 'team-erlend',
    _type: 'teamMember',
    name: 'Erlend Osberg Nilsen',
    slug: slug('erlend-osberg-nilsen'),
    title: 'Kundereise-ekspert & Strategisk rådgiver',
    email: 'erlend@salesup.no',
    phone: '+47 951 40 786',
    shortBio: 'Ekspert på kundereiser og digital strategi. Erlend spesialiserer seg på å kartlegge og optimalisere hele kundereisen — fra første søk til gjennomført kjøp — og sikrer at SalesUps klienter konverterer bedre.',
    fullBio: [
      p('Erlend Osberg Nilsen er kundereise-ekspert og strategisk rådgiver i SalesUp Norway AS. Han spesialiserer seg på å kartlegge og optimalisere hele den digitale kundereisen — fra første Google-søk eller AI-svar til gjennomført kjøp eller henvendelse.'),
      p('Erlend bringer en helhetlig perspektiv til SalesUps arbeid: der SEO-spesialistene fokuserer på å hente trafikk, sørger Erlend for at den trafikken faktisk konverterer. Han analyserer brukeratferd, identifiserer friksjonspunkter og designer konverteringsflyter som virker.'),
      h2('Tilnærming til kundereiser'),
      p('Erlend kombinerer kvantitative data (analytics, heatmaps, A/B-testing) med kvalitative innsikter (brukerintervjuer, kundeavreisesanalyse) for å forstå hva som faktisk driver beslutninger. Hans tilnærming er datadrevet uten å miste det menneskelige perspektivet.'),
      p('I et marked der AI endrer søkeadferd fundamentalt, er Erlends ekspertise på å forstå nye kundereiser særlig verdifull. Hvordan søker kunder i ChatGPT fremfor Google? Hva skjer etter at de har fått et AI-svar? Disse spørsmålene er kjernen i SalesUps AEO- og GEO-tilnærming.'),
    ],
    expertiseAreas: ['Kundereise', 'CRO', 'UX-analyse', 'Digital strategi', 'A/B-testing'],
    yearsOfExperience: 8,
    sortOrder: 2,
    metaTitle: 'Erlend Osberg Nilsen — Kundereise-ekspert | SalesUp',
    metaDescription: 'Erlend Osberg Nilsen er kundereise-ekspert i SalesUp. Spesialist på å optimalisere hele den digitale kundereisen fra søk til konvertering.',
  })
  console.log('  ✅ Erlend Osberg Nilsen')

  // ── 4. Testimonials ────────────────────────────────────────────────────────
  console.log('\n⭐ Importerer testimonials...')

  const testimonials = [
    {
      _id: 'testimonial-jotul',
      quote: 'SalesUp sørget for formidabel vekst i et tøft marked. September pleide å være måneden med svakest salg — nå er det en av de sterkeste.',
      author: 'Daglig leder', authorTitle: 'Daglig leder', company: 'Jøtul', featured: true, sortOrder: 1,
    },
    {
      _id: 'testimonial-firstcamp',
      quote: 'SalesUp hjalp oss med å øke organisk trafikk med 21,9 % på 6 måneder. Andelen salg fra organisk søk og AI har gått fra 30 % til 41 % på 12 måneder.',
      author: 'Digital Manager', authorTitle: 'Digital Manager', company: 'First Camp', featured: true, sortOrder: 2,
    },
    {
      _id: 'testimonial-europris',
      quote: 'SalesUp hjalp oss med å få 1 million flere organiske visninger sammenlignet med året før. Veldig fornøyd med hjelpen så langt!',
      author: 'Fredrik', authorTitle: 'Digital Marketing Manager', company: 'Europris', featured: true, sortOrder: 3,
    },
    {
      _id: 'testimonial-anlex',
      quote: 'Svært fornøyd med hjelpen vi har fått fra SalesUp med både synlighet og annonsering gjennom mange år. De forstår hva som faktisk gir resultater.',
      author: 'Kaleb', authorTitle: 'Daglig leder', company: 'Anlex AS', featured: true, sortOrder: 4,
    },
    {
      _id: 'testimonial-target',
      quote: 'Svært fornøyd med hjelpen vi har fått fra SalesUp med økning av kvalifiserte leads. Vi ser tydelig effekt i antall henvendelser fra riktig målgruppe.',
      author: 'Torstein', authorTitle: 'Daglig leder', company: 'Target Consulting AS', featured: true, sortOrder: 5,
    },
    {
      _id: 'testimonial-eurobox',
      quote: 'September pleide å være måneden med svakere salg, men SalesUp sikret en forlenget sesong og sterk salgsvekst, som til slutt gjorde at vi kunne selge virksomheten vår.',
      author: 'Ann Kristin', authorTitle: 'Daglig leder', company: 'Eurobox/Hyrbox', featured: false, sortOrder: 6,
    },
  ]

  for (const t of testimonials) {
    await upsert({ _type: 'testimonial', ...t })
    console.log(`  ✅ Testimonial: ${t.company}`)
  }

  // ── 5. FAQ-spørsmål ────────────────────────────────────────────────────────
  console.log('\n❓ Importerer FAQ-spørsmål...')

  const faqs = [
    {
      _id: 'faq-hva-er-seo',
      question: 'Hva er søkemotoroptimalisering (SEO)?',
      slug: slug('hva-er-seo'),
      category: 'seo',
      shortAnswer: 'SEO (søkemotoroptimalisering) er prosessen med å gjøre nettsiden din mer synlig i organiske søkeresultater på Google og andre søkemotorer. I praksis handler det om teknisk fundament, relevant innhold og autoritative lenker fra andre nettsteder. Godt SEO-arbeid gir deg trafikk fra folk som aktivt søker etter det du tilbyr — uten å betale for hvert klikk.',
      fullAnswer: [
        h2('Hva er SEO?'),
        p('SEO (Search Engine Optimization) — søkemotoroptimalisering på norsk — er disiplinen som handler om å gjøre nettsiden din mer synlig i de organiske (ikke-betalte) søkeresultatene på Google, Bing og andre søkemotorer.'),
        p('I 2026 inkluderer dette også AI-genererte søkeoversikter (Google AI Overviews / SGE), der Google presenterer ett sammendrag med én kilde — ikke ti lenker. For å bli valgt der krever du god SEO kombinert med AEO.'),
        h2('De tre pilarene i SEO'),
        h3('1. Teknisk SEO'),
        p('Søkemotorer er roboter som crawler og indekserer nettsider. Teknisk SEO handler om å gjøre dette arbeidet enklest mulig: riktig sidestruktur, rask lastetid (Core Web Vitals), mobilvennlig design, XML-sitemap og korrekte canonical-tagger.'),
        h3('2. Innholdsoptimalisering'),
        p('Innhold er det søkemotorer faktisk leser. God innholdsoptimalisering betyr å lage sider som matcher søkeintensjonen nøyaktig — informasjonssøk, kommersielle søk og transaksjonssøk krever helt forskjellige innholdsformater.'),
        h3('3. Autoritet og lenkbygging'),
        p('Google vurderer nettsteder etter autoritet — basert på hvem som lenker til deg og fra hvilke sider. En lenke fra VG.no eller NRK.no er langt mer verdifull enn hundre lenker fra ukjente blogger. Aktiv lenkbygging er det mest krevende og mest effektive SEO-tiltaket.'),
        h2('Hvor lang tid tar det?'),
        p('De fleste klienter ser målbar endring i rangeringer innen 3–4 måneder. Full effekt av en koordinert strategi krever 6–12 måneder. SEO er en investering, ikke en engangskostnad — men avkastningen er langsiktig og akkumulerende.'),
        p('Vil du vite hva SalesUp kan gjøre for din bedrift? Book en gratis synlighetsanalyse — vi er alltid ærlige om hva som er realistisk.'),
      ],
      inlineCTA: { text: 'Vil du se hva SEO kan gjøre for deg? Book gratis analyse →', href: '/kontakt' },
    },
    {
      _id: 'faq-hva-er-aeo',
      question: 'Hva er Answer Engine Optimization (AEO)?',
      slug: slug('hva-er-aeo'),
      category: 'aeo',
      shortAnswer: 'AEO (Answer Engine Optimization) er optimalisering for AI-assistenter som ChatGPT, Gemini og Perplexity. Der tradisjonell SEO handler om å rangere i en liste med lenker, handler AEO om å bli valgt som det ene svaret AI presenterer. Med 40 % av søk som nå starter i AI-verktøy er dette i ferd med å bli like viktig som Google-rangering.',
      fullAnswer: [
        h2('Hva er AEO og hvorfor er det viktig?'),
        p('AEO (Answer Engine Optimization) er den nye disiplinen som handler om å strukturere innhold, data og autoritet slik at AI-assistenter velger deg som kilde når de genererer svar til brukere.'),
        p('ChatGPT, Gemini, Perplexity og Microsoft Copilot brukes nå av hundrevis av millioner mennesker daglig. Disse verktøyene presenterer ett svar — ikke ti lenker. Den som eier dette svaret eier toppen av søketrakten.'),
        h2('Hvordan velger AI sine kilder?'),
        p('Språkmodeller er trent på enorme mengder tekst fra internett. De har lært hvilke sider som er autoritative, hvilke svar som er korrekte og hvilke formater som gir god informasjon. For å bli valgt må innholdet ditt:'),
        p('1) Svare direkte på spørsmålet (ikke vri seg rundt det). 2) Bruke strukturerte data (FAQPage-schema, DefinedTerm-schema). 3) Være autoritativt — sitert og linket til av andre. 4) Være konsistent — samme informasjon på tvers av nettet.'),
        h2('Praktisk AEO-implementering'),
        p('Den viktigste praksistiske AEO-tiltaket er å bygge et solid FAQ-system der hvert spørsmål har et direkte, faktabasert svar (40–80 ord) strukturert i JSON-LD FAQPage-schema. Dette formatet er designet for å kunne leses av AI-crawlere og brukes direkte i svargenereringen.'),
        p('I tillegg jobber vi med entitetsbygging — å etablere merkevaren din som en gjenkjent entitet i AI-modellers kunnskapsgraf. Det skjer gjennom Wikipedia, Wikidata og konsistente omtaler i autoritære tredjepartskilder.'),
      ],
      inlineCTA: { text: 'Vil du bli svaret AI gir om din bransje? Book gratis AEO-analyse →', href: '/kontakt' },
    },
    {
      _id: 'faq-hva-er-geo',
      question: 'Hva er Generative Engine Optimization (GEO)?',
      slug: slug('hva-er-geo'),
      category: 'geo',
      shortAnswer: 'GEO (Generative Engine Optimization) handler om å påvirke hva store språkmodeller (LLM-er) som ChatGPT og Gemini sier om deg og din bransje. Der AEO strukturerer innhold for AI-svar, handler GEO om å sørge for at AI-modeller faktisk har lært riktig og positiv informasjon om merkevaren din gjennom treningsdatasettet.',
      fullAnswer: [
        h2('GEO — den mest langsiktige formen for digital synlighet'),
        p('Generative Engine Optimization (GEO) er optimalisering for den nye generasjonen av AI-systemer — ikke bare for øyeblikket, men for fremtiden. Der SEO og AEO handler om hva AI gjør NÅ med eksisterende innhold, handler GEO om hva AI VIL si om deg basert på hva det har lært.'),
        p('Store språkmodeller (LLM-er) som GPT-4 og Gemini Ultra er trent på massive tekstmengder fra internett. De lærte hvem som er autoritative stemmer i ulike bransjer, hvilke selskaper som er markedsledere og hvilke produkter som anbefales — basert på dette treningsdatasettet.'),
        h2('Hva skiller GEO fra SEO og AEO?'),
        p('SEO: Optimaliser nettstedet for at Google skal velge deg i søk (nå). AEO: Optimaliser innhold for at AI skal velge deg som svar (nå). GEO: Bygg merkevareautoritet slik at fremtidige AI-modeller kjenner deg som autoriteten i din bransje (fremtid).'),
        h2('Konkrete GEO-tiltak'),
        p('Praktisk GEO-arbeid inkluderer: Wikipedia-oppføringer og Wikidata-entitetsbygging, pressedekning fra autoritære medier som VG, E24 og bransjemagasiner, deltakelse i fagforum som Reddit, deltakelse i podcaster og fagseminarer som siden publiseres online, og tredjepartsomtaler i fagpublikasjoner.'),
        p('Et kritisk prinsipp i GEO: konsistens. Hvis fem uavhengige, troverdige kilder beskriver bedriften din på samme måte, vil neste generasjon AI-modeller gjøre det samme.'),
      ],
      inlineCTA: { text: 'Vil du eie kategorien i LLM-svar? Book gratis GEO-analyse →', href: '/kontakt' },
    },
    {
      _id: 'faq-hvor-lang-tid-seo',
      question: 'Hvor lang tid tar det å se resultater med SEO?',
      slug: slug('hvor-lang-tid-tar-seo'),
      category: 'seo',
      shortAnswer: 'De fleste klienter ser målbar endring i rangeringer og trafikk innen 3–4 måneder. Full effekt av en koordinert strategi krever typisk 6–12 måneder. Tidsrammen avhenger av bransjekonkurransen, nettstedets tekniske tilstand og utgangspunktet for rangeringer. Klienter med et teknisk klargjort nettsted ser ofte raskere resultater.',
      fullAnswer: [
        h2('Realitetene om SEO-tid'),
        p('SEO er ikke et quick-fix — men det er heller ikke et sorteboks der resultater er uforutsigbare. Med riktig arbeid og realistiske forventninger er tidsrammene ganske forutsigbare:'),
        p('Måned 1–2: Teknisk SEO på plass. Crawling og indeksering optimalisert. Google begynner å forstå strukturen bedre. Måned 3–4: Første rangeringsforbedringer. On-site optimaliserte sider begynner å klatre. Første lenkeplasseringer er publisert. Måned 5–8: Tydelig trafikkøkning på optimaliserte sider. Lenkbygging gir begynnende autoritetsvekst. Måned 9–12: Full effekt av koordinert strategi. Stabile rangeringer, økende autoritet og selvforsterkende vekst.'),
        h2('Faktorer som påvirker hastigheten'),
        p('Bransjekonkurranse er den viktigste faktoren. I en bransje med mange sterke aktører tar det lengre tid enn i nisjebransjer. Nettstedets tekniske tilstand ved oppstart er avgjørende — et teknisk solid nettsted gir mye raskere resultater. Innholdsvolum og kvalitet på eksisterende sider påvirker også hastigheten.'),
        p('Hos SalesUp starter vi alltid med en synlighetsanalyse som gir et realistisk estimat basert på din spesifikke situasjon. Vi lover ikke raske resultater hvis det ikke er realistisk.'),
      ],
      inlineCTA: { text: 'Få et realistisk estimat for din bransje → Book gratis analyse', href: '/kontakt' },
    },
    {
      _id: 'faq-hva-koster-seo',
      question: 'Hva koster SEO hos SalesUp?',
      slug: slug('hva-koster-seo'),
      category: 'seo',
      shortAnswer: 'SEO-prisen avhenger av omfang, tjenester og konkurransesituasjonen i bransjen. On-site SEO og rådgivning kan starte fra 1 600 kr/t. Aktiv SEO med innholdsproduksjon og lenkbygging starter typisk fra 15 000–30 000 kr/mnd. Ta kontakt for en konkret prisvurdering basert på din situasjon.',
      fullAnswer: [
        h2('Hva påvirker SEO-prisen?'),
        p('SEO-prisen avhenger av tre faktorer: Hva du trenger (teknisk SEO, innhold, lenkbygging eller alt), bransjekonkurransen (mer konkurranseutsatte bransjer krever mer arbeid) og ønsket hastighet (raskere resultater krever mer ressurser).'),
        h2('SalesUps prismodeller'),
        p('On-site SEO: Fra 1 600 kr/t. Passer for bedrifter som vil ha bistand til spesifikke tekniske tiltak eller rådgivning uten løpende avtale. Aktiv SEO: Fra 30 000 kr/mnd. Inkluderer ukentlig innholdsproduksjon, lenkbygging, månedlig rapport og løpende optimalisering. Dette er SalesUps mest populære pakke.'),
        h2('ROI-perspektivet'),
        p('SEO er en investering, ikke en kostnad. Et SEO-program til 30 000 kr/mnd som genererer 5 nye kunder per måned med en kundeverdi på 50 000 kr gir 250 000 kr i nyomsetning for 30 000 kr investert. Det er 8× ROI — og effekten akkumulerer over tid fordi organisk synlighet bygges opp og beholdes.'),
        p('Book en uforpliktende analyse, så gir vi deg et konkret prisestimat basert på din bransje og situasjon.'),
      ],
      inlineCTA: { text: 'Få et konkret prisestimat for din bransje → Ta kontakt', href: '/kontakt' },
    },
    {
      _id: 'faq-betalte-lenker',
      question: 'Bruker dere betalte lenker?',
      slug: slug('bruker-dere-betalte-lenker'),
      category: 'seo',
      shortAnswer: 'Nei. SalesUps lenkbygging er utelukkende basert på redaksjonell plassering og ubetalte lenker fra relevante, autoritative publikasjoner. Vi bruker ikke PBN-nettverk (Private Blog Networks), betalte lenkeplasseringer eller andre teknikker som bryter Googles retningslinjer og risikerer en Manuel penalty.',
      fullAnswer: [
        h2('Vår tilnærming til lenkbygging'),
        p('Lenkbygging er den mest krevende og mest effektive delen av SEO — og den mest misforståtte. Mange byråer tilbyr billige lenkepackager basert på betalte plasseringer i lenkenettverk (PBN-er) eller sponsede artikler. Disse teknikkene bryter Googles retningslinjer og risikerer en Manuel penalty som kan ødelegge synligheten din over natten.'),
        p('SalesUps lenkbygging er basert på redaksjonell fortjeneste: vi lager innhold eller etablerer relasjoner som er gode nok til at andre nettsteder vil lenke til deg av egne grunner — uten betaling.'),
        h2('Hva redaksjonell lenkbygging innebærer'),
        p('Redaksjonell lenkbygging inkluderer: gjesteinnlegg i relevante norske bransjemedier og fagpublikasjoner, digital PR (pressemeldinger og nyheter som gir organisk pressedekning), ressurslenker (vi lager ressurser som er så verdifulle at andre lenker til dem) og broken link building (vi identifiserer ødelagte lenker og tilbyr erstatningsinnhold).'),
        p('Denne tilnærmingen gir langsommere resultater enn betalte lenker, men er 100 % bærekraftig og bygger faktisk autoritet — ikke bare kortsiktig rangeringsforbedring.'),
      ],
      inlineCTA: { text: 'Lær mer om bærekraftig lenkbygging → Book gratis SEO-analyse', href: '/kontakt' },
    },
    {
      _id: 'faq-skille-seo-aeo',
      question: 'Hva skiller SalesUp fra andre SEO-byråer?',
      slug: slug('hva-skiller-salesup-fra-andre-seo-byraer'),
      category: 'generelt',
      shortAnswer: 'SalesUp kombinerer SEO, AEO og GEO som ett koordinert system — ikke tre separate tjenester. Vi rapporterer på faktiske leads og forretningsresultater, ikke bare rangeringer og klikk. Vi er ett av de første norske byråene som tilbyr LLM-optimalisering som strukturert tjeneste. Og vi er alltid ærlige om hva som er realistisk for din bransje.',
      fullAnswer: [
        h2('Hva gjør SalesUp annerledes?'),
        p('De fleste SEO-byråer leverer SEO. Noen leverer Google Ads. Noen leverer innholdsproduksjon. SalesUp er ett av svært få norske byråer som koordinerer hele det digitale synlighetsbildet som ett system: teknisk SEO, innholdsstrategi, lenkbygging, AEO (AI-svarsoptimalisering) og GEO (generativ synlighetsoptimalisering).'),
        h2('Rapportering på det som betyr noe'),
        p('Vi rapporterer på leads, salg og inntekter — ikke på søkeordposisjoner og klikk. Mange klienter har opplevd å jobbe med byråer som leverer imponerende rankingsrapporter uten at det gir noe i salg. SalesUp starter alltid med å definere hvilke forretningsmål SEO-arbeidet skal oppnå, og måler mot disse.'),
        h2('Ærlighet og realistiske forventninger'),
        p('Vi anbefaler ikke tjenester klienten ikke trenger. Vi gir realistiske tidsestimater. Vi forteller deg hvis SEO ikke er riktig løsning for din situasjon. Denne ærligheten er grunnen til at vi har langvarige klientforhold — og klienter som vokser.'),
      ],
      inlineCTA: { text: 'Se hva vi har fått til for klienter → Se resultater', href: '/resultater' },
    },
    {
      _id: 'faq-kan-vi-gjore-seo-selv',
      question: 'Kan vi gjøre SEO selv, eller trenger vi et byrå?',
      slug: slug('kan-vi-gjore-seo-selv'),
      category: 'samarbeid',
      shortAnswer: 'Det er mulig å gjøre grunnleggende SEO-tiltak selv — spesielt on-site optimalisering og innholdsproduksjon. For teknisk SEO, aktiv lenkbygging og AEO/GEO kreves spesialkompetanse og dedikert tid. SalesUp tilbyr både fullt byråsamarbeid og rådgivning/opplæring for de som vil bygge intern kompetanse.',
      fullAnswer: [
        h2('DIY-SEO: Hva er mulig?'),
        p('Grunnleggende on-site SEO er absolutt mulig å gjøre selv med tilgjengelige ressurser: Yoast SEO eller Rank Math for WordPress, Google Search Console for å forstå indeksering og rangeringer, og Google Analytics 4 for trafikkanalyse.'),
        p('Med noen måneders læring og konsistent arbeid kan de fleste lage godt optimaliserte sider, skrive innhold som matcher søkeintensjon og gjøre grunnleggende teknisk vedlikehold.'),
        h2('Hva krever spesialkompetanse?'),
        p('Teknisk SEO på avansert nivå (Core Web Vitals-optimalisering, JavaScript SEO, hreflang for internasjonale nettsteder) krever dyp teknisk kompetanse. Aktiv lenkbygging er tidkrevende og relasjonsdrevet — det er vanskelig å gjøre effektivt uten dedikert arbeid og eksisterende mediakontakter. AEO og GEO er nye disipliner der det finnes lite norsk kompetanse — SalesUp er blant pionerene.'),
        p('For de fleste veksende bedrifter er den mest realistiske løsningen en hybrid: et byråpartnerskap for lenkbygging og strategi, mens intern markedsføring håndterer daglig innholdsproduksjon med bistand fra byrå.'),
      ],
      inlineCTA: { text: 'Diskuter hva som er riktig for din bedrift → Book gratis rådgivning', href: '/kontakt' },
    },
  ]

  for (const faq of faqs) {
    await upsert({ _type: 'faqQuestion', ...faq })
    console.log(`  ✅ FAQ: ${faq.question.substring(0, 50)}...`)
  }

  // ── 6. Case Studies ────────────────────────────────────────────────────────
  console.log('\n📊 Importerer case studies...')

  await upsert({
    _id: 'case-firstcamp',
    _type: 'caseStudy',
    clientName: 'First Camp',
    slug: slug('first-camp-seo'),
    industry: 'Reiseliv og camping',
    excerpt: 'Skandinavias største campingkjede økte organisk trafikk med 21,9 % på 6 måneder. Andelen salg fra organisk søk og AI gikk fra 30 % til 41 % på 12 måneder.',
    metrics: [
      { _key: k(), value: '+21,9 %', label: 'organisk trafikk', period: '6 måneder' },
      { _key: k(), value: '30 % → 41 %', label: 'andel salg fra organisk SEO/AI', period: '12 måneder' },
    ],
    challenge: [
      p('First Camp er Skandinavias største campingkjede med destinasjoner i Sverige og Danmark. Med et bredt tilbud av camping, hytter og opplevelser er målet å gjøre det enkelt for gjester å finne, velge og bestille ferieopphold — uansett sesong.'),
      p('First Camp ønsket å øke andelen salg fra organiske flater og bygge sterkere digital troverdighet i møte med nye søkevaner. SEO måtte fungere sammen med AI-baserte søkeresultater, og arbeidet måtte gi målbar effekt over tid — ikke bare trafikk, men reelt salg.'),
    ],
    solution: [
      p('For First Camp har SalesUp jobbet strategisk med Aktiv SEO i både Sverige og Danmark. Det innebærer ukentlig aktivitet som styrker synlighet, autoritet og relevans i eksterne, fremtredende flater — kombinert med månedlige, konkrete prioriteringer for forbedringer på selve nettsiden.'),
      p('Slik bygges ikke bare rangeringer, men varig digital troverdighet. Innholdsarbeidet fokuserte på å svare på spørsmålene campinggjester stiller i Google og i AI-assistenter, med FAQPage-schema på alle relevante sider.'),
    ],
    results: [
      p('Organisk trafikk økte med 21,9 % over 6 måneder. I ett av markedene økte andelen salg fra SEO og AI fra 30 % til 41 % på 12 måneder, mens øvrige kanaler leverte svakere utvikling.'),
      p('Den kontinuerlige aktiviteten gir First Camp økt troverdighet i Google-søk og organiske plasseringer, Google AI Overviews og AI-motorer som brukes i research- og planleggingsfasen.'),
    ],
  })
  console.log('  ✅ Case: First Camp')

  await upsert({
    _id: 'case-jotul',
    _type: 'caseStudy',
    clientName: 'Jøtul',
    slug: slug('jotul-seo'),
    industry: 'Produksjon / Peisovner',
    excerpt: '340 % økning i organisk trafikk over 8 måneder i et tøft B2B-marked. September — tradisjonelt årets svakeste salgsmåned — ble en av de sterkeste.',
    metrics: [
      { _key: k(), value: '340 %', label: 'økning i organisk trafikk', period: '8 måneder' },
      { _key: k(), value: '#1', label: 'ranking på primære bransjesøk', period: '' },
    ],
    challenge: [
      p('Jøtul er en av Norges mest kjente merkevarer innen peisovner og ildsteder — men hadde et digitalt fotavtrykk som ikke matchet merkevarens styrke. Organisk synlighet var svak, og konkurrenter rangerte over dem på sentrale søk.'),
      p('Markedet for peisovner er sesongbasert med sterk konsentrasjon i høst og vinter. Utfordringen var å bygge varig organisk synlighet som fungerte hele året — ikke bare i høysesong.'),
    ],
    solution: [
      p('SalesUp implementerte en koordinert SEO-strategi for Jøtul med fokus på tre ting: teknisk fundament (Core Web Vitals, sidestruktur, Schema.org), innholdsoptimalisering for kjøpsorienterte søk og aktiv lenkbygging fra norske interiør- og byggmedier.'),
      p('Vi identifiserte at mange potensielle kjøpere søkte etter informasjon om peisovner i forsømmelsesperioden (vår/sommer) — men at Jøtul var lite synlig da. Vi bygde et innholdsprogram som fanget disse søkene og drev trafikk til konverteringssider.'),
    ],
    results: [
      p('340 % økning i organisk trafikk over 8 måneder. September — tradisjonelt årets svakeste salgsmåned for peisovner — ble en av de sterkeste etter SEO-arbeidet. Den utvidede sesongen var et direkte resultat av den organiske synlighetsoppbyggingen.'),
      p('"SalesUp sørget for formidabel vekst i et tøft marked. September pleide å være måneden med svakest salg — nå er det en av de sterkeste." — Daglig leder, Jøtul'),
    ],
  })
  console.log('  ✅ Case: Jøtul')

  // ── 7. Bloggartikler (innsikt) ─────────────────────────────────────────────
  console.log('\n📝 Importerer bloggartikler...')

  const posts = [
    {
      _id: 'post-hva-er-seo-2026',
      _type: 'post',
      title: 'Hva er SEO i 2026 — og hvorfor er det viktigere enn noensinne?',
      slug: slug('hva-er-seo-2026'),
      publishedAt: '2026-03-15T08:00:00Z',
      excerpt: 'SEO i 2026 er ikke det samme som SEO i 2020. Med AI-genererte søkeresultater, Google AI Overviews og 40 % av søk som starter i AI-verktøy, har spillereglene endret seg fundamentalt. Her er hva du trenger å vite.',
      tags: ['SEO', 'AEO', 'AI-søk', 'Google'],
      body: [
        p('Søkemotoroptimalisering (SEO) har gjennomgått sin mest dramatiske transformasjon siden Googles Penguin-oppdatering i 2012. I 2026 er det ikke lenger nok å rangere på side én i Google — du må også forstå AI-genererte søkeresultater, svarmotorer og den nye søkeadferd.'),
        h2('Den nye søkelandskapet'),
        p('Google AI Overviews (tidligere Search Generative Experience) er nå tilgjengelig for millioner av norske søkere. Når en bruker søker «beste SEO-byrå i Norge», kan Google nå presentere ett sammendrag med én kilde — ikke ti lenker. Den kilden henter de organiske konverteringene.'),
        p('Parallelt har ChatGPT, Perplexity og Gemini tatt over deler av informasjonssøket. Ifølge global forskning starter nå 40 % av alle informasjonssøk i AI-verktøy fremfor Google. For yngre målgrupper er andelen enda høyere.'),
        h2('Hva betyr dette for SEO i praksis?'),
        p('SEO i 2026 handler fortsatt om de klassiske pilarene: teknisk fundament, relevant innhold og autoritative lenker. Men det krever nå to tilleggsdimensjoner:'),
        h3('AEO — strukturer for AI-svar'),
        p('For å bli valgt av AI-assistenter og Google AI Overviews må innholdet struktureres for maskinlesbarhet. FAQPage-schema, klar H2/H3-struktur og direkte svar på spørsmål er ikke lenger valgfritt — det er grunnleggende.'),
        h3('GEO — bygg merkevarens AI-fotavtrykk'),
        p('Fremtidige AI-modeller vil sitere kilder de kjenner som autoritative. GEO handler om å bygge denne autoriteten: Wikipedia-tilstedeværelse, pressedekning, tredjepartsomtaler og konsistent merkevarerepresentasjon på tvers av hele nettet.'),
        h2('De tre tingene du bør gjøre nå'),
        p('1) Gjennomfør en teknisk SEO-audit og fikse Core Web Vitals-problemer. 2) Bygg et strukturert FAQ-system med FAQPage-schema — minimum 10–15 spørsmål relevante for bransjen din. 3) Begynn å spore AI-synlighet: hva sier ChatGPT og Gemini om deg og konkurrentene dine?'),
        p('Vil du ha en konkret gjennomgang av situasjonen din? SalesUp tilbyr gratis synlighetsanalyse der vi ser på både Google-rangeringer og AI-synlighet.'),
      ],
      metaTitle: 'Hva er SEO i 2026? Den komplette guiden | SalesUp',
      metaDescription: 'SEO i 2026 inkluderer AI-genererte søkeresultater, Google AI Overviews og AEO. Les hva som faktisk virker i dag — og hva du bør gjøre nå.',
    },
    {
      _id: 'post-aeo-guide',
      _type: 'post',
      title: 'AEO: Slik strukturerer du innholdet ditt for å bli svaret ChatGPT gir',
      slug: slug('aeo-guide-bli-svaret-chatgpt-gir'),
      publishedAt: '2026-02-28T08:00:00Z',
      excerpt: 'AI-assistenter velger én kilde — ikke ti. Slik strukturerer du innhold, data og autoritet for å bli den kilden ChatGPT, Gemini og Perplexity velger når de svarer brukerne dine.',
      tags: ['AEO', 'AI-søk', 'FAQ', 'Schema.org'],
      body: [
        p('Anta at en potensiell kunde åpner ChatGPT og skriver: "Hvilke SEO-byråer er best i Norge?" Hva svarer AI? Nevner den deg? Nevner den konkurrenten din? Eller vet den ikke hvem dere er?'),
        p('Dette spørsmålet — og svaret — er essensen av Answer Engine Optimization (AEO). Den nye disiplinen som handler om å strukturere innhold slik at AI-assistenter velger deg.'),
        h2('Forstå hvordan AI velger sine kilder'),
        p('Språkmodeller som GPT-4 velger ikke sine svar vilkårlig. De er trent på enorme mengder tekst fra internett og har lært hvilke sider som er autoritative, hvilke svar som er faktabaserte og hvilke formater som gir god informasjon.'),
        p('For å bli valgt av AI trenger innholdet ditt tre egenskaper: Det må være direkte (AI foretrekker sider som svarer konkret på spørsmålet), strukturert (FAQPage-schema, DefinedTerm-schema og klar H2/H3-arkitektur) og autoritativt (andre nettsteder refererer til og lenker fra ditt innhold).'),
        h2('Steg 1: Bygg et FAQ-system'),
        p('Det viktigste enkelt-tiltaket for AEO er å bygge et solid FAQ-system. Hvert spørsmål skal ha: Et direkte svar på 40–80 ord (dette formatet er ideelt for AI å sitere). Et utdypende svar på 300+ ord med intern lenking til relaterte tjenester og termer. FAQPage-schema i JSON-LD eksponert i sidekoden.'),
        p('Eksempel på et godt AEO-optimert spørsmål: "Hva er SEO?" Svar: "SEO (søkemotoroptimalisering) er prosessen med å gjøre nettsiden din mer synlig i organiske søkeresultater. Det handler om tre ting: teknisk fundament (rask nettside, korrekt struktur), relevant innhold (svar på det kundene søker) og autoritative lenker fra andre nettsteder. God SEO gir deg trafikk uten å betale for hvert klikk."'),
        h2('Steg 2: Implementer Schema.org'),
        p('Schema.org er et vokabular av strukturerte data som Google, Bing og AI-modeller forstår. De viktigste schema-typene for AEO: FAQPage (for FAQ-innhold), Organization (for bedriftsinfo), Service (for tjenester), Person (for teammedlemmer) og LocalBusiness (for lokal synlighet).'),
        p('Bruk JSON-LD-format — ikke Microdata eller RDFa. Google anbefaler det, og det er enklest å implementere og vedlikeholde.'),
        h2('Steg 3: Bygg entiteter'),
        p('AI-modeller forstår verden gjennom entiteter — navngitte ting med relasjoner. Bedriften din er en entitet. For å bli gjenkjent av AI trenger du: Wikipedia-side (eller Wikidata-oppføring), konsistent NAP (name, address, phone) på tvers av alle nettsteder og lenker fra autoritative tredjepartskilder.'),
        h2('Steg 4: Mål AI-synligheten'),
        p('Mål regelmessig: Hva sier ChatGPT om deg? Hva sier Gemini? Hva sier Perplexity? Bruk standardiserte testspørsmål for konsistente målinger over tid. Dette er ennå ikke automatisert — det krever manuell testing — men det gir uvurderlig innsikt.'),
      ],
      metaTitle: 'AEO-guide 2026: Bli svaret ChatGPT gir | SalesUp',
      metaDescription: 'Slik strukturerer du innhold for AI-assistenter. Steg-for-steg guide til AEO med FAQ-struktur, Schema.org og entitetsbygging. Fra SalesUp Norway.',
    },
    {
      _id: 'post-hva-koster-seo',
      _type: 'post',
      title: 'Hva koster SEO? En ærlig gjennomgang av priser, modeller og hva du faktisk får',
      slug: slug('hva-koster-seo-priser'),
      publishedAt: '2026-01-20T08:00:00Z',
      excerpt: 'SEO-priser varierer fra 0 (gjør det selv) til 100 000+ kr/mnd (store internasjonale byråer). Her er en ærlig gjennomgang av hva de ulike prisnivåene faktisk innebærer — og hva du bør prioritere.',
      tags: ['SEO', 'Priser', 'ROI', 'Byråvalg'],
      body: [
        p('Hva koster SEO? Det er ett av de vanligste spørsmålene vi får — og et av de vanskeligste å svare på ærlig. Fordi svaret er: det kommer an på.'),
        p('Men det betyr ikke at vi ikke kan gi deg et konkret bilde. Her er en gjennomgang av hva ulike prisnivåer faktisk innebærer — og hva du bør forvente å betale for ekte, effektiv SEO.'),
        h2('De tre prismodellene'),
        h3('Timespris: 1 200–2 000 kr/t'),
        p('Passer for: Teknisk SEO-audit, on-site optimalisering av spesifikke sider, konsultasjon og rådgivning. Begrensning: Lenkbygging krever løpende innsats og er vanskelig å gjøre effektivt på timebasis.'),
        h3('Månedlig retainer: 10 000–60 000 kr/mnd'),
        p('Det vanligste for løpende SEO-arbeid. Prisnivåer: 10 000–15 000 kr/mnd: Grunnleggende on-site + teknisk vedlikehold. Lite innhold, minimal lenkbygging. 15 000–30 000 kr/mnd: On-site, innholdsproduksjon (2–4 artikler/mnd), noe lenkbygging. 30 000–60 000 kr/mnd: Aktiv SEO med ukentlig innholdsproduksjon, aktiv lenkbygging og AEO/GEO. Dette er nivået der du ser tydelig forretningsmessig effekt.'),
        h3('Prosjektpris: 25 000–150 000 kr'),
        p('For avgrenset arbeid: Full SEO-audit og implementeringsplan, nettstedsmigrering med SEO-fokus, eller oppbygging av nytt nettsted med teknisk SEO fra start.'),
        h2('Hva du bør forvente for pengene'),
        p('Under 10 000 kr/mnd: Nok til å holde teknisk SEO vedlike og publisere litt innhold. Ikke nok til aktiv vekst i et konkurranseutsatt marked. 10 000–20 000 kr/mnd: Grunnleggende SEO-arbeid og noe innhold. Passer for lokale bedrifter i lite konkurranseutsatte nisjeer. 20 000–35 000 kr/mnd: Aktiv SEO med innhold og lenkbygging. Tydelig vekst i de fleste markeder over 6–12 måneder. Over 35 000 kr/mnd: Intensivt SEO-arbeid med prioritert lenkbygging og AEO/GEO. Brukes i svært konkurranseutsatte bransjer.'),
        h2('ROI-perspektivet'),
        p('Den riktige måten å vurdere SEO-kostnad er som investering, ikke kostnad. Et SEO-program til 25 000 kr/mnd som genererer 4 nye kunder per måned med en kundeverdi på 50 000 kr gir 200 000 kr i nyomsetning. Det er 8× ROI — og den organiske trafikken som bygges opp er ikke avhengig av fortsatt betaling for å bestå.'),
        p('Sammenlign dette med Google Ads der 25 000 kr/mnd gir trafikk bare mens du betaler — og ingenting gjenværende når du stopper.'),
        h2('Hva du bør unngå'),
        p('"Billig SEO" under 5 000 kr/mnd fra ukjente leverandører er nesten alltid enten 1) ingenting reelt (rapporter uten handling), 2) betalte lenker som kan gi Google-penalty, eller 3) innholdsproduksjon med AI-generert tekst uten kvalitetskontroll.'),
        p('Et SEO-samarbeid er en tillitsrelasjon over tid. Velg et byrå som kan dokumentere resultater for klienter i din bransje og er ærlig om hva som er realistisk for deg.'),
      ],
      metaTitle: 'Hva koster SEO? Ærlig prisoversikt 2026 | SalesUp',
      metaDescription: 'SEO-priser i Norge: fra 1 600 kr/t til 50 000 kr/mnd. Ærlig gjennomgang av hva ulike prisnivåer innebærer og hva du bør forvente å betale.',
    },
    {
      _id: 'post-geo-for-norske-bedrifter',
      _type: 'post',
      title: 'GEO: Fremtidens synlighet for norske bedrifter — en praktisk innføring',
      slug: slug('geo-generativ-synlighet-norske-bedrifter'),
      publishedAt: '2026-04-01T08:00:00Z',
      excerpt: 'Generativ Engine Optimization (GEO) er den nye fronten i digital synlighet. Vi forklarer hva det er, hvorfor det betyr noe for norske bedrifter nå — og de første skrittene du kan ta i dag.',
      tags: ['GEO', 'AI', 'ChatGPT', 'LLM', 'Fremtidig SEO'],
      body: [
        p('Test det selv: Åpne ChatGPT og skriv "Hvilke norske SEO-byråer er best?" eller "Hva er beste SEO-byrå for e-handel i Norge?" Hva svarer AI? Nevner den deg? Kjenner den til bransjen din?'),
        p('Svarene du får er ikke tilfeldige. De reflekterer hva ChatGPT lærte under trening — fra Wikipedia-artikler, blogginlegg, pressemeldinger, fagartikler og tusenvis av andre nettsteder. GEO handler om å påvirke det bildet.'),
        h2('Hva er GEO egentlig?'),
        p('Generative Engine Optimization (GEO) er optimaliseringen av digital tilstedeværelse for å bli gjenkjent, sitert og anbefalt av generative AI-modeller som ChatGPT, Claude, Gemini og fremtidige LLM-er.'),
        p('GEO skiller seg fra AEO (som handler om å strukturere eksisterende innhold for AI-svar) ved at GEO handler om å påvirke selve grunnlaget — treningsdatasettet og den løpende oppdateringen gjennom retrieval-augmented generation (RAG).'),
        h2('Hvorfor norske bedrifter bør handle nå'),
        p('Her er det gode nyheten: AI-modellene har svært lite norsk treningsdata sammenlignet med engelsk. Det betyr at den som bygger norsk autoritet og konsistens nå vil dominere det norske AI-søkelandskapet i kommende år.'),
        p('Dette er et tidsvindu. Som det tidlige internett eller de tidlige Google-rangeringsdagene er det et first-mover-fortrinn tilgjengelig — men bare de som handler nå vil nyte det.'),
        h2('De fem pilarene i GEO'),
        h3('1. Wikipedia og Wikidata'),
        p('Wikipedia er en av de aller viktigste kildene i LLM-treningsdatasett. En Wikipedia-artikkel om bedriften din (eller bransjen der du er prominert nevnt) gir direkte innflytelse over hva AI sier om deg.'),
        h3('2. Pressedekning fra autoritative medier'),
        p('Artikler om bedriften din i VG, E24, Aftenposten, Dagens Næringsliv og relevante bransjemedier er gull for GEO. AI-modeller vekter disse kildene svært høyt.'),
        h3('3. Fagforum-tilstedeværelse'),
        p('Reddit, Quora og norske bransje-communities er viktige treningskilder for LLM-er. Relevant, hjelpsom deltakelse der bygger omdømme i treningsdatasett over tid.'),
        h3('4. Merkevarekonsistens'),
        p('Konsistens er kritisk for GEO. Bedriftsnavn, beskrivelse, bransje og tilbud skal beskrives identisk på tvers av LinkedIn, Proff.no, Virksomheter.no, bransjekatalogger og egne nettsteder.'),
        h3('5. Løpende AI-monitoring'),
        p('Mål hva AI sier om deg med jevne mellomrom. Bruk konsistente testprompts og noter endringer over tid. Dette er eneste måten å vite om GEO-arbeidet faktisk gir effekt.'),
        h2('Kom i gang med GEO'),
        p('GEO er en langsiktig investering — men første skritt kan tas i dag. Book en gratis GEO-analyse med SalesUp, og vi kartlegger din nåværende AI-synlighet og gir deg en prioritert handlingsplan.'),
      ],
      metaTitle: 'GEO: Generativ synlighet for norske bedrifter | SalesUp',
      metaDescription: 'GEO (Generative Engine Optimization) er fremtidens digitale synlighet. Lær hva det er og hva norske bedrifter bør gjøre nå. Fra SalesUp Norway.',
    },
  ]

  for (const post of posts) {
    await upsert(post)
    console.log(`  ✅ Artikkel: ${post.title.substring(0, 50)}...`)
  }

  // ── 8. Faguttrykk (glossary) ───────────────────────────────────────────────
  console.log('\n📚 Importerer faguttrykk (30 stk)...')

  const terms = [
    { id: 'g-aeo', term: 'AEO (Answer Engine Optimization)', slug: 'aeo', cat: 'aeo', short: 'Optimalisering for å bli valgt som svar av AI-assistenter som ChatGPT, Gemini og Perplexity. AEO bruker FAQ-struktur, Schema.org-data og autoritetsbygging for å sikre at AI velger din kilde fremfor konkurrentens.' },
    { id: 'g-seo', term: 'SEO (Søkemotoroptimalisering)', slug: 'seo', cat: 'seo', short: 'Prosessen med å gjøre en nettside mer synlig i organiske søkeresultater. Bygger på tre pilarer: teknisk fundament (crawling, indeksering, Core Web Vitals), innholdsoptimalisering (søkeintensjon, E-E-A-T) og autoritetsbygging (lenkbygging).' },
    { id: 'g-geo', term: 'GEO (Generative Engine Optimization)', slug: 'geo', cat: 'geo', short: 'Optimalisering for å bli nevnt, anbefalt og sitert av generative AI-modeller (LLM-er) som ChatGPT og Gemini. GEO handler om å påvirke treningsdatasettet og RAG-kildene AI-modeller bruker — ikke bare det de indekserer i dag.' },
    { id: 'g-cro', term: 'CRO (Konverteringsoptimalisering)', slug: 'cro', cat: 'cro', short: 'Prosessen med å øke andelen besøkende som gjennomfører ønsket handling på et nettsted — ta kontakt, kjøpe eller bestille. Bruker A/B-testing, heatmaps, brukeratferdsanalyse og UX-forbedringer.' },
    { id: 'g-serp', term: 'SERP (Search Engine Results Page)', slug: 'serp', cat: 'seo', short: 'Resultatssiden søkemotoren viser etter et søk. I 2026 inkluderer SERP organiske lenker, betalte annonser, Google AI Overviews, featured snippets, bildekaruseller og lokale kartresultater. Synlighet i SERP er målet for SEO.' },
    { id: 'g-cwv', term: 'Core Web Vitals', slug: 'core-web-vitals', cat: 'teknisk', short: 'Googles tre offisielle ytelsesmål for nettsider: LCP (Largest Contentful Paint — lastetid for hovedinnhold, mål under 2,5s), INP (Interaction to Next Paint — responstid, mål under 200ms) og CLS (Cumulative Layout Shift — stabiliteten i sidelayouten, mål under 0,1).' },
    { id: 'g-eeat', term: 'E-E-A-T', slug: 'e-e-a-t', cat: 'seo', short: 'Experience, Expertise, Authoritativeness, Trustworthiness — Googles kvalitetsvurderingsrammeverk for innhold. Brukes av Googles innholdsvurderere og indirekte av rangeringsalgoritmen. Spesielt kritisk for YMYL-innhold (Your Money or Your Life — helse, finans, jus).' },
    { id: 'g-anchor', term: 'Ankertekst (Anchor text)', slug: 'ankertekst', cat: 'seo', short: 'Den synlige, klikkbare teksten i en hyperlenke. Forteller søkemotorer hva den lenkede siden handler om. Over-optimalisert ankertekst (for mange eksakt-match lenker) kan utløse Googles Penguin-algoritme og skade rangeringer.' },
    { id: 'g-canonical', term: 'Canonical URL', slug: 'canonical-url', cat: 'teknisk', short: 'En HTML-tag (<link rel="canonical">) som forteller søkemotorer hvilken URL som er den foretrukne versjonen av en side. Kritisk for å unngå duplisert innhold og konsolidere lenkekraft på riktig URL.' },
    { id: 'g-schema', term: 'Schema.org / Structured Data', slug: 'schema-org', cat: 'aeo', short: 'Felles vokabular for strukturerte data — brukes av Google, Bing, Yahoo og AI-modeller for å forstå innhold maskinlesbart. Implementeres typisk i JSON-LD-format. Viktige typer: FAQPage, Organization, LocalBusiness, Service, Person, Article.' },
    { id: 'g-faqpage', term: 'FAQPage-schema', slug: 'faqpage-schema', cat: 'aeo', short: 'Schema.org-type som strukturerer spørsmål og svar i JSON-LD-format. Gjør innholdet maskinlesbart for Google (featured snippets), AI-crawlere og søkemotorer. Hvert spørsmål-svar-par er et separat Question-objekt med acceptedAnswer.' },
    { id: 'g-intern-lenking', term: 'Intern lenking', slug: 'intern-lenking', cat: 'seo', short: 'Hyperlenker mellom sider på samme nettsted. Hjelper søkemotorer å oppdage og crawle innhold, fordeler lenkeautoritet (PageRank) til viktige sider, og viser brukere og søkemotorer hierarkiet og sammenhengen i nettstedets innhold.' },
    { id: 'g-lcp', term: 'LCP (Largest Contentful Paint)', slug: 'lcp', cat: 'teknisk', short: 'Core Web Vital som måler tid til det største synlige innholdet (bilde, video eller tekst) er lastet. Google anbefaler under 2,5 sekunder for "God"-status. LCP påvirkes av serverhastighet, bildestørrelser og CSS-blokkering.' },
    { id: 'g-llm', term: 'LLM (Large Language Model)', slug: 'llm', cat: 'geo', short: 'Store språkmodeller trent på enorme tekstmengder fra internett — som GPT-4 (OpenAI), Gemini (Google), Claude (Anthropic) og Llama (Meta). De danner grunnlaget for AI-assistenter og generative søkemotorer. Sentralt for GEO-strategi.' },
    { id: 'g-topical-authority', term: 'Topical Authority', slug: 'topical-authority', cat: 'seo', short: 'Graden av faglig autoritet et nettsted oppfattes å ha innen et emneområde av søkemotorer. Bygges gjennom dybdedekning av alle aspekter ved et tema (topic clusters), intern lenking og ekstern anerkjennelse (lenker, sitasjoner, nevninger).' },
    { id: 'g-meta-desc', term: 'Meta description', slug: 'meta-description', cat: 'seo', short: 'Kort HTML-attributt (< 160 tegn) som beskriver sidinnholdet. Vises i søkeresultater under tittelen og brukes av AI som sammendragskilde. Påvirker klikk-gjennomstrøm (CTR) men er ikke direkte rangeringsfaktor.' },
    { id: 'g-longtail', term: 'Long-tail keywords', slug: 'long-tail-keywords', cat: 'seo', short: 'Søkeuttrykk med tre eller flere ord og lav søkevolum, men høy kjøpshensikt. "SEO-byrå i Oslo for nettbutikk" er et long-tail-søk. Long-tail-søk konverterer bedre enn generiske søk og er lettere å rangere på.' },
    { id: 'g-organisk', term: 'Organisk trafikk', slug: 'organisk-trafikk', cat: 'seo', short: 'Besøkende som kommer til nettsiden via klikk på ikke-betalte søkeresultater. Motsetningen til betalt trafikk (Google Ads). Organisk trafikk er mer bærekraftig fordi den ikke stopper når annonsebudsjettet er tomt.' },
    { id: 'g-sokeintensjon', term: 'Søkeintensjon', slug: 'sokeintensjon', cat: 'seo', short: 'Den underliggende hensikten bak et søk. De fire typene: informasjonssøk (lære noe), navigasjonssøk (finne et spesifikt nettsted), kommersielle søk (undersøke alternativer) og transaksjonssøk (kjøpe/kontakte). Innhold må matche intensjonen nøyaktig.' },
    { id: 'g-hreflang', term: 'Hreflang', slug: 'hreflang', cat: 'teknisk', short: 'HTML-attributt som forteller søkemotorer hvilket språk og hvilken region en side er beregnet for. Kritisk for flerspråklige og internasjonale nettsteder for å unngå at Google viser feil språkversjon i feil land.' },
    { id: 'g-sitemap', term: 'XML-sitemap', slug: 'xml-sitemap', cat: 'teknisk', short: 'Maskinlesbar fil (sitemap.xml) som lister alle URL-er på et nettsted med metadata om sist oppdatert, oppdateringsfrekvens og relativ prioritet. Hjelper søkemotorer med crawling og indeksering — spesielt for store nettsteder.' },
    { id: 'g-robots', term: 'Robots.txt', slug: 'robots-txt', cat: 'teknisk', short: 'Tekstfil i rotkatalogen til et nettsted som instruerer søkemotorroboter om hvilke sider som kan og ikke kan crawles. En feil i robots.txt kan blokkere hele nettstedet fra Google — et av de mest alvorlige tekniske SEO-feilene.' },
    { id: 'g-lenkbygging', term: 'Lenkbygging', slug: 'lenkbygging', cat: 'seo', short: 'Prosessen med å skaffe inngående hyperlenker (backlinks) fra andre nettsteder. En av de tre pilarene i SEO. Lenker fra autoritative, relevante nettsteder er det sterkeste rangeringssignalet Google bruker. Effektiv lenkbygging krever redaksjonell fortjeneste.' },
    { id: 'g-da', term: 'Domain Authority (DA)', slug: 'domain-authority', cat: 'seo', short: 'Moz-utviklet prediksjonsmetrikk (0–100) som estimerer et nettsteds evne til å rangere i søkemotorer basert på lenkeprofil. Ikke en offisiell Google-metrikk, men et nyttig komparativt mål. Lignende metrikker: Ahrefs Domain Rating (DR), Semrush Authority Score.' },
    { id: 'g-isr', term: 'ISR (Incremental Static Regeneration)', slug: 'isr', cat: 'teknisk', short: 'Next.js-teknikk som lar statisk genererte sider regenereres i bakgrunnen etter at et bestemt tidsintervall utløper (revalidate). Kombinerer ytelsen til statiske sider med aktualiteten til server-side rendering — brukes for blogg, FAQ og case-sider.' },
    { id: 'g-roas', term: 'ROAS (Return On Ad Spend)', slug: 'roas', cat: 'cro', short: 'Avkastning på annonsekroner. Beregnes som inntekter generert / annonsekostnader. Et ROAS på 5 betyr at 1 000 kr i annonsering genererer 5 000 kr i inntekter. SalesUps klienter oppnår gjennomsnittlig 5× ROAS.' },
    { id: 'g-perplexity', term: 'Perplexity', slug: 'perplexity', cat: 'aeo', short: 'AI-drevet søkemotor som gir direkte svar med kildehenvisninger i sanntid. Viktig kanal for AEO — bedrifter som er strukturert for Perplexity vil siteres direkte i svarene den gir brukere. Bruker råsøk + LLM-syntese.' },
    { id: 'g-featured-snippet', term: 'Featured Snippet', slug: 'featured-snippet', cat: 'seo', short: 'Den fremhevede svarboksen som vises øverst i Google-søkeresultater — over alle organiske lenker (posisjon 0). Hentes fra siden Google mener svarer best på et spørsmål. Optimaliseres med direkte, concise svar og strukturert innhold.' },
    { id: 'g-rag', term: 'RAG (Retrieval-Augmented Generation)', slug: 'rag', cat: 'geo', short: 'Teknikk der AI-modeller søker i sanntid (retrieval) og kombinerer funnene med egen kunnskap (generation) for å svare. Brukes av ChatGPT med nettilgang, Perplexity og Google AI Overviews. GEO-optimalisering som er relevant for RAG er kritisk for moderne AI-synlighet.' },
    { id: 'g-slug', term: 'Slug', slug: 'slug', cat: 'teknisk', short: 'Den URL-vennlige identifikatoren i en webadresse. I URL-en "/tjenester/seo" er "seo" slugen. En god slug er kort, beskrivende og inneholder målsøkeordet. Unngå spesialtegn og æøå — bruk ae, o, a.' },
  ]

  for (const t of terms) {
    await upsert({
      _id: `glossary-${t.id.replace('g-', '')}`,
      _type: 'glossaryTerm',
      term: t.term,
      slug: slug(t.slug),
      shortDefinition: t.short,
      category: t.cat,
      fullDefinition: [
        p(t.short),
        h2(`Mer om ${t.term}`),
        p(`${t.term} er et sentralt begrep innen digital markedsføring og SEO. For å lære mer om hvordan dette henger sammen med SalesUps tjenester, se vår oversikt over ${t.cat === 'seo' ? 'søkemotoroptimalisering' : t.cat === 'aeo' ? 'AI-svarsoptimalisering' : t.cat === 'geo' ? 'generativ synlighet' : 'konverteringsoptimalisering'}.`),
      ],
    })
    console.log(`  ✅ Faguttrykk: ${t.term.substring(0, 40)}`)
  }

  console.log('\n\n✅ ======================================')
  console.log('   ALL INNHOLD IMPORTERT VELLYKKET!')
  console.log('========================================')
  console.log('\nDokumenter opprettet:')
  console.log('  • 1  siteSettings')
  console.log('  • 6  tjenester')
  console.log('  • 2  teammedlemmer')
  console.log('  • 6  testimonials')
  console.log('  • 8  FAQ-spørsmål')
  console.log('  • 2  case studies')
  console.log('  • 4  bloggartikler')
  console.log(`  • ${terms.length}  faguttrykk`)
  console.log(`\n  Total: ${1 + 6 + 2 + 6 + 8 + 2 + 4 + terms.length} dokumenter\n`)
}

importAll().catch((err) => {
  console.error('❌ Import feilet:', err.message)
  process.exit(1)
})
