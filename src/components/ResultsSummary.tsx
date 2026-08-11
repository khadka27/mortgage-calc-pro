'use client';

import { ArrowUpRight, Calendar, DollarSign, Percent, PieChart, ShieldAlert } from 'lucide-react';

import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { CalculationResult } from '@/lib/mortgage/types';

interface ResultsSummaryProps {
  result: CalculationResult;
}

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  const {
    currencyCode,
    currencySymbol,
    paymentFrequency,
    totalPeriodicPayment,
    periodicPrincipalAndInterest,
    periodicPropertyTax,
    periodicHomeInsurance,
    periodicMortgageInsurance,
    periodicHoa,
    periodicOtherCosts,
    loanAmount,
    totalPrincipalPaid,
    totalInterestPaid,
    totalCostOfLoan,
    interestToPrincipalRatio,
    payoffDate,
    totalNumberOfPayments,
    ltvRatio,
    housingDti,
    totalDti,
  } = result;

  const freqLabel = paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1);

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Top Banner: Main Periodic Payment */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Estimated {freqLabel} Housing Payment</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
              {formatCurrency(totalPeriodicPayment, currencyCode)}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Includes Principal & Interest + Taxes + Insurance + HOA
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-right">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              Loan-to-Value (LTV)
            </div>
            <div className="text-lg font-bold text-emerald-400">{ltvRatio.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Payment Component Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-400" />
          {freqLabel} Payment Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-zinc-300 font-medium">Principal & Interest</span>
            </div>
            <span className="font-bold text-white">
              {formatCurrency(periodicPrincipalAndInterest, currencyCode)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-400" />
              <span className="text-zinc-300 font-medium">Property Tax</span>
            </div>
            <span className="font-bold text-white">
              {formatCurrency(periodicPropertyTax, currencyCode)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-zinc-300 font-medium">Home Insurance</span>
            </div>
            <span className="font-bold text-white">
              {formatCurrency(periodicHomeInsurance, currencyCode)}
            </span>
          </div>

          {periodicMortgageInsurance > 0 && (
            <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-zinc-300 font-medium">PMI / Mortgage Insurance</span>
              </div>
              <span className="font-bold text-amber-400">
                {formatCurrency(periodicMortgageInsurance, currencyCode)}
              </span>
            </div>
          )}

          {periodicHoa > 0 && (
            <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-zinc-300 font-medium">HOA / Maintenance</span>
              </div>
              <span className="font-bold text-white">{formatCurrency(periodicHoa, currencyCode)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loan Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-zinc-800 pt-5">
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Total Loan Amount</div>
          <div className="text-base font-bold text-white mt-1">
            {formatCurrency(loanAmount, currencyCode)}
          </div>
        </div>

        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Total Interest Paid</div>
          <div className="text-base font-bold text-amber-400 mt-1">
            {formatCurrency(totalInterestPaid, currencyCode)}
          </div>
        </div>

        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Total Cost of Loan</div>
          <div className="text-base font-bold text-white mt-1">
            {formatCurrency(totalCostOfLoan, currencyCode)}
          </div>
        </div>

        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
          <div className="text-[11px] text-zinc-400 font-medium">Payoff Date</div>
          <div className="text-base font-bold text-emerald-400 mt-1">{payoffDate}</div>
        </div>
      </div>

      {/* Ratios & Income DTI (if present) */}
      {(housingDti !== undefined || totalDti !== undefined) && (
        <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-400">Housing DTI Ratio: </span>
            <span className="font-bold text-white">{housingDti}%</span>
          </div>
          <div>
            <span className="text-zinc-400">Total DTI Ratio: </span>
            <span className="font-bold text-emerald-400">{totalDti}%</span>
          </div>
          <div className="text-zinc-500 text-[11px]">
            Based on gross monthly income
          </div>
        </div>
      )}
    </div>
  );
}
