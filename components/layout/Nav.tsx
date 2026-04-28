'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'

interface NavChild {
  label: string
  href: string
  description?: string
}

interface NavLink {
  label: string
  href: string
  children?: NavChild[]
}

interface NavCTA {
  label: string
  href: string
}

interface NavProps {
  navLinks: NavLink[]
  navCTA: NavCTA
}

// ─── Desktop mega-dropdown ──────────────────────────────────────

function DropdownMenu({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const btnId = `nav-trigger-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  const panelId = `nav-panel-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        containerRef.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const useGrid = (link.children?.length ?? 0) >= 3

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button
        id={btnId}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        className={clsx(
          'flex items-center gap-1.5 text-[14px] font-medium transition-colors rounded-sm',
          open ? 'text-green-light' : 'text-black hover:text-green-light'
        )}
      >
        {link.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={clsx('transition-transform duration-200 text-black/35', open && 'rotate-180')}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Mega dropdown panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={clsx(
          'absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-2xl shadow-[0_8px_40px_-8px_rgba(2,25,60,0.18)] border border-black/8 overflow-hidden transition-all duration-200 origin-top z-20',
          useGrid ? 'w-[480px]' : 'w-72',
          open
            ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
            : 'opacity-0 scale-[0.97] pointer-events-none -translate-y-1'
        )}
      >
        {/* Arrow */}
        <div
          aria-hidden="true"
          className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-t border-l border-black/8 rotate-45 z-10"
        />

        {/* Category header */}
        <div className="px-5 pt-5 pb-3 border-b border-black/6">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-black/30">
            {link.label}
          </p>
        </div>

        {/* Links — 2-column grid when ≥3 items */}
        <div className={clsx('p-2', useGrid && 'grid grid-cols-2')}>
          {link.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-cream transition-colors group"
            >
              <span className="text-[14px] font-medium text-black group-hover:text-green-light transition-colors">
                {child.label}
              </span>
              {child.description && (
                <span className="text-[12px] text-muted leading-tight">{child.description}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Footer link to full section */}
        {link.href !== '#' && (
          <div className="px-5 py-3 border-t border-black/6">
            <Link
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[12px] font-medium text-green-light hover:text-green-mid transition-colors inline-flex items-center gap-1"
            >
              Se alle {link.label.toLowerCase()}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 6h7M6.5 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Mobile accordion item ─────────────────────────────────────

function MobileAccordion({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const accordionId = `mobile-acc-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  const regionId = `${accordionId}-panel`

  return (
    <div className="border-b border-black/8">
      <button
        id={accordionId}
        aria-expanded={expanded}
        aria-controls={regionId}
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-[17px] font-medium text-black py-4"
      >
        {link.label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={clsx('transition-transform duration-200 text-black/35', expanded && 'rotate-180')}
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id={regionId}
        role="region"
        aria-labelledby={accordionId}
        className={clsx(
          'overflow-hidden transition-all duration-300',
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pb-4 pl-4 flex flex-col gap-0.5">
          {link.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="text-[15px] text-black/70 hover:text-green-light transition-colors py-2 flex items-center gap-2"
            >
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-black/20 shrink-0" />
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Nav component ─────────────────────────────────────────────

export function Nav({ navLinks, navCTA }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-black/8 transition-all duration-300',
        scrolled ? 'shadow-[0_2px_20px_-4px_rgba(2,25,60,0.10)]' : 'shadow-none'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" aria-label="SalesUp — tilbake til forsiden" className="shrink-0">
          <Logo variant="dark" width={120} />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Hovednav" className="hidden xl:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) =>
            link.children ? (
              <DropdownMenu key={link.label} link={link} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-black hover:text-green-light transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <Button href={navCTA.href} variant="primary">
            {navCTA.label}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="xl:hidden flex flex-col justify-center gap-[5px] w-10 h-10 -mr-2 rounded-lg"
              aria-label={open ? 'Lukk meny' : 'Åpne meny'}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
            >
              <span
                aria-hidden="true"
                className={clsx(
                  'block w-5 h-0.5 bg-black transition-all duration-300 origin-center',
                  open && 'translate-y-[7px] rotate-45'
                )}
              />
              <span
                aria-hidden="true"
                className={clsx(
                  'block w-5 h-0.5 bg-black transition-all duration-300',
                  open && 'opacity-0 scale-x-0'
                )}
              />
              <span
                aria-hidden="true"
                className={clsx(
                  'block w-5 h-0.5 bg-black transition-all duration-300 origin-center',
                  open && '-translate-y-[7px] -rotate-45'
                )}
              />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content
              id="mobile-nav-panel"
              aria-label="Navigasjonsmeny"
              className="fixed inset-y-0 right-0 z-50 w-[min(360px,100vw)] bg-white flex flex-col shadow-2xl"
            >
              <Dialog.Title className="sr-only">Navigasjonsmeny</Dialog.Title>

              {/* Panel header */}
              <div className="flex items-center justify-between px-7 h-16 border-b border-black/8 shrink-0">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  aria-label="SalesUp — forsiden"
                >
                  <Logo variant="dark" width={110} />
                </Link>
                <Dialog.Close asChild>
                  <button
                    aria-label="Lukk meny"
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-cream transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M14 4L4 14M4 4l10 10" />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>

              {/* Nav links */}
              <nav
                aria-label="Mobilnav"
                className="flex flex-col flex-1 overflow-y-auto px-7 pt-2 pb-4"
              >
                {navLinks.map((link) =>
                  link.children ? (
                    <MobileAccordion
                      key={link.label}
                      link={link}
                      onNavigate={() => setOpen(false)}
                    />
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-[17px] font-medium text-black hover:text-green-light transition-colors py-4 border-b border-black/8"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Contact + CTA — solidmedia-style bottom section */}
              <div className="px-7 py-6 border-t border-black/8 bg-cream/40 shrink-0">
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-black/35 mb-3">
                  Kontakt oss
                </p>
                <div className="flex flex-col gap-1.5 mb-5">
                  <a
                    href="mailto:hei@salesup.no"
                    className="text-[14px] text-black/60 hover:text-green-light transition-colors"
                  >
                    hei@salesup.no
                  </a>
                  <a
                    href="tel:+4740000000"
                    className="text-[14px] text-black/60 hover:text-green-light transition-colors"
                  >
                    +47 400 00 000
                  </a>
                </div>
                <Button
                  href={navCTA.href}
                  variant="primary"
                  className="w-full text-center justify-center"
                >
                  {navCTA.label}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  )
}
