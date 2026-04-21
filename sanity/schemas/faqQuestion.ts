import { defineField, defineType } from 'sanity'

export const faqQuestion = defineType({
  name: 'faqQuestion',
  title: 'FAQ-spørsmål',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Spørsmål',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'question', maxLength: 96 },
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
          { title: 'WordPress', value: 'wordpress' },
          { title: 'Samarbeid', value: 'samarbeid' },
          { title: 'Generelt', value: 'generelt' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortAnswer',
      title: 'Kort svar (40–80 ord) — brukes i widget og FAQPage-schema',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(150).max(500),
    }),
    defineField({
      name: 'fullAnswer',
      title: 'Fullt svar (Portable Text, 300+ ord)',
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
                      { type: 'teamMember' },
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
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Åpne i ny fane',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'inlineCTA',
      title: 'Kontekstuell CTA (tilpasset dette spørsmålet)',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Ingress-tekst',
          type: 'string',
          description: 'F.eks. "Vil du se hva SEO kan gjøre for deg?"',
        }),
        defineField({
          name: 'label',
          title: 'Knapp-tekst',
          type: 'string',
          description: 'F.eks. "Book gratis analyse →"',
        }),
        defineField({
          name: 'href',
          title: 'Lenke',
          type: 'string',
          initialValue: '/kontakt',
        }),
      ],
    }),
    defineField({
      name: 'relatedQuestions',
      title: 'Relaterte spørsmål',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqQuestion' }] }],
    }),
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
      name: 'featured',
      title: 'Fremhevet (vises øverst)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      initialValue: 99,
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
    select: { title: 'question', subtitle: 'category' },
  },
  orderings: [
    { title: 'Sorteringsrekkefølge', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
})
