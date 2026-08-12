/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { CalculationInput, CalculationResult, CountryConfig } from '@/lib/mortgage/types';

interface GeneratePdfOptions {
  input: CalculationInput;
  result: CalculationResult;
  country: CountryConfig;
  appName?: string;
}

export function generateMortgagePdfReport({
  input,
  result,
  country,
  appName = 'MortgagePro Global',
}: GeneratePdfOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const currencyCode = result.currencyCode;
  const freqLabel = result.paymentFrequency.charAt(0).toUpperCase() + result.paymentFrequency.slice(1);

  // Theme Palette Colors for PDF
  const primaryColor: [number, number, number] = [16, 185, 129]; // Emerald 500
  const darkColor: [number, number, number] = [15, 23, 42];      // Slate 900
  const mutedColor: [number, number, number] = [100, 116, 139];   // Slate 500
  const lightBg: [number, number, number] = [248, 250, 252];     // Slate 50

  // 1. Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(appName, 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text(`Official Mortgage Calculation Report — ${country.countryName}`, 14, 22);

  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${dateStr}`, 196, 15, { align: 'right' });

  let y = 36;

  // 2. Main Payment Summary Hero Box
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...mutedColor);
  doc.text(`ESTIMATED ${freqLabel.toUpperCase()} HOUSING PAYMENT`, 20, y + 8);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(formatCurrency(result.totalPeriodicPayment, currencyCode), 20, y + 19);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`LTV Ratio: ${result.ltvRatio.toFixed(1)}%`, 186, y + 15, { align: 'right' });

  y += 34;

  // 3. Section: Loan Parameters & Totals (2-column layout)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Loan Parameters & Totals', 14, y);
  y += 4;

  const leftParams = [
    ['Property Purchase Price:', formatCurrency(input.propertyPrice, currencyCode)],
    ['Down Payment Amount:', `${formatCurrency(input.downPayment, currencyCode)} (${((input.downPayment / (input.propertyPrice || 1)) * 100).toFixed(1)}%)`],
    ['Calculated Loan Amount:', formatCurrency(result.loanAmount, currencyCode)],
    ['Annual Interest Rate:', `${input.interestRate}%`],
    ['Loan Term:', `${input.loanTermYears} Years`],
    ['Payment Frequency:', freqLabel],
  ];

  const rightParams = [
    ['Total Principal Paid:', formatCurrency(result.totalPrincipalPaid, currencyCode)],
    ['Total Interest Paid:', formatCurrency(result.totalInterestPaid, currencyCode)],
    ['Total Cost of Loan:', formatCurrency(result.totalCostOfLoan, currencyCode)],
    ['Estimated Payoff Date:', result.payoffDate],
    ['Housing DTI Ratio:', result.housingDti ? `${result.housingDti}%` : 'N/A'],
    ['Total DTI Ratio:', result.totalDti ? `${result.totalDti}%` : 'N/A'],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Input Parameter', 'Value']],
    body: leftParams,
    margin: { left: 14, right: 108 },
    styles: { fontSize: 8.5, cellPadding: 2 },
    headStyles: { fillColor: darkColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 0: { fontStyle: 'normal' }, 1: { fontStyle: 'bold', halign: 'right' } },
  });

  autoTable(doc, {
    startY: y,
    head: [['Loan Overview Item', 'Value']],
    body: rightParams,
    margin: { left: 108, right: 14 },
    styles: { fontSize: 8.5, cellPadding: 2 },
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 0: { fontStyle: 'normal' }, 1: { fontStyle: 'bold', halign: 'right' } },
  });

  // Get position after the tables
  const lastTable = (doc as any).lastAutoTable;
  y = lastTable.finalY + 10;

  // 4. Section: Periodic Payment Breakdown Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(`${freqLabel} Payment Breakdown`, 14, y);
  y += 4;

  const breakdownRows = [
    ['Principal & Interest', formatCurrency(result.periodicPrincipalAndInterest, currencyCode)],
    ['Property Tax', formatCurrency(result.periodicPropertyTax, currencyCode)],
    ['Homeowner Insurance', formatCurrency(result.periodicHomeInsurance, currencyCode)],
    ...(result.periodicMortgageInsurance > 0
      ? [['Mortgage Insurance (PMI/CMHC)', formatCurrency(result.periodicMortgageInsurance, currencyCode)]]
      : []),
    ...(result.periodicHoa > 0
      ? [['HOA / Maintenance Fees', formatCurrency(result.periodicHoa, currencyCode)]]
      : []),
    ['Total Periodic Housing Payment', formatCurrency(result.totalPeriodicPayment, currencyCode)],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Expense Component', 'Amount']],
    body: breakdownRows,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    headStyles: { fillColor: darkColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { fontStyle: 'normal' },
      1: { fontStyle: 'bold', halign: 'right' },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // 5. Section: Amortization Schedule Preview (First 24 payments)
  if (result.amortizationSchedule && result.amortizationSchedule.rows.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text(`Amortization Schedule Preview (First 24 Payments)`, 14, y);
    y += 4;

    const scheduleRows = result.amortizationSchedule.rows.slice(0, 24).map((r) => [
      r.paymentNumber.toString(),
      r.paymentDate,
      formatCurrency(r.beginningBalance, currencyCode),
      formatCurrency(r.payment, currencyCode),
      formatCurrency(r.principal, currencyCode),
      formatCurrency(r.interest, currencyCode),
      formatCurrency(r.endingBalance, currencyCode),
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Date', 'Beg. Balance', 'Payment', 'Principal', 'Interest', 'End Balance']],
      body: scheduleRows,
      margin: { left: 14, right: 14 },
      styles: { fontSize: 7.5, cellPadding: 1.8 },
      headStyles: { fillColor: darkColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'left' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold' },
        4: { halign: 'right', textColor: [16, 185, 129] },
        5: { halign: 'right', textColor: [245, 158, 11] },
        6: { halign: 'right' },
      },
    });
  }

  // 6. Footer Disclaimer on Page
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(
      `Disclaimer: Estimations for educational/planning purposes only. Created with ${appName}.`,
      14,
      287
    );
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' });
  }

  // Save the PDF file
  const fileName = `Mortgage_Report_${country.countryCode}_${input.propertyPrice}.pdf`;
  doc.save(fileName);
}
