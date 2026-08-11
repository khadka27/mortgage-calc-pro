import Decimal from 'decimal.js';

import { generateAmortizationSchedule } from './amortization';
import { getCountryConfig } from './countryRules';
import { roundFinancial, safeDiv, toDec } from './decimalUtils';
import { calculateHomeInsurance, calculateLTV, calculateMortgageInsurance } from './insurance';
import { calculatePeriodicPayment, getPaymentsPerYear } from './interest';
import { calculatePropertyTax } from './taxes';
import { CalculationInput, CalculationResult } from './types';
import { CalculationInputSchema } from './validation';

/**
 * Core master function: Calculates full mortgage breakdown, periodic payments, monthly equivalents, tax, insurance, PMI, LTV, DTI, and amortization schedule.
 */
export function calculateMortgage(input: CalculationInput): CalculationResult {
  // Validate input schema
  const validatedInput = CalculationInputSchema.parse(input);

  const country = getCountryConfig(validatedInput.countryCode);
  const decimals = country.currencyDecimalPlaces;

  const propertyPrice = toDec(validatedInput.propertyPrice);
  const downPayment = toDec(validatedInput.downPayment);
  const loanAmount = Decimal.max(0, propertyPrice.sub(downPayment));

  const downPaymentPct = propertyPrice.gt(0)
    ? safeDiv(downPayment, propertyPrice).mul(100)
    : new Decimal(0);

  const ltvRatio = calculateLTV(propertyPrice, loanAmount);

  const frequency = validatedInput.paymentFrequency || 'monthly';
  const ppy = getPaymentsPerYear(frequency);
  const loanTermYears = validatedInput.loanTermYears;
  const totalNumberOfPayments = loanTermYears * ppy;

  // 1. Periodic Principal & Interest Payment
  const periodicPAndI = calculatePeriodicPayment(
    loanAmount,
    validatedInput.interestRate,
    loanTermYears,
    frequency,
    country.interestRateFrequency
  );

  // 2. Property Tax
  const taxResult = calculatePropertyTax(
    propertyPrice,
    validatedInput.propertyTaxAnnual,
    validatedInput.propertyTaxPercentage || (country.propertyTaxAvailable ? country.defaultPropertyTaxRatePct : 0),
    frequency
  );

  // 3. Home Insurance
  const insuranceResult = calculateHomeInsurance(
    propertyPrice,
    validatedInput.homeInsuranceAnnual,
    validatedInput.homeInsurancePercentage || (country.homeInsuranceAvailable ? country.defaultHomeInsuranceRatePct : 0),
    frequency
  );

  // 4. Mortgage Insurance / PMI
  const pmiResult = calculateMortgageInsurance(
    propertyPrice,
    loanAmount,
    validatedInput.mortgageInsuranceMonthly,
    country.mortgageInsuranceRules,
    frequency
  );

  // 5. HOA & Other monthly costs
  const monthlyHoa = toDec(validatedInput.hoaMonthly || 0);
  const monthlyOther = toDec(validatedInput.otherMonthlyCosts || 0);

  // Convert monthly costs to periodic costs
  const periodicHoa = safeDiv(monthlyHoa.mul(12), ppy);
  const periodicOther = safeDiv(monthlyOther.mul(12), ppy);

  // Total Periodic Payment
  const totalPeriodicPayment = periodicPAndI
    .add(taxResult.periodicTax)
    .add(insuranceResult.periodicInsurance)
    .add(pmiResult.periodicPMI)
    .add(periodicHoa)
    .add(periodicOther);

  // Monthly Equivalent Payments (for uniform comparison across payment frequencies)
  const monthlyFactor = safeDiv(ppy, 12);
  const monthlyPAndI = periodicPAndI.mul(monthlyFactor);
  const monthlyPropertyTax = toDec(taxResult.periodicTax).mul(monthlyFactor);
  const monthlyHomeInsurance = toDec(insuranceResult.periodicInsurance).mul(monthlyFactor);
  const monthlyMortgageInsurance = toDec(pmiResult.periodicPMI).mul(monthlyFactor);
  const totalMonthlyHousingPayment = totalPeriodicPayment.mul(monthlyFactor);

  // 6. Generate Amortization Schedule & Extra Payment Analysis
  const amortizationSummary = generateAmortizationSchedule(
    loanAmount,
    validatedInput.interestRate,
    loanTermYears,
    frequency,
    country.interestRateFrequency,
    validatedInput.startDate || new Date().toISOString().slice(0, 7),
    validatedInput.extraPayments || [],
    decimals
  );

  const totalPrincipalPaid = loanAmount;
  const totalInterestPaid = toDec(amortizationSummary.totalInterest);
  const totalCostOfLoan = totalPrincipalPaid.add(totalInterestPaid);
  const interestToPrincipalRatio = safeDiv(totalInterestPaid, totalPrincipalPaid).mul(100);

  // DTI calculation (if income is supplied)
  let housingDti: number | undefined;
  let totalDti: number | undefined;

  if (validatedInput.grossAnnualIncome && validatedInput.grossAnnualIncome > 0) {
    const grossMonthlyIncome = toDec(validatedInput.grossAnnualIncome).div(12);
    const otherMonthlyDebts = toDec(validatedInput.otherMonthlyDebts || 0);

    if (grossMonthlyIncome.gt(0)) {
      housingDti = roundFinancial(safeDiv(totalMonthlyHousingPayment, grossMonthlyIncome).mul(100), 2);
      totalDti = roundFinancial(
        safeDiv(totalMonthlyHousingPayment.add(otherMonthlyDebts), grossMonthlyIncome).mul(100),
        2
      );
    }
  }

  return {
    countryCode: country.countryCode,
    currencyCode: country.currencyCode,
    currencySymbol: country.currencySymbol,
    propertyPrice: roundFinancial(propertyPrice, decimals),
    downPayment: roundFinancial(downPayment, decimals),
    downPaymentPct: roundFinancial(downPaymentPct, 2),
    loanAmount: roundFinancial(loanAmount, decimals),
    ltvRatio: roundFinancial(ltvRatio, 2),
    interestRate: validatedInput.interestRate,
    loanTermYears,
    paymentFrequency: frequency,
    paymentsPerYear: ppy,
    totalNumberOfPayments,

    // Periodic Breakdown
    periodicPrincipalAndInterest: roundFinancial(periodicPAndI, decimals),
    periodicPropertyTax: roundFinancial(taxResult.periodicTax, decimals),
    periodicHomeInsurance: roundFinancial(insuranceResult.periodicInsurance, decimals),
    periodicMortgageInsurance: roundFinancial(pmiResult.periodicPMI, decimals),
    periodicHoa: roundFinancial(periodicHoa, decimals),
    periodicOtherCosts: roundFinancial(periodicOther, decimals),
    totalPeriodicPayment: roundFinancial(totalPeriodicPayment, decimals),

    // Monthly Breakdown
    monthlyPrincipalAndInterest: roundFinancial(monthlyPAndI, decimals),
    monthlyPropertyTax: roundFinancial(monthlyPropertyTax, decimals),
    monthlyHomeInsurance: roundFinancial(monthlyHomeInsurance, decimals),
    monthlyMortgageInsurance: roundFinancial(monthlyMortgageInsurance, decimals),
    monthlyHoa: roundFinancial(monthlyHoa, decimals),
    monthlyOtherCosts: roundFinancial(monthlyOther, decimals),
    totalMonthlyHousingPayment: roundFinancial(totalMonthlyHousingPayment, decimals),

    // Totals
    totalPrincipalPaid: roundFinancial(totalPrincipalPaid, decimals),
    totalInterestPaid: roundFinancial(totalInterestPaid, decimals),
    totalCostOfLoan: roundFinancial(totalCostOfLoan, decimals),
    annualPaymentAmount: roundFinancial(totalMonthlyHousingPayment.mul(12), decimals),
    totalPropertyTaxPaid: roundFinancial(toDec(taxResult.periodicTax).mul(totalNumberOfPayments), decimals),
    totalHomeInsurancePaid: roundFinancial(toDec(insuranceResult.periodicInsurance).mul(totalNumberOfPayments), decimals),
    totalMortgageInsurancePaid: roundFinancial(toDec(pmiResult.periodicPMI).mul(totalNumberOfPayments), decimals),
    interestToPrincipalRatio: roundFinancial(interestToPrincipalRatio, 2),
    payoffDate: amortizationSummary.payoffDate,

    // Extra Payment Analytics
    originalTotalInterest: roundFinancial(amortizationSummary.totalInterest + amortizationSummary.interestSaved, decimals),
    newTotalInterest: roundFinancial(amortizationSummary.totalInterest, decimals),
    interestSaved: roundFinancial(amortizationSummary.interestSaved, decimals),
    monthsSaved: amortizationSummary.monthsSaved,
    newPayoffDate: amortizationSummary.payoffDate,

    // DTI
    housingDti,
    totalDti,

    // Amortization Schedule
    amortizationSchedule: amortizationSummary,
  };
}
