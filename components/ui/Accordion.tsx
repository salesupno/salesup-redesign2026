'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import { clsx } from 'clsx'

interface AccordionItem {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  type?: 'single' | 'multiple'
  className?: string
  itemClassName?: string
}

export function Accordion({
  items,
  type = 'single',
  className,
  itemClassName,
}: AccordionProps) {
  return (
    <RadixAccordion.Root
      type={type as 'single'}
      collapsible={type === 'single' ? true : undefined}
      className={clsx('divide-y divide-[var(--color-border)]', className)}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.value}
          value={item.value}
          className={clsx('py-1', itemClassName)}
        >
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-[var(--color-black)] hover:text-[var(--color-green-deep)] transition-colors [&[data-state=open]]:text-[var(--color-green-deep)]">
              {item.trigger}
              <span className="ml-4 flex-shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-data-[state=open]:rotate-180">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_0.2s_ease] data-[state=closed]:animate-[accordion-up_0.2s_ease]">
            <div className="pb-4 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              {item.content}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  )
}
