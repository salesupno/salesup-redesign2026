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

function hasAnyMissingKey(arr) {
  return arr.some(item => !item._key)
}

function addKeys(arr) {
  return arr.map(item => {
    const fixed = { ...item }
    if (!fixed._key) fixed._key = makeKey()
    for (const [k, v] of Object.entries(fixed)) {
      if (Array.isArray(v)) fixed[k] = addKeys(v)
    }
    return fixed
  })
}

// Check all document types that could have arrays
const types = ['caseStudy', 'service', 'teamMember', 'post', 'faqQuestion', 'glossaryTerm', 'product', 'siteSettings']

for (const type of types) {
  const docs = await client.fetch(`*[_type == "${type}"]`)
  if (!docs.length) continue

  for (const doc of docs) {
    const problemFields = []
    for (const [key, val] of Object.entries(doc)) {
      if (Array.isArray(val) && hasAnyMissingKey(val)) {
        const missing = val.filter(item => !item._key).length
        problemFields.push({ key, missing, total: val.length })
      }
    }
    if (problemFields.length > 0) {
      console.log(`\n⚠️  ${type} / ${doc._id} (${doc.title || doc.name || doc.question || ''})`)
      for (const { key, missing, total } of problemFields) {
        console.log(`   ${key}: ${missing}/${total} mangler _key`)
      }
      // Fix it
      const patch = client.patch(doc._id)
      for (const { key } of problemFields) {
        patch.set({ [key]: addKeys(doc[key]) })
      }
      await patch.commit()
      console.log(`   → fikset!`)
    }
  }
}

console.log('\n✅ Ferdig — alle dokumenter sjekket.')
