'use client';

import { Check, Copy, Printer, Share2 } from 'lucide-react';
import { useState } from 'react';

import { CalculationInput } from '@/lib/mortgage/types';

interface ShareAndExportProps {
  input: CalculationInput;
}

export default function ShareAndExport({ input }: ShareAndExportProps) {
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams();
    params.set('country', input.countryCode);
    params.set('price', input.propertyPrice.toString());
    params.set('down', input.downPayment.toString());
    params.set('rate', input.interestRate.toString());
    params.set('term', input.loanTermYears.toString());
    params.set('freq', input.paymentFrequency);

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleCopyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border border-zinc-700 shadow-sm"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-emerald-400" />}
        {copied ? 'Link Copied!' : 'Share Calculation'}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border border-zinc-700 shadow-sm"
      >
        <Printer className="w-3.5 h-3.5 text-emerald-400" />
        Print
      </button>
    </div>
  );
}
