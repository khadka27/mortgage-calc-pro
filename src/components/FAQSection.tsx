'use client';

import { HelpCircle } from 'lucide-react';

import { CountryConfig } from '@/lib/mortgage/types';

interface FAQSectionProps {
  country: CountryConfig;
}

export default function FAQSection({ country }: FAQSectionProps) {
  const faqs = [
    {
      q: `How are mortgage payments calculated in ${country.countryName}?`,
      a: `In ${country.countryName}, mortgage payments are calculated using standard periodic amortization formulas. For nominal annual interest rates, the periodic rate is divided across the chosen payment frequency (${country.paymentFrequencyOptions.join(', ')}). ${country.interestRateFrequency === 'semi-annual' ? 'Canadian fixed mortgages compound semi-annually by law.' : ''}`,
    },
    {
      q: `What is the minimum down payment required in ${country.countryName}?`,
      a: `The minimum required down payment in ${country.countryName} is typically ${country.minimumDownPaymentPct}%. Down payments below ${country.mortgageInsuranceRules?.ltvThreshold || 80}% LTV may require mortgage insurance (e.g. PMI, CMHC, or LMI).`,
    },
    {
      q: `What mortgage products are available in ${country.countryName}?`,
      a: `${country.countryName} supports several mortgage product types including ${country.mortgageTypes.map((t) => t.name).join(', ')}.`,
    },
    {
      q: `Can I make extra payments to pay off my loan faster?`,
      a: `Yes! Extra monthly or annual lump-sum payments go directly toward reducing your principal balance, significantly reducing your total interest paid and cutting months off your payoff date.`,
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
        <HelpCircle className="w-5 h-5 text-emerald-400" />
        Frequently Asked Questions ({country.countryName})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
            <div className="text-xs font-bold text-emerald-400">{faq.q}</div>
            <div className="text-xs text-zinc-300 leading-relaxed">{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
