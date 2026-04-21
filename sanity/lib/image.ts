import imageUrlBuilder from '@sanity/image-url'
import { projectId, dataset } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
