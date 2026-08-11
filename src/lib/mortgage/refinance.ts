import Decimal from 'decimal.js';

import { getCountryConfig } from './countryRules';
import { roundFinancial, safeDiv, toDec } from './decimalUtils';
import { calculatePeriodicPayment } from './interest';
import { RefinanceInput, RefinanceResult } from './types';

/**
 * Calculates refinance metrics: monthly savings, interest comparison, break-even period, and net lifetime savings.
 */
export function calculateRefinance(input: RefinanceInput): RefinanceResult {
  const country = getCountryConfig(input.countryCode);
  const decimals = country.currencyDecimalPlaces;

  const currentBalance = toDec(input.currentLoanBalance);
  const currentPayment = toDec(input.currentMonthlyPayment);
  const remainingMonths = toDec(input.remainingTermMonths);
  const closingCosts = toDec(input.closingCosts);

  // New loan payment calculation
  const newMonthlyPayment = calculatePeriodicPayment(
    currentBalance,
    input.newInterestRate,
    input.newLoanTermYears,
    'monthly',
    country.interestRateFrequency
  );

  const monthlySavings = currentPayment.sub(newMonthlyPayment);

  // Remaining interest on old loan = (Current Monthly Payment * Remaining Months) - Current Balance
  const totalRemainingPaymentOldLoan = currentPayment.mul(remainingMonths);
  const totalRemainingInterestOldLoan = Decimal.max(0, totalRemainingPaymentOldLoan.sub(currentBalance));

  // Total interest on new loan = (New Monthly Payment * New Term Months) - Current Balance
  const newTermMonths = toDec(input.newLoanTermYears).mul(12);
  const totalPaymentNewLoan = newMonthlyPayment.mul(newTermMonths);
  const totalInterestNewLoan = Decimal.max(0, totalPaymentNewLoan.sub(currentBalance));

  // Gross lifetime interest savings
  const lifetimeInterestSavings = totalRemainingInterestOldLoan.sub(totalInterestNewLoan);
  const netLifetimeSavings = lifetimeInterestSavings.sub(closingCosts);

  // Break-even period in months = Closing Costs / Monthly Savings
  let breakEvenMonths: number | null = null;
  if (monthlySavings.gt(0)) {
    const rawBreakEven = safeDiv(closingCosts, monthlySavings);
    breakEvenMonths = Math.ceil(rawBreakEven.toNumber());
  }

  const isBeneficial = monthlySavings.gt(0) && (breakEvenMonths === null || breakEvenMonths <= remainingMonths.toNumber());

  return {
    newMonthlyPayment: roundFinancial(newMonthlyPayment, decimals),
    monthlySavings: roundFinancial(monthlySavings, decimals),
    totalRemainingInterestOldLoan: roundFinancial(totalRemainingInterestOldLoan, decimals),
    totalInterestNewLoan: roundFinancial(totalInterestNewLoan, decimals),
    lifetimeInterestSavings: roundFinancial(lifetimeInterestSavings, decimals),
    netLifetimeSavings: roundFinancial(netLifetimeSavings, decimals),
    breakEvenMonths,
    isRefinanceBeneficial: isBeneficial,
  };
}
