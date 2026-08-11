'use client';

import { Check, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

import { APP_NAME, APP_URL } from '@/lib/env';
import { generateMortgagePdfReport } from '@/lib/mortgage/pdfExporter';
import { CalculationInput, CalculationResult, CountryConfig } from '@/lib/mortgage/types';

interface ShareAndExportProps {
  input: CalculationInput;
  result?: CalculationResult;
  country?: CountryConfig;
}

export default function ShareAndExport({ input, result, country }: ShareAndExportProps) {
  const [copied, setCopied] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

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

  const handleDownloadPdf = () => {
    if (!result || !country) return;
    setGeneratingPdf(true);
    try {
      generateMortgagePdfReport({
        input,
        result,
        country,
        appName: APP_NAME,
      });
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setGeneratingPdf(false);
    }
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

      {result && country && (
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={generatingPdf}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm hover:opacity-80 disabled:opacity-50"
          style={btnStyle}
        >
          <Download className="w-3.5 h-3.5 text-emerald-500" />
          {generatingPdf ? 'Generating PDF…' : 'Download PDF'}
        </button>
      )}
    </div>
  );
}
