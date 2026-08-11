import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Global Mortgage Calculator Pro | Accurate Multi-Currency Home Loan Estimates',
  description:
    'Mathematically precise, transparent global mortgage calculator supporting 22+ countries, custom currencies, extra payment simulation, affordability, refinancing, and full amortization schedules.',
  keywords: [
    'mortgage calculator',
    'global home loan calculator',
    'amortization schedule',
    'refinance calculator',
    'affordability calculator',
    'US mortgage calculator',
    'UK mortgage calculator',
    'Canada mortgage calculator',
    'India home loan EMI calculator',
    'Nepal home loan calculator',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <div className="flex-1">{children}</div>

        <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400 py-8 px-4 sm:px-6 lg:px-8 text-xs no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm">MortgagePro Global</div>
              <div>Mathematically precise financial calculations using decimal.js arithmetic.</div>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="/mortgage-calculator/us" className="hover:text-emerald-400">USA</a>
              <a href="/mortgage-calculator/ca" className="hover:text-emerald-400">Canada</a>
              <a href="/mortgage-calculator/uk" className="hover:text-emerald-400">UK</a>
              <a href="/mortgage-calculator/au" className="hover:text-emerald-400">Australia</a>
              <a href="/mortgage-calculator/in" className="hover:text-emerald-400">India</a>
              <a href="/mortgage-calculator/np" className="hover:text-emerald-400">Nepal</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
