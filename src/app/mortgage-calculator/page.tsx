import { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { APP_NAME } from '@/lib/env';
import { SUPPORTED_COUNTRIES } from '@/lib/mortgage/countries';

export const metadata: Metadata = {
  title: `Global Mortgage Calculators by Country | ${APP_NAME}`,
  description:
    'Select your country to calculate precise mortgage payments, interest rates, property taxes, CMHC/PMI insurance, and amortization schedules.',
};

export default function GlobalCalculatorsHub() {
  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };

  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Header activeTab="calculator" countryName="Global Hub" currencySymbol="🌐" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
            🌐 20+ Regional Rule Engines
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Global Mortgage Calculators
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Country-specific home loan calculators engineered with local currency formatting, exact compounding conventions (e.g. Semi-Annual for Canada), tax modes, and mortgage insurance rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SUPPORTED_COUNTRIES.map((c) => (
            <Link
              key={c.countryCode}
              href={`/mortgage-calculator/${c.countryCode.toLowerCase()}`}
              className="border p-5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 group flex flex-col justify-between"
              style={cardStyle}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
                  >
                    {c.countryCode}
                  </div>
                  <div>
                    <h2 className="font-bold text-base transition-colors group-hover:text-emerald-500" style={{ color: 'var(--text-primary)' }}>
                      {c.countryName}
                    </h2>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {c.currencyCode} ({c.currencySymbol}) • Default {c.defaultInterestRate}%
                    </div>
                  </div>
                </div>

                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {c.disclaimer ? c.disclaimer.slice(0, 75) + '...' : `Calculates periodic ${c.currencyCode} housing payments with tax & insurance.`}
                </p>
              </div>

              <div className="mt-4 text-xs font-semibold border-t pt-3 flex items-center justify-between" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                <span>{c.mortgageTypes.length} Products</span>
                <span className="text-emerald-500 font-bold group-hover:translate-x-1 transition-transform">
                  Calculate &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
