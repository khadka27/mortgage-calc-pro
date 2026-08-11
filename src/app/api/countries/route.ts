import { NextResponse } from 'next/server';

import { getAllCountries } from '@/lib/mortgage/countryRules';

export async function GET() {
  const countries = getAllCountries();
  return NextResponse.json({
    success: true,
    total: countries.length,
    countries,
  });
}
