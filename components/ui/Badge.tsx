import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'text-[11px] font-medium px-2.5 py-1 rounded-full border',
        variant === 'default' &&
          'bg-[var(--color-cream)] text-[var(--color-green-deep)] border-[var(--color-green-deep)]/15',
        variant === 'dark' &&
          'bg-white/10 text-[var(--color-green-glow)] border-white/15',
        className
      )}
    >
      {children}
    </span>
  )
}
