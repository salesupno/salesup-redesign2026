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

let kc = 0
const k = () => `k${++kc}`
const slug = s => ({ _type: 'slug', current: s })
const p = t => ({ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: t }] })
const h2 = t => ({ _type: 'block', _key: k(), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: k(), text: t }] })

const products = [
  {
    _id: 'product-seo-tracker',
    _type: 'product',
    title: 'SEOTracker',
    slug: slug('seo-tracker'),
    category: 'saas',
    badge: 'SaaS-verktøy',
    tagline: 'Se nøyaktig hva organisk søk, Google Ads, AI-søk og alle andre kanaler faktisk gir deg i omsetning — i ett dashboard.',
    pitch: 'Det eneste SEO-verktøyet som viser deg hva organisk synlighet faktisk er verdt i kroner.',
    description: 'SEOTracker er bygget for nettbutikker som vil vite mer enn hvilken posisjon de er på. Du ser rangeringer, kjøpsintensjon per søkeord, om nøkkelordet faktisk er i H1 og metatittel — og du ser hva trafikken er verdt i faktisk omsetning. Koblet mot GA4 eller Piwik Pro får du multi-channel revenue-attribusjon der AI-søk er en egen kanal, ikke en ukjent darkroom.',
    externalUrl: 'https://seo-tracker.com',
    features: [
      { _key: k(), title: 'Revenue-attribusjon per søkeord', description: 'Se nøyaktig hvilke søkeord som genererer omsetning — ikke bare trafikk. Koblet direkte mot GA4 eller Piwik Pro.' },
      { _key: k(), title: 'AI-søk som egen kanal', description: 'Trafikk fra ChatGPT, Perplexity og Gemini vises som separate kanaler — ikke gjemt i "direct" eller "other".' },
      { _key: k(), title: 'Rangeringsovervåking med kjøpshensikt', description: 'Hvert søkeord scores etter kjøpshensikt. Du vet hvilke rangeringer som faktisk betyr noe for bunnlinjen.' },
      { _key: k(), title: 'H1- og metatittel-samsvar', description: 'Sjekker automatisk om målsøkeordet finnes i H1 og metatittel på den rangerende siden.' },
      { _key: k(), title: 'Multi-channel dashboard', description: 'SEO, Google Ads, AI-søk og direktetrafikk — all revenue samlet i ett oversiktlig dashboard.' },
    ],
    body: [
      h2('Hvorfor er SEOTracker annerledes?'),
      p('De fleste SEO-verktøy forteller deg hvor du rangerer. SEOTracker forteller deg hva rangeringen er verdt. Det er en fundamental forskjell — og den gjør SEO til et forretningsargument, ikke bare et markedsføringsspørsmål.'),
      p('Vi bygget SEOTracker fordi vi selv trengte det. Som SEO-byrå med 100+ klienter satt vi i møter der klientene spurte: "Men hva gir SEO oss egentlig i salg?" Det fantes ikke et verktøy som svarte tydelig på det. Så vi bygde det.'),
      h2('Hvem er SEOTracker for?'),
      p('SEOTracker er bygget for nettbutikker og e-handel med GA4 eller Piwik Pro — primært bedrifter med minst 5 000 besøkende/mnd der SEO og betalt annonsering begge er aktive kanaler.'),
      h2('Integrasjoner'),
      p('GA4 (Google Analytics 4), Piwik Pro, Google Search Console og Google Ads. Alle integrasjoner er read-only via OAuth — vi lagrer ingen transaksjonsdata.'),
    ],
    sortOrder: 1,
    metaTitle: 'SEOTracker — Se hva organisk synlighet er verdt i kroner',
    metaDescription: 'SEOTracker viser nøyaktig hva SEO, Google Ads og AI-søk gir deg i omsetning. Multi-channel revenue-attribusjon for nettbutikker. Prøv gratis.',
  },
  {
    _id: 'product-mynk',
    _type: 'product',
    title: 'Mynk',
    slug: slug('mynk'),
    category: 'saas',
    badge: 'SaaS-verktøy',
    tagline: 'Alt du er. Én lenke. Alltid oppdatert.',
    pitch: 'Du trenger ikke ti lenker. Du trenger én god.',
    description: 'Mynk er det digitale knutepunktet for folk som er lei av å sende folk til fem ulike steder. Én lenke som samler hvem du er, hva du gjør og hvor kundene finner deg — og som fungerer like godt i en LinkedIn-bio som på et visittkort.',
    externalUrl: 'https://mynk.no',
    features: [
      { _key: k(), title: 'Én lenke for alt', description: 'Samle nettsted, LinkedIn, booking, portfolio, kontaktskjema og alt annet på én smart URL.' },
      { _key: k(), title: 'Egendefinert design', description: 'Profil som matcher merkevaren din — ikke en generisk lenke-aggregator.' },
      { _key: k(), title: 'Analytics', description: 'Se hvilke lenker folk klikker på og optimaliser profilen din basert på faktisk atferd.' },
      { _key: k(), title: 'QR-kode', description: 'Automatisk QR-kode til visittkort, presentasjoner og fysisk markedsmateriell.' },
      { _key: k(), title: 'Alltid oppdatert', description: 'Endre innholdet bak lenken når du vil — QR-koden og URL-en forblir den samme.' },
    ],
    body: [
      h2('Det profesjonelle alternativet til Linktree'),
      p('Mynk er bygget for bedrifter og profesjonelle som vil ha én elegant, alltid oppdatert digital identitet — ikke fem ulike lenker spredd rundt i bioer og e-poster.'),
      p('Der andre "link in bio"-verktøy er bygget for influencere, er Mynk bygget for folk som tar den digitale presentasjonen seriøst. Egendefinert domene, profesjonelt design og ekte analytics.'),
      h2('Kom i gang på mynk.no'),
      p('Besøk mynk.no og opprett profilen din på under 5 minutter.'),
    ],
    sortOrder: 2,
    metaTitle: 'Mynk — Én lenke som samler alt du er',
    metaDescription: 'Mynk er din digitale identitet på én lenke. Alt du er, hva du gjør og hvor folk finner deg — samlet på mynk.no. Gratis å starte.',
  },
  {
    _id: 'product-groundrook-seo',
    _type: 'product',
    title: 'GroundRook SEO',
    slug: slug('groundrook-seo'),
    category: 'wordpress-plugin',
    badge: 'WordPress-plugin',
    tagline: 'Det tekniske SEO-grunnlaget din WordPress-side burde hatt fra dag én.',
    pitch: 'Teknisk SEO som sitter der det skal, uten at du tenker på det.',
    description: 'GroundRook legger det tekniske grunnlaget søkemotorer og AI-assistenter forventer å finne — metadata, strukturert data, canonical-lenker og intern lenkehjelp — uten at du trenger å skjønne hva det betyr. Installer, konfigurer én gang, og la det jobbe i bakgrunnen mens du fokuserer på innholdet.',
    features: [
      { _key: k(), title: 'Automatisk metadata-generering', description: 'Meta-titler og -beskrivelser genereres automatisk fra sideinnhold — du godkjenner eller overstyrer.' },
      { _key: k(), title: 'Schema.org JSON-LD', description: 'Organization, LocalBusiness, WebSite og BreadcrumbList injiseres automatisk på riktige sidetyper.' },
      { _key: k(), title: 'Canonical-lenker', description: 'Alle sider får korrekte canonical-tags uten manuell konfigurasjon.' },
      { _key: k(), title: 'XML-sitemap og robots.txt', description: 'Automatisk generert og holdt oppdatert — inkludert prioritert sidekategorisering.' },
      { _key: k(), title: 'Core Web Vitals-advarsler', description: 'Varsler om sider som underpresterer på LCP, INP eller CLS basert på Search Console-data.' },
    ],
    body: [
      h2('Teknisk SEO uten teknisk kompetanse'),
      p('GroundRook er bygget for de 99 % av WordPress-brukere som ikke er SEO-spesialister. Pluginen implementerer alt det tekniske grunnlaget som søkemotorer og AI-assistenter forventer å finne — uten at du trenger å forstå hva canonical-lenker eller JSON-LD er.'),
      p('Installer pluginen, gå gjennom en enkel oppsett-wizard én gang, og la GroundRook holde det tekniske grunnlaget oppdatert automatisk.'),
      h2('Sammenligning med Yoast og Rank Math'),
      p('Der Yoast SEO og Rank Math fokuserer på innholdsoptimalisering og gir deg lange sjekklister å følge, fokuserer GroundRook på å sette opp det tekniske grunnlaget riktig fra start — uten å kreve noe av deg etterpå. De to typene plugins utfyller hverandre.'),
    ],
    sortOrder: 3,
    metaTitle: 'GroundRook SEO — Teknisk SEO-grunnlag for WordPress',
    metaDescription: 'GroundRook legger teknisk SEO på WordPress automatisk: metadata, Schema.org, canonical, sitemap. Installer én gang, la det jobbe. Gratis WordPress-plugin.',
  },
  {
    _id: 'product-pro-faq',
    _type: 'product',
    title: 'Pro FAQ',
    slug: slug('pro-faq'),
    category: 'wordpress-plugin',
    badge: 'WordPress-plugin',
    tagline: 'Spørsmålene kundene stiller. Svarene Google Featured Snippets og ChatGPT velger.',
    pitch: 'FAQ som rangerer i Google og blir sitert av AI — på samme tid.',
    description: 'Pro FAQ er bygget for én ting: at svarene dine faktisk blir funnet. Hvert spørsmål er et eget dokument med egen URL, automatisk FAQPage-schema og innhold strukturert for AI-assistenter. Det er ikke bare en FAQ — det er en AEO-maskin som jobber for deg på Google, Perplexity og ChatGPT samtidig.',
    features: [
      { _key: k(), title: 'Eget dokument og URL per spørsmål', description: 'Hvert FAQ-spørsmål har sin egen side som Google og AI kan indeksere og rangere separat.' },
      { _key: k(), title: 'Automatisk FAQPage-schema', description: 'JSON-LD FAQPage-schema injiseres automatisk på alle FAQ-sider og widgeter uten manuell konfigurering.' },
      { _key: k(), title: 'AEO-optimalisert struktur', description: 'Kortsvars-felt (40–80 ord, AI-klar) + lang svar-felt med støtte for Gutenberg-blokker.' },
      { _key: k(), title: 'Kategorier og tagging', description: 'Organiser spørsmål i kategorier og tag dem til relevante tjenester, produkter og innhold.' },
      { _key: k(), title: 'Widget og shortcode', description: 'Embed FAQ-widget med accordion på tjenestesider og produktsider via shortcode.' },
    ],
    body: [
      h2('FAQ er ikke bare en side — det er en AEO-maskin'),
      p('De fleste WordPress-FAQ-løsninger er en liste med spørsmål og svar på én side. Pro FAQ er noe fundamentalt annerledes: en strukturert FAQ-arkitektur der hvert spørsmål er et eget dokument med SEO-optimalisert URL, AEO-klar innholdsstruktur og automatisk FAQPage-schema.'),
      p('Svarene dine kan rangere individuelt i Google og bli sitert av AI-assistenter som ChatGPT, Perplexity og Gemini — separat fra resten av nettstedet ditt.'),
      h2('Bygget av SEO-spesialister'),
      p('Pro FAQ er utviklet av SalesUp Norway — SEO-byrået som jobber med AEO som profesjonell tjeneste. Pluginen implementerer de samme prinsippene vi bruker for klienter som First Camp, Jøtul og Europris.'),
    ],
    sortOrder: 4,
    metaTitle: 'Pro FAQ — FAQ-plugin for WordPress med AEO og Schema.org',
    metaDescription: 'Pro FAQ er WordPress-pluginen som gjør FAQ til en AEO-maskin. Egne URL-er per spørsmål, automatisk FAQPage-schema og AI-klar struktur.',
  },
  {
    _id: 'product-ai-schema-markup-pro',
    _type: 'product',
    title: 'AI Schema Markup Pro',
    slug: slug('ai-schema-markup-pro'),
    category: 'wordpress-plugin',
    badge: 'WordPress-plugin',
    tagline: 'Fortell søkemotorer og AI-assistenter nøyaktig hva siden din betyr — automatisk.',
    pitch: 'Strukturert data på alle sider, uten at du trenger å kunne skrive en linje JSON.',
    description: 'AI Schema Markup Pro analyserer innholdet ditt og genererer presis JSON-LD-strukturert data for alle sidetyper — artikler, tjenester, produkter, FAQ, personer og organisasjoner. Det er det Google og AI-modeller bruker for å forstå hvem du er og hva du tilbyr. Uten det er du tekst. Med det er du en entitet de velger.',
    features: [
      { _key: k(), title: 'AI-drevet schema-generering', description: 'Analyserer sideinnhold og velger automatisk riktig schema-type: Article, Service, Product, Person, FAQ, Organization.' },
      { _key: k(), title: 'Alle Schema.org-typer', description: 'Støtter 20+ schema-typer inkludert LocalBusiness, Event, HowTo, VideoObject og BreadcrumbList.' },
      { _key: k(), title: 'JSON-LD-editor', description: 'Avanserte brukere kan redigere generert schema direkte i en JSON-LD-editor med validering.' },
      { _key: k(), title: 'Google Rich Results-test', description: 'Innebygd test mot Googles Rich Results API — se om strukturert data er implementert korrekt.' },
      { _key: k(), title: 'WooCommerce-støtte', description: 'Automatisk Product-schema med pris, tilgjengelighet og anmeldelser på alle WooCommerce-produktsider.' },
    ],
    body: [
      h2('Hva er strukturert data og hvorfor betyr det noe?'),
      p('Google og AI-modeller leser nettsider som tekst. Strukturert data (Schema.org i JSON-LD-format) er et maskinlesbart lag som forteller dem nøyaktig hva en side handler om: denne siden er en service, utført av denne organisasjonen, med denne prisen og disse anmeldelsene.'),
      p('Uten strukturert data er nettsiden din tekst Google tolker. Med strukturert data er den en entitet Google forstår — og det er grunnlaget for featured snippets, rich results og AI-svar.'),
      h2('Kompatibel med alle store sidebyggere'),
      p('Gutenberg, Elementor, Divi, WPBakery og alle andre sidebyggere — AI Schema Markup Pro fungerer med alle.'),
    ],
    sortOrder: 5,
    metaTitle: 'AI Schema Markup Pro — Strukturert data for WordPress automatisk',
    metaDescription: 'Automatisk JSON-LD Schema.org for alle WordPress-sider. AI Schema Markup Pro genererer Article, Service, Product, FAQ og 20+ schema-typer.',
  },
  {
    _id: 'product-interne-lenker',
    _type: 'product',
    title: 'Interne lenker',
    slug: slug('interne-lenker'),
    category: 'wordpress-plugin',
    badge: 'WordPress-plugin',
    tagline: 'Lenkeautoritet flyter dit du lenker. Nå flyter den riktig — automatisk.',
    pitch: 'Aldri glem en intern lenke igjen.',
    description: 'Intern lenking er den SEO-mekanismen alle vet de burde gjøre, og ingen gjør konsekvent nok. Pluginen scanner publisert innhold og setter relevante interne lenker automatisk basert på hva du faktisk har skrevet — ikke på søkeord du har hardkodet. Resultatet er at lenkeautoriteten fra sterke sider faktisk når frem til sidene som trenger det.',
    features: [
      { _key: k(), title: 'Kontekstuell lenkeoppdaging', description: 'Scanner publisert innhold og identifiserer lenkmuligheter basert på semantisk relevans — ikke bare eksakt nøkkelordmatch.' },
      { _key: k(), title: 'Automatisk eller manuell godkjenning', description: 'Velg mellom automatisk innsetting av lenker eller godkjenning av forslag én og én.' },
      { _key: k(), title: 'Lenkeautoritet-visualisering', description: 'Se hvilke sider som sender lenkeautoritet og hvilke sider som mangler innkommende lenker.' },
      { _key: k(), title: 'Ankertekst-variasjon', description: 'Bruker varierende ankertekster for naturlig lenkeprofil — unngår over-optimalisering.' },
      { _key: k(), title: 'Eksklusions-liste', description: 'Definer sider som aldri skal lenkifiseres automatisk — login, personvern, handlekurv.' },
    ],
    body: [
      h2('Den glemte SEO-gevinsten'),
      p('Intern lenking er et av de mest undervurderte SEO-tiltakene. Det koster ingenting, krever ikke ekstern godkjenning og har umiddelbar effekt på hvordan lenkeautoriteten din fordeles internt. Problemet: det er kjedelig og tidkrevende å gjøre manuelt — og derfor blir det ikke gjort.'),
      p('Interne lenker-pluginen løser det ved å automatisere prosessen basert på semantisk relevans. Den finner naturlige lenkmuligheter i eksisterende og nytt innhold og setter dem inn — enten automatisk eller for godkjenning.'),
      h2('Kompatibel med Classic Editor og Gutenberg'),
      p('Pluginen fungerer med Classic Editor, Gutenberg og alle populære sidebyggere.'),
    ],
    sortOrder: 6,
    metaTitle: 'Interne lenker — Automatisk intern lenking for WordPress',
    metaDescription: 'WordPress-plugin som setter relevante interne lenker automatisk. Styrk lenkeautoriteten og SEO uten manuelt arbeid. Gratis og pro-versjon.',
  },
  {
    _id: 'product-pro-faq-shopify',
    _type: 'product',
    title: 'Pro FAQ for Shopify',
    slug: slug('pro-faq-shopify'),
    category: 'shopify-app',
    badge: 'Shopify-app',
    tagline: 'Kunden som får svar på produktsiden, legger i handlekurven. Den som ikke gjør det, lukker fanen.',
    pitch: 'Svar på spørsmålene før kunden stiller dem. Selg mer. Support mindre.',
    description: 'Pro FAQ for Shopify gir butikken din en dedikert /faq/-side med kategorier og egne poster per spørsmål — og legger kundenes viktigste spørsmål direkte inn på produktsidene med automatisk FAQPage-schema. Færre support-tickets, høyere konverteringsrate og synlighet i AI-søk — fra én app, uten temaendringer.',
    features: [
      { _key: k(), title: 'Egne FAQ-poster per spørsmål', description: 'Hvert spørsmål er en separat post med URL, kategorisering og automatisk FAQPage-schema.' },
      { _key: k(), title: 'Produktside-FAQ', description: 'Legg spørsmål direkte på spesifikke produktsider — uten temaendringer eller kode.' },
      { _key: k(), title: 'Automatisk FAQPage-schema', description: 'JSON-LD FAQPage-schema injiseres automatisk på alle FAQ-sider og produktsider med FAQ.' },
      { _key: k(), title: 'Support-integrasjon', description: 'Kobles mot Gorgias og Zendesk — FAQ foreslås automatisk basert på support-tickets.' },
      { _key: k(), title: 'Søkemotor og AI-optimalisert', description: 'Strukturert for å rangere i Google Featured Snippets og bli sitert av Perplexity og ChatGPT.' },
    ],
    body: [
      h2('Konvertering starter med svar'),
      p('60–80 % av kunder forlater en produktside fordi de ikke finner svar på spørsmålet sitt. Pro FAQ for Shopify løser to problemer på én gang: færre support-tickets og høyere konverteringsrate.'),
      h2('AI-søk som konkurransefortrinn'),
      p('Shopify-butikker som har FAQ-innhold strukturert for AI vil bli anbefalt av ChatGPT og Perplexity når kunder søker etter produkter i din kategori.'),
      h2('Uten temaendringer'),
      p('Pro FAQ for Shopify fungerer med alle temaer uten kodeendringer. App-blokker legges til i Shopify Theme Editor — ingen utvikler nødvendig.'),
    ],
    sortOrder: 7,
    metaTitle: 'Pro FAQ for Shopify — FAQ-app med Schema.org og AEO',
    metaDescription: 'Pro FAQ for Shopify: dedikert FAQ-side, produktside-FAQ og automatisk FAQPage-schema. Selg mer, support mindre. 14 dager gratis.',
  },
]

let count = 0
for (const prod of products) {
  await client.createOrReplace(prod)
  console.log(`✅ ${prod.title}`)
  count++
}
console.log(`\n✅ ${count} produkter importert!`)
