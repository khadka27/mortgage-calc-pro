'use client';

import { Download, Search } from 'lucide-react';
import { useState } from 'react';

import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { AmortizationSummary } from '@/lib/mortgage/types';

interface AmortizationTableProps {
  summary: AmortizationSummary;
  currencyCode: string;
  currencySymbol: string;
}

export default function AmortizationTable({
  summary,
  currencyCode,
  currencySymbol,
}: AmortizationTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Show 1 year per page

  const filteredRows = summary.rows.filter(
    (r) =>
      r.paymentNumber.toString().includes(search) ||
      r.paymentDate.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV Export handler
  const exportToCSV = () => {
    const headers = [
      'Payment #',
      'Date',
      'Beginning Balance',
      'Scheduled Payment',
      'Principal',
      'Interest',
      'Extra Payment',
      'Ending Balance',
      'Cumulative Interest',
      'Cumulative Principal',
    ];

    const rows = summary.rows.map((r) => [
      r.paymentNumber,
      r.paymentDate,
      r.beginningBalance.toFixed(2),
      r.payment.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.extraPayment.toFixed(2),
      r.endingBalance.toFixed(2),
      r.cumulativeInterest.toFixed(2),
      r.cumulativePrincipal.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mortgage_Amortization_Schedule_${currencyCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Amortization Schedule
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-normal">
              {summary.totalPayments} Total Payments
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Complete period-by-period breakdown of principal reduction and interest accumulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search year/date..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-48"
            />
          </div>

          {/* Download CSV Button */}
          <button
            type="button"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
            <tr>
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Beginning Balance</th>
              <th className="py-3 px-3">Total Payment</th>
              <th className="py-3 px-3 text-emerald-400">Principal</th>
              <th className="py-3 px-3 text-amber-400">Interest</th>
              <th className="py-3 px-3 text-cyan-400">Extra Paid</th>
              <th className="py-3 px-3">Ending Balance</th>
              <th className="py-3 px-3">Cumul. Interest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-zinc-500 font-sans">
                  No amortization rows found matching search criteria.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.paymentNumber} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-400">{row.paymentNumber}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{row.paymentDate}</td>
                  <td className="py-2.5 px-3">{formatCurrency(row.beginningBalance, currencyCode)}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {formatCurrency(row.payment, currencyCode)}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                    {formatCurrency(row.principal, currencyCode)}
                  </td>
                  <td className="py-2.5 px-3 text-amber-400">
                    {formatCurrency(row.interest, currencyCode)}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400">
                    {row.extraPayment > 0 ? formatCurrency(row.extraPayment, currencyCode) : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-200">
                    {formatCurrency(row.endingBalance, currencyCode)}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    {formatCurrency(row.cumulativeInterest, currencyCode)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
        <div>
          Showing page <span className="text-white font-bold">{currentPage}</span> of{' '}
          <span className="text-white font-bold">{totalPages}</span> ({filteredRows.length} rows)
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            Prev
          </button>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
