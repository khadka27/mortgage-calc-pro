import { NextResponse } from 'next/server';

import { RATE_API_KEY, RATE_API_URL } from '@/lib/env';

export const revalidate = 3600; // Cache for 1 hour (ISR)

interface RateApiBenchmark {
  product_type: string;
  display_name: string;
  count: number;
  min_apr: number;
  median_apr: number;
  max_apr: number;
  min_rate: number;
  max_rate: number;
  as_of: string;
  min_apr_institution?: string;
  min_apr_state?: string;
}

interface RateApiResponse {
  benchmarks: RateApiBenchmark[];
  summary: {
    total_institutions: number;
    total_rates: number;
    states_covered: number;
  };
  generated_at: string;
}

const MORTGAGE_PRODUCTS = ['mortgage_15yr', 'mortgage_30yr', 'mortgage_arm', 'heloc'];

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
  category: 'mortgage' | 'auto' | 'personal' | 'recreational';
}

export interface LiveRatesPayload {
  rates: LiveMortgageRate[];
  allRates: LiveMortgageRate[];
  totalInstitutions: number;
  totalRates: number;
  generatedAt: string;
  cachedAt: string;
}

function getCategory(productType: string): 'mortgage' | 'auto' | 'personal' | 'recreational' {
  if (productType.includes('mortgage') || productType.includes('heloc')) return 'mortgage';
  if (productType.includes('auto') || productType.includes('motorcycle')) return 'auto';
  if (productType.includes('personal') || productType.includes('credit_card') || productType.includes('student')) return 'personal';
  return 'recreational';
}

export async function GET() {
  const apiKey = RATE_API_KEY;
  const apiUrl = RATE_API_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Rate API not configured. Set RATE_API_KEY in .env.local.' },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(apiUrl, {
      headers: { 'X-API-Key': apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Rate API responded with ${res.status}: ${text}` },
        { status: res.status }
      );
    }

    const data: RateApiResponse = await res.json();

    const allMappedRates: LiveMortgageRate[] = data.benchmarks.map((b) => ({
      productType: b.product_type,
      displayName: b.display_name,
      minRate: b.min_rate,
      medianRate: b.median_apr,
      maxRate: b.max_rate,
      minApr: b.min_apr,
      medianApr: b.median_apr,
      maxApr: b.max_apr,
      count: b.count,
      asOf: b.as_of,
      lowestInstitution: b.min_apr_institution,
      lowestState: b.min_apr_state,
      category: getCategory(b.product_type),
    }));

    const rates = allMappedRates.filter((r) => MORTGAGE_PRODUCTS.includes(r.productType));

    const payload: LiveRatesPayload = {
      rates,
      allRates: allMappedRates,
      totalInstitutions: data.summary.total_institutions,
      totalRates: data.summary.total_rates,
      generatedAt: data.generated_at,
      cachedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to fetch rates: ${message}` }, { status: 500 });
  }
}
