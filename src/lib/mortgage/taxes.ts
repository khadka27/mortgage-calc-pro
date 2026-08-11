import Decimal from 'decimal.js';

import { roundFinancial, safeDiv, toDec } from './decimalUtils';
import { PaymentFrequency } from './types';

/**
 * Calculates property tax per period and annually.
 */
export function calculatePropertyTax(
  propertyPrice: number | Decimal,
  annualAmount?: number,
  percentage?: number,
  frequency: PaymentFrequency = 'monthly'
): { annualTax: number; periodicTax: number } {
  const price = toDec(propertyPrice);

  let annual = new Decimal(0);

  if (annualAmount && annualAmount > 0) {
    annual = toDec(annualAmount);
  } else if (percentage && percentage > 0) {
    annual = price.mul(toDec(percentage)).div(100);
  }

  let periodicMultiplier = 12;
  switch (frequency) {
    case 'weekly':
      periodicMultiplier = 52;
      break;
    case 'biweekly':
      periodicMultiplier = 26;
      break;
    case 'quarterly':
      periodicMultiplier = 4;
      break;
    case 'yearly':
      periodicMultiplier = 1;
      break;
    case 'monthly':
    default:
      periodicMultiplier = 12;
      break;
  }

  const periodic = safeDiv(annual, periodicMultiplier);

  return {
    annualTax: roundFinancial(annual, 2),
    periodicTax: roundFinancial(periodic, 2),
  };
}
