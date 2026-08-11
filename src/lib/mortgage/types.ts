export type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly' | 'quarterly' | 'yearly';

export type TaxCalculationMethod = 'manual' | 'percentage' | 'annualAmount';

export type InsuranceCalculationMethod = 'manual' | 'percentage' | 'annualAmount';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

export interface MortgageProduct {
  id: string;
  name: string;
  termYears: number;
  type: 'fixed' | 'variable' | 'arm' | 'tracker' | 'floating' | 'fixed-period';
  description: string;
}

export interface PMIRule {
  ltvThreshold: number; // e.g., 80% (PMI applies if LTV > 80%)
  annualRatePercentage: number; // e.g., 0.5% - 1.5%
  appliesGlobally: boolean;
  minDownPaymentPct: number;
}

export interface MortgageRate {
  id: string;
  countryCode: string;
  currencyCode: string;
  mortgageType: string;
  termYears: number;
  rate: number;
  rateType: string;
  provider: string;
  sourceUrl: string;
  effectiveDate: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface CountryConfig {
  countryCode: string; // ISO 2-letter uppercase e.g. "US", "CA", "UK", "IN", "NP"
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  currencyDecimalPlaces: number;
  defaultLoanTerm: number;
  availableLoanTerms: number[];
  defaultInterestRate: number;
  interestRateFrequency: 'annual' | 'semi-annual'; // e.g. Canada fixed loans compound semi-annually
  paymentFrequencyOptions: PaymentFrequency[];
  mortgageTypes: MortgageProduct[];
  minimumDownPaymentPct: number;
  maximumLoanTerm: number;
  propertyTaxAvailable: boolean;
  homeInsuranceAvailable: boolean;
  mortgageInsuranceAvailable: boolean;
  defaultPropertyTaxRatePct: number;
  defaultHomeInsuranceRatePct: number;
  additionalFees: { name: string; amount: number; isPercentage: boolean }[];
  taxCalculationMethod: TaxCalculationMethod;
  mortgageInsuranceRules?: PMIRule;
  supportedRateSources: string[];
  disclaimer: string;
}

export interface ExtraPaymentInput {
  amount: number; // Amount in currency or percentage
  type: 'monthly' | 'yearly' | 'one-time';
  startDate?: string; // YYYY-MM
  percentageOfPayment?: boolean;
}

export interface CalculationInput {
  countryCode: string;
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  paymentFrequency: PaymentFrequency;
  mortgageTypeId?: string;
  startDate?: string; // ISO YYYY-MM
  propertyTaxAnnual?: number;
  propertyTaxPercentage?: number;
  homeInsuranceAnnual?: number;
  homeInsurancePercentage?: number;
  mortgageInsuranceMonthly?: number;
  hoaMonthly?: number;
  otherMonthlyCosts?: number;
  extraPayments?: ExtraPaymentInput[];
  grossAnnualIncome?: number;
  otherMonthlyDebts?: number;
}

export interface AmortizationRow {
  paymentNumber: number;
  paymentDate: string;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  endingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface AmortizationSummary {
  rows: AmortizationRow[];
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
  totalExtraPaid: number;
  payoffDate: string;
  originalPayoffDate: string;
  monthsSaved: number;
  interestSaved: number;
}

export interface CalculationResult {
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  propertyPrice: number;
  downPayment: number;
  downPaymentPct: number;
  loanAmount: number;
  ltvRatio: number;
  interestRate: number;
  loanTermYears: number;
  paymentFrequency: PaymentFrequency;
  paymentsPerYear: number;
  totalNumberOfPayments: number;
  
  // Periodic payments (matching payment frequency)
  periodicPrincipalAndInterest: number;
  periodicPropertyTax: number;
  periodicHomeInsurance: number;
  periodicMortgageInsurance: number;
  periodicHoa: number;
  periodicOtherCosts: number;
  totalPeriodicPayment: number;

  // Standard Monthly Equivalents for easy comparison
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyMortgageInsurance: number;
  monthlyHoa: number;
  monthlyOtherCosts: number;
  totalMonthlyHousingPayment: number;

  // Totals & Analytics
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalCostOfLoan: number;
  interestToPrincipalRatio: number;
  payoffDate: string;

  // Extra Payments Comparison
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
  newPayoffDate: string;

  // DTI (if income provided)
  housingDti?: number;
  totalDti?: number;

  // Amortization Schedule
  amortizationSchedule: AmortizationSummary;
}

export interface AffordabilityInput {
  countryCode: string;
  annualIncome: number;
  monthlyDebts: number;
  downPaymentAmount: number;
  interestRate: number;
  loanTermYears: number;
  propertyTaxPct?: number;
  insurancePct?: number;
  hoaMonthly?: number;
  targetMaxDtiPct?: number; // e.g. 36%
  targetHousingDtiPct?: number; // e.g. 28%
}

export interface AffordabilityResult {
  maxHomePrice: number;
  maxLoanAmount: number;
  maxMonthlyPayment: number;
  maxMonthlyHousingCost: number;
  allowedMonthlyDebtForHousing: number;
  downPaymentAmount: number;
  housingDtiPct: number;
  totalDtiPct: number;
}

export interface RefinanceInput {
  countryCode: string;
  currentLoanBalance: number;
  currentInterestRate: number;
  currentMonthlyPayment: number;
  remainingTermMonths: number;
  newInterestRate: number;
  newLoanTermYears: number;
  closingCosts: number;
}

export interface RefinanceResult {
  newMonthlyPayment: number;
  monthlySavings: number;
  totalRemainingInterestOldLoan: number;
  totalInterestNewLoan: number;
  lifetimeInterestSavings: number;
  netLifetimeSavings: number;
  breakEvenMonths: number | null; // null if monthlySavings <= 0
  isRefinanceBeneficial: boolean;
}
