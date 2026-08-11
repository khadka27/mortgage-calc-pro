'use client';

import { Check, ChevronDown, Globe, Search } from 'lucide-react';
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

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
        Select Country / Region
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500/50 rounded-xl px-4 py-3 text-white transition-all shadow-sm group focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-400 text-xs shadow-inner">
            {selectedCountry.countryCode}
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              {selectedCountry.countryName}
            </div>
            <div className="text-xs text-zinc-400">
              Currency: <span className="text-emerald-400 font-medium">{selectedCountry.currencyCode} ({selectedCountry.currencySymbol})</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-950/80">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country or currency (e.g. US, CAD, Nepal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/50">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
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
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center font-bold text-xs border border-zinc-700 text-emerald-400">
                        {c.countryCode}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-medium">{c.countryName}</div>
                        <div className="text-[11px] text-zinc-400">
                          {c.currencyCode} ({c.currencySymbol}) • Default {c.defaultInterestRate}% @ {c.defaultLoanTerm} yrs
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
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
