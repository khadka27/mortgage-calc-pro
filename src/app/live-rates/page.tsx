'use client';

import { Activity, ArrowRight, Building, CheckCircle2, Clock, Filter, Layers, RefreshCw, Search, ShieldCheck, Sparkles, TrendingDown, Wifi } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLiveRates, LiveMortgageRate } from '@/hooks/useLiveRates';
import { APP_NAME } from '@/lib/env';

export default function LiveRatesPage() {
  const { allRates, meta, loading, error, refetch } = useLiveRates();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'calculator' | 'affordability' | 'refinance'>('calculator');

  const filteredRates = useMemo(() => {
    return allRates.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.lowestInstitution && item.lowestInstitution.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allRates, selectedCategory, searchQuery]);

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        countryName="United States"
        currencySymbol="$"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div
          className="rounded-3xl p-6 sm:p-10 relative overflow-hidden border shadow-sm"
          style={{
            background: 'linear-gradient(135deg, var(--accent-bg) 0%, color-mix(in srgb, var(--accent-bg) 30%, var(--bg-card)) 100%)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div
            className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 rounded-full opacity-15 pointer-events-none"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }} />
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--accent)' }} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                Live Lender Benchmark Feed
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Updated hourly via rateapi.dev
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Live Interest Rates &amp; Lender Benchmarks
            </h1>

            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Transparent market data covering 3,300+ institutional US lenders, banks, and credit unions. Compare median rates, lowest APR offers, and active lender market counts in real-time.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t" style={{ borderColor: 'var(--accent-border)' }}>
            {[
              { label: 'Institutions Tracked', value: meta ? meta.totalInstitutions.toLocaleString() : '3,377+' },
              { label: 'Live Rates Analyzed', value: meta ? meta.totalRates.toLocaleString() : '58,499+' },
              { label: 'US States Covered', value: meta ? `${meta.statesCovered || 55} States` : '55 States' },
              { label: 'Data Source API', value: 'rateapi.dev' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-2xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 85%, transparent)', borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                <div className="text-sm sm:text-base font-black" style={{ color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border" style={cardStyle}>
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Benchmarks' },
              { id: 'mortgage', label: 'Mortgage & HELOC' },
              { id: 'auto', label: 'Auto & Vehicles' },
              { id: 'personal', label: 'Personal & Credit Cards' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
                style={selectedCategory !== cat.id ? { color: 'var(--text-secondary)' } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search benchmark product or institution…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl pl-9 pr-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <button
              type="button"
              onClick={refetch}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 shrink-0"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 rounded-2xl border p-6 animate-pulse" style={tileStyle} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 rounded-2xl border text-center space-y-3" style={cardStyle}>
            <Wifi className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Failed to load live benchmarks</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Benchmarks Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRates.map((rate) => {
              const isMortgage = rate.category === 'mortgage';

              return (
                <div
                  key={rate.productType}
                  className="border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-md relative overflow-hidden group"
                  style={cardStyle}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}>
                        {rate.category || 'Benchmark'}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {rate.count} lenders
                      </span>
                    </div>

                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {rate.displayName}
                    </h3>

                    {/* Median APR Hero */}
                    <div className="p-4 rounded-xl border" style={tileStyle}>
                      <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        US Median Benchmark APR
                      </div>
                      <div className="text-3xl font-black text-emerald-500">
                        {rate.medianApr.toFixed(2)}%
                      </div>
                      <div className="text-xs mt-1 flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Range: {rate.minApr.toFixed(2)}% – {rate.maxApr.toFixed(2)}%</span>
                      </div>
                    </div>

                    {/* Lowest Rate Institution */}
                    {rate.lowestInstitution && (
                      <div className="text-xs p-3 rounded-xl border flex items-center justify-between gap-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Lowest APR offered by: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{rate.lowestInstitution}</strong>
                        </div>
                        {rate.lowestState && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-emerald-500 border border-emerald-500/30">
                            {rate.lowestState}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Apply / Calculate Action */}
                  <Link
                    href={`/?country=US&rate=${rate.medianRate}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20"
                  >
                    Apply Rate to Calculator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
