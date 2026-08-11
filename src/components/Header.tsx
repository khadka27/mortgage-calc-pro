'use client';

import { Calculator, DollarSign, Globe, Home, Menu, RefreshCw, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'calculator' as const, label: 'Mortgage', fullLabel: 'Mortgage Calculator', icon: Calculator },
    { id: 'affordability' as const, label: 'Affordability', fullLabel: 'Home Affordability', icon: DollarSign },
    { id: 'refinance' as const, label: 'Refinance', fullLabel: 'Refinance Comparison', icon: RefreshCw },
  ];

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md shadow-sm border-b transition-colors"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-card) 92%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {APP_NAME.replace(' Global', '')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tracking-widest uppercase">
                Global
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav
            className="hidden md:flex items-center gap-1 p-1 rounded-xl border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            {navItems.map(({ id, fullLabel, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#10b981' : undefined,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.25)' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {fullLabel}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Country Badge, Theme Toggle & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Country Pill */}
            <div
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border font-medium"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="hidden sm:inline font-medium">{countryName}</span>
              <span className="font-bold text-emerald-500">({currencySymbol})</span>
            </div>

            <ThemeToggleButton />

            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border transition-colors"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Segmented Control Bar */}
        <div className="md:hidden border-t py-1.5" style={{ borderColor: 'var(--border)' }}>
          <nav
            className="flex items-center gap-1 p-1 rounded-xl border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}-mobile`}
                  onClick={() => {
                    setActiveTab(id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-semibold rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#10b981' : undefined,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t py-4 px-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="text-xs font-bold uppercase tracking-wider px-2" style={{ color: 'var(--text-muted)' }}>
              Calculator Modes & Tools
            </div>
            <div className="space-y-1">
              {navItems.map(({ id, fullLabel, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveTab(id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-bg)' : 'var(--bg-subtle)',
                      borderColor: isActive ? 'var(--accent-border)' : 'var(--border)',
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{fullLabel}</span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t flex items-center justify-between px-2 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Selected: <strong style={{ color: 'var(--text-primary)' }}>{countryName}</strong></span>
              </div>
              <span className="font-mono text-[11px] font-bold text-emerald-500">{currencySymbol}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
