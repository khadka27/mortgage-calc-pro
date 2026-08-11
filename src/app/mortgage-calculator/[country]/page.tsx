import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AmortizationTable from '@/components/AmortizationTable';
import ChartsSection from '@/components/ChartsSection';
import DisclaimerSection from '@/components/DisclaimerSection';
import FAQSection from '@/components/FAQSection';
import ResultsSummary from '@/components/ResultsSummary';
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
    title: `${config.countryName} Mortgage Calculator (${config.currencyCode}) | MortgagePro`,
    description: `Calculate monthly mortgage payments, property taxes, interest rates, and CMHC/PMI insurance for home loans in ${config.countryName}. Generate complete amortization schedules.`,
    alternates: {
      canonical: `https://mortgagepro.global/mortgage-calculator/${config.countryCode.toLowerCase()}`,
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <span>Country Specific Mortgage Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {config.countryName} Mortgage Calculator ({config.currencyCode})
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl">
          Engineered for home buyers in {config.countryName}. Calculates precise monthly/periodic payments, principal & interest breakdown, property taxes, and regional insurance requirements using official baseline rates.
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
    </div>
  );
}
