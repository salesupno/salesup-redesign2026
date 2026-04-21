import { defineField, defineType } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case / Resultat',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Kundenavn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'clientName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Bransje',
      type: 'string',
    }),
    defineField({
      name: 'services',
      title: 'Tjenester levert',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Coverbilde',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt-tekst', type: 'string', validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Kort sammendrag (1–2 setninger)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(300),
    }),

    // Nøkkeltall
    defineField({
      name: 'metrics',
      title: 'Nøkkeltall',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Verdi', type: 'string', description: 'F.eks. "+312%"' }),
            defineField({ name: 'label', title: 'Etikett', type: 'string', description: 'F.eks. "organisk trafikk"' }),
            defineField({ name: 'period', title: 'Periode', type: 'string', description: 'F.eks. "12 måneder"' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // Casebeskrivelse
    defineField({
      name: 'challenge',
      title: 'Utfordringen',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'solution',
      title: 'Løsningen',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'results',
      title: 'Resultatene',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // Sitat
    defineField({
      name: 'testimonialQuote',
      title: 'Kundesitat',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'testimonialAuthor',
      title: 'Sitatets forfatter',
      type: 'string',
    }),
    defineField({
      name: 'testimonialTitle',
      title: 'Forfatterens tittel',
      type: 'string',
    }),

    defineField({
      name: 'featured',
      title: 'Fremhevet på forsiden',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      initialValue: 99,
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
    select: { title: 'clientName', subtitle: 'industry', media: 'heroImage' },
  },
  orderings: [
    { title: 'Sorteringsrekkefølge', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
})
