import Decimal from 'decimal.js';

import { roundFinancial, safeDiv, toDec } from './decimalUtils';
import { calculatePeriodicPayment, calculatePeriodicRate, getPaymentsPerYear } from './interest';
import { AmortizationRow, AmortizationSummary, ExtraPaymentInput, PaymentFrequency } from './types';

/**
 * Helper to advance date by 1 period based on payment frequency.
 */
function advanceDate(currentDate: Date, frequency: PaymentFrequency): Date {
  const d = new Date(currentDate.getTime());
  switch (frequency) {
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'biweekly':
      d.setDate(d.getDate() + 14);
      break;
    case 'quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
    case 'monthly':
    default:
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generates a full amortization schedule.
 * Handles extra payments (monthly, yearly, one-time, percentage).
 * Performs final payment rounding so balance reaches exactly 0.
 */
export function generateAmortizationSchedule(
  principal: number | Decimal,
  annualRatePct: number | Decimal,
  loanTermYears: number,
  paymentFrequency: PaymentFrequency = 'monthly',
  compoundingFrequency: 'annual' | 'semi-annual' = 'annual',
  startDateISO: string = new Date().toISOString().slice(0, 7), // YYYY-MM
  extraPayments: ExtraPaymentInput[] = [],
  currencyDecimals: number = 2
): AmortizationSummary {
  const P = toDec(principal);
  const ppy = getPaymentsPerYear(paymentFrequency);
  const totalScheduledPayments = loanTermYears * ppy;

  const periodicRate = calculatePeriodicRate(annualRatePct, paymentFrequency, compoundingFrequency);
  const baseScheduledPayment = calculatePeriodicPayment(
    P,
    annualRatePct,
    loanTermYears,
    paymentFrequency,
    compoundingFrequency
  );

  let beginningBalance = P;
  let cumulativeInterest = new Decimal(0);
  let cumulativePrincipal = new Decimal(0);
  let totalExtraPaid = new Decimal(0);

  const rows: AmortizationRow[] = [];
  let currentDate = new Date(`${startDateISO}-01T00:00:00Z`);
  if (isNaN(currentDate.getTime())) {
    currentDate = new Date();
  }

  const originalPayoffDate = formatDate(
    advanceDateByPeriods(currentDate, paymentFrequency, totalScheduledPayments)
  );

  let paymentNumber = 1;

  while (beginningBalance.gt(0) && paymentNumber <= totalScheduledPayments * 2) {
    const paymentDateStr = formatDate(currentDate);

    // Calculate interest for period
    let interest = beginningBalance.mul(periodicRate);
    if (interest.lt(0)) interest = new Decimal(0);

    // Calculate base scheduled payment
    let scheduledPayment = baseScheduledPayment;

    // Check for extra payments
    let extraPayment = new Decimal(0);
    for (const ep of extraPayments) {
      if (!ep.amount || ep.amount <= 0) continue;
      const epAmount = toDec(ep.amount);

      if (ep.type === 'monthly') {
        extraPayment = extraPayment.add(epAmount);
      } else if (ep.type === 'yearly' && paymentNumber % ppy === 1) {
        extraPayment = extraPayment.add(epAmount);
      } else if (ep.type === 'one-time' && ep.startDate && ep.startDate === paymentDateStr.slice(0, 7)) {
        extraPayment = extraPayment.add(epAmount);
      }
    }

    let principal = scheduledPayment.sub(interest);

    // Check if this payment completes the loan
    let totalPaymentForPeriod = principal.add(interest).add(extraPayment);

    if (beginningBalance.sub(principal).sub(extraPayment).lte(0.01)) {
      // Final Payment Adjustment: Ensure ending balance is exactly zero
      principal = beginningBalance;
      extraPayment = new Decimal(0);
      scheduledPayment = principal.add(interest);
      totalPaymentForPeriod = scheduledPayment;
      const endingBalance = new Decimal(0);

      cumulativeInterest = cumulativeInterest.add(interest);
      cumulativePrincipal = cumulativePrincipal.add(principal);

      rows.push({
        paymentNumber,
        paymentDate: paymentDateStr,
        beginningBalance: roundFinancial(beginningBalance, currencyDecimals),
        payment: roundFinancial(scheduledPayment, currencyDecimals),
        principal: roundFinancial(principal, currencyDecimals),
        interest: roundFinancial(interest, currencyDecimals),
        extraPayment: 0,
        endingBalance: 0,
        cumulativeInterest: roundFinancial(cumulativeInterest, currencyDecimals),
        cumulativePrincipal: roundFinancial(cumulativePrincipal, currencyDecimals),
      });

      break;
    }

    const endingBalance = beginningBalance.sub(principal).sub(extraPayment);

    cumulativeInterest = cumulativeInterest.add(interest);
    cumulativePrincipal = cumulativePrincipal.add(principal).add(extraPayment);
    totalExtraPaid = totalExtraPaid.add(extraPayment);

    rows.push({
      paymentNumber,
      paymentDate: paymentDateStr,
      beginningBalance: roundFinancial(beginningBalance, currencyDecimals),
      payment: roundFinancial(scheduledPayment.add(extraPayment), currencyDecimals),
      principal: roundFinancial(principal, currencyDecimals),
      interest: roundFinancial(interest, currencyDecimals),
      extraPayment: roundFinancial(extraPayment, currencyDecimals),
      endingBalance: roundFinancial(endingBalance, currencyDecimals),
      cumulativeInterest: roundFinancial(cumulativeInterest, currencyDecimals),
      cumulativePrincipal: roundFinancial(cumulativePrincipal, currencyDecimals),
    });

    beginningBalance = endingBalance;
    paymentNumber++;
    currentDate = advanceDate(currentDate, paymentFrequency);
  }

  const actualPayoffDate = rows.length > 0 ? rows[rows.length - 1].paymentDate : originalPayoffDate;
  const actualPaymentsCount = rows.length;
  const monthsSaved = Math.max(
    0,
    Math.round(((totalScheduledPayments - actualPaymentsCount) * 12) / ppy)
  );

  // Original schedule total interest without extra payments
  const originalTotalInterest = baseScheduledPayment
    .mul(totalScheduledPayments)
    .sub(P);

  const newTotalInterest = cumulativeInterest;
  const interestSaved = Decimal.max(0, originalTotalInterest.sub(newTotalInterest));

  return {
    rows,
    totalPayments: rows.length,
    totalInterest: roundFinancial(cumulativeInterest, currencyDecimals),
    totalPrincipal: roundFinancial(cumulativePrincipal, currencyDecimals),
    totalExtraPaid: roundFinancial(totalExtraPaid, currencyDecimals),
    payoffDate: actualPayoffDate,
    originalPayoffDate,
    monthsSaved,
    interestSaved: roundFinancial(interestSaved, currencyDecimals),
  };
}

function advanceDateByPeriods(start: Date, frequency: PaymentFrequency, periods: number): Date {
  let d = new Date(start.getTime());
  for (let i = 0; i < periods; i++) {
    d = advanceDate(d, frequency);
  }
  return d;
}
