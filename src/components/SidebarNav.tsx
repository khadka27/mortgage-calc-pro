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

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity md:hidden"
        />
      )}

      {/* 1. COLLAPSED VERTICAL ICON RAIL (Pin on left edge matching user screenshot) */}
      {!isOpen && (
        <aside
          className="hidden md:flex fixed top-24 left-3 z-30 flex-col items-center gap-2.5 p-2 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-200"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg-card) 92%, transparent)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Expand Drawer Button */}
          <button
            type="button"
            onClick={onToggle}
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 transition-transform hover:scale-105 group relative"
            title="Expand All Tools Drawer"
          >
            <PanelLeftOpen className="w-5 h-5" />
            <span className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Expand All Tools
            </span>
          </button>

          <div className="w-6 h-[1px] bg-slate-200 dark:bg-zinc-800 my-0.5" />

          {/* Quick Vertical Icon Buttons (matching screenshot circles) */}
          {COLLAPSED_SHORTCUTS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group
                  ${isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 border border-slate-200/50 dark:border-zinc-800'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="absolute left-14 bg-slate-900 dark:bg-zinc-950 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-slate-800 z-50">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </aside>
      )}

      {/* 2. EXPANDED DRAWER SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw]
          bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800
          shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                All Mortgage Tools
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                20+ Specialized Calculators
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-zinc-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search calculator tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Tools List Accordion */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredTools.map((cat) => {
            const isCatOpen = openCategories[cat.category] ?? true;
            return (
              <div key={cat.category} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.category)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <cat.icon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cat.category}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isCatOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isCatOpen && (
                  <div className="pl-2 space-y-0.5 border-l-2 border-slate-200 dark:border-zinc-800 ml-3">
                    {cat.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => {
                            if (window.innerWidth < 768) onToggle();
                          }}
                          className={`
                            group flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all duration-150
                            ${isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                            }
                          `}
                        >
                          <item.icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500 group-hover:scale-110 transition-transform" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate">{item.title}</span>
                              {item.badge && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">
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

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950/50 flex items-center justify-between">
          <span>MortgagePro Global</span>
          <span className="font-bold text-emerald-500">v2.5</span>
        </div>
      </aside>
    </>
  );
}
