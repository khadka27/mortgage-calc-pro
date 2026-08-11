'use client';

import { ArrowDown, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { ExtraPaymentInput } from '@/lib/mortgage/types';

interface ExtraPaymentsFormProps {
  extraPayments: ExtraPaymentInput[];
  onChangeExtraPayments: (payments: ExtraPaymentInput[]) => void;
  currencyCode: string;
  currencySymbol: string;
  monthsSaved: number;
  interestSaved: number;
}

export default function ExtraPaymentsForm({
  extraPayments,
  onChangeExtraPayments,
  currencyCode,
  currencySymbol,
  monthsSaved,
  interestSaved,
}: ExtraPaymentsFormProps) {
  const [amount, setAmount] = useState<number | ''>(extraPayments.find((ep) => ep.type === 'monthly')?.amount || '');
  const [yearlyAmount, setYearlyAmount] = useState<number | ''>(extraPayments.find((ep) => ep.type === 'yearly')?.amount || '');

  const handleMonthlyChange = (val: number) => {
    setAmount(val);
    const updated = extraPayments.filter((ep) => ep.type !== 'monthly');
    if (val > 0) updated.push({ amount: val, type: 'monthly' });
    onChangeExtraPayments(updated);
  };

  const handleYearlyChange = (val: number) => {
    setYearlyAmount(val);
    const updated = extraPayments.filter((ep) => ep.type !== 'yearly');
    if (val > 0) updated.push({ amount: val, type: 'yearly' });
    onChangeExtraPayments(updated);
  };

  const yearsSaved = (monthsSaved / 12).toFixed(1);
  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };
  const inputCls = 'w-full rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all';

  return (
    <div className="border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5" style={cardStyle}>
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          Accelerated Payoff & Extra Payments
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Simulate early mortgage freedom</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Extra Monthly Payment ({currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none" style={{ color: 'var(--text-muted)' }}>
              {currencySymbol}
            </span>
            <input
              type="number" min="0" step="50" placeholder="e.g. 200"
              value={amount || ''}
              onChange={(e) => handleMonthlyChange(Number(e.target.value))}
              className={inputCls} style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Extra Annual Lump-Sum ({currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none" style={{ color: 'var(--text-muted)' }}>
              {currencySymbol}
            </span>
            <input
              type="number" min="0" step="500" placeholder="e.g. 2500"
              value={yearlyAmount || ''}
              onChange={(e) => handleYearlyChange(Number(e.target.value))}
              className={inputCls} style={inputStyle}
            />
          </div>
        </div>
      </div>

      {(monthsSaved > 0 || interestSaved > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 flex items-center justify-between border"
            style={{ backgroundColor: 'var(--accent-bg)', borderColor: 'var(--accent-border)' }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Total Interest Saved</div>
              <div className="text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(interestSaved, currencyCode)}
              </div>
            </div>
            <TrendingUp className="w-8 h-8 opacity-60" style={{ color: 'var(--accent)' }} />
          </div>

          <div className="rounded-xl p-4 flex items-center justify-between border"
            style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#38bdf8' }}>Time Cut Off Loan</div>
              <div className="text-2xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {monthsSaved} Months ({yearsSaved} Yrs)
              </div>
            </div>
            <ArrowDown className="w-8 h-8 opacity-60" style={{ color: '#38bdf8' }} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-3.5 text-xs text-center border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          Enter an extra payment above to calculate your interest savings and updated payoff date.
        </div>
      )}
    </div>
  );
}
