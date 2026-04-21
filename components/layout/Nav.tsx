'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'

interface NavLink {
  label: string
  href: string
}

interface NavCTA {
  label: string
  href: string
}

interface NavProps {
  navLinks: NavLink[]
  navCTA: NavCTA
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
        'fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-black/8'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 xl:px-20 h-full flex items-center justify-between">
        {/* Logo */}
        <Logo variant="dark" width={120} />

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-black hover:text-green-deep transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
              <span
                className={clsx(
                  'block w-6 h-0.5 bg-black transition-transform duration-300',
                  open && 'translate-y-2 rotate-45'
                )}
              />
              <span
                className={clsx(
                  'block w-6 h-0.5 bg-black transition-opacity duration-300',
                  open && 'opacity-0'
                )}
              />
              <span
                className={clsx(
                  'block w-6 h-0.5 bg-black transition-transform duration-300',
                  open && '-translate-y-2 -rotate-45'
                )}
              />
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
              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-[17px] font-medium text-black hover:text-green-deep transition-colors py-3 border-b border-black/8"
                  >
                    {link.label}
                  </Link>
                ))}
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
