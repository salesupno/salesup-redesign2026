import { defineField, defineType } from 'sanity'

export const glossaryTerm = defineType({
  name: 'glossaryTerm',
  title: 'Faguttrykk',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Faguttrykk',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'term', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'SEO', value: 'seo' },
          { title: 'AEO', value: 'aeo' },
          { title: 'GEO', value: 'geo' },
          { title: 'CRO', value: 'cro' },
          { title: 'Google Ads', value: 'google-ads' },
          { title: 'Analyse', value: 'analyse' },
          { title: 'Teknisk', value: 'teknisk' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDefinition',
      title: 'Kort definisjon (40–80 ord)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'fullDefinition',
      title: 'Full definisjon (Portable Text)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
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
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Relaterte faguttrykk',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'glossaryTerm' }] }],
    }),
    defineField({
      name: 'relatedServices',
      title: 'Relaterte tjenester',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Relaterte artikler',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),
    defineField({
      name: 'faqQuestions',
      title: 'FAQ-spørsmål (referanser)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqQuestion' }] }],
    }),
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
  ],
  preview: {
    select: { title: 'term', subtitle: 'category' },
  },
  orderings: [
    { title: 'Alfabetisk', name: 'termAsc', by: [{ field: 'term', direction: 'asc' }] },
  ],
})
