import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Bloggartikkel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
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
      name: 'author',
      title: 'Forfatter',
      type: 'reference',
      to: [{ type: 'teamMember' }],
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
          { title: 'Case', value: 'case' },
          { title: 'Bransje-nytt', value: 'bransje-nytt' },
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publisert',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress / utdrag (40–80 ord)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),
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

    // FAQ-referanser (ALDRI inline!)
    defineField({
      name: 'faqQuestions',
      title: 'FAQ-spørsmål (referanser)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqQuestion' }] }],
      description: 'Velg eksisterende faqQuestion-dokumenter.',
    }),

    // Inline CTA midtveis
    defineField({
      name: 'inlineCTA',
      title: 'Inline CTA (midtveis i artikkelen)',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Tekst', type: 'string' }),
        defineField({ name: 'label', title: 'Knapp-tekst', type: 'string' }),
        defineField({ name: 'href', title: 'Lenke', type: 'string', initialValue: '/kontakt' }),
      ],
    }),

    // Relatert innhold
    defineField({
      name: 'relatedPosts',
      title: 'Relaterte artikler',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
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
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'mainImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle as string).toLocaleDateString('nb-NO') : '',
        media,
      }
    },
  },
  orderings: [
    { title: 'Nyeste først', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
