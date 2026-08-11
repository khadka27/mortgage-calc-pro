'use client';

import { Calculator, DollarSign, Home, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggleButton } from '@/components/ThemeProvider';
import { APP_NAME } from '@/lib/env';

interface HeaderProps {
  activeTab: 'calculator' | 'affordability' | 'refinance';
  setActiveTab: (tab: 'calculator' | 'affordability' | 'refinance') => void;
  countryName: string;
  currencySymbol: string;
}

export default function Header({
  activeTab,
  setActiveTab,
  countryName,
  currencySymbol,
}: HeaderProps) {
  const tabClass = (tab: string) =>
    `flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
      activeTab === tab
        ? 'bg-emerald-500 dark:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/25'
        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
    }`;

  const mobileTabClass = (tab: string) =>
    `flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
      activeTab === tab
        ? 'bg-emerald-500 text-white font-semibold'
        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-zinc-900'
    }`;

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md shadow-sm border-b"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-card) 95%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <Home className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {APP_NAME.replace(' Global', '')}
              </span>
              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tracking-widest">
                GLOBAL
              </span>
            </div>
          </Link>

          {/* Mode Switcher Tabs — desktop */}
          <nav
            className="hidden md:flex items-center gap-0.5 p-1.5 rounded-xl border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            <button id="tab-calculator" onClick={() => setActiveTab('calculator')} className={tabClass('calculator')}>
              <Calculator className="w-4 h-4" />
              Mortgage Calculator
            </button>
            <button id="tab-affordability" onClick={() => setActiveTab('affordability')} className={tabClass('affordability')}>
              <DollarSign className="w-4 h-4" />
              Affordability
            </button>
            <button id="tab-refinance" onClick={() => setActiveTab('refinance')} className={tabClass('refinance')}>
              <RefreshCw className="w-4 h-4" />
              Refinance
            </button>
          </nav>

          {/* Right side: country badge + theme toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{countryName}</span>
              <span className="font-bold text-emerald-500">({currencySymbol})</span>
            </div>
            <ThemeToggleButton />
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div
          className="flex md:hidden border-t py-2 gap-1 overflow-x-auto"
          style={{ borderColor: 'var(--border)' }}
        >
          <button id="tab-calculator-mobile" onClick={() => setActiveTab('calculator')} className={mobileTabClass('calculator')}>
            <Calculator className="w-3.5 h-3.5" />
            Mortgage
          </button>
          <button id="tab-affordability-mobile" onClick={() => setActiveTab('affordability')} className={mobileTabClass('affordability')}>
            <DollarSign className="w-3.5 h-3.5" />
            Affordability
          </button>
          <button id="tab-refinance-mobile" onClick={() => setActiveTab('refinance')} className={mobileTabClass('refinance')}>
            <RefreshCw className="w-3.5 h-3.5" />
            Refinance
          </button>
        </div>
      </div>
    </header>
  );
}
