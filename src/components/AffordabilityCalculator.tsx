'use client';

import { DollarSign, Home, ShieldAlert, Sliders } from 'lucide-react';
import { useState } from 'react';

import { calculateAffordability } from '@/lib/mortgage/affordability';
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
  const [targetHousingDti, setTargetHousingDti] = useState<number>(28);
  const [targetMaxDti, setTargetMaxDti] = useState<number>(36);

  const result = calculateAffordability({
    countryCode: country.countryCode,
    annualIncome,
    monthlyDebts,
    downPaymentAmount,
    interestRate,
    loanTermYears,
    targetHousingDtiPct: targetHousingDti,
    targetMaxDtiPct: targetMaxDti,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form Column */}
      <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-400" />
            Home Affordability Inputs
          </h2>
          <p className="text-xs text-zinc-400">
            Estimate maximum purchase price based on income and debt ratios ({country.currencyCode}).
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Gross Annual Income ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              value={annualIncome || ''}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Monthly Recurring Debts (Car, Credit Cards, Student Loans) ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={monthlyDebts || ''}
              onChange={(e) => setMonthlyDebts(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Available Down Payment ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              value={downPaymentAmount || ''}
              onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Interest Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.1"
                value={interestRate || ''}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Loan Term (Years)
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                {country.availableLoanTerms.map((t) => (
                  <option key={t} value={t}>
                    {t} Years
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DTI Limit Sliders */}
          <div className="border-t border-zinc-800 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Target Debt-to-Income (DTI) Limit
              </label>
              <span className="text-xs font-bold text-emerald-400">{targetMaxDti}% Total DTI</span>
            </div>

            <input
              type="range"
              min="20"
              max="50"
              step="1"
              value={targetMaxDti}
              onChange={(e) => setTargetMaxDti(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Estimated Maximum Home Price
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
            {formatCurrency(result.maxHomePrice, country.currencyCode)}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Includes estimated max loan of {formatCurrency(result.maxLoanAmount, country.currencyCode)} + {formatCurrency(result.downPaymentAmount, country.currencyCode)} down payment.
          </p>
        </div>

        <div className="space-y-3 border-t border-zinc-800 pt-5">
          <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-xs font-medium text-zinc-300">Max Monthly Housing Payment</span>
            <span className="text-base font-bold text-emerald-400">
              {formatCurrency(result.maxMonthlyHousingCost, country.currencyCode)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-xs font-medium text-zinc-300">Housing DTI Ratio</span>
            <span className="text-sm font-bold text-white">{result.housingDtiPct}%</span>
          </div>

          <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-xs font-medium text-zinc-300">Total DTI Ratio (Housing + Debt)</span>
            <span className="text-sm font-bold text-white">{result.totalDtiPct}%</span>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Disclaimer:</strong> This calculation is an estimate for planning purposes only and does not constitute formal mortgage pre-approval or loan commitment.
          </div>
        </div>
      </div>
    </div>
  );
}
