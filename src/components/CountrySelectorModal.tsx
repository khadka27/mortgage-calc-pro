'use client';

import { Check, Globe, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SUPPORTED_COUNTRIES } from '@/lib/mortgage/countries';
import { CountryConfig } from '@/lib/mortgage/types';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountryCode?: string;
  onSelectCountry?: (country: CountryConfig) => void;
}

export default function CountrySelectorModal({
  isOpen,
  onClose,
  selectedCountryCode = 'US',
  onSelectCountry,
}: CountrySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const filteredCountries = SUPPORTED_COUNTRIES.filter(
    (c) =>
      c.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.countryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };
  const tileStyle: React.CSSProperties = { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' };
  const inputStyle: React.CSSProperties = { backgroundColor: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        style={cardStyle}
      >
        {/* Modal Header */}
        <div className="p-5 border-b flex items-center justify-between gap-3" style={tileStyle}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Select Country &amp; Mortgage Rules
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Choose region for localized currency, tax laws &amp; compounding rules
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search country name, code (e.g. US, CA, UK, IN) or currency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              style={inputStyle}
              autoFocus
            />
          </div>
        </div>

        {/* Countries Grid */}
        <div className="p-4 overflow-y-auto max-h-96 space-y-2">
          {filteredCountries.length === 0 ? (
            <div className="py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No countries match your search query.
            </div>
          ) : (
            filteredCountries.map((c) => {
              const isSelected = c.countryCode === selectedCountryCode;
              return (
                <button
                  key={c.countryCode}
                  type="button"
                  onClick={() => {
                    if (onSelectCountry) {
                      onSelectCountry(c);
                    } else {
                      router.push(`/mortgage-calculator/${c.countryCode.toLowerCase()}`);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-150 hover:border-emerald-500/50 hover:shadow-sm group"
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-bg)' : 'var(--bg-subtle)',
                    borderColor: isSelected ? 'var(--accent-border)' : 'var(--border)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 transition-transform group-hover:scale-105"
                      style={
                        isSelected
                          ? { backgroundColor: 'var(--accent)', color: '#fff', borderColor: 'transparent' }
                          : { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }
                      }
                    >
                      {c.countryCode}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        {c.countryName}
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Currency: <strong className="text-emerald-500 font-mono">{c.currencyCode} ({c.currencySymbol})</strong> • Default {c.defaultInterestRate}% • {c.mortgageTypes.length} products
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
