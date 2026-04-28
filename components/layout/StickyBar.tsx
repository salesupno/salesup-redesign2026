'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export function StickyBar() {
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const target = document.getElementById('hero-cta')
    if (!target) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    )

    observerRef.current.observe(target)

    return () => observerRef.current?.disconnect()
  }, [])

  if (!visible) return null

  return (
    <div
      role="complementary"
      aria-label="Rask kontakt"
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-white/8 px-6 md:px-12 py-4 flex items-center justify-between gap-4"
      style={{ transform: 'translateZ(0)' }}
    >
      <p className="text-[13px] text-white/70 hidden sm:block">
        Vil du øke synligheten din?
      </p>
      <div className="flex items-center gap-3 ml-auto">
        <a
          href="tel:+4790000000"
          className="text-[13px] text-white/60 hover:text-white transition-colors"
        >
          Ring oss
        </a>
        <Link
          href="/book-analyse"
          className="bg-accent text-black font-medium px-6 py-2.5 rounded-full text-[13px] hover:bg-accent-dark transition-colors"
        >
          Book gratis analyse →
        </Link>
      </div>
    </div>
  )
}
