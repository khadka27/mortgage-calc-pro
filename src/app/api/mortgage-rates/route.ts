import { NextRequest, NextResponse } from 'next/server';

import { defaultRateProvider } from '@/lib/mortgage/rateProvider';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('country') || 'US';

  try {
    const rates = await defaultRateProvider.getRates(countryCode);

    if (rates.length === 0) {
      return NextResponse.json({
        success: false,
        rates: [],
        message: 'Current rate unavailable. Please enter an interest rate.',
      });
    }

    return NextResponse.json({
      success: true,
      country: countryCode.toUpperCase(),
      rates,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        rates: [],
        message: 'Live mortgage rates are temporarily unavailable. Please enter an interest rate manually.',
      },
      { status: 500 }
    );
  }
}
