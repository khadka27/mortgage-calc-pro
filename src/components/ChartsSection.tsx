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

import { useTheme } from '@/components/ThemeProvider';
import { formatCurrency } from '@/lib/mortgage/decimalUtils';
import { CalculationResult } from '@/lib/mortgage/types';

interface ChartsSectionProps {
  result: CalculationResult;
}

type ChartType = 'pie' | 'balance' | 'breakdown' | 'annual' | 'cumulative';

const CHART_TABS: { id: ChartType; label: string }[] = [
  { id: 'pie', label: 'Principal vs Interest' },
  { id: 'balance', label: 'Balance Curve' },
  { id: 'breakdown', label: 'Payment Breakdown' },
  { id: 'annual', label: 'Annual P&I' },
  { id: 'cumulative', label: 'Cumulative Interest' },
];

export default function ChartsSection({ result }: ChartsSectionProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('pie');
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const tooltipStyle = {
    backgroundColor: isDark ? '#18181b' : '#ffffff',
    borderColor: isDark ? '#3f3f46' : '#e2e8f0',
    borderRadius: 10,
    color: isDark ? '#f4f4f5' : '#0f172a',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    border: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}`,
  };

  const axisColor = isDark ? '#71717a' : '#94a3b8';
  const gridColor = isDark ? '#27272a' : '#f1f5f9';

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

  const pieData = [
    { name: 'Principal Paid', value: totalPrincipalPaid, color: '#10b981' },
    { name: 'Interest Paid', value: totalInterestPaid, color: '#f59e0b' },
  ];

  const breakdownData = [
    { name: 'Principal & Interest', value: periodicPrincipalAndInterest, color: '#10b981' },
    { name: 'Property Tax', value: periodicPropertyTax, color: '#2dd4bf' },
    { name: 'Home Insurance', value: periodicHomeInsurance, color: '#38bdf8' },
    ...(periodicMortgageInsurance > 0
      ? [{ name: 'Mortgage Insurance', value: periodicMortgageInsurance, color: '#fbbf24' }]
      : []),
    ...(periodicHoa > 0 ? [{ name: 'HOA / Fees', value: periodicHoa, color: '#c084fc' }] : []),
  ];

  const rows = amortizationSchedule.rows;
  const yearlyDataMap: Record<number, { year: number; principalPaidYear: number; interestPaidYear: number; endingBalance: number; cumulativeInterest: number }> = {};

  rows.forEach((row, idx) => {
    const dateYear = new Date(row.paymentDate).getFullYear() || idx + 1;
    if (!yearlyDataMap[dateYear]) {
      yearlyDataMap[dateYear] = { year: dateYear, principalPaidYear: 0, interestPaidYear: 0, endingBalance: row.endingBalance, cumulativeInterest: row.cumulativeInterest };
    }
    yearlyDataMap[dateYear].principalPaidYear += row.principal + row.extraPayment;
    yearlyDataMap[dateYear].interestPaidYear += row.interest;
    yearlyDataMap[dateYear].endingBalance = row.endingBalance;
    yearlyDataMap[dateYear].cumulativeInterest = row.cumulativeInterest;
  });

  const timelineData = Object.values(yearlyDataMap);

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tabBarStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };

  const tabCls = (id: ChartType) =>
    `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
      activeChart === id
        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
        : ''
    }`;
  const tabStyle = (id: ChartType): React.CSSProperties =>
    activeChart !== id ? { color: 'var(--text-muted)' } : {};

  return (
    <div className="border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5" style={cardStyle}>
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Financial Visualizations</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Interactive charts — loan breakdown, equity build-up, and interest cost.
          </p>
        </div>

        <div
          className="flex items-center gap-0.5 p-1 rounded-xl border overflow-x-auto w-full sm:w-auto"
          style={tabBarStyle}
        >
          {CHART_TABS.map(({ id, label }) => (
            <button
              key={id}
              id={`chart-tab-${id}`}
              onClick={() => setActiveChart(id)}
              className={tabCls(id)}
              style={tabStyle(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        {activeChart === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), '']}
                contentStyle={tooltipStyle}
              />
              <Legend formatter={(val) => <span style={{ fontSize: 12, color: isDark ? '#d4d4d8' : '#334155' }}>{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'balance' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={isDark ? 0.35 : 0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), 'Remaining Balance']}
                contentStyle={tooltipStyle}
              />
              <Area type="monotone" dataKey="endingBalance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#balanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'breakdown' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownData} layout="vertical">
              <XAxis type="number" stroke={axisColor} fontSize={11} tickFormatter={(v) => `${v}`} />
              <YAxis type="category" dataKey="name" stroke={axisColor} fontSize={11} width={140} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), 'Amount']}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {breakdownData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'annual' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData}>
              <XAxis dataKey="year" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), '']}
                contentStyle={tooltipStyle}
              />
              <Legend formatter={(val) => <span style={{ fontSize: 12, color: isDark ? '#d4d4d8' : '#334155' }}>{val}</span>} />
              <Bar dataKey="principalPaidYear" name="Principal Paid" fill="#10b981" stackId="a" />
              <Bar dataKey="interestPaidYear" name="Interest Paid" fill="#f59e0b" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'cumulative' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="year" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val) || 0, currencyCode), 'Cumulative Interest']}
                contentStyle={tooltipStyle}
              />
              <Line type="monotone" dataKey="cumulativeInterest" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
