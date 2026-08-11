'use client';

import { ExternalLink, Info, ShieldCheck } from 'lucide-react';

import { CountryConfig } from '@/lib/mortgage/types';

interface RateSourceNoticeProps {
  country: CountryConfig;
  interestRate: number;
}

export default function RateSourceNotice({ country, interestRate }: RateSourceNoticeProps) {
  const primarySource = country.supportedRateSources[0] || 'Central Bank Indicator';

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <div>
          <span className="text-zinc-300 font-semibold">Interest Rate Data Benchmark: </span>
          <span className="text-emerald-400 font-medium">{primarySource}</span>
          <span className="text-zinc-500 ml-2">({interestRate}% current baseline rate)</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-zinc-400 text-[11px] self-end sm:self-auto">
        <span>Last Updated: Aug 2026</span>
        <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 font-mono">Transparent Baseline</span>
      </div>
    </div>
  );
}
