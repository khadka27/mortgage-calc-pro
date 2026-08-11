'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

import AffordabilityCalculator from '@/components/AffordabilityCalculator';
import AmortizationTable from '@/components/AmortizationTable';
import ChartsSection from '@/components/ChartsSection';
import CountrySelector from '@/components/CountrySelector';
import DisclaimerSection from '@/components/DisclaimerSection';
import ExtraPaymentsForm from '@/components/ExtraPaymentsForm';
import FAQSection from '@/components/FAQSection';
import Header from '@/components/Header';
import MortgageForm from '@/components/MortgageForm';
import RateSourceNotice from '@/components/RateSourceNotice';
import RefinanceCalculator from '@/components/RefinanceCalculator';
import ResultsSummary from '@/components/ResultsSummary';
import ShareAndExport from '@/components/ShareAndExport';
import { calculateMortgage } from '@/lib/mortgage/calculator';
import { getCountryConfig } from '@/lib/mortgage/countryRules';
import { CalculationInput, CountryConfig, ExtraPaymentInput } from '@/lib/mortgage/types';

function MortgageAppContent() {
  const searchParams = useSearchParams();

  // Initial Country detection from URL query or default US
  const initialCountryCode = searchParams.get('country') || 'US';
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(
    getCountryConfig(initialCountryCode)
  );

  const [activeTab, setActiveTab] = useState<'calculator' | 'affordability' | 'refinance'>(
    'calculator'
  );

  // Form input state
  const [input, setInput] = useState<CalculationInput>(() => {
    const country = getCountryConfig(initialCountryCode);
    const defaultPrice = country.countryCode === 'JP' ? 45000000 : country.countryCode === 'NP' || country.countryCode === 'IN' ? 10000000 : 400000;
    const defaultDown = defaultPrice * (country.minimumDownPaymentPct / 100 || 0.2);

    return {
      countryCode: country.countryCode,
      propertyPrice: Number(searchParams.get('price')) || defaultPrice,
      downPayment: Number(searchParams.get('down')) || defaultDown,
      interestRate: Number(searchParams.get('rate')) || country.defaultInterestRate,
      loanTermYears: Number(searchParams.get('term')) || country.defaultLoanTerm,
      paymentFrequency: (searchParams.get('freq') as any) || country.paymentFrequencyOptions[0] || 'monthly',
      mortgageTypeId: country.mortgageTypes[0]?.id,
      extraPayments: [],
    };
  });

  // Switch country handler
  const handleCountryChange = (newCountry: CountryConfig) => {
    setSelectedCountry(newCountry);
    const defaultPrice = newCountry.countryCode === 'JP' ? 45000000 : newCountry.countryCode === 'NP' || newCountry.countryCode === 'IN' ? 10000000 : 400000;
    const defaultDown = defaultPrice * (newCountry.minimumDownPaymentPct / 100 || 0.2);

    setInput({
      countryCode: newCountry.countryCode,
      propertyPrice: defaultPrice,
      downPayment: defaultDown,
      interestRate: newCountry.defaultInterestRate,
      loanTermYears: newCountry.defaultLoanTerm,
      paymentFrequency: newCountry.paymentFrequencyOptions[0] || 'monthly',
      mortgageTypeId: newCountry.mortgageTypes[0]?.id,
      extraPayments: [],
    });
  };

  const handleReset = () => {
    handleCountryChange(selectedCountry);
  };

  // Perform calculation locally using testable decimal arithmetic calculation engine
  const calculationResult = useMemo(() => {
    try {
      return calculateMortgage(input);
    } catch {
      // Safe fallback if temporary input editing creates intermediate state
      return calculateMortgage({
        ...input,
        propertyPrice: Math.max(1, input.propertyPrice),
        downPayment: Math.min(input.downPayment, input.propertyPrice - 1),
      });
    }
  }, [input]);

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
      suppressHydrationWarning
    >
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        countryName={selectedCountry.countryName}
        currencySymbol={selectedCountry.currencySymbol}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Country Selector & Share Bar */}
        <div
          className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4 p-4 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex-1 max-w-md">
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountryChange}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <ShareAndExport input={input} />
          </div>
        </div>

        {/* Rate Transparency Banner */}
        <RateSourceNotice country={selectedCountry} interestRate={input.interestRate} />

        {/* Tabbed Modes */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            {/* Input Form & Results Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6">
                <MortgageForm
                  country={selectedCountry}
                  input={input}
                  onChangeInput={setInput}
                  onReset={handleReset}
                />
              </div>

              <div className="lg:col-span-6">
                <ResultsSummary result={calculationResult} />
              </div>
            </div>

            {/* Interactive Charts Section (5 Recharts views) */}
            <ChartsSection result={calculationResult} />

            {/* Accelerated Amortization Extra Payment Simulator */}
            <ExtraPaymentsForm
              extraPayments={input.extraPayments || []}
              onChangeExtraPayments={(payments: ExtraPaymentInput[]) =>
                setInput({ ...input, extraPayments: payments })
              }
              currencyCode={selectedCountry.currencyCode}
              currencySymbol={selectedCountry.currencySymbol}
              monthsSaved={calculationResult.monthsSaved}
              interestSaved={calculationResult.interestSaved}
            />

            {/* Amortization Table */}
            <AmortizationTable
              summary={calculationResult.amortizationSchedule}
              currencyCode={selectedCountry.currencyCode}
              currencySymbol={selectedCountry.currencySymbol}
            />
          </div>
        )}

        {activeTab === 'affordability' && (
          <AffordabilityCalculator country={selectedCountry} />
        )}

        {activeTab === 'refinance' && (
          <RefinanceCalculator country={selectedCountry} />
        )}

        {/* Country Specific FAQs & Legal Disclaimer */}
        <FAQSection country={selectedCountry} />
        <DisclaimerSection country={selectedCountry} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading Mortgage Calculator Pro...</div>}>
      <MortgageAppContent />
    </Suspense>
  );
}
