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

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`
        flex items-center justify-center w-9 h-9 rounded-xl
        bg-slate-100 dark:bg-zinc-800
        border border-slate-200 dark:border-zinc-700
        text-slate-600 dark:text-zinc-300
        hover:bg-slate-200 dark:hover:bg-zinc-700
        hover:text-slate-900 dark:hover:text-white
        transition-all duration-200 shadow-sm shrink-0
        ${className}
      `}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
