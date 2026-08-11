import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AmortizationTable from '@/components/AmortizationTable';
import ChartsSection from '@/components/ChartsSection';
import DisclaimerSection from '@/components/DisclaimerSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ResultsSummary from '@/components/ResultsSummary';
import { APP_NAME, APP_URL } from '@/lib/env';
import { calculateMortgage } from '@/lib/mortgage/calculator';
import { SUPPORTED_COUNTRIES } from '@/lib/mortgage/countries';
import { getCountryConfig } from '@/lib/mortgage/countryRules';

export async function generateStaticParams() {
  return SUPPORTED_COUNTRIES.map((c) => ({
    country: c.countryCode.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: countryCode } = await params;
  const config = getCountryConfig(countryCode);

  return {
    title: `${config.countryName} Mortgage Calculator (${config.currencyCode}) | ${APP_NAME}`,
    description: `Calculate monthly mortgage payments, property taxes, interest rates, and CMHC/PMI insurance for home loans in ${config.countryName}. Generate complete amortization schedules.`,
    alternates: {
      canonical: `${APP_URL}/mortgage-calculator/${config.countryCode.toLowerCase()}`,
    },
  };
}

export default async function CountryMortgagePage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countryCode } = await params;
  const config = getCountryConfig(countryCode);

  const defaultPrice = config.countryCode === 'JP' ? 45000000 : config.countryCode === 'NP' || config.countryCode === 'IN' ? 10000000 : 400000;
  const defaultDown = defaultPrice * (config.minimumDownPaymentPct / 100 || 0.2);

  const initialResult = calculateMortgage({
    countryCode: config.countryCode,
    propertyPrice: defaultPrice,
    downPayment: defaultDown,
    interestRate: config.defaultInterestRate,
    loanTermYears: config.defaultLoanTerm,
    paymentFrequency: config.paymentFrequencyOptions[0] || 'monthly',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${config.countryName} Mortgage Calculator`,
    description: `Calculate home loan payments, interest, taxes, and amortization in ${config.countryName}`,
    currency: config.currencyCode,
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ backgroundColor: 'var(--bg-page)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header activeTab="calculator" countryName={config.countryName} currencySymbol={config.currencySymbol} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
            <span>Country Specific Mortgage Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {config.countryName} Mortgage Calculator ({config.currencyCode})
          </h1>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Engineered for home buyers in {config.countryName}. Calculates precise monthly/periodic payments, principal &amp; interest breakdown, property taxes, and regional insurance requirements using official baseline rates.
          </p>
        </div>

        {/* Summary Banner */}
        <ResultsSummary result={initialResult} />

        {/* Visual Charts */}
        <ChartsSection result={initialResult} />

        {/* Amortization Schedule */}
        <AmortizationTable
          summary={initialResult.amortizationSchedule}
          currencyCode={config.currencyCode}
          currencySymbol={config.currencySymbol}
        />

        {/* FAQs & Legal Disclaimer */}
        <FAQSection country={config} />
        <DisclaimerSection country={config} />
      </main>

      <Footer />
    </div>
  );
}
