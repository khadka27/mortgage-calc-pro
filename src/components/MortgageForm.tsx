'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

import CustomSelect from '@/components/CustomSelect';
import { CalculationInput, CountryConfig, PaymentFrequency } from '@/lib/mortgage/types';
import { CalculationInputSchema, getFieldErrors } from '@/lib/mortgage/validation';

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

  // Compute field validation errors using Zod schema safely
  const fieldErrors = useMemo(() => getFieldErrors(CalculationInputSchema, input), [input]);

  const handlePriceChange = (price: number) => {
    let newDown = input.downPayment;
    if (downPaymentMode === 'percentage') {
      const pct = (input.downPayment / (input.propertyPrice || 1)) * 100;
      newDown = (price * pct) / 100;
    }
    onChangeInput({
      ...input,
      propertyPrice: price,
      downPayment: newDown,
    });
  };

  const handleDownPaymentAmountChange = (amount: number) => {
    onChangeInput({ ...input, downPayment: amount });
  };

  const handleDownPaymentPctChange = (pct: number) => {
    const newAmount = ((input.propertyPrice || 0) * pct) / 100;
    onChangeInput({ ...input, downPayment: newAmount });
  };

  const currentDownPct =
    input.propertyPrice > 0
      ? (input.downPayment / input.propertyPrice) * 100
      : 0;

  const loanAmount = Math.max(0, input.propertyPrice - input.downPayment);

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="border rounded-2xl p-5 sm:p-7 shadow-sm space-y-6" style={cardStyle}>
      {/* Header & Reset */}
      <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Mortgage Parameters
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Adjust loan variables to calculate periodic payments ({country.currencySymbol})
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          title="Reset form to country defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Home / Property Price */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Property Price</label>
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
              step="5000"
              value={input.propertyPrice || ''}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className={`${inputCls} ${fieldErrors.propertyPrice ? 'border-red-500 ring-2 ring-red-500/30' : ''} pl-8 pr-4`}
              style={inputStyle}
            />
          </div>
          {fieldErrors.propertyPrice && (
            <div className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.propertyPrice}</span>
            </div>
          )}
        </div>

        {/* Down Payment (Toggle Amount vs Percentage) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls} style={{ color: 'var(--text-muted)', marginBottom: 0 }}>Down Payment</label>
            <div className="flex items-center gap-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setDownPaymentMode('amount')}
                className={`px-2 py-0.5 rounded transition-all ${
                  downPaymentMode === 'amount'
                    ? 'bg-emerald-500 text-white font-bold shadow-xs'
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
                    ? 'bg-emerald-500 text-white font-bold shadow-xs'
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
                  step="500"
                  value={input.downPayment !== undefined ? input.downPayment : ''}
                  onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                  className={`${inputCls} ${fieldErrors.downPayment ? 'border-red-500 ring-2 ring-red-500/30' : ''} pl-8 pr-16`}
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
                  step="0.5"
                  value={currentDownPct ? Number(currentDownPct.toFixed(2)) : ''}
                  onChange={(e) => handleDownPaymentPctChange(Number(e.target.value))}
                  className={`${inputCls} ${fieldErrors.downPayment ? 'border-red-500 ring-2 ring-red-500/30' : ''} pl-4 pr-10`}
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
          {fieldErrors.downPayment && (
            <div className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.downPayment}</span>
            </div>
          )}
        </div>

        {/* Loan Amount (computed, read-only) */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Calculated Loan Amount</label>
          <div
            className="rounded-xl px-4 py-2.5 text-sm font-bold flex items-center justify-between border min-w-0"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--accent)' }}
          >
            <span className="truncate">
              {country.currencySymbol}
              {loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-normal shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
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
              max="100"
              step="0.05"
              value={input.interestRate !== undefined ? input.interestRate : ''}
              onChange={(e) => onChangeInput({ ...input, interestRate: Number(e.target.value) })}
              className={`${inputCls} ${fieldErrors.interestRate ? 'border-red-500 ring-2 ring-red-500/30' : ''} pl-4 pr-8`}
              style={inputStyle}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              %
            </span>
          </div>
          {fieldErrors.interestRate && (
            <div className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.interestRate}</span>
            </div>
          )}
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
          {fieldErrors.loanTermYears && (
            <div className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{fieldErrors.loanTermYears}</span>
            </div>
          )}
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

        {/* Start Date: Month & Year */}
        <div>
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Loan Start Date</label>
          <div className="grid grid-cols-2 gap-2">
            <CustomSelect
              id="select-start-month"
              value={String(input.startDateMonth || (new Date().getMonth() + 1))}
              onChange={(v) => {
                const m = Number(v);
                const y = input.startDateYear || new Date().getFullYear();
                const isoDate = `${y}-${String(m).padStart(2, '0')}`;
                onChangeInput({ ...input, startDateMonth: m, startDate: isoDate });
              }}
              options={[
                { value: '1', label: 'Jan' }, { value: '2', label: 'Feb' },
                { value: '3', label: 'Mar' }, { value: '4', label: 'Apr' },
                { value: '5', label: 'May' }, { value: '6', label: 'Jun' },
                { value: '7', label: 'Jul' }, { value: '8', label: 'Aug' },
                { value: '9', label: 'Sep' }, { value: '10', label: 'Oct' },
                { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
              ]}
            />
            <CustomSelect
              id="select-start-year"
              value={String(input.startDateYear || new Date().getFullYear())}
              onChange={(v) => {
                const y = Number(v);
                const m = input.startDateMonth || (new Date().getMonth() + 1);
                const isoDate = `${y}-${String(m).padStart(2, '0')}`;
                onChangeInput({ ...input, startDateYear: y, startDate: isoDate });
              }}
              options={Array.from({ length: 31 }, (_, i) => {
                const yr = new Date().getFullYear() + i;
                return { value: String(yr), label: String(yr) };
              })}
            />
          </div>
        </div>

        {/* Mortgage Type */}
        <div className="sm:col-span-2">
          <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
            Mortgage Structure / Product
          </label>
          <CustomSelect
            id="select-mortgage-type"
            value={input.mortgageTypeId || country.mortgageTypes[0]?.id || ''}
            onChange={(v) => onChangeInput({ ...input, mortgageTypeId: v })}
            options={country.mortgageTypes.map((p) => ({
              value: p.id,
              label: `${p.name} — ${p.description}`,
            }))}
          />
        </div>
      </div>

      {/* Taxes, Insurance & Extra Housing Costs Accordion */}
      <div className="pt-4 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">
          Taxes, Insurance &amp; HOA Costs
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Property Tax */}
          <div>
            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
              Annual Property Tax ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={input.propertyTaxAnnual !== undefined ? input.propertyTaxAnnual : ''}
              onChange={(e) => onChangeInput({ ...input, propertyTaxAnnual: Number(e.target.value) })}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Home Insurance */}
          <div>
            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
              Annual Homeowners Insurance ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={input.homeInsuranceAnnual !== undefined ? input.homeInsuranceAnnual : ''}
              onChange={(e) => onChangeInput({ ...input, homeInsuranceAnnual: Number(e.target.value) })}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Monthly HOA */}
          <div>
            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
              Monthly HOA / Condo Fee ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="25"
              value={input.hoaMonthly !== undefined ? input.hoaMonthly : ''}
              onChange={(e) => onChangeInput({ ...input, hoaMonthly: Number(e.target.value) })}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {/* Monthly PMI / Mortgage Insurance Override */}
          <div>
            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
              Monthly PMI / Mortgage Insurance ({country.currencySymbol})
            </label>
            <input
              type="number"
              min="0"
              step="10"
              placeholder="Auto-calculated if LTV > 80%"
              value={input.mortgageInsuranceMonthly !== undefined ? input.mortgageInsuranceMonthly : ''}
              onChange={(e) => onChangeInput({ ...input, mortgageInsuranceMonthly: Number(e.target.value) })}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
