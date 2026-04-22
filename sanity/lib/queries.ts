import { groq } from 'next-sanity'

// ─── SiteSettings ─────────────────────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    navLinks,
    navCTA,
    heroBadge,
    heroHeading,
    heroHeadingAccent,
    heroIngress,
    heroPrimaryCTA,
    heroSecondaryCTA,
    metrics,
    processSteps,
    featuredCaseClientName,
    featuredCaseStat,
    featuredCaseStatLabel,
    featuredCaseQuote,
    featuredCaseAuthor,
    featuredCaseSlug,
    globalCTAHeading,
    globalCTAIngress,
    globalCTAPrimary,
    urgencyText,
    footerColumns,
    email,
    phone,
    orgNr,
    linkedinUrl,
    address
  }
`

// ─── AI-siteringer ────────────────────────────────────────────────────────────
export const aiCitationsQuery = groq`
  *[_type == "aiCitation" && active == true] | order(sortOrder asc) {
    _id,
    source,
    company,
    query,
    minutesAgo
  }
`

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const allFaqQuestionsQuery = groq`
  *[_type == "faqQuestion"] | order(sortOrder asc) {
    _id,
    question,
    "slug": slug.current,
    category,
    shortAnswer,
    featured,
    sortOrder
  }
`

export const faqQuestionBySlugQuery = groq`
  *[_type == "faqQuestion" && slug.current == $slug][0] {
    _id,
    question,
    "slug": slug.current,
    category,
    shortAnswer,
    fullAnswer,
    inlineCTA,
    "relatedQuestions": relatedQuestions[]-> {
      _id, question, "slug": slug.current, shortAnswer, category
    },
    "relatedServices": relatedServices[]-> {
      _id, title, "slug": slug.current, tagline
    },
    "relatedTerms": relatedTerms[]-> {
      _id, term, "slug": slug.current, shortDefinition
    },
    metaTitle,
    metaDescription
  }
`

export const faqQuestionsByIdsQuery = groq`
  *[_type == "faqQuestion" && _id in $ids] | order(sortOrder asc) {
    _id,
    question,
    "slug": slug.current,
    shortAnswer,
    category
  }
`

// ─── Services ─────────────────────────────────────────────────────────────────
export const allServicesQuery = groq`
  *[_type == "service"] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    shortCode,
    tagline,
    heroIngress,
    heroImage { asset->, alt },
    tags
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortCode,
    tagline,
    heroHeading,
    heroIngress,
    heroImage { asset->, alt },
    deliverables,
    processSteps,
    body,
    "faqQuestions": faqQuestions[]-> {
      _id, question, "slug": slug.current, shortAnswer, category
    },
    cta,
    "relatedServices": relatedServices[]-> {
      _id, title, "slug": slug.current, tagline
    },
    "relatedTerms": relatedTerms[]-> {
      _id, term, "slug": slug.current, shortDefinition
    },
    "relatedPosts": relatedPosts[]-> {
      _id, title, "slug": slug.current, publishedAt, excerpt,
      mainImage { asset->, alt }
    },
    tags,
    metaTitle,
    metaDescription
  }
`

// ─── Posts ────────────────────────────────────────────────────────────────────
export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    "author": author-> { name, "slug": slug.current, title, photo { asset->, alt } },
    category,
    publishedAt,
    mainImage { asset->, alt },
    excerpt,
    tags
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "author": author-> {
      _id, name, "slug": slug.current, title, photo { asset->, alt }, linkedinUrl
    },
    category,
    publishedAt,
    mainImage { asset->, alt },
    excerpt,
    body,
    "faqQuestions": faqQuestions[]-> {
      _id, question, "slug": slug.current, shortAnswer, category
    },
    inlineCTA,
    "relatedPosts": relatedPosts[]-> {
      _id, title, "slug": slug.current, publishedAt, excerpt, mainImage { asset->, alt }
    },
    "relatedServices": relatedServices[]-> {
      _id, title, "slug": slug.current, tagline
    },
    "relatedTerms": relatedTerms[]-> {
      _id, term, "slug": slug.current, shortDefinition
    },
    tags,
    metaTitle,
    metaDescription
  }
`

// ─── Team ─────────────────────────────────────────────────────────────────────
export const allTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(sortOrder asc) {
    _id,
    name,
    "slug": slug.current,
    title,
    photo { asset->, alt },
    shortBio,
    expertiseAreas,
    linkedinUrl
  }
`

export const teamMemberBySlugQuery = groq`
  *[_type == "teamMember" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    title,
    photo { asset->, alt },
    email,
    phone,
    linkedinUrl,
    shortBio,
    fullBio,
    expertiseAreas,
    yearsOfExperience,
    metaTitle,
    metaDescription
  }
`

// ─── Glossary ─────────────────────────────────────────────────────────────────
export const allGlossaryTermsQuery = groq`
  *[_type == "glossaryTerm"] | order(term asc) {
    _id,
    term,
    "slug": slug.current,
    category,
    shortDefinition
  }
`

export const glossaryTermBySlugQuery = groq`
  *[_type == "glossaryTerm" && slug.current == $slug][0] {
    _id,
    term,
    "slug": slug.current,
    category,
    shortDefinition,
    fullDefinition,
    "relatedTerms": relatedTerms[]-> {
      _id, term, "slug": slug.current, shortDefinition
    },
    "relatedServices": relatedServices[]-> {
      _id, title, "slug": slug.current, tagline
    },
    "relatedPosts": relatedPosts[]-> {
      _id, title, "slug": slug.current, publishedAt, excerpt, mainImage { asset->, alt }
    },
    "faqQuestions": faqQuestions[]-> {
      _id, question, "slug": slug.current, shortAnswer, category
    },
    metaTitle,
    metaDescription
  }
`

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(sortOrder asc) {
    _id,
    quote,
    author,
    authorTitle,
    company,
    photo { asset->, alt }
  }
`

// ─── Case Studies ─────────────────────────────────────────────────────────────
export const allCaseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(sortOrder asc) {
    _id,
    clientName,
    "slug": slug.current,
    industry,
    heroImage { asset->, alt },
    excerpt,
    featured,
    metrics[] { value, label, period },
    "services": services[]-> { _id, title, "slug": slug.current }
  }
`

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    clientName,
    "slug": slug.current,
    industry,
    heroImage { asset->, alt },
    excerpt,
    metrics[] { value, label, period },
    challenge,
    solution,
    results,
    testimonialQuote,
    testimonialAuthor,
    testimonialTitle,
    "services": services[]-> { _id, title, "slug": slug.current, tagline },
    metaTitle,
    metaDescription
  }
`

// ─── Produkter ────────────────────────────────────────────────────────────────
export const allProductsQuery = groq`
  *[_type == "product"] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    badge,
    tagline,
    pitch,
    description,
    externalUrl,
    features[] { title, description },
    sortOrder
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    badge,
    tagline,
    pitch,
    description,
    externalUrl,
    features[] { title, description },
    body,
    mainImage { asset->{ _id, url, metadata { dimensions } }, hotspot, crop, alt },
    screenshots[] { asset->{ _id, url, metadata { dimensions } }, hotspot, crop, alt, caption },
    metaTitle,
    metaDescription
  }
`

// ─── Sitemap ──────────────────────────────────────────────────────────────────
export const sitemapQuery = groq`
  {
    "services": *[_type == "service"] { "slug": slug.current },
    "posts": *[_type == "post"] { "slug": slug.current, publishedAt },
    "teamMembers": *[_type == "teamMember"] { "slug": slug.current },
    "glossaryTerms": *[_type == "glossaryTerm"] { "slug": slug.current },
    "faqQuestions": *[_type == "faqQuestion"] { "slug": slug.current },
    "caseStudies": *[_type == "caseStudy"] { "slug": slug.current },
    "products": *[_type == "product"] { "slug": slug.current }
  }
`
