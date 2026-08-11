import { SUPPORTED_COUNTRIES } from './countries';
import { CountryConfig } from './types';

/**
 * Retrieves country configuration by 2-letter ISO country code.
 * Defaults to United States ('US') if country is not found.
 */
export function getCountryConfig(countryCode: string = 'US'): CountryConfig {
  const code = countryCode.toUpperCase();
  const country = SUPPORTED_COUNTRIES.find((c) => c.countryCode === code);
  if (country) return country;
  return SUPPORTED_COUNTRIES[0]; // US Default
}

/**
 * Returns list of all supported countries.
 */
export function getAllCountries(): CountryConfig[] {
  return SUPPORTED_COUNTRIES;
}

/**
 * Search countries by name, code, or currency code.
 */
export function searchCountries(query: string): CountryConfig[] {
  const q = query.toLowerCase().trim();
  if (!q) return SUPPORTED_COUNTRIES;
  return SUPPORTED_COUNTRIES.filter(
    (c) =>
      c.countryName.toLowerCase().includes(q) ||
      c.countryCode.toLowerCase().includes(q) ||
      c.currencyCode.toLowerCase().includes(q)
  );
}
