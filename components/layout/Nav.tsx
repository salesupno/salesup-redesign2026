'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'

interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}

interface NavCTA {
  label: string
  href: string
}

interface NavProps {
  navLinks: NavLink[]
  navCTA: NavCTA
}

function DropdownItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={clsx(
          'flex items-center gap-1.5 text-[14px] font-medium transition-colors',
          open ? 'text-green-deep' : 'text-black hover:text-green-deep'
        )}
        aria-expanded={open}
      >
        {link.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={clsx('transition-transform duration-200 text-black/40', open && 'rotate-180')}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        className={clsx(
          'absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-black/8 overflow-hidden transition-all duration-200 origin-top',
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        {/* Arrow */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-black/8 rotate-45" />
        <div className="p-2 relative">
          {link.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-cream transition-colors group"
            >
              <span className="text-[14px] font-medium text-black group-hover:text-green-deep transition-colors">
                {child.label}
              </span>
              {child.description && (
                <span className="text-[12px] text-muted leading-tight">{child.description}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileAccordion({
  link,
  onNavigate,
}: {
  link: NavLink
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-black/8">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between text-[17px] font-medium text-black py-3"
      >
        {link.label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={clsx('transition-transform duration-200 text-black/40', expanded && 'rotate-180')}
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pb-3 pl-4 flex flex-col gap-1">
          {link.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="text-[15px] text-black/70 hover:text-green-deep transition-colors py-2"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

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
        'fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-black/8 transition-shadow duration-300',
        scrolled ? 'shadow-sm' : 'shadow-none'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Logo variant="dark" width={120} />

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) =>
            link.children ? (
              <DropdownItem key={link.label} link={link} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-black hover:text-green-deep transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden xl:block">
          <Button href={navCTA.href} variant="primary">
            {navCTA.label}
          </Button>
        </div>

        {/* Mobil hamburger */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="xl:hidden flex flex-col gap-1.5 p-2"
              aria-label="Åpne meny"
            >
              <span className={clsx('block w-6 h-0.5 bg-black transition-transform duration-300', open && 'translate-y-2 rotate-45')} />
              <span className={clsx('block w-6 h-0.5 bg-black transition-opacity duration-300', open && 'opacity-0')} />
              <span className={clsx('block w-6 h-0.5 bg-black transition-transform duration-300', open && '-translate-y-2 -rotate-45')} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[min(320px,100vw)] bg-white flex flex-col p-8 shadow-2xl">
              <Dialog.Title className="sr-only">Navigasjonsmeny</Dialog.Title>
              <div className="flex items-center justify-between mb-10">
                <Logo variant="dark" width={110} />
                <Dialog.Close asChild>
                  <button aria-label="Lukk meny" className="text-black p-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>
              <nav className="flex flex-col flex-1">
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
                      className="text-[17px] font-medium text-black hover:text-green-deep transition-colors py-3 border-b border-black/8"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
              <div className="mt-8">
                <Button href={navCTA.href} variant="primary" className="w-full justify-center">
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
