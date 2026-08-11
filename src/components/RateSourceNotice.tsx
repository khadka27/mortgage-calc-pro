'use client';

import { ExternalLink, Info, ShieldCheck } from 'lucide-react';

import { CountryConfig } from '@/lib/mortgage/types';

interface RateSourceNoticeProps {
  country: CountryConfig;
  interestRate: number;
}

export default function RateSourceNotice({ country, interestRate }: RateSourceNoticeProps) {
  const primarySource = country.supportedRateSources[0] || 'Central Bank Indicator';

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
    color: 'var(--text-muted)',
  };
  const badgeStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border)',
  };

  return (
    <div className="border rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs" style={containerStyle}>
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
        <div>
          <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Interest Rate Benchmark: </span>
          <span className="font-medium" style={{ color: 'var(--accent)' }}>{primarySource}</span>
          <span className="ml-2" style={{ color: 'var(--text-muted)' }}>({interestRate}% baseline)</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] self-end sm:self-auto" style={{ color: 'var(--text-muted)' }}>
        <span>Last Updated: Aug 2026</span>
        <span className="px-2 py-0.5 rounded border font-mono" style={badgeStyle}>Transparent Baseline</span>
      </div>
    </div>
  );
}
