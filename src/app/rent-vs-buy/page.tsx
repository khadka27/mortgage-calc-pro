'use client';

import { ArrowLeft, Building, DollarSign, Home, Scale, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/mortgage/decimalUtils';

export default function RentVsBuyPage() {
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [annualRentIncreasePct, setAnnualRentIncreasePct] = useState(3.5);
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [homeAppreciationPct, setHomeAppreciationPct] = useState(4.0);
  const [yearsToCompare, setYearsToCompare] = useState(10);

  const loanAmount = Math.max(0, homePrice - downPayment);
  const monthlyRate = (interestRate / 100) / 12;
  const numPayments = 30 * 12;

  const monthlyPAndI =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

  const totalMonthlyBuyCost = monthlyPAndI + (homePrice * 0.012) / 12 + (homePrice * 0.005) / 12;

  const comparison = useMemo(() => {
    let cumulativeRentPaid = 0;
    let currentRent = monthlyRent;
    for (let yr = 1; yr <= yearsToCompare; yr++) {
      cumulativeRentPaid += currentRent * 12;
      currentRent *= 1 + annualRentIncreasePct / 100;
    }

    const futureHomeValue = homePrice * Math.pow(1 + homeAppreciationPct / 100, yearsToCompare);
    let remainingLoan = loanAmount;
    for (let m = 1; m <= yearsToCompare * 12; m++) {
      const interest = remainingLoan * monthlyRate;
      const principal = monthlyPAndI - interest;
      remainingLoan = Math.max(0, remainingLoan - principal);
    }

    const homeEquityGained = futureHomeValue - remainingLoan;
    const netBuyingWealth = homeEquityGained - downPayment;
    const netRentingWealth = -cumulativeRentPaid;

    return {
      cumulativeRentPaid,
      futureHomeValue,
      remainingLoan,
      homeEquityGained,
      netBuyingWealth,
      netRentingWealth,
      buyingAdvantage: homeEquityGained - cumulativeRentPaid,
    };
  }, [monthlyRent, annualRentIncreasePct, homePrice, downPayment, interestRate, homeAppreciationPct, yearsToCompare, loanAmount, monthlyRate, monthlyPAndI]);

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Header activeTab="calculator" setActiveTab={() => {}} countryName="United States" currencySymbol="$" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-500" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Rent vs. Buy Calculator
              </h1>
            </div>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Compare total long-term net wealth gained between renting vs homeownership over {yearsToCompare} years.
            </p>
          </div>
          <Link href="/" className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0" style={tileStyle}>
            <ArrowLeft className="w-4 h-4" /> Back to Main
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-6 border rounded-2xl p-5 sm:p-6 space-y-5" style={cardStyle}>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">Rental vs Purchase Parameters</div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Monthly Rent ($)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Rent Inflation (%/yr)</label>
                <input
                  type="number"
                  step="0.5"
                  value={annualRentIncreasePct}
                  onChange={(e) => setAnnualRentIncreasePct(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Home Price ($)</label>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Down Payment ($)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Appreciation (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={homeAppreciationPct}
                  onChange={(e) => setHomeAppreciationPct(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Time Horizon</label>
                <input
                  type="number"
                  value={yearsToCompare}
                  onChange={(e) => setYearsToCompare(Number(e.target.value))}
                  className="w-full rounded-xl px-3 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 border rounded-2xl p-5 sm:p-6 space-y-6" style={cardStyle}>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">{yearsToCompare}-Year Wealth Outcome</div>

            <div className="p-4 rounded-xl border space-y-1" style={tileStyle}>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Net Home Equity Accumulated</div>
              <div className="text-3xl font-black text-emerald-500">
                {formatCurrency(comparison.homeEquityGained, 'USD')}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Estimated future home value of {formatCurrency(comparison.futureHomeValue, 'USD')} minus remaining loan balance of {formatCurrency(comparison.remainingLoan, 'USD')}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border space-y-1" style={tileStyle}>
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Total Rent Paid</div>
                <div className="text-lg font-bold text-red-500">
                  {formatCurrency(comparison.cumulativeRentPaid, 'USD')}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Unrecoverable cost</div>
              </div>

              <div className="p-4 rounded-xl border space-y-1" style={tileStyle}>
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Buying Advantage</div>
                <div className="text-lg font-bold text-emerald-500">
                  +{formatCurrency(comparison.buyingAdvantage, 'USD')}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Net wealth difference</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
