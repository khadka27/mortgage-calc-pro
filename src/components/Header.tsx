'use client';

import { Activity, Calculator, DollarSign, Globe, Home, Layers, Menu, PanelLeftClose, PanelLeftOpen, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CountrySelectorModal from '@/components/CountrySelectorModal';
import SidebarNav from '@/components/SidebarNav';
import { ThemeToggleButton } from '@/components/ThemeProvider';
import { APP_NAME } from '@/lib/env';

interface HeaderProps {
  activeTab?: 'calculator' | 'affordability' | 'refinance';
  setActiveTab?: (tab: 'calculator' | 'affordability' | 'refinance') => void;
  countryName: string;
  currencySymbol: string;
  onSelectCountry?: (country: any) => void;
}

export default function Header({
  activeTab = 'calculator',
  setActiveTab,
  countryName,
  currencySymbol,
  onSelectCountry,
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const mainNavItems = [
    { id: 'calculator' as const, label: 'Mortgage Calcs', icon: Calculator, href: '/?tab=calculator' },
    { id: 'refinance' as const, label: 'Refinance', icon: RefreshCw, href: '/?tab=refinance' },
    { id: 'affordability' as const, label: 'Affordability', icon: DollarSign, href: '/?tab=affordability' },
  ];

  const quickLinks = [
    { label: 'Live Rates', href: '/live-rates', icon: Activity },
    { label: 'HELOC', href: '/heloc', icon: Calculator },
    { label: 'Global Hub', href: '/mortgage-calculator', icon: Globe },
  ];

  const handleTabClick = (id: 'calculator' | 'affordability' | 'refinance', href: string) => {
    if (setActiveTab) {
      setActiveTab(id);
    } else {
      router.push(href);
    }
  };

  return (
    <>
      {/* Collapsible Tool Drawer Sidebar */}
      <SidebarNav isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Interactive Country Switcher Popup Modal */}
      <CountrySelectorModal
        isOpen={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        onSelectCountry={onSelectCountry}
      />

      <header className="w-full sticky top-0 z-40 shadow-sm transition-colors border-b" style={{ borderColor: 'var(--border)' }}>
        {/* Top Header Bar — Main Logo & Controls */}
        <div
          className="backdrop-blur-md border-b transition-colors"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg-card) 95%, transparent)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Sidebar Toggle Button + Country Selector Badge Popup Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                title="Toggle All Mortgage Tools Sidebar"
              >
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                <span className="hidden sm:inline">All Tools</span>
              </button>

              <button
                type="button"
                onClick={() => setCountryModalOpen(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 hover:border-emerald-500/50 cursor-pointer"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                title="Click to Switch Country"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{countryName}</span>
                <span className="font-bold text-emerald-500 font-mono">({currencySymbol})</span>
              </button>
            </div>

            {/* Center: Large Brand Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Mortgage<span className="text-emerald-500">Calculator</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tracking-widest uppercase">
                  Pro
                </span>
              </div>
            </Link>

            {/* Right: Theme Toggle & Mobile Menu Trigger */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggleButton />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border transition-colors"
                style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navbar Bar */}
        <nav className="bg-slate-900 dark:bg-zinc-950 text-slate-100 border-b border-slate-800 dark:border-zinc-800 py-2.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs font-bold tracking-wide">
            {/* Main Mode Tabs */}
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTabClick(item.id, item.href)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                  <span className="text-slate-600 font-normal">+</span>
                </div>
              );
            })}

            {/* Additional Quick Navigation Links */}
            {quickLinks.map((link, idx) => (
              <div key={link.label} className="flex items-center gap-3">
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 dark:hover:bg-zinc-800 rounded-lg transition-all"
                >
                  <link.icon className="w-3.5 h-3.5 text-emerald-400" />
                  {link.label}
                </Link>
                {idx < quickLinks.length - 1 && <span className="text-slate-600 font-normal">+</span>}
              </div>
            ))}
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-b p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Calculator Modes
            </div>
            <div className="space-y-1.5">
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleTabClick(item.id, item.href);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-bg)' : 'var(--bg-subtle)',
                      borderColor: isActive ? 'var(--accent-border)' : 'var(--border)',
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-bold uppercase tracking-wider pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Quick Links
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <link.icon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
