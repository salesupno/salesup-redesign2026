import { defineField, defineType } from 'sanity'
import { PackageIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Produkt',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({ name: 'title', title: 'Produktnavn', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'SaaS-verktøy', value: 'saas' },
          { title: 'WordPress-plugin', value: 'wordpress-plugin' },
          { title: 'Shopify-app', value: 'shopify-app' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'badge', title: 'Badge-tekst', type: 'string', description: 'F.eks. "WordPress-plugin", "SaaS", "Shopify-app"' }),
    defineField({ name: 'tagline', title: 'Tagline (kortfatning)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'pitch', title: 'Én-setnings pitch', type: 'string', description: '40–80 tegn. Brukes i kort-kort-format.' }),
    defineField({ name: 'description', title: 'Produktbeskrivelse (ingress)', type: 'text', rows: 4 }),
    defineField({ name: 'externalUrl', title: 'Ekstern URL', type: 'url', description: 'For seo-tracker.com og mynk.no' }),
    defineField({
      name: 'mainImage',
      title: 'Hovedbilde (hero)',
      type: 'image',
      options: { hotspot: true },
      description: 'Vises i hero-seksjonen på produktsiden. Anbefalt: 1200×675px.',
    }),
    defineField({
      name: 'screenshots',
      title: 'Skjermbilder / Produktbilder',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'caption', title: 'Bildetekst', type: 'string' }),
          defineField({ name: 'alt', title: 'Alt-tekst', type: 'string' }),
        ],
      }],
      description: 'Vises i et galleri under features.',
    }),
    defineField({
      name: 'features',
      title: 'Nøkkelfunksjoner',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Funksjon', type: 'string' }),
          defineField({ name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'title' } },
      }],
    }),
    defineField({
      name: 'body',
      title: 'Produktinnhold (Portable Text)',
      type: 'array',
      of: [{
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
          annotations: [{
            name: 'link',
            type: 'object',
            title: 'Lenke',
            fields: [
              { name: 'href', type: 'url', title: 'URL' },
              { name: 'blank', type: 'boolean', title: 'Ny fane', initialValue: true },
            ],
          }],
        },
      }],
    }),
    defineField({ name: 'sortOrder', title: 'Sorteringsrekkefølge', type: 'number', initialValue: 99 }),
    defineField({ name: 'metaTitle', title: 'SEO: Meta-tittel', type: 'string', validation: (r) => r.max(60) }),
    defineField({ name: 'metaDescription', title: 'SEO: Meta-beskrivelse', type: 'text', rows: 2, validation: (r) => r.max(160) }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
