'use client';

import { ArrowDown, DollarSign, Sparkles, TrendingUp } from 'lucide-react';
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
  const [amount, setAmount] = useState<number | ''>(
    extraPayments.find((ep) => ep.type === 'monthly')?.amount || ''
  );
  const [yearlyAmount, setYearlyAmount] = useState<number | ''>(
    extraPayments.find((ep) => ep.type === 'yearly')?.amount || ''
  );

  const handleMonthlyChange = (val: number) => {
    setAmount(val);
    const updated = extraPayments.filter((ep) => ep.type !== 'monthly');
    if (val > 0) {
      updated.push({ amount: val, type: 'monthly' });
    }
    onChangeExtraPayments(updated);
  };

  const handleYearlyChange = (val: number) => {
    setYearlyAmount(val);
    const updated = extraPayments.filter((ep) => ep.type !== 'yearly');
    if (val > 0) {
      updated.push({ amount: val, type: 'yearly' });
    }
    onChangeExtraPayments(updated);
  };

  const yearsSaved = (monthsSaved / 12).toFixed(1);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Accelerated Payoff & Extra Payments
        </h3>
        <span className="text-xs text-zinc-400">Simulate early mortgage freedom</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Extra Monthly Payment */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Extra Monthly Payment ({currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              step="50"
              placeholder="e.g. 200"
              value={amount || ''}
              onChange={(e) => handleMonthlyChange(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Extra Annual Bonus Payment */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Extra Annual Lump-Sum ({currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
              {currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              step="500"
              placeholder="e.g. 2500"
              value={yearlyAmount || ''}
              onChange={(e) => handleYearlyChange(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Savings Metric Cards */}
      {(monthsSaved > 0 || interestSaved > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Total Interest Saved
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {formatCurrency(interestSaved, currencyCode)}
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400 opacity-80" />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                Time Cut Off Loan
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {monthsSaved} Months ({yearsSaved} Yrs)
              </div>
            </div>
            <ArrowDown className="w-8 h-8 text-cyan-400 opacity-80" />
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-400 text-center">
          Enter an extra payment amount above to calculate your interest savings and updated payoff date.
        </div>
      )}
    </div>
  );
}
