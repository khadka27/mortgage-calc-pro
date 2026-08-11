'use client';

import { Calendar, DollarSign, Info, Percent } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CalculationInput, CountryConfig, PaymentFrequency } from '@/lib/mortgage/types';

interface MortgageFormProps {
  country: CountryConfig;
  input: CalculationInput;
  onChangeInput: (newInput: CalculationInput) => void;
  onReset: () => void;
}

export default function MortgageForm({
  country,
  input,
  onChangeInput,
  onReset,
}: MortgageFormProps) {
  const [downPaymentMode, setDownPaymentMode] = useState<'amount' | 'percentage'>('amount');

  // Down Payment sync logic: changing price or down payment updates amount or percentage
  const handlePriceChange = (price: number) => {
    const validPrice = Math.max(0, price);
    let newDown = input.downPayment;
    if (downPaymentMode === 'percentage') {
      const pct = (input.downPayment / (input.propertyPrice || 1)) * 100;
      newDown = (validPrice * pct) / 100;
    }
    onChangeInput({
      ...input,
      propertyPrice: validPrice,
      downPayment: Math.min(newDown, validPrice),
    });
  };

  const handleDownPaymentAmountChange = (amount: number) => {
    const validAmount = Math.max(0, Math.min(amount, input.propertyPrice));
    onChangeInput({
      ...input,
      downPayment: validAmount,
    });
  };

  const handleDownPaymentPctChange = (pct: number) => {
    const validPct = Math.max(0, Math.min(pct, 99.99));
    const calculatedAmount = (input.propertyPrice * validPct) / 100;
    onChangeInput({
      ...input,
      downPayment: calculatedAmount,
    });
  };

  const loanAmount = Math.max(0, input.propertyPrice - input.downPayment);
  const currentDownPct = input.propertyPrice > 0 ? (input.downPayment / input.propertyPrice) * 100 : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Mortgage Parameters</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {country.currencyCode} ({country.currencySymbol})
          </span>
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 transition-colors"
        >
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Price */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Property Price ({country.currencySymbol})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
              {country.currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              step="1000"
              value={input.propertyPrice || ''}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Down Payment Mode Switcher & Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Down Payment
            </label>
            <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
              <button
                type="button"
                onClick={() => setDownPaymentMode('amount')}
                className={`px-2 py-0.5 rounded ${
                  downPaymentMode === 'amount' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400'
                }`}
              >
                {country.currencySymbol} Amount
              </button>
              <button
                type="button"
                onClick={() => setDownPaymentMode('percentage')}
                className={`px-2 py-0.5 rounded ${
                  downPaymentMode === 'percentage' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400'
                }`}
              >
                % Percent
              </button>
            </div>
          </div>

          <div className="relative">
            {downPaymentMode === 'amount' ? (
              <>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                  {country.currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  max={input.propertyPrice}
                  step="500"
                  value={input.downPayment || ''}
                  onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-8 pr-16 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {currentDownPct.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <input
                  type="number"
                  min="0"
                  max="99.9"
                  step="0.5"
                  value={currentDownPct ? Number(currentDownPct.toFixed(2)) : ''}
                  onChange={(e) => handleDownPaymentPctChange(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                  %
                </span>
              </>
            )}
          </div>
        </div>

        {/* Loan Amount (Read-only computed) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Calculated Loan Amount
          </label>
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-emerald-400 font-bold text-sm flex items-center justify-between">
            <span>
              {country.currencySymbol}
              {loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-zinc-500 font-normal">Property - Down Payment</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Annual Interest Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="30"
              step="0.05"
              value={input.interestRate || ''}
              onChange={(e) => onChangeInput({ ...input, interestRate: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-4 pr-8 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
              %
            </span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Loan Term (Years)
          </label>
          <select
            value={input.loanTermYears}
            onChange={(e) => onChangeInput({ ...input, loanTermYears: Number(e.target.value) })}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
          >
            {country.availableLoanTerms.map((term) => (
              <option key={term} value={term}>
                {term} Years
              </option>
            ))}
          </select>
        </div>

        {/* Payment Frequency */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Payment Frequency
          </label>
          <select
            value={input.paymentFrequency}
            onChange={(e) =>
              onChangeInput({ ...input, paymentFrequency: e.target.value as PaymentFrequency })
            }
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 capitalize"
          >
            {country.paymentFrequencyOptions.map((freq) => (
              <option key={freq} value={freq} className="capitalize">
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Mortgage Type (Country Specific) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Mortgage Product Type ({country.countryName})
          </label>
          <select
            value={input.mortgageTypeId || country.mortgageTypes[0]?.id}
            onChange={(e) => onChangeInput({ ...input, mortgageTypeId: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
          >
            {country.mortgageTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.description})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Housing Expenses (Taxes, Insurance, HOA) */}
      <div className="border-t border-zinc-800 pt-4 space-y-4">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Taxes, Insurance & Additional Fees
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Property Tax */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Annual Property Tax ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={input.propertyTaxAnnual !== undefined ? input.propertyTaxAnnual : ''}
              placeholder={`Est. ${((input.propertyPrice * country.defaultPropertyTaxRatePct) / 100).toFixed(0)}`}
              onChange={(e) => onChangeInput({ ...input, propertyTaxAnnual: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Home Insurance */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Annual Home Insurance ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={input.homeInsuranceAnnual !== undefined ? input.homeInsuranceAnnual : ''}
              placeholder={`Est. ${((input.propertyPrice * country.defaultHomeInsuranceRatePct) / 100).toFixed(0)}`}
              onChange={(e) => onChangeInput({ ...input, homeInsuranceAnnual: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Mortgage Insurance / PMI */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Monthly PMI / Insurance ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={input.mortgageInsuranceMonthly !== undefined ? input.mortgageInsuranceMonthly : ''}
              placeholder={country.mortgageInsuranceAvailable ? 'Auto calculated' : 'N/A'}
              onChange={(e) => onChangeInput({ ...input, mortgageInsuranceMonthly: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* HOA / Maintenance */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              Monthly HOA / Fees ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={input.hoaMonthly || ''}
              onChange={(e) => onChangeInput({ ...input, hoaMonthly: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
