'use client'

import * as Accordion from '@radix-ui/react-accordion'
import Script from 'next/script'
import Link from 'next/link'
import { clsx } from 'clsx'

interface FAQQuestion {
  _id: string
  question: string
  slug: string
  shortAnswer: string
  category?: string
}

interface FAQWidgetProps {
  faqQuestions: FAQQuestion[]
  className?: string
}

export function FAQWidget({ faqQuestions, className }: FAQWidgetProps) {
  if (!faqQuestions?.length) return null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.shortAnswer,
      },
    })),
  }

  return (
    <div className={clsx('w-full', className)}>
      <Script
        id={`faq-schema-${faqQuestions[0]._id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="afterInteractive"
      />

      <Accordion.Root type="multiple" className="divide-y divide-black/8">
        {faqQuestions.map((q) => (
          <Accordion.Item key={q._id} value={q._id}>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left">
              <span className="font-display text-[17px] font-semibold tracking-tight leading-snug text-black group-data-[state=open]:text-green-deep transition-colors">
                {q.question}
              </span>
              <span
                className="shrink-0 w-8 h-8 rounded-full border border-black/12 flex items-center justify-center text-black/40 group-data-[state=open]:bg-green-deep group-data-[state=open]:border-green-deep group-data-[state=open]:text-white transition-all"
                aria-hidden="true"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-[fadeUp_0.2s_ease] data-[state=closed]:animate-none">
              <div className="pb-6 pt-1">
                <p className="text-[15px] text-muted leading-[1.75]">{q.shortAnswer}</p>
                <Link
                  href={`/faq/${q.slug}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-medium text-green-deep hover:text-green-mid transition-colors"
                >
                  Les utdypende svar
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6h8M6 2l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}
