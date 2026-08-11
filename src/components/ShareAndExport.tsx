'use client';

import { Check, Copy, Printer, Share2 } from 'lucide-react';
import { useState } from 'react';

import { APP_URL } from '@/lib/env';
import { CalculationInput } from '@/lib/mortgage/types';

interface ShareAndExportProps {
  input: CalculationInput;
}

export default function ShareAndExport({ input }: ShareAndExportProps) {
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    const base = typeof window !== 'undefined'
      ? window.location.origin
      : APP_URL;
    const params = new URLSearchParams();
    params.set('country', input.countryCode);
    params.set('price', input.propertyPrice.toString());
    params.set('down', input.downPayment.toString());
    params.set('rate', input.interestRate.toString());
    params.set('term', input.loanTermYears.toString());
    params.set('freq', input.paymentFrequency);
    return `${base}/?${params.toString()}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generateShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const btnStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-subtle)',
    borderColor: 'var(--border)',
    color: 'var(--text-secondary)',
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm hover:opacity-80"
        style={btnStyle}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-emerald-500" />}
        {copied ? 'Copied!' : 'Share'}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm hover:opacity-80"
        style={btnStyle}
      >
        <Printer className="w-3.5 h-3.5 text-emerald-500" />
        Print
      </button>
    </div>
  );
}
