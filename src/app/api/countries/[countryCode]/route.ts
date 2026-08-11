import { NextRequest, NextResponse } from 'next/server';

import { getCountryConfig } from '@/lib/mortgage/countryRules';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await params;
  const config = getCountryConfig(countryCode);

  return NextResponse.json({
    success: true,
    country: config,
  });
}
