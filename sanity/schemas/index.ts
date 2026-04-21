import { faqQuestion } from './faqQuestion'
import { siteSettings } from './siteSettings'
import { teamMember } from './teamMember'
import { glossaryTerm } from './glossaryTerm'
import { service } from './service'
import { post } from './post'
import { caseStudy } from './caseStudy'
import { testimonial } from './testimonial'

export const schemaTypes = [
  // Singleton
  siteSettings,
  // Core content
  faqQuestion,
  service,
  post,
  caseStudy,
  glossaryTerm,
  teamMember,
  testimonial,
]
