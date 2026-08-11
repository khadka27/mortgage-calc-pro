import Decimal from 'decimal.js';

import { getCountryConfig } from './countryRules';
import { roundFinancial, safeDiv, toDec } from './decimalUtils';
import { calculatePeriodicPayment, calculatePeriodicRate } from './interest';
import { AffordabilityInput, AffordabilityResult } from './types';

/**
 * Calculates max home purchase price, max loan amount, and max monthly payment based on borrower income, debt, down payment, and DTI limits.
 */
export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const country = getCountryConfig(input.countryCode);
  const annualIncome = toDec(input.annualIncome);
  const grossMonthlyIncome = annualIncome.div(12);
  const monthlyDebts = toDec(input.monthlyDebts);
  const downPayment = toDec(input.downPaymentAmount);

  const targetHousingDtiPct = toDec(input.targetHousingDtiPct || 28);
  const targetMaxDtiPct = toDec(input.targetMaxDtiPct || 36);

  // Maximum monthly housing payment allowed under Housing DTI (Front-End Ratio)
  const maxHousingPaymentByFrontEnd = grossMonthlyIncome.mul(targetHousingDtiPct).div(100);

  // Maximum total debt allowed under Total DTI (Back-End Ratio)
  const maxTotalDebt = grossMonthlyIncome.mul(targetMaxDtiPct).div(100);
  const maxHousingPaymentByBackEnd = Decimal.max(0, maxTotalDebt.sub(monthlyDebts));

  // The binding constraint is the smaller of front-end and back-end DTI limits
  const maxMonthlyHousingCost = Decimal.min(maxHousingPaymentByFrontEnd, maxHousingPaymentByBackEnd);

  // Estimate taxes/insurance deduction (e.g. ~15% reserved for taxes & insurance)
  const estimatedTaxInsuranceRatio = 0.15;
  const maxMonthlyPAndI = maxMonthlyHousingCost.mul(1 - estimatedTaxInsuranceRatio);

  // Reverse calculate loan amount from maximum P&I payment
  const ppy = 12; // Monthly payments for affordability
  const totalPayments = toDec(input.loanTermYears).mul(ppy);
  const periodicRate = calculatePeriodicRate(input.interestRate, 'monthly', country.interestRateFrequency);

  let maxLoanAmount = new Decimal(0);
  if (!periodicRate.isZero() && totalPayments.gt(0)) {
    const onePlusRPowN = periodicRate.add(1).pow(totalPayments);
    // P = M * [(1+r)^n - 1] / [r * (1+r)^n]
    const numerator = maxMonthlyPAndI.mul(onePlusRPowN.sub(1));
    const denominator = periodicRate.mul(onePlusRPowN);
    maxLoanAmount = safeDiv(numerator, denominator);
  } else if (totalPayments.gt(0)) {
    maxLoanAmount = maxMonthlyPAndI.mul(totalPayments);
  }

  const maxHomePrice = maxLoanAmount.add(downPayment);
  const decimals = country.currencyDecimalPlaces;

  const actualHousingDti = grossMonthlyIncome.gt(0)
    ? maxMonthlyHousingCost.div(grossMonthlyIncome).mul(100)
    : new Decimal(0);
  const actualTotalDti = grossMonthlyIncome.gt(0)
    ? maxMonthlyHousingCost.add(monthlyDebts).div(grossMonthlyIncome).mul(100)
    : new Decimal(0);

  return {
    maxHomePrice: roundFinancial(maxHomePrice, decimals),
    maxLoanAmount: roundFinancial(maxLoanAmount, decimals),
    maxMonthlyPayment: roundFinancial(maxMonthlyPAndI, decimals),
    maxMonthlyHousingCost: roundFinancial(maxMonthlyHousingCost, decimals),
    allowedMonthlyDebtForHousing: roundFinancial(maxHousingPaymentByBackEnd, decimals),
    downPaymentAmount: roundFinancial(downPayment, decimals),
    housingDtiPct: roundFinancial(actualHousingDti, 2),
    totalDtiPct: roundFinancial(actualTotalDti, 2),
  };
}
