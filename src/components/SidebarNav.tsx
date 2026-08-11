'use client';

import {
  Activity,
  BadgePercent,
  Building,
  Calculator,
  ChevronDown,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  Globe,
  Home,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Receipt,
  RefreshCw,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

export interface ToolCategory {
  category: string;
  icon: any;
  items: {
    title: string;
    href: string;
    icon: any;
    badge?: string;
    description: string;
  }[];
}

export const ALL_MORTGAGE_TOOLS: ToolCategory[] = [
  {
    category: 'Current Mortgage Rates',
    icon: Activity,
    items: [
      { title: 'Live Rates Feed', href: '/live-rates', icon: Activity, badge: 'Live API', description: 'Real-time US lender rates & benchmarks' },
      { title: 'Lender Comparison', href: '/#lenders', icon: Building, badge: 'Marketplace', description: 'Compare verified lender quotes' },
    ],
  },
  {
    category: 'Refinancing Tools',
    icon: RefreshCw,
    items: [
      { title: 'Refinance Calculator', href: '/?tab=refinance', icon: RefreshCw, description: 'Calculate monthly & lifetime refinance savings' },
      { title: 'HELOC Calculator', href: '/heloc', icon: Wallet, badge: 'Popular', description: 'Home Equity Line of Credit payment estimator' },
    ],
  },
  {
    category: 'Mortgage Tools',
    icon: Calculator,
    items: [
      { title: 'Payment Calculator', href: '/', icon: Calculator, description: 'Master multi-currency mortgage calculator' },
      { title: 'Real APR & Fees', href: '/apr', icon: BadgePercent, description: 'Calculate true APR inclusive of closing costs' },
      { title: 'PMI vs 2nd Mortgage', href: '/pmi-vs-2nd', icon: Scale, description: 'Compare PMI vs 80-10-10 piggyback loan' },
      { title: 'Remaining Principal', href: '/remaining-balance', icon: Layers, description: 'Calculate balance at any future year' },
      { title: 'Cost Per Thousand', href: '/cost-per-thousand', icon: Receipt, description: 'Quick monthly cost factor per $1,000 borrowed' },
    ],
  },
  {
    category: 'Loan Qualification & Affordability',
    icon: DollarSign,
    items: [
      { title: 'Home Affordability', href: '/?tab=affordability', icon: Home, description: 'Maximum home purchase price based on DTI' },
      { title: 'Income Requirements', href: '/income-requirements', icon: Wallet, description: 'Required annual income for target home price' },
      { title: 'FHA Loan Qualification', href: '/fha-qualification', icon: ShieldAlert, description: '3.5% down FHA debt ratio test' },
    ],
  },
  {
    category: 'Loan Comparison Tools',
    icon: Scale,
    items: [
      { title: 'Rent vs Buy', href: '/rent-vs-buy', icon: Scale, badge: 'Essential', description: 'Compare total wealth outcome over 10-30 years' },
      { title: 'Mortgage Points', href: '/mortgage-points', icon: BadgePercent, description: 'Discount points breakeven calculation' },
      { title: 'Loan Term Compare', href: '/loan-term-compare', icon: Layers, description: '15-Yr vs 30-Yr fixed payment contrast' },
    ],
  },
  {
    category: 'Money Saving Tools',
    icon: TrendingDown,
    items: [
      { title: 'Bi-weekly Payments', href: '/biweekly', icon: TrendingDown, badge: 'Save Interest', description: 'Accelerated 26-half payment payoff' },
      { title: 'Extra Payment Simulator', href: '/#extra-payments', icon: Sparkles, description: 'Custom lump sum & monthly extra payment analysis' },
      { title: 'Mortgage Tax Benefits', href: '/tax-savings', icon: FileSpreadsheet, description: 'Estimate annual mortgage interest tax deduction' },
    ],
  },
  {
    category: 'Interest Only Loans',
    icon: PieChart,
    items: [
      { title: 'Interest Only Loans', href: '/interest-only', icon: PieChart, description: 'Interest-only period payment breakdown' },
    ],
  },
  {
    category: 'Specialized & Credit Tools',
    icon: CreditCard,
    items: [
      { title: 'Reverse Mortgages', href: '/reverse-mortgage', icon: Home, description: 'HECM equity conversion for seniors 62+' },
      { title: 'Credit Card Payoff', href: '/credit-card-payoff', icon: CreditCard, description: 'Card debt payoff timeline & interest savings' },
      { title: 'Canadian Mortgages', href: '/mortgage-calculator/ca', icon: Globe, badge: 'Canada', description: 'Semi-annual compounding CMHC mortgage rule engine' },
    ],
  },
];

const COLLAPSED_SHORTCUTS = [
  { title: 'Mortgage Calculator', href: '/', icon: Calculator },
  { title: 'Refinance', href: '/?tab=refinance', icon: RefreshCw },
  { title: 'Affordability', href: '/?tab=affordability', icon: DollarSign },
  { title: 'Live Rates', href: '/live-rates', icon: Activity },
  { title: 'HELOC', href: '/heloc', icon: Wallet },
  { title: 'Rent vs Buy', href: '/rent-vs-buy', icon: Scale },
  { title: 'Canadian Rules', href: '/mortgage-calculator/ca', icon: Globe },
];

interface SidebarNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarNav({ isOpen, onToggle }: SidebarNavProps) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Current Mortgage Rates': true,
    'Refinancing Tools': true,
    'Mortgage Tools': true,
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredTools = useMemo(() => {
    if (!search.trim()) return ALL_MORTGAGE_TOOLS;
    const q = search.toLowerCase();
    return ALL_MORTGAGE_TOOLS.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <>
      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Floating Morphing Sidebar Panel */}
      <aside
        className={`
          hidden md:flex fixed top-[118px] left-4 z-50 flex-col rounded-3xl border shadow-2xl backdrop-blur-md
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-80 max-h-[calc(100vh-140px)]' : 'w-14 h-auto'}
        `}
        style={cardStyle}
      >
        {/* COLLAPSED STATE (w-14) */}
        {!isOpen && (
          <div className="p-2 flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={onToggle}
              className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 transition-transform hover:scale-105 group relative"
              title="Expand All Tools Panel"
            >
              <PanelLeftOpen className="w-5 h-5" />
              <span className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
                Expand All Tools
              </span>
            </button>

            <div className="w-6 h-[1px] my-0.5" style={{ backgroundColor: 'var(--border)' }} />

            {COLLAPSED_SHORTCUTS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 relative group border"
                  style={{
                    backgroundColor: isActive ? '#10b981' : 'var(--bg-subtle)',
                    borderColor: isActive ? '#10b981' : 'var(--border)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="absolute left-14 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* EXPANDED STATE (w-80) */}
        {isOpen && (
          <div className="flex flex-col h-full max-h-[calc(100vh-120px)] animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between gap-3 shrink-0" style={tileStyle}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    All Mortgage Tools
                  </h2>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    20+ Specialized Calculators
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 rounded-xl border transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                title="Collapse Panel"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search calculator tools…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  style={inputStyle}
                  autoFocus
                />
              </div>
            </div>

            {/* Tools List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {filteredTools.map((cat) => {
                const isCatOpen = openCategories[cat.category] ?? true;
                return (
                  <div key={cat.category} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.category)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{cat.category}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isCatOpen ? 'rotate-180' : ''
                        }`}
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </button>

                    {isCatOpen && (
                      <div className="pl-2 space-y-0.5 border-l-2 ml-3" style={{ borderColor: 'var(--border)' }}>
                        {cat.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={onToggle}
                              className="group flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all duration-150 border"
                              style={{
                                backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
                                borderColor: isActive ? 'var(--accent-border)' : 'transparent',
                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                              }}
                            >
                              <item.icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500 group-hover:scale-110 transition-transform" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="truncate font-semibold">{item.title}</span>
                                  {item.badge && (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t text-[11px] flex items-center justify-between shrink-0" style={{ ...tileStyle, color: 'var(--text-muted)' }}>
              <span>MortgagePro Global</span>
              <span className="font-bold text-emerald-500">v2.5</span>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE FULL DRAWER */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw]
          border-r shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={cardStyle}
      >
        <div className="p-4 border-b flex items-center justify-between gap-3" style={tileStyle}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">All Mortgage Tools</h2>
          </div>
          <button type="button" onClick={onToggle} className="p-1.5 rounded-xl border">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {ALL_MORTGAGE_TOOLS.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="text-xs font-bold p-1 text-emerald-500">{cat.category}</div>
              {cat.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onToggle}
                  className="flex items-center gap-2 p-2 text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <item.icon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
