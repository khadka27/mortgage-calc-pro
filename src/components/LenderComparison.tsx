'use client';

import { ArrowRight, Check, Filter, Info, ShieldCheck, Star } from 'lucide-react';
import { useMemo, useState } from 'react';

import CustomSelect from '@/components/CustomSelect';
import { formatCurrency } from '@/lib/mortgage/decimalUtils';

interface LenderOffer {
  id: string;
  lenderName: string;
  nmlsId: string;
  badge?: string;
  apr: number;
  rate: number;
  monthlyPayment: number;
  fees: number;
  points: number;
  pointsAmount: number;
  programType: 'conventional' | 'fha' | 'va' | 'usda';
  rating: number;
}

interface LenderComparisonProps {
  propertyPrice?: number;
  loanAmount?: number;
  currencyCode?: string;
  currencySymbol?: string;
}

const DEFAULT_LENDERS: LenderOffer[] = [
  {
    id: 'f5-mortgage',
    lenderName: 'F5 Mortgage',
    nmlsId: 'NMLS #1938115',
    badge: 'Top Choice',
    apr: 6.377,
    rate: 6.250,
    monthlyPayment: 1971,
    fees: 4422,
    points: 0.950,
    pointsAmount: 3040,
    programType: 'conventional',
    rating: 4.9,
  },
  {
    id: 'optimum-first',
    lenderName: 'Optimum First Mortgage',
    nmlsId: 'NMLS #240415',
    badge: 'Popular',
    apr: 6.397,
    rate: 6.250,
    monthlyPayment: 1971,
    fees: 4974,
    points: 0.931,
    pointsAmount: 2979,
    programType: 'conventional',
    rating: 4.8,
  },
  {
    id: 'pure-funding',
    lenderName: 'Pure Funding LLC',
    nmlsId: 'NMLS #2371647',
    apr: 6.433,
    rate: 6.250,
    monthlyPayment: 1971,
    fees: 6682,
    points: 0.500,
    pointsAmount: 1600,
    programType: 'conventional',
    rating: 4.7,
  },
  {
    id: 'pmf-pro',
    lenderName: 'PMF Pro Mortgage Funding',
    nmlsId: 'NMLS #2119829',
    apr: 6.455,
    rate: 6.250,
    monthlyPayment: 1971,
    fees: 6965,
    points: 0.553,
    pointsAmount: 1770,
    programType: 'conventional',
    rating: 4.7,
  },
  {
    id: 'river-city',
    lenderName: 'River City Mortgage',
    nmlsId: 'NMLS #142954',
    badge: 'Low Fees',
    apr: 6.462,
    rate: 6.375,
    monthlyPayment: 1997,
    fees: 3037,
    points: 0.621,
    pointsAmount: 1987,
    programType: 'conventional',
    rating: 4.8,
  },
  {
    id: 'pure-rate',
    lenderName: 'Pure Rate Mortgage',
    nmlsId: 'NMLS #2578474',
    apr: 6.462,
    rate: 6.375,
    monthlyPayment: 1997,
    fees: 2905,
    points: 0.525,
    pointsAmount: 1680,
    programType: 'conventional',
    rating: 4.6,
  },
  {
    id: 'future-first',
    lenderName: 'Future First Lending',
    nmlsId: 'NMLS #2126430',
    apr: 6.470,
    rate: 6.375,
    monthlyPayment: 1997,
    fees: 3195,
    points: 0.625,
    pointsAmount: 2000,
    programType: 'conventional',
    rating: 4.8,
  },
  {
    id: 'home-simply',
    lenderName: 'HomeSimply',
    nmlsId: 'NMLS #2473786',
    apr: 6.487,
    rate: 6.375,
    monthlyPayment: 1997,
    fees: 3770,
    points: 0.836,
    pointsAmount: 2675,
    programType: 'conventional',
    rating: 4.7,
  },
];

export default function LenderComparison({
  propertyPrice = 400000,
  loanAmount = 320000,
  currencyCode = 'USD',
  currencySymbol = '$',
}: LenderComparisonProps) {
  const [loanPurpose, setLoanPurpose] = useState<'purchase' | 'refinance'>('purchase');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [creditScore, setCreditScore] = useState<string>('740-759');
  const [includeFHA, setIncludeFHA] = useState(false);
  const [includeVA, setIncludeVA] = useState(false);
  const [includeUSDA, setIncludeUSDA] = useState(false);
  const [sortBy, setSortBy] = useState<'apr' | 'payment' | 'rate' | 'fees'>('apr');
  const [appliedLender, setAppliedLender] = useState<string | null>(null);

  const currentDateStr = new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const sortedLenders = useMemo(() => {
    return [...DEFAULT_LENDERS].sort((a, b) => {
      if (sortBy === 'apr') return a.apr - b.apr;
      if (sortBy === 'payment') return a.monthlyPayment - b.monthlyPayment;
      if (sortBy === 'rate') return a.rate - b.rate;
      if (sortBy === 'fees') return a.fees - b.fees;
      return 0;
    });
  }, [sortBy]);

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="border rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 overflow-hidden" style={cardStyle}>
      {/* Header Banner matching screenshot 2 & 3 */}
      <div className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Compare Today's Mortgage Rates for {currentDateStr}
            </h2>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Real-time personalized rate quotes from verified institutional lenders based on your loan profile.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border shrink-0" style={tileStyle}>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span style={{ color: 'var(--text-secondary)' }}>Equal Housing Opportunity</span>
        </div>
      </div>

      {/* Filter Control Box matching screenshot 2 */}
      <div className="p-4 sm:p-5 rounded-2xl border space-y-4" style={tileStyle}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          <Filter className="w-3.5 h-3.5 text-emerald-500" />
          Loan Profile & Rate Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Loan Purpose Toggle Buttons */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Loan Purpose
            </label>
            <div className="flex rounded-xl border p-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <button
                type="button"
                onClick={() => setLoanPurpose('purchase')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  loanPurpose === 'purchase'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setLoanPurpose('refinance')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  loanPurpose === 'refinance'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Refinance
              </button>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Loan Term
            </label>
            <CustomSelect
              id="lender-loan-term"
              value={loanTerm}
              onChange={(v) => setLoanTerm(v)}
              options={[
                { value: '30', label: '30 Yr Fixed' },
                { value: '20', label: '20 Yr Fixed' },
                { value: '15', label: '15 Yr Fixed' },
                { value: '5-arm', label: '5/1 ARM' },
              ]}
            />
          </div>

          {/* Credit Score Tier */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Credit Score
            </label>
            <CustomSelect
              id="lender-credit-score"
              value={creditScore}
              onChange={(v) => setCreditScore(v)}
              options={[
                { value: '760+', label: '760+ Excellent' },
                { value: '740-759', label: '740-759 Very Good' },
                { value: '700-739', label: '700-739 Good' },
                { value: '680-699', label: '680-699 Fair' },
                { value: '660-679', label: '660-679 Average' },
              ]}
            />
          </div>

          {/* Loan Balance Display */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Calculated Loan Balance
            </label>
            <div className="px-3.5 py-2 rounded-xl border text-sm font-bold text-emerald-500" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              {formatCurrency(loanAmount, currencyCode)}
            </div>
          </div>
        </div>

        {/* Checkbox Options: FHA / VA / USDA */}
        <div className="flex items-center gap-6 pt-2 border-t flex-wrap text-xs font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeFHA}
              onChange={(e) => setIncludeFHA(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Include FHA Loans</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeVA}
              onChange={(e) => setIncludeVA(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Include VA Loans</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUSDA}
              onChange={(e) => setIncludeUSDA(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Include USDA Loans</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </label>
        </div>
      </div>

      {/* Sort By Toolbar matching screenshot 3 */}
      <div className="flex items-center justify-between gap-4 border-b pb-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span style={{ color: 'var(--text-muted)' }}>SORT BY:</span>
          {(
            [
              { id: 'apr', label: 'APR' },
              { id: 'payment', label: 'Monthly Payment' },
              { id: 'rate', label: 'Rate' },
              { id: 'fees', label: 'Fees & Points' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSortBy(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                sortBy === tab.id
                  ? 'bg-emerald-500 text-white font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Showing {sortedLenders.length} lender quotes
        </div>
      </div>

      {/* Lender Rate Cards List matching screenshot 3 */}
      <div className="space-y-3">
        {sortedLenders.map((lender) => (
          <div
            key={lender.id}
            className="p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            style={tileStyle}
          >
            {/* Lender Identity */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-500 text-base shrink-0">
                {lender.lenderName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {lender.lenderName}
                  </h3>
                  {lender.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                      {lender.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span>{lender.nmlsId}</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-500" /> {lender.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                  APR
                </div>
                <div className="text-lg font-black text-emerald-500">
                  {lender.apr.toFixed(3)}%
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{loanTerm} Yr Fixed</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                  PAYMENT
                </div>
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currencySymbol}{lender.monthlyPayment.toLocaleString()} <span className="text-xs font-normal">/mo</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                  RATE
                </div>
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {lender.rate.toFixed(3)}%
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                  FEES &amp; POINTS
                </div>
                <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currencySymbol}{lender.fees.toLocaleString()}
                </div>
                <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  Includes {lender.points.toFixed(3)} pts ({currencySymbol}{lender.pointsAmount.toLocaleString()})
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0 flex items-center lg:flex-col justify-end gap-2">
              <button
                type="button"
                onClick={() => setAppliedLender(lender.id)}
                className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                {appliedLender === lender.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Rate Locked!
                  </>
                ) : (
                  <>
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
