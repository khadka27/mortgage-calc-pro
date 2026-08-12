/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent<HTMLElement>) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Read persisted preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('mp-theme') as Theme | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored ?? (systemDark ? 'dark' : 'light');
    setTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    setMounted(true);
  }, []);

  const toggleTheme = async (event?: React.MouseEvent<HTMLElement>) => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    const triggerEl = event?.currentTarget;
    const hasViewTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasViewTransition || !triggerEl) {
      localStorage.setItem('mp-theme', nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      setTheme(nextTheme);
      return;
    }

    const { top, left, width, height } = triggerEl.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(
      Math.max(left, right),
      Math.max(top, bottom)
    );

    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        localStorage.setItem('mp-theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        setTheme(nextTheme);
      });
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  // Avoid flash: don't render children until theme resolved
  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950" aria-hidden="true" />
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function ThemeToggleButton({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isDark = theme === 'dark';

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative flex items-center justify-between
        w-[52px] h-7 sm:w-[58px] sm:h-8 p-1 rounded-full
        border transition-all duration-300 cursor-pointer shrink-0 select-none
        ${isDark
          ? 'bg-zinc-900 border-zinc-700/80 shadow-inner'
          : 'bg-amber-500/10 border-amber-500/30 shadow-inner'
        }
        ${className}
      `}
    >
      {/* Background static icons */}
      <Sun
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 transition-opacity duration-300 ml-0.5 ${
          isDark ? 'opacity-40' : 'opacity-100 font-bold'
        }`}
      />
      <Moon
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 transition-opacity duration-300 mr-0.5 ${
          isDark ? 'opacity-100 font-bold' : 'opacity-40'
        }`}
      />

      {/* Sliding Thumb */}
      <div
        className={`
          absolute top-[3px] left-[3px]
          w-5 h-5 sm:w-6 sm:h-6 rounded-full
          flex items-center justify-center
          shadow-md transition-transform duration-300 ease-out
          ${isDark
            ? 'translate-x-[24px] sm:translate-x-[28px] bg-zinc-800 border border-zinc-600 text-indigo-300'
            : 'translate-x-0 bg-white border border-amber-200 text-amber-500'
          }
        `}
      >
        {isDark ? (
          <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 rotate-0 hover:-rotate-12" />
        ) : (
          <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 rotate-0 hover:rotate-45" />
        )}
      </div>
    </button>
  );
}
