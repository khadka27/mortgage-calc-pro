import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="flex-1" suppressHydrationWarning>
            {children}
          </div>

          <footer
            className="border-t py-8 px-4 sm:px-6 lg:px-8 text-xs no-print"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' }}
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>MortgagePro Global</div>
                <div>Mathematically precise financial calculations using decimal.js arithmetic.</div>
              </div>
              <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)' }}>
                <a href="/mortgage-calculator/us" className="hover:text-emerald-500 transition-colors">USA</a>
                <a href="/mortgage-calculator/ca" className="hover:text-emerald-500 transition-colors">Canada</a>
                <a href="/mortgage-calculator/uk" className="hover:text-emerald-500 transition-colors">UK</a>
                <a href="/mortgage-calculator/au" className="hover:text-emerald-500 transition-colors">Australia</a>
                <a href="/mortgage-calculator/in" className="hover:text-emerald-500 transition-colors">India</a>
                <a href="/mortgage-calculator/np" className="hover:text-emerald-500 transition-colors">Nepal</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
