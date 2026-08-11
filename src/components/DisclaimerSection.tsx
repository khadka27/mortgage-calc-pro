'use client';

import { ShieldAlert } from 'lucide-react';

import { CountryConfig } from '@/lib/mortgage/types';

interface DisclaimerSectionProps {
  country: CountryConfig;
}

export default function DisclaimerSection({ country }: DisclaimerSectionProps) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 text-xs text-zinc-400 space-y-3">
      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
        <ShieldAlert className="w-4 h-4" />
        <span>Legal & Financial Disclaimer ({country.countryName})</span>
      </div>

      <p className="leading-relaxed">
        This mortgage calculator provides estimations for informational and educational purposes only. Actual mortgage payments, annual percentage rates (APR), property taxes, home insurance premiums, fees, and loan terms may vary based on your lender, credit profile, property appraisal, regional taxation laws, and borrower qualification.
      </p>

      <p className="text-zinc-500 font-mono text-[11px] border-t border-zinc-800/80 pt-2">
        {country.disclaimer}
      </p>
    </div>
  );
}
