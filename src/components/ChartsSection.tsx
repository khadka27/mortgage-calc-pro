'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { CalculationResult } from '@/lib/mortgage/types';

interface ChartsSectionProps {
  result: CalculationResult;
}

export default function ChartsSection({ result }: ChartsSectionProps) {
  const [activeChart, setActiveChart] = useState<
    'pie' | 'balance' | 'breakdown' | 'annual' | 'cumulative'
  >('pie');

  const {
    currencyCode,
    totalPrincipalPaid,
    totalInterestPaid,
    periodicPrincipalAndInterest,
    periodicPropertyTax,
    periodicHomeInsurance,
    periodicMortgageInsurance,
    periodicHoa,
    amortizationSchedule,
  } = result;

  // 1. Principal vs Interest Pie Data
  const pieData = [
    { name: 'Principal Paid', value: totalPrincipalPaid, color: '#10b981' },
    { name: 'Interest Paid', value: totalInterestPaid, color: '#f59e0b' },
  ];

  // 2. Breakdown Data
  const breakdownData = [
    { name: 'Principal & Interest', value: periodicPrincipalAndInterest, color: '#10b981' },
    { name: 'Property Tax', value: periodicPropertyTax, color: '#2dd4bf' },
    { name: 'Home Insurance', value: periodicHomeInsurance, color: '#38bdf8' },
    ...(periodicMortgageInsurance > 0
      ? [{ name: 'Mortgage Insurance (PMI)', value: periodicMortgageInsurance, color: '#fbbf24' }]
      : []),
    ...(periodicHoa > 0 ? [{ name: 'HOA / Fees', value: periodicHoa, color: '#c084fc' }] : []),
  ];

  // 3. Balance & Cumulative & Annual Data aggregated by Year from Amortization schedule
  const rows = amortizationSchedule.rows;
  const yearlyDataMap: Record<
    number,
    {
      year: number;
      principalPaidYear: number;
      interestPaidYear: number;
      endingBalance: number;
      cumulativeInterest: number;
    }
  > = {};

  rows.forEach((row, idx) => {
    const dateYear = new Date(row.paymentDate).getFullYear() || idx + 1;
    if (!yearlyDataMap[dateYear]) {
      yearlyDataMap[dateYear] = {
        year: dateYear,
        principalPaidYear: 0,
        interestPaidYear: 0,
        endingBalance: row.endingBalance,
        cumulativeInterest: row.cumulativeInterest,
      };
    }

    yearlyDataMap[dateYear].principalPaidYear += row.principal + row.extraPayment;
    yearlyDataMap[dateYear].interestPaidYear += row.interest;
    yearlyDataMap[dateYear].endingBalance = row.endingBalance;
    yearlyDataMap[dateYear].cumulativeInterest = row.cumulativeInterest;
  });

  const timelineData = Object.values(yearlyDataMap);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & Chart Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white">Financial Visualizations</h3>
          <p className="text-xs text-zinc-400">
            Interactive charts illustrating loan breakdown, equity build-up, and interest cost.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveChart('pie')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeChart === 'pie'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Principal vs Interest
          </button>

          <button
            onClick={() => setActiveChart('balance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeChart === 'balance'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Balance Curve
          </button>

          <button
            onClick={() => setActiveChart('breakdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeChart === 'breakdown'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Payment Breakdown
          </button>

          <button
            onClick={() => setActiveChart('annual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeChart === 'annual'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Annual P&I
          </button>

          <button
            onClick={() => setActiveChart('cumulative')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeChart === 'cumulative'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cumulative Interest
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        {activeChart === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), '']}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fff' }}
              />
              <Legend formatter={(val) => <span className="text-xs text-zinc-300 font-medium">{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'balance' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), 'Remaining Balance']}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fff' }}
              />
              <Area type="monotone" dataKey="endingBalance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#balanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'breakdown' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownData} layout="vertical">
              <XAxis type="number" stroke="#71717a" fontSize={11} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} width={130} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), 'Payment Component']}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {breakdownData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'annual' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), '']}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fff' }}
              />
              <Legend formatter={(val) => <span className="text-xs text-zinc-300 font-medium">{val}</span>} />
              <Bar dataKey="principalPaidYear" name="Principal Paid" fill="#10b981" stackId="a" />
              <Bar dataKey="interestPaidYear" name="Interest Paid" fill="#f59e0b" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'cumulative' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), 'Cumulative Interest']}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: 8, color: '#fff' }}
              />
              <Line type="monotone" dataKey="cumulativeInterest" stroke="#f59e0b" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
