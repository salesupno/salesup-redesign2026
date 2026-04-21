import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Kundeuttalelse',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Sitat',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Navn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorTitle',
      title: 'Tittel / stilling',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Selskap',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Profilbilde (valgfritt)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' }),
      ],
    }),
    defineField({
      name: 'relatedService',
      title: 'Knyttet til tjeneste',
      type: 'reference',
      to: [{ type: 'service' }],
    }),
    defineField({
      name: 'relatedCase',
      title: 'Knyttet til case',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
    }),
    defineField({
      name: 'featured',
      title: 'Fremhevet (vises på forsiden)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'company', media: 'photo' },
  },
  orderings: [
    { title: 'Sorteringsrekkefølge', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
})
