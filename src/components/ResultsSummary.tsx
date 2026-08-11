'use client';

import { PieChart, TrendingDown } from 'lucide-react';

import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { CalculationResult } from '@/lib/mortgage/types';

interface ResultsSummaryProps {
  result: CalculationResult;
}

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  const {
    currencyCode,
    paymentFrequency,
    totalPeriodicPayment,
    periodicPrincipalAndInterest,
    periodicPropertyTax,
    periodicHomeInsurance,
    periodicMortgageInsurance,
    periodicHoa,
    loanAmount,
    totalInterestPaid,
    totalCostOfLoan,
    payoffDate,
    ltvRatio,
    housingDti,
    totalDti,
  } = result;

  const freqLabel = paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1);

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
  };

  const tileStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-subtle)',
    borderColor: 'var(--border)',
  };

  const breakdownItems = [
    { label: 'Principal & Interest', value: periodicPrincipalAndInterest, color: '#10b981' },
    { label: 'Property Tax', value: periodicPropertyTax, color: '#2dd4bf' },
    { label: 'Home Insurance', value: periodicHomeInsurance, color: '#38bdf8' },
    ...(periodicMortgageInsurance > 0
      ? [{ label: 'PMI / Mortgage Insurance', value: periodicMortgageInsurance, color: '#f59e0b' }]
      : []),
    ...(periodicHoa > 0
      ? [{ label: 'HOA / Maintenance', value: periodicHoa, color: '#c084fc' }]
      : []),
  ];

  return (
    <div className="border rounded-2xl p-6 shadow-sm space-y-6" style={cardStyle}>
      {/* Main Payment Hero */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--accent-bg) 0%, color-mix(in srgb, var(--accent-bg) 40%, var(--bg-card)) 100%)',
          borderColor: 'var(--accent-border)',
          border: '1px solid var(--accent-border)',
        }}
      >
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-28 h-28 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: 'var(--accent)' }} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
              Estimated {freqLabel} Housing Payment
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(totalPeriodicPayment, currencyCode)}
            </div>
            <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
              Principal + Interest + Taxes + Insurance + HOA
            </div>
          </div>

          <div
            className="flex flex-col items-end gap-1 px-4 py-2.5 rounded-xl border text-right shrink-0"
            style={tileStyle}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              LTV Ratio
            </div>
            <div className="text-xl font-black" style={{ color: 'var(--accent)' }}>
              {ltvRatio.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <PieChart className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          {freqLabel} Payment Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {breakdownItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-xl border"
              style={tileStyle}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(item.value, currencyCode)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
        {[
          { label: 'Total Loan Amount', value: formatCurrency(loanAmount, currencyCode), accent: false },
          { label: 'Total Interest Paid', value: formatCurrency(totalInterestPaid, currencyCode), accent: true },
          { label: 'Total Cost of Loan', value: formatCurrency(totalCostOfLoan, currencyCode), accent: false },
          { label: 'Payoff Date', value: payoffDate, accent: true },
        ].map(({ label, value, accent }) => (
          <div key={label} className="p-3.5 rounded-xl border" style={tileStyle}>
            <div className="text-[11px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
            <div
              className="text-sm font-bold"
              style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* DTI Ratios */}
      {(housingDti !== undefined || totalDti !== undefined) && (
        <div
          className="p-3.5 rounded-xl border flex items-center justify-between text-xs flex-wrap gap-3"
          style={tileStyle}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Housing DTI: </span>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{housingDti}%</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total DTI: </span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{totalDti}%</span>
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Based on gross monthly income</div>
        </div>
      )}
    </div>
  );
}
