'use client';

import { Activity, ArrowLeft, Calculator, DollarSign, Info, ShieldCheck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/mortgage/decimalUtils';

export default function HelocPage() {
  const [homeValue, setHomeValue] = useState(400000);
  const [mortgageBalance, setMortgageBalance] = useState(200000);
  const [maxLtvPct, setMaxLtvPct] = useState(80);
  const [helocDrawAmount, setHelocDrawAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [drawPeriodYears, setDrawPeriodYears] = useState(10);
  const [repaymentPeriodYears, setRepaymentPeriodYears] = useState(20);

  const maxBorrowLimit = Math.max(0, (homeValue * (maxLtvPct / 100)) - mortgageBalance);
  const safeDraw = Math.min(helocDrawAmount, maxBorrowLimit);

  // Draw Period (Interest-Only Payment)
  const monthlyRate = (interestRate / 100) / 12;
  const drawMonthlyPayment = safeDraw * monthlyRate;

  // Repayment Period (Amortized Principal + Interest)
  const totalRepaymentMonths = repaymentPeriodYears * 12;
  const repaymentMonthlyPayment =
    monthlyRate > 0
      ? (safeDraw * (monthlyRate * Math.pow(1 + monthlyRate, totalRepaymentMonths))) /
        (Math.pow(1 + monthlyRate, totalRepaymentMonths) - 1)
      : safeDraw / totalRepaymentMonths;

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Header activeTab="calculator" countryName="United States" currencySymbol="$" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                HELOC Calculator (Home Equity Line of Credit)
              </h1>
            </div>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Calculate maximum credit line limit, interest-only draw payments, and amortized repayment period costs.
            </p>
          </div>
          <Link href="/" className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0" style={tileStyle}>
            <ArrowLeft className="w-4 h-4" /> Back to Main
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-6 border rounded-2xl p-5 sm:p-6 space-y-5" style={cardStyle}>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">Equity &amp; Line Parameters</div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Current Home Value ($)</label>
              <input
                type="number"
                value={homeValue}
                onChange={(e) => setHomeValue(Number(e.target.value))}
                className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Existing First Mortgage Balance ($)</label>
              <input
                type="number"
                value={mortgageBalance}
                onChange={(e) => setMortgageBalance(Number(e.target.value))}
                className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                style={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Max LTV Limit (%)</label>
                <input
                  type="number"
                  value={maxLtvPct}
                  onChange={(e) => setMaxLtvPct(Number(e.target.value))}
                  className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>HELOC Draw Amount ($)</label>
                <input
                  type="number"
                  value={helocDrawAmount}
                  onChange={(e) => setHelocDrawAmount(Number(e.target.value))}
                  className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>HELOC Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Draw (Yrs)</label>
                <input
                  type="number"
                  value={drawPeriodYears}
                  onChange={(e) => setDrawPeriodYears(Number(e.target.value))}
                  className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Repay (Yrs)</label>
                <input
                  type="number"
                  value={repaymentPeriodYears}
                  onChange={(e) => setRepaymentPeriodYears(Number(e.target.value))}
                  className="w-full rounded-xl px-3.5 py-2 text-sm border font-semibold"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 border rounded-2xl p-5 sm:p-6 space-y-6" style={cardStyle}>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">HELOC Borrowing Capacity</div>

            <div className="p-4 rounded-xl border space-y-1" style={tileStyle}>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Maximum Estimated Line of Credit</div>
              <div className="text-3xl font-black text-emerald-500">
                {formatCurrency(maxBorrowLimit, 'USD')}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Based on {maxLtvPct}% maximum combined loan-to-value (CLTV) limit.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border space-y-1" style={tileStyle}>
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Draw Period ({drawPeriodYears} Yrs)</div>
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(drawMonthlyPayment, 'USD')} <span className="text-xs font-normal">/mo</span>
                </div>
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Interest Only</div>
              </div>

              <div className="p-4 rounded-xl border space-y-1" style={tileStyle}>
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Repayment Period ({repaymentPeriodYears} Yrs)</div>
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(repaymentMonthlyPayment, 'USD')} <span className="text-xs font-normal">/mo</span>
                </div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Principal + Interest</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
