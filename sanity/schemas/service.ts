import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Tjeneste',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tjenestenavn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortCode',
      title: 'Kortform (f.eks. "SEO", "AEO")',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (1 linje)',
      type: 'string',
    }),

    // Hero-seksjon
    defineField({
      name: 'heroHeading',
      title: 'Hero: Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'heroIngress',
      title: 'Hero: Ingress (40–80 ord)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero: Bilde',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt-tekst', type: 'string', validation: (Rule) => Rule.required() }),
      ],
    }),

    // Leveranser (liste)
    defineField({
      name: 'deliverables',
      title: 'Hva du får (leveranser)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Tittel', type: 'string' }),
            defineField({ name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),

    // Prosess-steg
    defineField({
      name: 'processSteps',
      title: 'Prosess-steg',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stepNumber', title: 'Steg-nr.', type: 'number' }),
            defineField({ name: 'title', title: 'Tittel', type: 'string' }),
            defineField({ name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'title', subtitle: 'stepNumber' } },
        },
      ],
    }),

    // Brødtekst (Portable Text)
    defineField({
      name: 'body',
      title: 'Brødtekst (Portable Text)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'internalLink',
                type: 'object',
                title: 'Intern lenke',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    to: [
                      { type: 'service' },
                      { type: 'post' },
                      { type: 'glossaryTerm' },
                      { type: 'faqQuestion' },
                    ],
                  },
                ],
              },
              {
                name: 'link',
                type: 'object',
                title: 'Ekstern lenke',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  { name: 'blank', type: 'boolean', title: 'Ny fane', initialValue: true },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' }),
            defineField({ name: 'caption', title: 'Bildetekst', type: 'string' }),
          ],
        },
      ],
    }),

    // FAQ (referanser til faqQuestion-dokumenter — ALDRI inline array!)
    defineField({
      name: 'faqQuestions',
      title: 'FAQ-spørsmål (referanser til faqQuestion-dokumenter)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqQuestion' }] }],
      description: 'Velg eksisterende faqQuestion-dokumenter. Lag nye under FAQ-menyen.',
    }),

    // CTA-seksjon
    defineField({
      name: 'cta',
      title: 'Avslutnings-CTA',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Overskrift', type: 'string' }),
        defineField({ name: 'ingress', title: 'Ingress', type: 'text', rows: 2 }),
        defineField({ name: 'label', title: 'Knapp-tekst', type: 'string' }),
        defineField({ name: 'href', title: 'Lenke', type: 'string', initialValue: '/kontakt' }),
      ],
    }),

    // Relatert innhold
    defineField({
      name: 'relatedServices',
      title: 'Relaterte tjenester',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Relaterte faguttrykk',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'glossaryTerm' }] }],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Relaterte artikler',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),

    // Tags
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // SEO
    defineField({
      name: 'metaTitle',
      title: 'SEO: Meta-tittel',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO: Meta-beskrivelse',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge (nav)',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'heroImage' },
  },
  orderings: [
    { title: 'Sorteringsrekkefølge', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
})
