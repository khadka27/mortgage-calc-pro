import { NextRequest, NextResponse } from 'next/server';

import { calculateMortgage } from '@/lib/mortgage/calculator';
import { CalculationInput } from '@/lib/mortgage/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Map payload field aliases if needed (e.g. country -> countryCode, propertyTax -> propertyTaxAnnual)
    const payload: CalculationInput = {
      countryCode: body.countryCode || body.country || 'US',
      propertyPrice: Number(body.propertyPrice),
      downPayment: Number(body.downPayment),
      interestRate: Number(body.interestRate),
      loanTermYears: Number(body.loanTermYears),
      paymentFrequency: body.paymentFrequency || 'monthly',
      mortgageTypeId: body.mortgageTypeId,
      startDate: body.startDate,
      propertyTaxAnnual: body.propertyTaxAnnual !== undefined ? Number(body.propertyTaxAnnual) : (body.propertyTax !== undefined ? Number(body.propertyTax) : undefined),
      homeInsuranceAnnual: body.homeInsuranceAnnual !== undefined ? Number(body.homeInsuranceAnnual) : (body.homeInsurance !== undefined ? Number(body.homeInsurance) : undefined),
      mortgageInsuranceMonthly: body.mortgageInsuranceMonthly !== undefined ? Number(body.mortgageInsuranceMonthly) : (body.mortgageInsurance !== undefined ? Number(body.mortgageInsurance) : undefined),
      hoaMonthly: body.hoaMonthly !== undefined ? Number(body.hoaMonthly) : (body.hoa !== undefined ? Number(body.hoa) : undefined),
      otherMonthlyCosts: Number(body.otherMonthlyCosts || 0),
      extraPayments: body.extraPayments || (body.extraPayment ? [{ amount: Number(body.extraPayment), type: 'monthly' }] : []),
      grossAnnualIncome: body.grossAnnualIncome ? Number(body.grossAnnualIncome) : undefined,
      otherMonthlyDebts: body.otherMonthlyDebts ? Number(body.otherMonthlyDebts) : undefined,
    };

    const result = calculateMortgage(payload);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid mortgage calculation request';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
