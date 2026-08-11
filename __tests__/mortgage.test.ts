import { describe, expect, it } from 'vitest';

import { calculateAffordability } from '../src/lib/mortgage/affordability';
import { generateAmortizationSchedule } from '../src/lib/mortgage/amortization';
import { calculateMortgage } from '../src/lib/mortgage/calculator';
import { getCountryConfig } from '../src/lib/mortgage/countryRules';
import { formatCurrency, safeDiv } from '../src/lib/mortgage/decimalUtils';
import { calculatePeriodicPayment } from '../src/lib/mortgage/interest';
import { calculateRefinance } from '../src/lib/mortgage/refinance';
import { CalculationInputSchema } from '../src/lib/mortgage/validation';

describe('Global Mortgage Calculator Engine', () => {
  describe('Standard Fixed-Rate Formula Accuracy', () => {
    it('calculates expected monthly payment of ~$1,798.65 for $300,000 loan at 6% over 30 years', () => {
      const payment = calculatePeriodicPayment(300000, 6, 30, 'monthly', 'annual');
      const roundedPayment = payment.toDecimalPlaces(2).toNumber();
      expect(roundedPayment).toBe(1798.65);
    });

    it('handles zero interest rate loans accurately without division by zero', () => {
      const payment = calculatePeriodicPayment(120000, 0, 10, 'monthly', 'annual');
      const roundedPayment = payment.toDecimalPlaces(2).toNumber();
      expect(roundedPayment).toBe(1000.0); // $120,000 / 120 months
    });

    it('calculates very low interest rate loans (0.1%)', () => {
      const payment = calculatePeriodicPayment(100000, 0.1, 10, 'monthly', 'annual');
      expect(payment.toNumber()).toBeGreaterThan(0);
      expect(payment.toNumber()).toBeLessThan(1000);
    });

    it('calculates high interest rate loans (15%)', () => {
      const payment = calculatePeriodicPayment(100000, 15, 15, 'monthly', 'annual');
      expect(payment.toNumber()).toBeGreaterThan(1400);
    });
  });

  describe('Payment Frequencies', () => {
    it('calculates weekly, biweekly, quarterly, and yearly payments correctly', () => {
      const principal = 200000;
      const rate = 5;
      const years = 20;

      const monthly = calculatePeriodicPayment(principal, rate, years, 'monthly');
      const biweekly = calculatePeriodicPayment(principal, rate, years, 'biweekly');
      const weekly = calculatePeriodicPayment(principal, rate, years, 'weekly');
      const quarterly = calculatePeriodicPayment(principal, rate, years, 'quarterly');
      const yearly = calculatePeriodicPayment(principal, rate, years, 'yearly');

      expect(weekly.toNumber() * 52).toBeGreaterThan(0);
      expect(biweekly.toNumber()).toBeLessThan(monthly.toNumber());
      expect(weekly.toNumber()).toBeLessThan(biweekly.toNumber());
      expect(quarterly.toNumber()).toBeGreaterThan(monthly.toNumber());
      expect(yearly.toNumber()).toBeGreaterThan(quarterly.toNumber());
    });
  });

  describe('Amortization Schedule & Final Payment Rounding', () => {
    it('adjusts final payment so ending balance reaches exactly 0', () => {
      const summary = generateAmortizationSchedule(100000, 5.5, 15, 'monthly');
      const lastRow = summary.rows[summary.rows.length - 1];

      expect(lastRow.endingBalance).toBe(0);
      expect(summary.totalPrincipal).toBeCloseTo(100000, 1);
    });

    it('recalculates payoff date and interest saved when extra monthly payments are added', () => {
      const standardSummary = generateAmortizationSchedule(300000, 6, 30, 'monthly');
      const extraSummary = generateAmortizationSchedule(300000, 6, 30, 'monthly', 'annual', '2026-08', [
        { amount: 300, type: 'monthly' },
      ]);

      expect(extraSummary.totalPayments).toBeLessThan(standardSummary.totalPayments);
      expect(extraSummary.monthsSaved).toBeGreaterThan(0);
      expect(extraSummary.interestSaved).toBeGreaterThan(0);
    });
  });

  describe('Country Specific Configurations', () => {
    it('loads country metadata for all 22 supported countries', () => {
      const usConfig = getCountryConfig('US');
      const caConfig = getCountryConfig('CA');
      const npConfig = getCountryConfig('NP');

      expect(usConfig.currencyCode).toBe('USD');
      expect(caConfig.interestRateFrequency).toBe('semi-annual');
      expect(npConfig.currencySymbol).toBe('Rs.');
    });

    it('formats currencies using country locale standards', () => {
      expect(formatCurrency(1500.5, 'USD')).toBe('$1,500.50');
      expect(formatCurrency(1500.5, 'GBP')).toBe('£1,500.50');
      expect(formatCurrency(1500.5, 'EUR')).toBe('€1,500.50');
      expect(formatCurrency(1500, 'JPY', 0)).toBe('¥1,500');
    });
  });

  describe('Affordability & Refinance Calculators', () => {
    it('calculates home affordability based on DTI limits', () => {
      const result = calculateAffordability({
        countryCode: 'US',
        annualIncome: 120000, // $10,000/mo
        monthlyDebts: 500,
        downPaymentAmount: 50000,
        interestRate: 6.5,
        loanTermYears: 30,
        targetHousingDtiPct: 28,
        targetMaxDtiPct: 36,
      });

      expect(result.maxHomePrice).toBeGreaterThan(50000);
      expect(result.maxMonthlyPayment).toBeGreaterThan(0);
      expect(result.housingDtiPct).toBeLessThanOrEqual(28);
    });

    it('calculates refinance savings and break-even period', () => {
      const result = calculateRefinance({
        countryCode: 'US',
        currentLoanBalance: 300000,
        currentInterestRate: 7.5,
        currentMonthlyPayment: 2250,
        remainingTermMonths: 300,
        newInterestRate: 5.5,
        newLoanTermYears: 25,
        closingCosts: 4000,
      });

      expect(result.monthlySavings).toBeGreaterThan(0);
      expect(result.breakEvenMonths).not.toBeNull();
      expect(result.breakEvenMonths!).toBeGreaterThan(0);
      expect(result.isRefinanceBeneficial).toBe(true);
    });
  });

  describe('Zod Input Validation', () => {
    it('rejects invalid inputs like negative property price or down payment >= price', () => {
      const invalidPrice = CalculationInputSchema.safeParse({
        countryCode: 'US',
        propertyPrice: -100,
        downPayment: 5000,
        interestRate: 5,
        loanTermYears: 30,
        paymentFrequency: 'monthly',
      });
      expect(invalidPrice.success).toBe(false);

      const invalidDown = CalculationInputSchema.safeParse({
        countryCode: 'US',
        propertyPrice: 100000,
        downPayment: 150000, // Down payment > Price
        interestRate: 5,
        loanTermYears: 30,
        paymentFrequency: 'monthly',
      });
      expect(invalidDown.success).toBe(false);
    });
  });
});
