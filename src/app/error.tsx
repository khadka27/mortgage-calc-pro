'use client';

import { Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Error SVG Illustration */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
          <img
            src="/Error.svg"
            alt="Application Error"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Error Text Content */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
            Unexpected Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Something Went Wrong
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            An unexpected error occurred while calculating financial analytics. Don't worry, your data is safe.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border text-xs font-bold transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Home className="w-4 h-4 text-emerald-500" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
