// Reparerer arrays som ble ødelagt av fix-all-keys.mjs
// String-arrays skal være strings, IKKE objects med { 0, 1, 2, _key }
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

// Rekonstruer string fra feilaktig spredt objekt { 0: 'S', 1: 'E', 2: 'O', _key: ... }
function reconstructString(obj) {
  const chars = []
  let i = 0
  while (obj[String(i)] !== undefined) {
    chars.push(obj[String(i)])
    i++
  }
  return chars.join('')
}

function isBrokenStringObj(item) {
  return typeof item === 'object' && item !== null && '0' in item
}

function restoreStringArray(arr) {
  return arr.map(item => isBrokenStringObj(item) ? reconstructString(item) : item)
}

// Felt som SKAL være arrays av strings (ikke objects)
const stringArrayFields = {
  teamMember: ['expertiseAreas'],
  service: ['tags'],
  post: ['tags'],
  caseStudy: ['services'],
  product: ['features'],
}

for (const [type, fields] of Object.entries(stringArrayFields)) {
  const docs = await client.fetch(`*[_type == "${type}"]`)
  if (!docs.length) continue

  for (const doc of docs) {
    const patch = client.patch(doc._id)
    let changed = false

    for (const field of fields) {
      const arr = doc[field]
      if (!Array.isArray(arr)) continue
      if (!arr.some(isBrokenStringObj)) continue

      const restored = restoreStringArray(arr)
      console.log(`⚠️  ${type}/${doc._id}.${field}: ${JSON.stringify(arr.slice(0,2))} → ${JSON.stringify(restored.slice(0,2))}`)
      patch.set({ [field]: restored })
      changed = true
    }

    if (changed) {
      await patch.commit()
      console.log(`   → fikset!`)
    }
  }
}

// caseStudy.services er litt spesielt - sjekk om det er strings eller objects
// (det kan lovlig være referanser til service-dokumenter)
console.log('\n✅ Ferdig — alle string-arrays reparert.')
