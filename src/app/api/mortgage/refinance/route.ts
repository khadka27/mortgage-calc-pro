import { NextRequest, NextResponse } from 'next/server';

import { calculateRefinance } from '@/lib/mortgage/refinance';
import { RefinanceInputSchema } from '@/lib/mortgage/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RefinanceInputSchema.parse({
      countryCode: body.countryCode || body.country || 'US',
      currentLoanBalance: Number(body.currentLoanBalance),
      currentInterestRate: Number(body.currentInterestRate),
      currentMonthlyPayment: Number(body.currentMonthlyPayment),
      remainingTermMonths: Number(body.remainingTermMonths),
      newInterestRate: Number(body.newInterestRate),
      newLoanTermYears: Number(body.newLoanTermYears),
      closingCosts: Number(body.closingCosts || 0),
    });

    const result = calculateRefinance(validated);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid refinance request';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
