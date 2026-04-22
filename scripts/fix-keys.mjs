import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: 'xlo44g1n',
  dataset: 'production',
  apiVersion: '2025-04-22',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function makeKey() {
  return randomBytes(6).toString('hex')
}

function addKeys(arr) {
  return arr.map(item => {
    const fixed = { ...item }
    if (!fixed._key) fixed._key = makeKey()
    // Recurse into nested arrays
    for (const [k, v] of Object.entries(fixed)) {
      if (Array.isArray(v)) {
        fixed[k] = addKeys(v)
      }
    }
    return fixed
  })
}

const doc = await client.fetch('*[_type == "siteSettings"][0]')
if (!doc) { console.log('Ingen siteSettings funnet'); process.exit(1) }

console.log('Sjekker arrays i siteSettings...')
const patch = client.patch(doc._id)
let changed = false

for (const [key, val] of Object.entries(doc)) {
  if (Array.isArray(val)) {
    const missing = val.filter(item => !item._key).length
    console.log(`  ${key}: ${val.length} items, ${missing} mangler _key`)
    if (missing > 0) {
      patch.set({ [key]: addKeys(val) })
      changed = true
    }
  }
}

if (changed) {
  await patch.commit()
  console.log('\n✅ Alle _key-er fikset!')
} else {
  console.log('\nIngen arrays manglet _key — allerede i orden.')
}
