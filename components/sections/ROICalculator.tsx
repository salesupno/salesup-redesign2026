'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UrgencyBadge } from '@/components/ui/UrgencyBadge'

interface ROICalculatorProps {
  urgencyText?: string
}

function formatKr(value: number): string {
  return `kr ${value.toLocaleString('nb-NO')}`
}

export function ROICalculator({ urgencyText }: ROICalculatorProps) {
  const [adSpend, setAdSpend] = useState(15000)
  const [customerValue, setCustomerValue] = useState(25000)
  const [customersPerMonth, setCustomersPerMonth] = useState(10)

  const SEO_MONTHLY_COST = 15000

  const costPerCustomer = customersPerMonth > 0
    ? Math.round(adSpend / customersPerMonth)
    : 0

  const organicUpliftValue = Math.round(customersPerMonth * 0.3 * customerValue)

  const breakEvenMonths = organicUpliftValue > 0
    ? Math.ceil((SEO_MONTHLY_COST / organicUpliftValue) * 12)
    : null

  const results = [
    {
      label: 'Estimert kostnad per kunde i dag',
      value: formatKr(costPerCustomer),
      sub: 'annonsekost ÷ kunder/mnd',
    },
    {
      label: 'Estimert verdi av 30% mer organisk trafikk',
      value: `${formatKr(organicUpliftValue)}/mnd`,
      sub: 'konservativt estimat',
    },
    {
      label: 'Break-even på SEO-investering',
      value: breakEvenMonths !== null ? `ca. ${breakEvenMonths} mnd` : '—',
      sub: 'ved 15 000 kr/mnd SEO-kostnad',
    },
  ]

  return (
    <section className="bg-black py-20 px-6 md:px-12 xl:px-20">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent mb-4">
            Regnestykket
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-[-0.012em] leading-[1.1] text-white mb-4">
            Hva koster usynlighet din bedrift?
          </h2>
          <p className="text-[17px] font-light text-white/60 leading-[1.7] max-w-[560px]">
            De fleste undervurderer hva det faktisk koster å ikke bli funnet. Juster tallene og se hva organisk synlighet kan bety for deg.
          </p>
        </div>

        <div className="grid xl:grid-cols-[1fr_400px] gap-10 xl:gap-16">
          {/* ─── SLIDERE ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Slider 1 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="ad-spend" className="text-[14px] font-medium text-white/80">
                  Månedlig annonsekostnad
                </label>
                <span className="text-[15px] font-display font-bold text-accent">
                  {formatKr(adSpend)}
                </span>
              </div>
              <input
                id="ad-spend"
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full accent-accent h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30 mt-1.5">
                <span>0 kr</span>
                <span>100 000 kr</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="customer-value" className="text-[14px] font-medium text-white/80">
                  Gjennomsnittlig kundeverdi
                </label>
                <span className="text-[15px] font-display font-bold text-accent">
                  {formatKr(customerValue)}
                </span>
              </div>
              <input
                id="customer-value"
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={customerValue}
                onChange={(e) => setCustomerValue(Number(e.target.value))}
                className="w-full accent-accent h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30 mt-1.5">
                <span>1 000 kr</span>
                <span>500 000 kr</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="customers-per-month" className="text-[14px] font-medium text-white/80">
                  Nye kunder per måned fra digitale kanaler
                </label>
                <span className="text-[15px] font-display font-bold text-accent">
                  {customersPerMonth}
                </span>
              </div>
              <input
                id="customers-per-month"
                type="range"
                min={1}
                max={100}
                step={1}
                value={customersPerMonth}
                onChange={(e) => setCustomersPerMonth(Number(e.target.value))}
                className="w-full accent-accent h-1.5 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30 mt-1.5">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* ─── OUTPUT ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {results.map((r) => (
              <div
                key={r.label}
                className="bg-white/5 border border-white/8 rounded-2xl p-6"
              >
                <p className="text-[11px] text-white/40 mb-2">{r.label}</p>
                <p className="font-display text-[clamp(22px,2.5vw,30px)] font-extrabold tracking-tight text-white leading-none mb-1">
                  {r.value}
                </p>
                <p className="text-[11px] text-white/30">{r.sub}</p>
              </div>
            ))}

            {/* CTA */}
            <div className="mt-2">
              {urgencyText && (
                <div className="mb-3">
                  <UrgencyBadge text={urgencyText} variant="dark" />
                </div>
              )}
              <Link
                href="/kontakt"
                className="block text-center bg-accent text-black font-medium px-6 py-4 rounded-full hover:bg-accent-dark transition-colors text-[14px]"
              >
                Book gratis analyse →
              </Link>
              <p className="text-[11px] text-white/30 text-center mt-3">
                Se hva dette konkret betyr for din bedrift
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-white/25 mt-10 max-w-[600px]">
          Beregningene er estimater basert på bransjesnitt og tallene du oppgir. Faktiske resultater avhenger av bransje, konkurranse og utgangspunkt.
        </p>
      </div>
    </section>
  )
}
