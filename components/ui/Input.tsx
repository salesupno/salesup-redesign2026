'use client'

import { useState, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [touched, setTouched] = useState(false)

    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-[var(--color-black)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          onBlur={() => setTouched(true)}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border bg-white text-[15px] text-[var(--color-black)] placeholder:text-[var(--color-text-subtle)] outline-none transition-all duration-150',
            touched && error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-[var(--color-border-mid)] focus:border-[var(--color-green-deep)] focus:ring-2 focus:ring-[var(--color-green-deep)]/10',
            className
          )}
          {...props}
        />
        {touched && error && (
          <p className="text-[12px] text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
