'use client';

import { useEffect, useState } from 'react';

export interface LiveMortgageRate {
  productType: string;
  displayName: string;
  minRate: number;
  medianRate: number;
  maxRate: number;
  minApr: number;
  medianApr: number;
  maxApr: number;
  count: number;
  asOf: string;
  lowestInstitution?: string;
  lowestState?: string;
}

export interface LiveRatesPayload {
  rates: LiveMortgageRate[];
  totalInstitutions: number;
  totalRates: number;
  generatedAt: string;
  cachedAt: string;
}

interface UseLiveRatesResult {
  rates: LiveMortgageRate[];
  meta: Omit<LiveRatesPayload, 'rates'> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLiveRates(): UseLiveRatesResult {
  const [data, setData] = useState<LiveRatesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/live-rates')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<LiveRatesPayload>;
      })
      .then((payload) => {
        if (!cancelled) {
          setData(payload);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load live rates');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [tick]);

  const { rates = [], ...meta } = data ?? {};

  return {
    rates,
    meta: data ? (meta as Omit<LiveRatesPayload, 'rates'>) : null,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}

/** Convenience: return just the rate for a specific product type */
export function useRateByProduct(productType: string): LiveMortgageRate | null {
  const { rates } = useLiveRates();
  return rates.find((r) => r.productType === productType) ?? null;
}
