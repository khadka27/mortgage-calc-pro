'use client';

import { Activity, AlertCircle, ArrowRight, RefreshCw, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

import { useLiveRates, LiveMortgageRate } from '@/hooks/useLiveRates';

interface LiveRateBannerProps {
  /** Called when user clicks "Apply" on a rate card */
  onApplyRate: (rate: number) => void;
  /** Currently active mortgage term in years — used to highlight the matching product */
  activeLoanTermYears?: number;
}

const PRODUCT_TERM_MAP: Record<string, number> = {
  mortgage_15yr: 15,
  mortgage_30yr: 30,
  mortgage_arm: 30,
};

const PRODUCT_LABEL_MAP: Record<string, string> = {
  mortgage_15yr: '15-yr Fixed',
  mortgage_30yr: '30-yr Fixed',
  mortgage_arm: 'ARM',
};

const PRODUCT_COLOR_MAP: Record<string, string> = {
  mortgage_15yr: '#10b981',   // emerald
  mortgage_30yr: '#3b82f6',   // blue
  mortgage_arm: '#f59e0b',    // amber
};

function RateCard({
  rate,
  isHighlighted,
  onApply,
}: {
  rate: LiveMortgageRate;
  isHighlighted: boolean;
  onApply: () => void;
}) {
  const color = PRODUCT_COLOR_MAP[rate.productType] ?? '#10b981';
  const label = PRODUCT_LABEL_MAP[rate.productType] ?? rate.displayName;

  return (
    <div
      className="flex-1 min-w-[160px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer group relative overflow-hidden"
      style={{
        backgroundColor: isHighlighted ? `${color}12` : 'var(--bg-subtle)',
        borderColor: isHighlighted ? `${color}50` : 'var(--border)',
      }}
    >
      {/* Active indicator dot */}
      {isHighlighted && (
        <span
          className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Product label */}
      <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color }}>
        {label}
      </div>

      {/* Median rate — the headline number */}
      <div className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {rate.medianRate.toFixed(2)}
        <span className="text-sm font-semibold ml-0.5" style={{ color: 'var(--text-muted)' }}>%</span>
      </div>

      {/* Range row */}
      <div className="flex items-center gap-1.5 mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
        <span>{rate.minRate.toFixed(2)}%</span>
        <span>–</span>
        <span>{rate.maxRate.toFixed(2)}%</span>
        <span className="ml-auto">{rate.count} lenders</span>
      </div>

      {/* Apply button */}
      <button
        type="button"
        onClick={onApply}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 border"
        style={{
          backgroundColor: isHighlighted ? color : 'var(--bg-card)',
          color: isHighlighted ? '#fff' : 'var(--text-secondary)',
          borderColor: isHighlighted ? color : 'var(--border)',
        }}
        onMouseEnter={(e) => {
          if (!isHighlighted) {
            (e.currentTarget as HTMLElement).style.backgroundColor = color;
            (e.currentTarget as HTMLElement).style.color = '#fff';
            (e.currentTarget as HTMLElement).style.borderColor = color;
          }
        }}
        onMouseLeave={(e) => {
          if (!isHighlighted) {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-card)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }
        }}
      >
        Use This Rate
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function LiveRateBanner({ onApplyRate, activeLoanTermYears = 30 }: LiveRateBannerProps) {
  const { rates, meta, loading, error, refetch } = useLiveRates();
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const handleRefetch = () => {
    refetch();
    setLastRefreshed(new Date());
  };

  const formatTime = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div
        className="rounded-2xl border p-4 flex items-center gap-3 text-sm"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <Activity className="w-4 h-4 animate-pulse" style={{ color: 'var(--accent)' }} />
        <span style={{ color: 'var(--text-muted)' }}>Fetching live mortgage rates…</span>
        <span className="ml-auto flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-20 h-16 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            />
          ))}
        </span>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || rates.length === 0) {
    return (
      <div
        className="rounded-2xl border p-3.5 flex items-center gap-3 text-xs"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <WifiOff className="w-4 h-4 shrink-0" style={{ color: '#f59e0b' }} />
        <span style={{ color: 'var(--text-muted)' }}>
          Live rate feed unavailable. {error ?? 'No mortgage benchmarks returned.'}
        </span>
        <button
          type="button"
          onClick={handleRefetch}
          className="ml-auto flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-4 space-y-3"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: 'var(--accent)' }} />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
            Live US Mortgage Rates
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full border font-semibold" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
            {meta?.totalInstitutions.toLocaleString()} lenders · {meta?.totalRates.toLocaleString()} rates
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>Updated {formatTime(meta?.generatedAt ?? '')}</span>
          <button
            type="button"
            onClick={handleRefetch}
            className="flex items-center gap-1 font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Rate cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {rates.map((rate) => {
          const matchingTerm = PRODUCT_TERM_MAP[rate.productType];
          const isHighlighted = matchingTerm === activeLoanTermYears;
          return (
            <RateCard
              key={rate.productType}
              rate={rate}
              isHighlighted={isHighlighted}
              onApply={() => onApplyRate(rate.medianRate)}
            />
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Source: rateapi.dev · Median APRs across US credit unions &amp; banks · Updated in real-time · For reference only — actual rates vary by lender, credit score, and location.
      </p>
    </div>
  );
}
