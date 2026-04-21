// Sanity Studio struktur — SalesUp
// @ts-check

/**
 * @param {import('sanity/structure').StructureBuilder} S
 */
export const structure = (S) =>
  S.list()
    .title('SalesUp Innhold')
    .items([
      // Singleton
      S.listItem()
        .title('Nettstedsinnstillinger')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Nettstedsinnstillinger')
        ),

      S.divider(),

      // Tjenester
      S.documentTypeListItem('service').title('Tjenester'),

      S.divider(),

      // FAQ
      S.listItem()
        .title('FAQ-spørsmål')
        .child(
          S.documentTypeList('faqQuestion')
            .title('FAQ-spørsmål')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
        ),

      S.divider(),

      // Blogg
      S.documentTypeListItem('post').title('Bloggartikler'),

      S.divider(),

      // Cases & testimonials
      S.documentTypeListItem('caseStudy').title('Caser / Resultater'),
      S.documentTypeListItem('testimonial').title('Kundeuttalelser'),

      S.divider(),

      // Team
      S.documentTypeListItem('teamMember').title('Teammedlemmer'),

      S.divider(),

      // Faguttrykk
      S.listItem()
        .title('Faguttrykk')
        .child(
          S.documentTypeList('glossaryTerm')
            .title('Faguttrykk')
            .defaultOrdering([{ field: 'term', direction: 'asc' }])
        ),
    ])
