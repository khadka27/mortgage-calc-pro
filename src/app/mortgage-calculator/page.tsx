import { Metadata } from 'next';
import Link from 'next/link';

import { APP_NAME } from '@/lib/env';
import { SUPPORTED_COUNTRIES } from '@/lib/mortgage/countries';

export const metadata: Metadata = {
  title: `Global Mortgage Calculators by Country | ${APP_NAME}`,
  description:
    'Select your country to calculate precise mortgage payments, interest rates, property taxes, CMHC/PMI insurance, and amortization schedules.',
};

export default function GlobalCalculatorsHub() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Global Mortgage Calculators
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          Country-specific home loan calculators engineered with local currency formatting, exact compounding conventions, tax modes, and mortgage insurance rules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SUPPORTED_COUNTRIES.map((c) => (
          <Link
            key={c.countryCode}
            href={`/mortgage-calculator/${c.countryCode.toLowerCase()}`}
            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-400 text-sm group-hover:scale-105 transition-transform">
                {c.countryCode}
              </div>
              <div>
                <h2 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  {c.countryName}
                </h2>
                <div className="text-xs text-zinc-400">
                  {c.currencyCode} ({c.currencySymbol}) • Default {c.defaultInterestRate}%
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-zinc-500 border-t border-zinc-800/80 pt-3 flex items-center justify-between">
              <span>{c.mortgageTypes.length} Mortgage Products</span>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                Calculate &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
