import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'dark' | 'light'
  width?: number
}

export function Logo({ variant = 'dark', width = 130 }: LogoProps) {
  const height = Math.round(width * (125 / 464))
  return (
    <Link href="/" aria-label="SalesUp — til forsiden">
      <Image
        src="/logo.png"
        alt="SalesUp"
        width={width}
        height={height}
        className={variant === 'light' ? 'invert brightness-0 filter' : ''}
        priority
      />
    </Link>
  )
}
