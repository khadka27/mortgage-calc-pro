import Decimal from 'decimal.js';

// Configure high precision for financial calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export { Decimal };

/**
 * Converts value to Decimal safely.
 */
export function toDec(val: number | string | Decimal): Decimal {
  if (val instanceof Decimal) return val;
  if (typeof val === 'number' && (isNaN(val) || !isFinite(val))) {
    return new Decimal(0);
  }
  try {
    return new Decimal(val || 0);
  } catch {
    return new Decimal(0);
  }
}

/**
 * Safe division preventing division by zero.
 */
export function safeDiv(numerator: Decimal | number, denominator: Decimal | number): Decimal {
  const d = toDec(denominator);
  if (d.isZero()) return new Decimal(0);
  return toDec(numerator).div(d);
}

/**
 * Rounds a financial decimal value to target currency decimal places for display/reporting.
 * Internal calculations maintain exact precision.
 */
export function roundFinancial(val: Decimal | number, decimals: number = 2): number {
  const dec = toDec(val);
  return dec.toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toNumber();
}

/**
 * Formats a monetary number into locale-aware currency strings.
 */
export function formatCurrency(
  amount: number | string | Decimal,
  currencyCode: string = 'USD',
  decimalPlaces: number = 2
): string {
  const num = typeof amount === 'number' ? amount : toDec(amount).toNumber();
  if (isNaN(num) || !isFinite(num)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(num);
  } catch {
    const symbol = currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : '$';
    return `${symbol}${num.toFixed(decimalPlaces)}`;
  }
}

/**
 * Formats a percentage number for display.
 */
export function formatPercent(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
}
