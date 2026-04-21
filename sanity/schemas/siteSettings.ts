import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Nettstedsinnstillinger',
  type: 'document',
  fields: [
    // Nav
    defineField({
      name: 'navLinks',
      title: 'Navigasjonslenker',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Tekst', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'navCTA',
      title: 'Nav CTA-knapp',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Tekst', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),

    // Hero
    defineField({
      name: 'heroBadge',
      title: 'Hero: Badge-tekst',
      type: 'string',
      description: 'F.eks. "SEO · AEO · GEO · CRO"',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero: Overskrift (del 1)',
      type: 'string',
    }),
    defineField({
      name: 'heroHeadingAccent',
      title: 'Hero: Overskrift (del 2 — aksentfarge)',
      type: 'string',
    }),
    defineField({
      name: 'heroIngress',
      title: 'Hero: Ingress',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroPrimaryCTA',
      title: 'Hero: Primærknapp',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Tekst', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroSecondaryCTA',
      title: 'Hero: Sekundærknapp',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Tekst', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),

    // Metrics strip (etter hero)
    defineField({
      name: 'metrics',
      title: 'Nøkkeltall (strip under hero)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Verdi', type: 'string', description: 'F.eks. "+847%"' }),
            defineField({ name: 'label', title: 'Etikett', type: 'string', description: 'F.eks. "organisk trafikk"' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),

    // Global CTA-seksjon
    defineField({
      name: 'globalCTAHeading',
      title: 'Global CTA: Overskrift',
      type: 'string',
    }),
    defineField({
      name: 'globalCTAIngress',
      title: 'Global CTA: Ingress',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'globalCTAPrimary',
      title: 'Global CTA: Primærknapp',
      type: 'object',
      fields: [
        defineField({ name: 'label', title: 'Tekst', type: 'string' }),
        defineField({ name: 'href', title: 'URL', type: 'string' }),
      ],
    }),

    // Footer
    defineField({
      name: 'footerColumns',
      title: 'Footer: Kolonner med lenker',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Kolonneoverskrift', type: 'string' }),
            defineField({
              name: 'links',
              title: 'Lenker',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Tekst', type: 'string' }),
                    defineField({ name: 'href', title: 'URL', type: 'string' }),
                  ],
                  preview: { select: { title: 'label' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),

    // Kontaktinfo
    defineField({ name: 'email', title: 'E-post', type: 'string' }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
    defineField({ name: 'orgNr', title: 'Org.nr.', type: 'string' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'address', title: 'Adresse', type: 'string' }),
  ],
  preview: {
    prepare() {
      return { title: 'Nettstedsinnstillinger' }
    },
  },
})
