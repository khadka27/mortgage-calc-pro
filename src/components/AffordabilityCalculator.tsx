'use client';

import { Home, ShieldAlert, Sliders } from 'lucide-react';
import { useState } from 'react';

import { calculateAffordability } from '@/lib/mortgage/affordability';
import CustomSelect from '@/components/CustomSelect';
import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { CountryConfig } from '@/lib/mortgage/types';

interface AffordabilityCalculatorProps {
  country: CountryConfig;
}

export default function AffordabilityCalculator({ country }: AffordabilityCalculatorProps) {
  const [annualIncome, setAnnualIncome] = useState<number>(120000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(600);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(country.defaultInterestRate);
  const [loanTermYears, setLoanTermYears] = useState<number>(country.defaultLoanTerm);
  const [targetMaxDti, setTargetMaxDti] = useState<number>(36);

  const result = calculateAffordability({
    countryCode: country.countryCode,
    annualIncome,
    monthlyDebts,
    downPaymentAmount,
    interestRate,
    loanTermYears,
    targetHousingDtiPct: 28,
    targetMaxDtiPct: targetMaxDti,
  });

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };
  const inputCls = 'w-full rounded-xl px-4 py-2.5 text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500/40';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider mb-1.5';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-6 border rounded-2xl p-6 shadow-sm space-y-5" style={cardStyle}>
        <div className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Home className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            Home Affordability Inputs
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Estimate maximum purchase price based on income and debt ratios ({country.currencyCode}).
          </p>
        </div>

        <div className="space-y-4">
          {[
            { label: `Gross Annual Income (${country.currencySymbol})`, value: annualIncome, setter: setAnnualIncome, step: 5000 },
            { label: `Monthly Recurring Debts — Car, Credit Cards (${country.currencySymbol})`, value: monthlyDebts, setter: setMonthlyDebts, step: 50 },
            { label: `Available Down Payment (${country.currencySymbol})`, value: downPaymentAmount, setter: setDownPaymentAmount, step: 5000 },
          ].map(({ label, value, setter, step }) => (
            <div key={label}>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>{label}</label>
              <input
                type="number" min="0" step={step}
                value={value || ''}
                onChange={(e) => setter(Number(e.target.value))}
                className={inputCls} style={inputStyle}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Interest Rate (%)</label>
              <input
                type="number" min="0" max="25" step="0.1"
                value={interestRate || ''}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className={inputCls} style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Loan Term (Years)</label>
              <CustomSelect
                id="affordability-loan-term"
                value={String(loanTermYears)}
                onChange={(v) => setLoanTermYears(Number(v))}
                options={country.availableLoanTerms.map((t) => ({ value: String(t), label: `${t} Years` }))}
              />
            </div>
          </div>

          {/* DTI Slider */}
          <div className="border-t pt-3 space-y-2.5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Sliders className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                Max Total DTI Limit
              </label>
              <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{targetMaxDti}%</span>
            </div>
            <input
              type="range" min="20" max="50" step="1"
              value={targetMaxDti}
              onChange={(e) => setTargetMaxDti(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-6 border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-6" style={cardStyle}>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
            Estimated Maximum Home Price
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(result.maxHomePrice, country.currencyCode)}
          </div>
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Max loan {formatCurrency(result.maxLoanAmount, country.currencyCode)} + {formatCurrency(result.downPaymentAmount, country.currencyCode)} down
          </p>
        </div>

        <div className="space-y-2.5">
          {[
            { label: 'Max Monthly Housing Payment', value: formatCurrency(result.maxMonthlyHousingCost, country.currencyCode), accent: true },
            { label: 'Housing DTI Ratio', value: `${result.housingDtiPct}%`, accent: false },
            { label: 'Total DTI (Housing + Debts)', value: `${result.totalDtiPct}%`, accent: false },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex items-center justify-between p-3.5 rounded-xl border" style={tileStyle}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span className="text-sm font-bold" style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-3.5 flex items-start gap-3 text-xs border"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.2)', color: '#d97706' }}
        >
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
          <div>
            <strong>Disclaimer:</strong> This is an estimate for planning only and does not constitute pre-approval or a loan commitment.
          </div>
        </div>
      </div>
    </div>
  );
}
