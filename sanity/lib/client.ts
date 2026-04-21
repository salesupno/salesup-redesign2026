import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = '2025-04-21'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// Sanity client med write-token (kun server-side)
export function getServerClient(token?: string) {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token ?? process.env.SANITY_API_TOKEN,
  })
}
