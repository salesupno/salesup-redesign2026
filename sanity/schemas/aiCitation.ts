import { defineField, defineType } from 'sanity'

export const aiCitation = defineType({
  name: 'aiCitation',
  title: 'AI-siteringer',
  type: 'document',
  fields: [
    defineField({
      name: 'source',
      title: 'AI-kilde',
      type: 'string',
      options: {
        list: [
          { title: 'ChatGPT', value: 'ChatGPT' },
          { title: 'Perplexity', value: 'Perplexity' },
          { title: 'Claude', value: 'Claude' },
          { title: 'Gemini', value: 'Gemini' },
          { title: 'Copilot', value: 'Copilot' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'company',
      title: 'Bedrift / Kunde',
      type: 'string',
      description: 'F.eks. "First Camp Sverige" eller "SalesUp Norway"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'query',
      title: 'Søkefrase',
      type: 'string',
      description: 'Inkluder anførselstegn: "AEO byrå Norge"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'minutesAgo',
      title: 'Minutter siden (startverdi)',
      type: 'number',
      description: 'Brukes til å vise "X min siden" i feeden ved oppstart',
      initialValue: 10,
    }),
    defineField({
      name: 'active',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Skru av for å skjule fra feeden uten å slette',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Rekkefølge',
      type: 'number',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Rekkefølge',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      company: 'company',
      source: 'source',
      query: 'query',
      active: 'active',
    },
    prepare({ company, source, query, active }) {
      return {
        title: `${active ? '✅' : '⏸'} ${company}`,
        subtitle: `${source} — ${query}`,
      }
    },
  },
})
