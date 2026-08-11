'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  id?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  className = '',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); return; }
    if (!open) return;
    const currentIndex = options.findIndex((o) => o.value === value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = options[Math.min(currentIndex + 1, options.length - 1)];
      if (next) onChange(next.value);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = options[Math.max(currentIndex - 1, 0)];
      if (prev) onChange(prev.value);
    }
  };

  /* Scroll active item into view when list opens */
  useEffect(() => {
    if (open && listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [open]);

  const triggerStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-input)',
    borderColor: open ? 'var(--accent)' : 'var(--border)',
    color: 'var(--text-primary)',
    boxShadow: open ? '0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent)' : undefined,
  };

  const dropdownStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      {/* Trigger button */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold border transition-all duration-150 focus:outline-none text-left"
        style={triggerStyle}
        aria-label={selected?.label ?? placeholder}
      >
        <span className="flex flex-col leading-tight min-w-0">
          <span className="truncate" style={{ color: selected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {selected?.label ?? placeholder}
          </span>
          {selected?.description && (
            <span className="text-[11px] font-normal truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {selected.description}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: open ? 'var(--accent)' : 'var(--text-muted)' }}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden"
          style={dropdownStyle}
        >
          <div className="overflow-y-auto max-h-56 py-1">
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  data-active={isActive}
                  aria-selected={isActive}
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors duration-100 focus:outline-none"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-bg)' : undefined,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '';
                  }}
                >
                  <span className="flex flex-col leading-tight min-w-0">
                    <span className={`text-sm font-${isActive ? 'semibold' : 'medium'} truncate`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-[11px] truncate mt-0.5" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)', opacity: 0.8 }}>
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <Check className="w-4 h-4 shrink-0 ml-2" style={{ color: 'var(--accent)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
