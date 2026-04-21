'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface FormData {
  name: string
  company: string
  email: string
  message: string
}

interface FieldState {
  touched: boolean
  error: string
}

type FieldStates = Record<keyof FormData, FieldState>

function validateField(name: keyof FormData, value: string): string {
  if (!value.trim()) return 'Dette feltet er påkrevd'
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ugyldig e-postadresse'
  return ''
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', company: '', email: '', message: '' })
  const [fields, setFields] = useState<FieldStates>({
    name: { touched: false, error: '' },
    company: { touched: false, error: '' },
    email: { touched: false, error: '' },
    message: { touched: false, error: '' },
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleBlur(name: keyof FormData) {
    const error = validateField(name, form[name])
    setFields((prev) => ({ ...prev, [name]: { touched: true, error } }))
  }

  function handleChange(name: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fields[name].touched) {
      const error = validateField(name, value)
      setFields((prev) => ({ ...prev, [name]: { ...prev[name], error } }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Valider alle felter
    const newFields = { ...fields }
    let hasError = false
    for (const key of Object.keys(form) as (keyof FormData)[]) {
      const error = validateField(key, form[key])
      newFields[key] = { touched: true, error }
      if (error) hasError = true
    }
    setFields(newFields)
    if (hasError) return

    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('server error')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-pale rounded-3xl p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-deep flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-[22px] font-bold tracking-tight mb-2">Takk!</h3>
        <p className="text-[16px] text-muted">Tommy tar kontakt innen 1 arbeidsdag.</p>
      </div>
    )
  }

  const inputBase = 'w-full bg-white border rounded-2xl px-5 py-4 text-[15px] outline-none transition-colors placeholder:text-black/30'
  const inputNormal = 'border-black/12 focus:border-green-deep'
  const inputError = 'border-red-400 focus:border-red-500'

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Navn + bedrift */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-[13px] font-medium mb-2">
            Ditt navn <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Tommy Nilsen"
            className={clsx(inputBase, fields.name.error ? inputError : inputNormal)}
          />
          {fields.name.error && (
            <p className="text-[12px] text-red-500 mt-1.5">{fields.name.error}</p>
          )}
        </div>
        <div>
          <label htmlFor="company" className="block text-[13px] font-medium mb-2">
            Bedrift <span className="text-red-400">*</span>
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => handleChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
            placeholder="Bedrift AS"
            className={clsx(inputBase, fields.company.error ? inputError : inputNormal)}
          />
          {fields.company.error && (
            <p className="text-[12px] text-red-500 mt-1.5">{fields.company.error}</p>
          )}
        </div>
      </div>

      {/* E-post */}
      <div>
        <label htmlFor="email" className="block text-[13px] font-medium mb-2">
          E-post <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="deg@bedrift.no"
          className={clsx(inputBase, fields.email.error ? inputError : inputNormal)}
        />
        {fields.email.error && (
          <p className="text-[12px] text-red-500 mt-1.5">{fields.email.error}</p>
        )}
      </div>

      {/* Melding */}
      <div>
        <label htmlFor="message" className="block text-[13px] font-medium mb-2">
          Hva kan vi hjelpe deg med? <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder="Fortell litt om situasjonen din og hva du ønsker å oppnå…"
          className={clsx(inputBase, 'resize-none', fields.message.error ? inputError : inputNormal)}
        />
        {fields.message.error && (
          <p className="text-[12px] text-red-500 mt-1.5">{fields.message.error}</p>
        )}
      </div>

      {status === 'error' && (
        <p className="text-[13px] text-red-500 bg-red-50 rounded-xl px-4 py-3">
          Noe gikk galt. Prøv igjen eller send e-post direkte til{' '}
          <a href="mailto:hei@salesup.no" className="underline">hei@salesup.no</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start bg-green-deep text-accent font-medium px-8 py-4 rounded-full hover:bg-green-mid transition-colors text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sender…' : 'Send melding →'}
      </button>
    </form>
  )
}
