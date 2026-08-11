'use client';

import { ShieldAlert } from 'lucide-react';

import { CountryConfig } from '@/lib/mortgage/types';

interface DisclaimerSectionProps {
  country: CountryConfig;
}

export default function DisclaimerSection({ country }: DisclaimerSectionProps) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
    color: 'var(--text-muted)',
  };

  return (
    <div className="border rounded-2xl p-5 sm:p-6 text-xs space-y-3" style={containerStyle}>
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
        <ShieldAlert className="w-4 h-4" />
        <span>Legal & Financial Disclaimer ({country.countryName})</span>
      </div>

      <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        This mortgage calculator provides estimations for informational and educational purposes only. Actual mortgage payments, annual percentage rates (APR), property taxes, home insurance premiums, fees, and loan terms may vary based on your lender, credit profile, property appraisal, regional taxation laws, and borrower qualification.
      </p>

      <p className="font-mono text-[11px] border-t pt-2" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
        {country.disclaimer}
      </p>
    </div>
  );
}
