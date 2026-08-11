/**
 * Centralised environment variable access.
 *
 * — NEXT_PUBLIC_* vars are inlined at build time and available in the browser.
 * — Non-prefixed vars (RATE_API_KEY, RATE_API_URL) are server-only.
 *
 * Import this file wherever you need env access instead of
 * sprinkling raw `process.env.*` calls around the codebase.
 */

// ── Public (browser-safe) ───────────────────────────────────────
export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? 'MortgagePro Global';

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const APP_ENV =
  (process.env.NEXT_PUBLIC_APP_ENV as 'development' | 'staging' | 'production') ??
  'development';

export const IS_PROD = APP_ENV === 'production';
export const IS_DEV  = APP_ENV === 'development';

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

export const GSC_VERIFICATION =
  process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '';

export const ENABLE_RATE_ALERTS =
  process.env.NEXT_PUBLIC_ENABLE_RATE_ALERTS === 'true';

export const ENABLE_COMPARE_MODE =
  process.env.NEXT_PUBLIC_ENABLE_COMPARE_MODE === 'true';

// ── Server-only (never sent to browser) ────────────────────────
// These will be `undefined` on the client — that is intentional.
export const RATE_API_KEY  = process.env.RATE_API_KEY;
export const RATE_API_URL  =
  process.env.RATE_API_URL ?? 'https://api.rateapi.dev/v1/benchmarks';
