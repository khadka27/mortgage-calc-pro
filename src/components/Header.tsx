'use client';

import { Calculator, DollarSign, Home, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

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
  return (
    <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-zinc-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                MortgagePro
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GLOBAL
              </span>
            </div>
          </Link>

          {/* Mode Switcher Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Mortgage Calculator
            </button>

            <button
              onClick={() => setActiveTab('affordability')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'affordability'
                  ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Affordability
            </button>

            <button
              onClick={() => setActiveTab('refinance')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'refinance'
                  ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Refinance
            </button>
          </nav>

          {/* Selected Country Badge */}
          <div className="flex items-center gap-2 text-xs sm:text-sm bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-300 font-medium">{countryName}</span>
            <span className="font-bold text-emerald-400 ml-1">({currencySymbol})</span>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-zinc-800 py-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-emerald-500 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Mortgage
          </button>
          <button
            onClick={() => setActiveTab('affordability')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'affordability'
                ? 'bg-emerald-500 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Affordability
          </button>
          <button
            onClick={() => setActiveTab('refinance')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'refinance'
                ? 'bg-emerald-500 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refinance
          </button>
        </div>
      </div>
    </header>
  );
}
