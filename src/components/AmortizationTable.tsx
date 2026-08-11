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

export default function AmortizationTable({ summary, currencyCode, currencySymbol }: AmortizationTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredRows = summary.rows.filter(
    (r) =>
      r.paymentNumber.toString().includes(search) ||
      r.paymentDate.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportToCSV = () => {
    const headers = ['Payment #', 'Date', 'Beginning Balance', 'Scheduled Payment', 'Principal', 'Interest', 'Extra Payment', 'Ending Balance', 'Cumulative Interest', 'Cumulative Principal'];
    const rows = summary.rows.map((r) => [
      r.paymentNumber, r.paymentDate,
      r.beginningBalance.toFixed(2), r.payment.toFixed(2),
      r.principal.toFixed(2), r.interest.toFixed(2),
      r.extraPayment.toFixed(2), r.endingBalance.toFixed(2),
      r.cumulativeInterest.toFixed(2), r.cumulativePrincipal.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Mortgage_Amortization_${currencyCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const subtleStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };
  const theadStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };

  return (
    <div className="border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4" style={cardStyle}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Amortization Schedule
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full border"
              style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
            >
              {summary.totalPayments} payments
            </span>
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Period-by-period breakdown of principal reduction and interest accumulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search payment / date…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="rounded-xl pl-8 pr-3 py-1.5 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 w-36 sm:w-48"
              style={inputStyle}
            />
          </div>

          <button
            type="button"
            onClick={exportToCSV}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-left text-xs">
          <thead className="border-b uppercase font-semibold" style={{ ...theadStyle, borderColor: 'var(--border)' }}>
            <tr>
              {['#', 'Date', 'Beg. Balance', 'Payment', 'Principal', 'Interest', 'Extra Paid', 'End Balance', 'Cumul. Interest'].map((h, i) => (
                <th
                  key={h}
                  className="py-3 px-3 whitespace-nowrap"
                  style={{
                    color: h === 'Principal' ? '#10b981' : h === 'Interest' ? '#f59e0b' : h === 'Extra Paid' ? '#38bdf8' : 'var(--text-muted)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ color: 'var(--text-secondary)' }}>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No rows matching search criteria.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.paymentNumber}
                  className="border-b transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--text-muted)' }}>{row.paymentNumber}</td>
                  <td className="py-2.5 px-3">{row.paymentDate}</td>
                  <td className="py-2.5 px-3 font-mono">{formatCurrency(row.beginningBalance, currencyCode)}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(row.payment, currencyCode)}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold" style={{ color: '#10b981' }}>{formatCurrency(row.principal, currencyCode)}</td>
                  <td className="py-2.5 px-3 font-mono" style={{ color: '#f59e0b' }}>{formatCurrency(row.interest, currencyCode)}</td>
                  <td className="py-2.5 px-3 font-mono" style={{ color: '#38bdf8' }}>
                    {row.extraPayment > 0 ? formatCurrency(row.extraPayment, currencyCode) : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(row.endingBalance, currencyCode)}</td>
                  <td className="py-2.5 px-3 font-mono" style={{ color: 'var(--text-muted)' }}>{formatCurrency(row.cumulativeInterest, currencyCode)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
        <div>
          Page <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentPage}</span> of{' '}
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{totalPages}</span>{' '}
          ({filteredRows.length} rows)
        </div>
        <div className="flex items-center gap-1">
          {(['Prev', 'Next'] as const).map((label) => {
            const disabled = label === 'Prev' ? currentPage === 1 : currentPage === totalPages;
            return (
              <button
                key={label}
                type="button"
                disabled={disabled}
                onClick={() => setCurrentPage((p) => label === 'Prev' ? Math.max(1, p - 1) : Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
