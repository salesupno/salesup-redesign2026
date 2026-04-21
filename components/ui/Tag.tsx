import { clsx } from 'clsx'

interface TagProps {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={clsx(
        'text-[11px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full bg-[var(--color-cream)] text-[var(--color-text-muted)] border border-[var(--color-border)]',
        className
      )}
    >
      {children}
    </span>
  )
}
