'use client';

import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import CustomSelect from '@/components/CustomSelect';
import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { calculateRefinance } from '@/lib/mortgage/refinance';
import { CountryConfig } from '@/lib/mortgage/types';

interface RefinanceCalculatorProps {
  country: CountryConfig;
}

export default function RefinanceCalculator({ country }: RefinanceCalculatorProps) {
  const [currentLoanBalance, setCurrentLoanBalance] = useState<number>(300000);
  const [currentInterestRate, setCurrentInterestRate] = useState<number>(7.25);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState<number>(2046);
  const [remainingTermMonths, setRemainingTermMonths] = useState<number>(300);

  const [newInterestRate, setNewInterestRate] = useState<number>(5.5);
  const [newLoanTermYears, setNewLoanTermYears] = useState<number>(25);
  const [closingCosts, setClosingCosts] = useState<number>(4500);

  const result = calculateRefinance({
    countryCode: country.countryCode,
    currentLoanBalance,
    currentInterestRate,
    currentMonthlyPayment,
    remainingTermMonths,
    newInterestRate,
    newLoanTermYears,
    closingCosts,
  });

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const panelStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputCls = 'w-full rounded-lg px-3 py-2 text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500/30';
  const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider mb-1';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 overflow-hidden">
      {/* Input columns */}
      <div className="lg:col-span-7 border rounded-2xl p-4 sm:p-6 shadow-sm space-y-6" style={cardStyle}>
        {/* Header */}
        <div className="border-b pb-3 flex items-center justify-between gap-2" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <RefreshCw className="w-5 h-5 shrink-0" style={{ color: 'var(--accent)' }} />
            Mortgage Refinance Comparison
          </h2>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0"
            style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
          >
            {country.currencyCode} ({country.currencySymbol})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Current Mortgage */}
          <div className="p-3.5 sm:p-4 rounded-xl border space-y-3" style={panelStyle}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Current Mortgage
            </h3>

            {[
              { label: `Current Balance (${country.currencySymbol})`, value: currentLoanBalance, setter: setCurrentLoanBalance, step: 1000 },
              { label: 'Current Interest Rate (%)', value: currentInterestRate, setter: setCurrentInterestRate, step: 0.1 },
              { label: `Current Monthly Payment (${country.currencySymbol})`, value: currentMonthlyPayment, setter: setCurrentMonthlyPayment, step: 50 },
              { label: 'Remaining Term (Months)', value: remainingTermMonths, setter: setRemainingTermMonths, step: 12, min: 1 },
            ].map(({ label, value, setter, step, min }) => (
              <div key={label}>
                <label className={labelCls} style={{ color: 'var(--text-muted)' }}>{label}</label>
                <input
                  type="number" min={min ?? 0} step={step}
                  value={value || ''}
                  onChange={(e) => setter(Number(e.target.value))}
                  className={inputCls} style={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Proposed Refinance */}
          <div className="p-3.5 sm:p-4 rounded-xl border space-y-3" style={panelStyle}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Proposed Refinance
            </h3>

            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>New Interest Rate (%)</label>
              <input
                type="number" min="0" step="0.1"
                value={newInterestRate || ''}
                onChange={(e) => setNewInterestRate(Number(e.target.value))}
                className={inputCls} style={inputStyle}
              />
            </div>

            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>New Loan Term (Years)</label>
              <CustomSelect
                id="refinance-loan-term"
                value={String(newLoanTermYears)}
                onChange={(v) => setNewLoanTermYears(Number(v))}
                options={country.availableLoanTerms.map((t) => ({ value: String(t), label: `${t} Years` }))}
              />
            </div>

            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
                Closing Costs ({country.currencySymbol})
              </label>
              <input
                type="number" min="0" step="250"
                value={closingCosts || ''}
                onChange={(e) => setClosingCosts(Number(e.target.value))}
                className={inputCls} style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-5 border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between gap-6 overflow-hidden" style={cardStyle}>
        {/* Hero metric */}
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
            Estimated Monthly Savings
          </div>
          {result.monthlySavings > 0 ? (
            <div className="text-3xl sm:text-4xl font-black tracking-tight break-words min-w-0" style={{ color: 'var(--accent)' }}>
              {formatCurrency(result.monthlySavings, country.currencyCode)} / mo
            </div>
          ) : (
            <div className="text-xl sm:text-2xl font-bold" style={{ color: '#f43f5e' }}>
              No Monthly Savings
            </div>
          )}
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            New payment {formatCurrency(result.newMonthlyPayment, country.currencyCode)} vs current{' '}
            {formatCurrency(currentMonthlyPayment, country.currencyCode)}.
          </p>
        </div>

        {/* Analytics tiles */}
        <div className="space-y-2.5 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          {[
            {
              label: 'Break-Even Period',
              value: result.breakEvenMonths !== null
                ? `${result.breakEvenMonths} Months (${(result.breakEvenMonths / 12).toFixed(1)} yrs)`
                : 'N/A — no monthly savings',
              positive: result.breakEvenMonths !== null,
            },
            {
              label: 'Net Lifetime Interest Savings',
              value: formatCurrency(result.netLifetimeSavings, country.currencyCode),
              positive: result.netLifetimeSavings > 0,
            },
          ].map(({ label, value, positive }) => (
            <div key={label} className="flex items-center justify-between p-3.5 rounded-xl border text-xs min-w-0 gap-2" style={tileStyle}>
              <span className="font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span className="font-bold shrink-0 text-right" style={{ color: positive ? 'var(--accent)' : '#f43f5e' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Recommendation banner */}
        {result.isRefinanceBeneficial ? (
          <div
            className="rounded-xl p-4 flex items-center gap-3 text-xs border"
            style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent-border)', color: 'var(--accent-text)' }}
          >
            <TrendingDown className="w-5 h-5 shrink-0" style={{ color: 'var(--accent)' }} />
            <div>
              <strong>Refinance Recommended:</strong> Generates monthly savings and recoups closing costs in {result.breakEvenMonths} months.
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-4 flex items-center gap-3 text-xs border"
            style={{ backgroundColor: 'rgba(244, 63, 94, 0.07)', borderColor: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e' }}
          >
            <TrendingUp className="w-5 h-5 shrink-0" />
            <div>
              <strong>Refinance Caution:</strong> Proposed terms don&apos;t generate sufficient savings to justify closing costs.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
