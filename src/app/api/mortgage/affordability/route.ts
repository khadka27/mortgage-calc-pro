import { NextRequest, NextResponse } from 'next/server';

import { calculateAffordability } from '@/lib/mortgage/affordability';
import { AffordabilityInputSchema } from '@/lib/mortgage/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = AffordabilityInputSchema.parse({
      countryCode: body.countryCode || body.country || 'US',
      annualIncome: Number(body.annualIncome),
      monthlyDebts: Number(body.monthlyDebts || 0),
      downPaymentAmount: Number(body.downPaymentAmount || 0),
      interestRate: Number(body.interestRate),
      loanTermYears: Number(body.loanTermYears || 30),
      targetHousingDtiPct: body.targetHousingDtiPct ? Number(body.targetHousingDtiPct) : undefined,
      targetMaxDtiPct: body.targetMaxDtiPct ? Number(body.targetMaxDtiPct) : undefined,
    });

    const result = calculateAffordability(validated);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid affordability request';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
