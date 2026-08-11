import Decimal from 'decimal.js';

import { safeDiv, toDec } from './decimalUtils';
import { PaymentFrequency } from './types';

/**
 * Returns number of payments per year for a payment frequency.
 */
export function getPaymentsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 52;
    case 'biweekly':
      return 26;
    case 'quarterly':
      return 4;
    case 'yearly':
      return 1;
    case 'monthly':
    default:
      return 12;
  }
}

/**
 * Calculates periodic interest rate for a given nominal annual rate, payment frequency, and compounding convention.
 *
 * Canadian fixed mortgages compound semi-annually by law:
 * periodicRate = (1 + nominalAnnualRate / 2)^(2 / paymentsPerYear) - 1
 *
 * Standard mortgages:
 * periodicRate = nominalAnnualRate / paymentsPerYear
 */
export function calculatePeriodicRate(
  annualRatePct: number | Decimal,
  paymentFrequency: PaymentFrequency,
  compoundingFrequency: 'annual' | 'semi-annual' = 'annual'
): Decimal {
  const annualRate = safeDiv(toDec(annualRatePct), 100);
  const ppy = toDec(getPaymentsPerYear(paymentFrequency));

  if (annualRate.isZero() || ppy.isZero()) {
    return new Decimal(0);
  }

  if (compoundingFrequency === 'semi-annual') {
    // Canadian semi-annual compounding formula: (1 + r/2)^(2 / ppy) - 1
    const semiAnnual = annualRate.div(2).add(1);
    const exponent = safeDiv(2, ppy);
    return semiAnnual.pow(exponent).sub(1);
  }

  // Standard nominal compounding: r / ppy
  return annualRate.div(ppy);
}

/**
 * Calculates total periodic Principal & Interest payment using exact financial formula:
 * M = P * [r * (1 + r)^n] / [(1 + r)^n - 1]
 *
 * For zero-interest loans (r = 0):
 * M = P / n
 */
export function calculatePeriodicPayment(
  principal: number | Decimal,
  annualRatePct: number | Decimal,
  loanTermYears: number | Decimal,
  paymentFrequency: PaymentFrequency = 'monthly',
  compoundingFrequency: 'annual' | 'semi-annual' = 'annual'
): Decimal {
  const P = toDec(principal);
  const termYears = toDec(loanTermYears);
  const ppy = toDec(getPaymentsPerYear(paymentFrequency));
  const n = termYears.mul(ppy);

  if (P.lte(0) || n.lte(0)) {
    return new Decimal(0);
  }

  const r = calculatePeriodicRate(annualRatePct, paymentFrequency, compoundingFrequency);

  if (r.isZero()) {
    // Zero-interest loan calculation
    return safeDiv(P, n);
  }

  // (1 + r)^n
  const onePlusRPowN = r.add(1).pow(n);

  // M = P * [r * (1+r)^n] / [(1+r)^n - 1]
  const numerator = P.mul(r).mul(onePlusRPowN);
  const denominator = onePlusRPowN.sub(1);

  return safeDiv(numerator, denominator);
}
