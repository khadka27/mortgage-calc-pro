'use client';

import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* 404 SVG Illustration */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
          <img
            src="/404 error.svg"
            alt="404 Page Not Found"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Page Not Found
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            The mortgage calculator page or tool you are looking for doesn’t exist or may have been relocated.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>

          <Link
            href="/mortgage-calculator"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border text-xs font-bold transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Search className="w-4 h-4 text-emerald-500" /> View All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
