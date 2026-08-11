'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { SUPPORTED_COUNTRIES } from '@/lib/mortgage/countries';
import { CountryConfig } from '@/lib/mortgage/types';

interface CountrySelectorProps {
  selectedCountry: CountryConfig;
  onSelectCountry: (country: CountryConfig) => void;
}

export default function CountrySelector({
  selectedCountry,
  onSelectCountry,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = SUPPORTED_COUNTRIES.filter(
    (c) =>
      c.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.countryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  };
  const dropdownStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
  };
  const subtleStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-subtle)',
    borderColor: 'var(--border)',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
        Select Country / Region
      </label>

      <button
        id="country-selector-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        style={triggerStyle}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border"
            style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }}
          >
            {selectedCountry.countryCode}
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {selectedCountry.countryName}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Currency:{' '}
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                {selectedCountry.currencyCode} ({selectedCountry.currencySymbol})
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: isOpen ? 'var(--accent)' : 'var(--text-muted)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 overflow-hidden"
          style={dropdownStyle}
        >
          {/* Search */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search country or currency…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg pl-9 pr-4 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Country list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No matching countries found.
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.countryCode === selectedCountry.countryCode;
                return (
                  <button
                    key={c.countryCode}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-bg)' : undefined,
                      color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs border"
                        style={
                          isSelected
                            ? { backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', borderColor: 'var(--accent-border)' }
                            : { backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-muted)' }
                        }
                      >
                        {c.countryCode}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-medium">{c.countryName}</div>
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {c.currencyCode} ({c.currencySymbol}) · {c.defaultInterestRate}% · {c.defaultLoanTerm}yr
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
