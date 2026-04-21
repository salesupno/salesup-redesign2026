import Link from 'next/link'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'outline-white' | 'outline-dark'

interface ButtonProps {
  variant?: ButtonVariant
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-green-deep)] hover:bg-[var(--color-green-mid)] text-[var(--color-white)] rounded-full px-7 py-4 text-[15px] font-medium transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2.5',
  accent:
    'bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-green-deep)] rounded-full px-9 py-[18px] text-[15px] font-semibold transition-all hover:-translate-y-0.5 inline-flex items-center gap-2.5',
  ghost:
    'text-[var(--color-black)] border-b border-[var(--color-black)] hover:text-[var(--color-green-deep)] hover:border-[var(--color-green-deep)] transition-colors pb-0.5 text-[15px] inline-flex items-center gap-2',
  'outline-white':
    'border border-white/25 hover:border-white/60 text-white rounded-full px-9 py-[18px] text-[15px] transition-all hover:-translate-y-0.5 inline-flex items-center gap-2.5',
  'outline-dark':
    'border border-[var(--color-green-deep)]/30 hover:border-[var(--color-green-deep)] text-[var(--color-green-deep)] rounded-full px-9 py-[18px] text-[15px] transition-all hover:-translate-y-0.5 inline-flex items-center gap-2.5',
}

export function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = clsx(variants[variant], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(classes, disabled && 'opacity-50 cursor-not-allowed')}
    >
      {children}
    </button>
  )
}
