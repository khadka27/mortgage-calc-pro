'use client';

import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import CustomSelect from '@/components/CustomSelect';
import { CalculationInput, CountryConfig, PaymentFrequency } from '@/lib/mortgage/types';

interface MortgageFormProps {
  country: CountryConfig;
  input: CalculationInput;
  onChangeInput: (newInput: CalculationInput) => void;
  onReset: () => void;
}

// Shared input class built from CSS tokens
const inputCls =
  'w-full rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all';

const labelCls = 'block text-xs font-semibold uppercase tracking-wider mb-1.5';

export default function MortgageForm({
  country,
  input,
  onChangeInput,
  onReset,
}: MortgageFormProps) {
  const [downPaymentMode, setDownPaymentMode] = useState<'amount' | 'percentage'>('amount');

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
    onChangeInput({ ...input, downPayment: validAmount });
  };

  const handleDownPaymentPctChange = (pct: number) => {
    const validPct = Math.max(0, Math.min(pct, 99.99));
    onChangeInput({ ...input, downPayment: (input.propertyPrice * validPct) / 100 });
  };

  const loanAmount = Math.max(0, input.propertyPrice - input.downPayment);
  const currentDownPct = input.propertyPrice > 0 ? (input.downPayment / input.propertyPrice) * 100 : 0;

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
  };
  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  };
  const inputFocusBorder = 'border focus:border-emerald-500 dark:focus:border-emerald-400';

  return (
    <div
      className="border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
      style={cardStyle}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          Mortgage Parameters
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--accent)',
              borderColor: 'var(--accent-border)',
            }}
          >
            {country.currencyCode} ({country.currencySymbol})
          </span>
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-emerald-500"
          style={{ color: 'var(--text-muted)' }}
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Price */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
            Property Price ({country.currencySymbol})
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              {country.currencySymbol}
            </span>
            <input
              type="number"
              min="0"
              step="1000"
              value={input.propertyPrice || ''}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className={`${inputCls} ${inputFocusBorder} pl-8 pr-4`}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Down Payment</label>
            <div
              className="flex items-center gap-0.5 p-0.5 rounded-lg border text-[11px]"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
              <button
                type="button"
                onClick={() => setDownPaymentMode('amount')}
                className={`px-2 py-0.5 rounded transition-all ${
                  downPaymentMode === 'amount'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'font-medium'
                }`}
                style={downPaymentMode !== 'amount' ? { color: 'var(--text-muted)' } : {}}
              >
                {country.currencySymbol} Amount
              </button>
              <button
                type="button"
                onClick={() => setDownPaymentMode('percentage')}
                className={`px-2 py-0.5 rounded transition-all ${
                  downPaymentMode === 'percentage'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'font-medium'
                }`}
                style={downPaymentMode !== 'percentage' ? { color: 'var(--text-muted)' } : {}}
              >
                % Percent
              </button>
            </div>
          </div>

          <div className="relative">
            {downPaymentMode === 'amount' ? (
              <>
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {country.currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  max={input.propertyPrice}
                  step="500"
                  value={input.downPayment || ''}
                  onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                  className={`${inputCls} ${inputFocusBorder} pl-8 pr-16`}
                  style={inputStyle}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}
                >
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
                  className={`${inputCls} ${inputFocusBorder} pl-4 pr-10`}
                  style={inputStyle}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}
                >
                  %
                </span>
              </>
            )}
          </div>
        </div>

        {/* Loan Amount (computed, read-only) */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Calculated Loan Amount</label>
          <div
            className="rounded-xl px-4 py-2.5 text-sm font-bold flex items-center justify-between border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--accent)' }}
          >
            <span>
              {country.currencySymbol}
              {loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>
              Price − Down
            </span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Annual Interest Rate (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="30"
              step="0.05"
              value={input.interestRate || ''}
              onChange={(e) => onChangeInput({ ...input, interestRate: Number(e.target.value) })}
              className={`${inputCls} ${inputFocusBorder} pl-4 pr-8`}
              style={inputStyle}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              %
            </span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Loan Term (Years)</label>
          <CustomSelect
            id="select-loan-term"
            value={String(input.loanTermYears)}
            onChange={(v) => onChangeInput({ ...input, loanTermYears: Number(v) })}
            options={country.availableLoanTerms.map((term) => ({ value: String(term), label: `${term} Years` }))}
          />
        </div>

        {/* Payment Frequency */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Payment Frequency</label>
          <CustomSelect
            id="select-payment-frequency"
            value={input.paymentFrequency}
            onChange={(v) => onChangeInput({ ...input, paymentFrequency: v as PaymentFrequency })}
            options={country.paymentFrequencyOptions.map((freq) => ({
              value: freq,
              label: freq.charAt(0).toUpperCase() + freq.slice(1),
            }))}
          />
        </div>

        {/* Mortgage Type */}
        <div className="md:col-span-2">
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
            Mortgage Product Type ({country.countryName})
          </label>
          <CustomSelect
            id="select-mortgage-type"
            value={input.mortgageTypeId || country.mortgageTypes[0]?.id || ''}
            onChange={(v) => onChangeInput({ ...input, mortgageTypeId: v })}
            options={country.mortgageTypes.map((type) => ({
              value: type.id,
              label: type.name,
              description: type.description,
            }))}
          />
        </div>
      </div>

      {/* Additional Housing Expenses */}
      <div className="border-t pt-4 space-y-4" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Taxes, Insurance & Additional Fees
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Property Tax */}
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Annual Property Tax ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={input.propertyTaxAnnual !== undefined ? input.propertyTaxAnnual : ''}
              placeholder={`Est. ${((input.propertyPrice * country.defaultPropertyTaxRatePct) / 100).toFixed(0)}`}
              onChange={(e) => onChangeInput({ ...input, propertyTaxAnnual: Number(e.target.value) })}
              className="w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              style={inputStyle}
            />
          </div>

          {/* Home Insurance */}
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Annual Home Insurance ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={input.homeInsuranceAnnual !== undefined ? input.homeInsuranceAnnual : ''}
              placeholder={`Est. ${((input.propertyPrice * country.defaultHomeInsuranceRatePct) / 100).toFixed(0)}`}
              onChange={(e) => onChangeInput({ ...input, homeInsuranceAnnual: Number(e.target.value) })}
              className="w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              style={inputStyle}
            />
          </div>

          {/* PMI */}
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Monthly PMI / Insurance ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={input.mortgageInsuranceMonthly !== undefined ? input.mortgageInsuranceMonthly : ''}
              placeholder={country.mortgageInsuranceAvailable ? 'Auto calculated' : 'N/A'}
              onChange={(e) => onChangeInput({ ...input, mortgageInsuranceMonthly: Number(e.target.value) })}
              className="w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              style={inputStyle}
            />
          </div>

          {/* HOA */}
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              Monthly HOA / Fees ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={input.hoaMonthly || ''}
              onChange={(e) => onChangeInput({ ...input, hoaMonthly: Number(e.target.value) })}
              className="w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
