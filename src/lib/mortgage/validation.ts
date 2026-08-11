import { z } from 'zod';

export const PaymentFrequencySchema = z.enum(['monthly', 'biweekly', 'weekly', 'quarterly', 'yearly']);

export const ExtraPaymentInputSchema = z.object({
  amount: z.number().min(0, 'Extra payment amount must be non-negative'),
  type: z.enum(['monthly', 'yearly', 'one-time']),
  startDate: z.string().optional(),
  percentageOfPayment: z.boolean().optional(),
});

export const CalculationInputSchema = z
  .object({
    countryCode: z.string().min(2).max(5),
    propertyPrice: z
      .number()
      .positive('Property price must be greater than 0')
      .finite('Property price must be a finite number'),
    downPayment: z
      .number()
      .min(0, 'Down payment cannot be negative')
      .finite('Down payment must be a finite number'),
    interestRate: z
      .number()
      .min(0, 'Interest rate cannot be negative')
      .max(100, 'Interest rate cannot exceed 100%')
      .finite('Interest rate must be a finite number'),
    loanTermYears: z
      .number()
      .positive('Loan term must be greater than 0')
      .max(50, 'Maximum loan term is 50 years')
      .finite('Loan term must be a finite number'),
    paymentFrequency: PaymentFrequencySchema.default('monthly'),
    mortgageTypeId: z.string().optional(),
    startDate: z.string().optional(),
    propertyTaxAnnual: z.number().min(0).optional(),
    propertyTaxPercentage: z.number().min(0).max(100).optional(),
    homeInsuranceAnnual: z.number().min(0).optional(),
    homeInsurancePercentage: z.number().min(0).max(100).optional(),
    mortgageInsuranceMonthly: z.number().min(0).optional(),
    hoaMonthly: z.number().min(0).optional(),
    otherMonthlyCosts: z.number().min(0).optional(),
    extraPayments: z.array(ExtraPaymentInputSchema).optional(),
    grossAnnualIncome: z.number().min(0).optional(),
    otherMonthlyDebts: z.number().min(0).optional(),
  })
  .refine((data) => data.downPayment < data.propertyPrice, {
    message: 'Down payment must be strictly less than the property price',
    path: ['downPayment'],
  });

export const AffordabilityInputSchema = z.object({
  countryCode: z.string().min(2).max(5),
  annualIncome: z.number().positive('Annual income must be greater than 0'),
  monthlyDebts: z.number().min(0, 'Monthly debts cannot be negative'),
  downPaymentAmount: z.number().min(0, 'Down payment cannot be negative'),
  interestRate: z.number().min(0).max(100),
  loanTermYears: z.number().positive().max(50),
  propertyTaxPct: z.number().min(0).max(100).optional(),
  insurancePct: z.number().min(0).max(100).optional(),
  hoaMonthly: z.number().min(0).optional(),
  targetMaxDtiPct: z.number().min(1).max(100).optional(),
  targetHousingDtiPct: z.number().min(1).max(100).optional(),
});

export const RefinanceInputSchema = z.object({
  countryCode: z.string().min(2).max(5),
  currentLoanBalance: z.number().positive('Current loan balance must be greater than 0'),
  currentInterestRate: z.number().min(0).max(100),
  currentMonthlyPayment: z.number().positive('Current monthly payment must be greater than 0'),
  remainingTermMonths: z.number().positive('Remaining term must be greater than 0'),
  newInterestRate: z.number().min(0).max(100),
  newLoanTermYears: z.number().positive().max(50),
  closingCosts: z.number().min(0, 'Closing costs cannot be negative'),
});
