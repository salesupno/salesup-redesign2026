import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'
import StudioClient from './StudioClient'

export const metadata = studioMetadata
export const viewport = studioViewport
export const dynamic = 'force-static'

export default function StudioPage() {
  return <StudioClient />
}
