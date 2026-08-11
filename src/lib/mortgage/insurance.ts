import Decimal from 'decimal.js';

import { Decimal, roundFinancial, safeDiv, toDec } from './decimalUtils';
import { PaymentFrequency, PMIRule } from './types';

/**
 * Calculates Loan-To-Value (LTV) Ratio percentage.
 * LTV = (Loan Amount / Property Price) * 100
 */
export function calculateLTV(
  propertyPrice: number | Decimal,
  loanAmount: number | Decimal
): number {
  const price = toDec(propertyPrice);
  const loan = toDec(loanAmount);

  if (price.lte(0)) return 0;
  const ltv = safeDiv(loan, price).mul(100);
  return roundFinancial(ltv, 2);
}

/**
 * Calculates Home Hazard Insurance periodic amount.
 */
export function calculateHomeInsurance(
  propertyPrice: number | Decimal,
  annualAmount?: number,
  percentage?: number,
  frequency: PaymentFrequency = 'monthly'
): { annualInsurance: number; periodicInsurance: number } {
  const price = toDec(propertyPrice);
  let annual = new Decimal(0);

  if (annualAmount && annualAmount > 0) {
    annual = toDec(annualAmount);
  } else if (percentage && percentage > 0) {
    annual = price.mul(toDec(percentage)).div(100);
  }

  let divisor = 12;
  switch (frequency) {
    case 'weekly':
      divisor = 52;
      break;
    case 'biweekly':
      divisor = 26;
      break;
    case 'quarterly':
      divisor = 4;
      break;
    case 'yearly':
      divisor = 1;
      break;
    case 'monthly':
    default:
      divisor = 12;
      break;
  }

  const periodic = safeDiv(annual, divisor);

  return {
    annualInsurance: roundFinancial(annual, 2),
    periodicInsurance: roundFinancial(periodic, 2),
  };
}

/**
 * Calculates Mortgage Insurance / PMI based on country-specific rules or user input.
 *
 * For USA: PMI applies if LTV > 80% (Down payment < 20%). Estimated rate usually 0.5% - 1.5% of original loan per year.
 * For Canada: Mortgage Default Insurance (CMHC) applies if LTV > 80% (Down payment < 20%).
 */
export function calculateMortgageInsurance(
  propertyPrice: number | Decimal,
  loanAmount: number | Decimal,
  manualMonthlyAmount?: number,
  pmiRules?: PMIRule,
  frequency: PaymentFrequency = 'monthly'
): { annualPMI: number; periodicPMI: number; isApplies: boolean } {
  const price = toDec(propertyPrice);
  const loan = toDec(loanAmount);
  const ltv = calculateLTV(price, loan);

  let divisor = 12;
  switch (frequency) {
    case 'weekly':
      divisor = 52;
      break;
    case 'biweekly':
      divisor = 26;
      break;
    case 'quarterly':
      divisor = 4;
      break;
    case 'yearly':
      divisor = 1;
      break;
    case 'monthly':
    default:
      divisor = 12;
      break;
  }

  // 1. Manual monthly amount entered by user
  if (typeof manualMonthlyAmount === 'number' && manualMonthlyAmount >= 0) {
    const monthlyDec = toDec(manualMonthlyAmount);
    const annualDec = monthlyDec.mul(12);
    const periodicDec = safeDiv(annualDec, divisor);
    return {
      annualPMI: roundFinancial(annualDec, 2),
      periodicPMI: roundFinancial(periodicDec, 2),
      isApplies: manualMonthlyAmount > 0,
    };
  }

  // 2. Configurable PMI rules
  if (pmiRules) {
    if (ltv > pmiRules.ltvThreshold) {
      const annualRate = toDec(pmiRules.annualRatePercentage).div(100);
      const annualDec = loan.mul(annualRate);
      const periodicDec = safeDiv(annualDec, divisor);
      return {
        annualPMI: roundFinancial(annualDec, 2),
        periodicPMI: roundFinancial(periodicDec, 2),
        isApplies: true,
      };
    }
  }

  return {
    annualPMI: 0,
    periodicPMI: 0,
    isApplies: false,
  };
}
