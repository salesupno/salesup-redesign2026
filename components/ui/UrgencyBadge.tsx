import { clsx } from 'clsx'

interface UrgencyBadgeProps {
  text: string
  variant?: 'light' | 'dark'
}

export function UrgencyBadge({ text, variant = 'light' }: UrgencyBadgeProps) {
  return (
    <p
      className={clsx(
        'flex items-center gap-2 text-[12px] font-medium',
        variant === 'dark' ? 'text-accent' : 'text-green-light'
      )}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      {text}
    </p>
  )
}
