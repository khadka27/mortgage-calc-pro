import { SUPPORTED_COUNTRIES } from './countries';
import { MortgageRate } from './types';

export interface MortgageRateProvider {
  getRates(countryCode: string): Promise<MortgageRate[]>;
}

export class ConfiguredRateProvider implements MortgageRateProvider {
  private static ratesMap: Record<string, MortgageRate[]> = {
    US: [
      {
        id: 'us-30f-rate',
        countryCode: 'US',
        currencyCode: 'USD',
        mortgageType: '30-Year Fixed',
        termYears: 30,
        rate: 6.48,
        rateType: 'fixed',
        provider: 'Freddie Mac PMMS Benchmark',
        sourceUrl: 'https://www.freddiemac.com/pmms',
        effectiveDate: '2026-08-01',
        lastUpdated: '2026-08-08',
        isActive: true,
      },
      {
        id: 'us-15f-rate',
        countryCode: 'US',
        currencyCode: 'USD',
        mortgageType: '15-Year Fixed',
        termYears: 15,
        rate: 5.75,
        rateType: 'fixed',
        provider: 'Freddie Mac PMMS Benchmark',
        sourceUrl: 'https://www.freddiemac.com/pmms',
        effectiveDate: '2026-08-01',
        lastUpdated: '2026-08-08',
        isActive: true,
      },
    ],
    CA: [
      {
        id: 'ca-5f-rate',
        countryCode: 'CA',
        currencyCode: 'CAD',
        mortgageType: '5-Year Fixed',
        termYears: 25,
        rate: 5.14,
        rateType: 'fixed',
        provider: 'Bank of Canada Financial Indicators',
        sourceUrl: 'https://www.bankofcanada.ca',
        effectiveDate: '2026-08-01',
        lastUpdated: '2026-08-08',
        isActive: true,
      },
    ],
    UK: [
      {
        id: 'uk-5f-rate',
        countryCode: 'UK',
        currencyCode: 'GBP',
        mortgageType: '5-Year Fixed',
        termYears: 25,
        rate: 4.75,
        rateType: 'fixed',
        provider: 'Bank of England Base Rate',
        sourceUrl: 'https://www.bankofengland.co.uk',
        effectiveDate: '2026-08-01',
        lastUpdated: '2026-08-08',
        isActive: true,
      },
    ],
    IN: [
      {
        id: 'in-repo-rate',
        countryCode: 'IN',
        currencyCode: 'INR',
        mortgageType: 'Repo-Rate Linked Floating',
        termYears: 20,
        rate: 8.5,
        rateType: 'floating',
        provider: 'Reserve Bank of India (RBI)',
        sourceUrl: 'https://www.rbi.org.in',
        effectiveDate: '2026-08-01',
        lastUpdated: '2026-08-08',
        isActive: true,
      },
    ],
    NP: [
      {
        id: 'np-base-rate',
        countryCode: 'NP',
        currencyCode: 'NPR',
        mortgageType: 'Base Rate Linked Floating',
        termYears: 15,
        rate: 10.5,
        rateType: 'floating',
        provider: 'Nepal Rastra Bank (NRB) Directives',
        sourceUrl: 'https://www.nrb.org.np',
        effectiveDate: '2026-08-01',
        lastUpdated: '2026-08-08',
        isActive: true,
      },
    ],
  };

  async getRates(countryCode: string): Promise<MortgageRate[]> {
    const code = countryCode.toUpperCase();
    const rates = ConfiguredRateProvider.ratesMap[code];
    if (rates && rates.length > 0) {
      return rates;
    }
    
    // Return country default if configured
    const country = SUPPORTED_COUNTRIES.find((c) => c.countryCode === code);
    if (country) {
      return [
        {
          id: `${code.toLowerCase()}-default-rate`,
          countryCode: code,
          currencyCode: country.currencyCode,
          mortgageType: country.mortgageTypes[0]?.name || 'Standard Mortgage',
          termYears: country.defaultLoanTerm,
          rate: country.defaultInterestRate,
          rateType: country.mortgageTypes[0]?.type || 'fixed',
          provider: country.supportedRateSources[0] || 'Central Bank Indicator',
          sourceUrl: 'https://www.centralbank.org',
          effectiveDate: '2026-08-01',
          lastUpdated: '2026-08-08',
          isActive: true,
        },
      ];
    }

    return [];
  }
}

export const defaultRateProvider = new ConfiguredRateProvider();
