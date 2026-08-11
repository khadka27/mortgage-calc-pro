'use client';

import { ArrowRight, DollarSign, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

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
  const [remainingTermMonths, setRemainingTermMonths] = useState<number>(300); // 25 years left

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Columns */}
      <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            Mortgage Refinance Comparison
          </h2>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {country.currencyCode} ({country.currencySymbol})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Mortgage Column */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Current Mortgage
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Current Balance ({country.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={currentLoanBalance || ''}
                onChange={(e) => setCurrentLoanBalance(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Current Interest Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={currentInterestRate || ''}
                onChange={(e) => setCurrentInterestRate(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Current Monthly Payment ({country.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={currentMonthlyPayment || ''}
                onChange={(e) => setCurrentMonthlyPayment(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Remaining Term (Months)
              </label>
              <input
                type="number"
                min="1"
                step="12"
                value={remainingTermMonths || ''}
                onChange={(e) => setRemainingTermMonths(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* New Proposed Mortgage Column */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Proposed Refinance
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                New Interest Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={newInterestRate || ''}
                onChange={(e) => setNewInterestRate(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                New Loan Term (Years)
              </label>
              <select
                value={newLoanTermYears}
                onChange={(e) => setNewLoanTermYears(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                {country.availableLoanTerms.map((t) => (
                  <option key={t} value={t}>
                    {t} Years
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Refinance Closing Costs ({country.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="250"
                value={closingCosts || ''}
                onChange={(e) => setClosingCosts(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Analysis Column */}
      <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Estimated Monthly Savings
          </div>
          {result.monthlySavings > 0 ? (
            <div className="text-4xl font-black text-emerald-400 tracking-tight mt-1">
              {formatCurrency(result.monthlySavings, country.currencyCode)} / mo
            </div>
          ) : (
            <div className="text-2xl font-bold text-rose-400 mt-1">
              No Monthly Savings
            </div>
          )}
          <p className="text-xs text-zinc-400 mt-1">
            New monthly payment of {formatCurrency(result.newMonthlyPayment, country.currencyCode)} vs current {formatCurrency(currentMonthlyPayment, country.currencyCode)}.
          </p>
        </div>

        {/* Break-even analytics */}
        <div className="space-y-3 border-t border-zinc-800 pt-5 text-xs">
          <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-300 font-medium">Break-Even Period</span>
            <span className="font-bold text-white">
              {result.breakEvenMonths !== null
                ? `${result.breakEvenMonths} Months (${(result.breakEvenMonths / 12).toFixed(1)} yrs)`
                : 'N/A (No monthly savings)'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-300 font-medium">Net Lifetime Interest Savings</span>
            <span className={`font-bold ${result.netLifetimeSavings > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(result.netLifetimeSavings, country.currencyCode)}
            </span>
          </div>
        </div>

        {result.isRefinanceBeneficial ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300 flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <strong>Refinance Recommended:</strong> This refinance generates immediate monthly savings and recoups closing costs in {result.breakEvenMonths} months.
            </div>
          </div>
        ) : (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <strong>Refinance Caution:</strong> Proposed interest rate or terms do not yield sufficient monthly savings to justify closing costs.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
