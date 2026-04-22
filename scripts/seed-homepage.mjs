import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] })
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'xlo44g1n',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-04-22',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// ─── AI-siteringer ─────────────────────────────────────────────────────────────
const citations = [
  { id: 'aic-01', source: 'Perplexity',  company: 'SalesUp Norway',    query: '"AEO byrå Norge"',            minutesAgo: 2,  sortOrder: 1  },
  { id: 'aic-02', source: 'ChatGPT',     company: 'First Camp Sverige', query: '"SEO camping Skandinavia"',   minutesAgo: 5,  sortOrder: 2  },
  { id: 'aic-03', source: 'Claude',      company: 'SalesUp Norway',    query: '"organisk vekst strategi"',   minutesAgo: 9,  sortOrder: 3  },
  { id: 'aic-04', source: 'Gemini',      company: 'Dyreparken',         query: '"markedsføring opplevelse"',  minutesAgo: 13, sortOrder: 4  },
  { id: 'aic-05', source: 'Perplexity',  company: 'Smart Varme',        query: '"vedovn installatør Bergen"', minutesAgo: 17, sortOrder: 5  },
  { id: 'aic-06', source: 'ChatGPT',     company: 'SalesUp Norway',    query: '"beste SEO byrå Oslo"',       minutesAgo: 22, sortOrder: 6  },
  { id: 'aic-07', source: 'Claude',      company: 'First Camp Danmark', query: '"outdoor SEO campingplass"',  minutesAgo: 26, sortOrder: 7  },
  { id: 'aic-08', source: 'Copilot',     company: 'Ditt Uterom',        query: '"hagespesialist synlighet"',  minutesAgo: 31, sortOrder: 8  },
  { id: 'aic-09', source: 'Gemini',      company: 'SalesUp Norway',    query: '"GEO generativ søk"',         minutesAgo: 35, sortOrder: 9  },
  { id: 'aic-10', source: 'Perplexity',  company: 'Smart Varme',        query: '"peisovn Bergen"',            minutesAgo: 40, sortOrder: 10 },
  { id: 'aic-11', source: 'ChatGPT',     company: 'First Camp Norge',   query: '"familiecamping tips"',       minutesAgo: 44, sortOrder: 11 },
  { id: 'aic-12', source: 'Claude',      company: 'Dyreparken',         query: '"Kaptein Sabeltann billett"', minutesAgo: 49, sortOrder: 12 },
  { id: 'aic-13', source: 'Copilot',     company: 'Ditt Uterom',        query: '"uterom ideer inspirasjon"',  minutesAgo: 53, sortOrder: 13 },
  { id: 'aic-14', source: 'Gemini',      company: 'SalesUp Norway',    query: '"AEO vs SEO forskjell"',      minutesAgo: 58, sortOrder: 14 },
  { id: 'aic-15', source: 'Perplexity',  company: 'Norweh.com',         query: '"norsk nettbutikk USA"',      minutesAgo: 63, sortOrder: 15 },
  { id: 'aic-16', source: 'ChatGPT',     company: 'SalesUp Norway',    query: '"AEO agency Scandinavia"',    minutesAgo: 68, sortOrder: 16 },
  { id: 'aic-17', source: 'Gemini',      company: 'First Camp Sverige', query: '"camping booking Sverige"',   minutesAgo: 72, sortOrder: 17 },
  { id: 'aic-18', source: 'Claude',      company: 'SalesUp Norway',    query: '"AI synlighet byrå"',         minutesAgo: 77, sortOrder: 18 },
  { id: 'aic-19', source: 'Copilot',     company: 'Smart Varme',        query: '"peisrehabilitering pris"',   minutesAgo: 82, sortOrder: 19 },
  { id: 'aic-20', source: 'Perplexity',  company: 'Ditt Uterom',        query: '"hagedesign trender 2026"',   minutesAgo: 87, sortOrder: 20 },
]

for (const c of citations) {
  await client.createOrReplace({
    _id: c.id,
    _type: 'aiCitation',
    source: c.source,
    company: c.company,
    query: c.query,
    minutesAgo: c.minutesAgo,
    active: true,
    sortOrder: c.sortOrder,
  })
  process.stdout.write(`✅ ${c.id} — ${c.source}: ${c.company}\n`)
}

// ─── siteSettings — legg til nye felt ─────────────────────────────────────────
const existingSettings = await client.fetch('*[_type == "siteSettings"][0]{_id}')

const processSteps = [
  { _key: 's1', num: '01', title: 'Synlighetsanalyse & gap-kartlegging', body: 'Vi ser på hele det digitale fotavtrykket ditt — Google, AI-kanaler og konkurrentlandskapet.' },
  { _key: 's2', num: '02', title: 'Strategi på tvers av SEO, AEO og GEO', body: 'Én koordinert plan — ikke tre separate siloer.' },
  { _key: 's3', num: '03', title: 'Aktiv implementering og lenkbygging', body: 'Vi gjør jobben. Innhold, tekniske tiltak og ekte ubetalte lenker.' },
  { _key: 's4', num: '04', title: 'Rapportering på det som betyr noe', body: 'Rangeringer, trafikk og faktiske leads — ikke bare aktivitetsrapporter.' },
]

const heroMetrics = [
  { _key: 'm1', value: '100+', label: 'kunder hjulpet' },
  { _key: 'm2', value: '20 år', label: 'SEO-erfaring' },
  { _key: 'm3', value: '5× ROAS', label: 'dokumentert snitt' },
]

const newFields = {
  heroBadge: 'Norges første SEO + AEO + GEO-byrå',
  heroHeading: 'Synlighet som bygges,',
  heroHeadingAccent: 'ikke leies.',
  heroIngress: 'Vi hjelper ambisiøse bedrifter å bli funnet — i Google, i AI-assistenter og på tvers av alle kanaler der kundene faktisk søker.',
  heroPrimaryCTA: { label: 'Få gratis synlighetsanalyse →', href: '/kontakt' },
  heroSecondaryCTA: { label: 'Se resultater', href: '/resultater' },
  metrics: heroMetrics,
  processSteps,
  featuredCaseClientName: 'Smart Varme',
  featuredCaseStat: '+280%',
  featuredCaseStatLabel: 'økning i organisk trafikk over 9 måneder',
  featuredCaseQuote: 'Vi hadde ikke trodd at SEO kunne gjøre så stor forskjell for et lokalt håndverkerfirma. SalesUp skjønte bransjen vår og resultatet taler for seg selv.',
  featuredCaseAuthor: 'Daglig leder, Smart Varme',
  featuredCaseSlug: 'smart-varme',
  urgencyText: '2 ledige analyseplasser denne uken',
}

if (existingSettings?._id) {
  await client.patch(existingSettings._id).set(newFields).commit()
  console.log(`✅ siteSettings oppdatert (${existingSettings._id})`)
} else {
  await client.create({ _type: 'siteSettings', ...newFields })
  console.log('✅ siteSettings opprettet (ny)')
}

console.log('\n✅ Seed ferdig!')
