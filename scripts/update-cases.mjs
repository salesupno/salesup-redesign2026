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
const p = t => ({ _type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: k(), text: t }] })
const h2 = t => ({ _type: 'block', _key: k(), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: k(), text: t }] })

// ─── 1. Rename Jøtul case → Smart Varme ─────────────────────────────────────
await client.createOrReplace({
  _id: 'case-smart-varme',
  _type: 'caseStudy',
  clientName: 'Smart Varme',
  'slug': { _type: 'slug', current: 'smart-varme' },
  industry: 'Peisovner & vedovner / Installasjon',
  excerpt: 'Fra null til #1 på "peisovn Bergen" — Smart Varme dominerer nå lokalt søk på peiser, vedovner og peisrehabiliterering i hele Vestlandet.',
  featured: true,
  metrics: [
    { _key: k(), value: '+280%', label: 'organisk trafikk', period: '9 mnd' },
    { _key: k(), value: '+140%', label: 'organiske forespørsler', period: '9 mnd' },
    { _key: k(), value: '#1', label: '"peisovn Bergen" Google' },
  ],
  body: [
    h2('Utfordringen'),
    p('Smart Varme selger og rehabiliterer peiser og vedovner i Bergensregionen. De hadde god håndverkerkompetanse, men nesten ingen digital synlighet. Konkurrentene dominerte Google lokalt, og de fleste kundene kom via jungeltelegrafen.'),
    h2('Hva vi gjorde'),
    p('Vi bygget en lokal SEO-strategi rundt de søketermene som driver faktisk kjøpsintensjon: "peisovn Bergen", "vedovn installasjon Bergen", "peisrehabilitering Vestlandet". Kombinert med Google Business-optimalisering og strukturert innhold ble Smart Varme synlig der kundene faktisk søker.'),
    h2('Resultater'),
    p('Innen 9 måneder hadde Smart Varme tatt #1-posisjon på sine viktigste søkeord. Forespørsler via nettsiden økte med 140 %, og sesongsvingningene ble jevnet ut gjennom helårlig innholdsoptimalisering.'),
  ],
  testimonial: {
    quote: 'Vi hadde ikke trodd at SEO kunne gjøre så stor forskjell for et lokalt håndverkerfirma. SalesUp skjønte bransjen vår og hva kundene faktisk søker etter — peiser, vedovner, rehabilitering. Resultatet taler for seg selv.',
    author: 'Daglig leder',
    company: 'Smart Varme',
  },
  services: [{ _type: 'reference', _ref: 'service-seo' }],
  sortOrder: 1,
  metaTitle: 'Smart Varme — fra usynlig til #1 på peisovner i Bergen | SalesUp',
  metaDescription: 'Se hvordan Smart Varme økte organisk trafikk med 280% og dominerer lokalt søk på peisovner og vedovner i Bergensregionen.',
})
console.log('✅ case-smart-varme')

// Slett gammelt Jøtul-case
try { await client.delete('case-jotul'); console.log('✅ Slettet case-jotul') } catch { console.log('ℹ️  case-jotul fantes ikke') }

// ─── 2. Ny case: Ditt Uterom ─────────────────────────────────────────────────
kc = 100
await client.createOrReplace({
  _id: 'case-ditt-uterom',
  _type: 'caseStudy',
  clientName: 'Ditt Uterom',
  'slug': { _type: 'slug', current: 'ditt-uterom' },
  industry: 'Hage & uterom',
  excerpt: 'Ditt Uterom gikk fra å konkurrere på pris til å eie søkeresultatene for inspirasjon og rådgivning — noe som tiltrakk kunder med høyere kjøpsintensjon.',
  featured: true,
  metrics: [
    { _key: k(), value: '+195%', label: 'organisk trafikk', period: '8 mnd' },
    { _key: k(), value: '+67%', label: 'prosjektforespørsler', period: '8 mnd' },
    { _key: k(), value: 'Top 3', label: '"uterom ideer" Google' },
  ],
  body: [
    h2('Utfordringen'),
    p('Ditt Uterom er en spesialist på uteromsløsninger, men slet med å skille seg ut i et marked dominert av store byggevareaktører. Nettsiden trakk lite organisk trafikk, og de fleste besøkende kom fra betalt annonsering.'),
    h2('Strategi'),
    p('Vi identifiserte et gap: folk søker etter inspirasjon og ideer lenge før de er klare til å kjøpe. Vi bygde et inspirasjonsunivers med innhold rundt "uterom ideer", "terrasseinspirasjon" og "hagedesign" — innhold som trekker besøkende i alle kjøpsfaser.'),
    h2('Resultater'),
    p('Organisk trafikk ble tredoblet på 8 måneder. Viktigst: kvaliteten på forespørslene økte markant — kunder som kom via organisk søk hadde tydelig høyere kjøpsintensjon enn annonsetrafikken.'),
  ],
  testimonial: {
    quote: 'SalesUp forstår at salg av uterom handler om drømmer og inspirasjon, ikke bare spesifikasjoner. Innholdsstrategien de la opp har endret hvem som kontakter oss — og det merkes på ordrestørrelsen.',
    author: 'Eier',
    company: 'Ditt Uterom',
  },
  services: [{ _type: 'reference', _ref: 'service-seo' }],
  sortOrder: 2,
  metaTitle: 'Ditt Uterom — +195% organisk trafikk med innholdsstrategi | SalesUp',
  metaDescription: 'Slik hjalp SalesUp Ditt Uterom å tredoble organisk trafikk og tiltrekke kunder med høyere kjøpsintensjon gjennom inspirasjonssøk.',
})
console.log('✅ case-ditt-uterom')

// ─── 3. Oppdater First Camp case ─────────────────────────────────────────────
kc = 200
await client.createOrReplace({
  _id: 'case-firstcamp',
  _type: 'caseStudy',
  clientName: 'First Camp',
  'slug': { _type: 'slug', current: 'first-camp' },
  industry: 'Camping & friluftsliv',
  excerpt: 'Nordeuropas ledende campingkjede økte organisk trafikk med 21,9 % på 6 måneder og økte andelen salg fra organisk søk fra 30 % til 41 %.',
  featured: true,
  metrics: [
    { _key: k(), value: '+21,9%', label: 'organisk trafikk', period: '6 mnd' },
    { _key: k(), value: '41%', label: 'salg fra organisk søk', period: '12 mnd' },
    { _key: k(), value: '+34%', label: 'AI-synlighet camping' },
  ],
  body: [
    h2('Utfordringen'),
    p('First Camp er Skandinavias største campingkjede med lokasjoner i Sverige, Danmark og Norge. Utfordringen: millioner av potensielle campingkunder søker hvert år, men First Camp tapte synlighet til aggregatorer og bookingplattformer.'),
    h2('Strategi: SEO + AEO på tvers av markeder'),
    p('Vi la opp en flermarkedsstrategi som kombinerte tradisjonell SEO for transaksjonelle søkeord ("camping Sverige", "campingplass Gotland") med AEO-optimalisering for inspirasjons- og informasjonssøk. Spesielt AI-synlighet ble prioritert — ChatGPT og Perplexity anbefaler nå First Camp på spørsmål om familieferier i Skandinavia.'),
    h2('Resultater'),
    p('Organisk trafikk opp 21,9 % på 6 måneder. Enda viktigere: andelen av total omsetning som kom fra organisk søk økte fra 30 % til 41 % over 12 måneder — noe som reduserer avhengigheten av dyr betalt annonsering betydelig.'),
  ],
  testimonial: {
    quote: 'SalesUp hjalp oss med å øke organisk trafikk med 21,9 % på 6 måneder. Andelen salg fra organisk søk og AI har gått fra 30 % til 41 % på 12 måneder. Det er resultater som faktisk monner.',
    author: 'Digital Manager',
    company: 'First Camp',
  },
  services: [{ _type: 'reference', _ref: 'service-seo' }, { _type: 'reference', _ref: 'service-aeo' }],
  sortOrder: 3,
  metaTitle: 'First Camp — +21,9% organisk trafikk på 6 måneder | SalesUp',
  metaDescription: 'Se hvordan SalesUp hjalp First Camp å øke organisk trafikk med 21,9% og øke andelen salg fra organisk søk til 41% på 12 måneder.',
})
console.log('✅ case-firstcamp')

// ─── 4. Ny case: Norweh.com ───────────────────────────────────────────────────
kc = 300
await client.createOrReplace({
  _id: 'case-norweh',
  _type: 'caseStudy',
  clientName: 'Norweh.com',
  'slug': { _type: 'slug', current: 'norweh' },
  industry: 'E-handel / USA',
  excerpt: 'Dobling av organisk synlighet på 2 måneder for norsk e-handelsaktør med vekstambisjoner i det amerikanske markedet.',
  featured: false,
  metrics: [
    { _key: k(), value: '2×', label: 'organisk synlighet', period: '2 mnd' },
    { _key: k(), value: '+118%', label: 'organisk klikk (US)', period: '2 mnd' },
    { _key: k(), value: 'Top 10', label: 'prioriterte søkeord US' },
  ],
  body: [
    h2('Utfordringen'),
    p('Norweh.com er en norsk nettbutikk med ambisjoner om vekst i det amerikanske markedet. Startsituasjonen: minimal synlighet i Google US, sterk konkurranse fra etablerte aktører og behov for å bygge domeneautoritet fra bunnen.'),
    h2('Strategi'),
    p('Vi prioriterte en kombinasjon av teknisk SEO-grunnarbeid og innholdsbasert autoritetbygging. Fokus på søkeord med middels konkurranse der vi raskt kunne konkurrere, kombinert med strukturert data og AEO-innhold for å fange AI-siteringer.'),
    h2('Resultater'),
    p('To måneder inn: organisk synlighet doblet, klikk fra det amerikanske markedet opp 118 %. Veksten fortsetter — dette er et prosjekt i sterk fremdrift.'),
  ],
  testimonial: {
    quote: 'Vi trodd at organisk vekst i USA ville ta minst ett år å se resultater fra. SalesUp leverte doblet synlighet på to måneder. Imponerende tempo.',
    author: 'Grunnlegger',
    company: 'Norweh.com',
  },
  services: [{ _type: 'reference', _ref: 'service-seo' }, { _type: 'reference', _ref: 'service-geo' }],
  sortOrder: 4,
  metaTitle: 'Norweh.com — Dobling av organisk synlighet i USA på 2 måneder | SalesUp',
  metaDescription: 'Se hvordan SalesUp doblet organisk synlighet for Norweh.com i det amerikanske markedet på bare 2 måneder.',
})
console.log('✅ case-norweh')

// ─── 5. Oppdater testimonials ─────────────────────────────────────────────────

// Smart Varme (erstatter Jøtul)
await client.createOrReplace({
  _id: 'testimonial-smart-varme',
  _type: 'testimonial',
  company: 'Smart Varme',
  author: 'Daglig leder',
  quote: 'Vi hadde ikke trodd at SEO kunne gjøre så stor forskjell for et lokalt håndverkerfirma. SalesUp skjønte bransjen vår — peiser, vedovner, rehabilitering — og resultatet taler for seg selv. Vi er nå #1 på de søkene som faktisk gir kunder.',
  rating: 5,
  sortOrder: 1,
})
console.log('✅ testimonial-smart-varme')

// Slett gammelt Jøtul-testimonial
try { await client.delete('testimonial-jotul'); console.log('✅ Slettet testimonial-jotul') } catch { console.log('ℹ️  testimonial-jotul fantes ikke') }

// Dyreparken (ny)
await client.createOrReplace({
  _id: 'testimonial-dyreparken',
  _type: 'testimonial',
  company: 'Dyreparken',
  author: 'Markedssjef',
  quote: 'SalesUp hjelper oss å bli funnet av familier som planlegger Sørlandsopplevelser — enten de søker etter Kaptein Sabeltann, Hakkebakkeskogen eller overnatting i Kristiansand. AI-synligheten de har bygget for oss er imponerende.',
  rating: 5,
  sortOrder: 2,
})
console.log('✅ testimonial-dyreparken')

// Ditt Uterom (ny)
await client.createOrReplace({
  _id: 'testimonial-ditt-uterom',
  _type: 'testimonial',
  company: 'Ditt Uterom',
  author: 'Eier',
  quote: 'SalesUp forstår at salg av uterom handler om drømmer og inspirasjon. Innholdsstrategien har endret hvem som kontakter oss — kunder med høyere kjøpsintensjon og større prosjekter.',
  rating: 5,
  sortOrder: 3,
})
console.log('✅ testimonial-ditt-uterom')

// First Camp (oppdater eksisterende)
await client.patch('testimonial-firstcamp').set({
  quote: 'SalesUp hjalp oss med å øke organisk trafikk med 21,9 % på 6 måneder. Andelen salg fra organisk søk og AI har gått fra 30 % til 41 % på 12 måneder. Det er resultater som faktisk monner.',
  author: 'Digital Manager',
  company: 'First Camp',
  rating: 5,
  sortOrder: 4,
}).commit()
console.log('✅ testimonial-firstcamp (oppdatert)')

console.log('\n✅ Alle oppdateringer ferdig!')
