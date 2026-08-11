import { NextRequest, NextResponse } from 'next/server';

import { calculateMortgage } from '@/lib/mortgage/calculator';
import { CalculationInput } from '@/lib/mortgage/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload: CalculationInput = {
      countryCode: body.countryCode || body.country || 'US',
      propertyPrice: Number(body.propertyPrice),
      downPayment: Number(body.downPayment),
      interestRate: Number(body.interestRate),
      loanTermYears: Number(body.loanTermYears),
      paymentFrequency: body.paymentFrequency || 'monthly',
      startDate: body.startDate,
      extraPayments: body.extraPayments || [],
    };

    const result = calculateMortgage(payload);

    return NextResponse.json({
      success: true,
      amortization: result.amortizationSchedule,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid amortization request';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
