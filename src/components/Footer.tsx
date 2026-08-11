'use client';

import { Activity, Calculator, DollarSign, Globe, Home, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/env';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const cardStyle: React.CSSProperties = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' };

  return (
    <footer className="border-t mt-16 transition-colors" style={cardStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <Home className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Mortgage<span className="text-emerald-500">Calculator</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Multi-currency global mortgage analytics platform, real-time lender benchmarks, HELOC, refinance, and loan comparison tools.
            </p>
          </div>

          {/* Core Calculators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              Core Calculators
            </h4>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <li><Link href="/" className="hover:text-emerald-500 transition-colors">Mortgage Payment Calculator</Link></li>
              <li><Link href="/?tab=affordability" className="hover:text-emerald-500 transition-colors">Home Affordability Tool</Link></li>
              <li><Link href="/?tab=refinance" className="hover:text-emerald-500 transition-colors">Refinance Comparison</Link></li>
              <li><Link href="/heloc" className="hover:text-emerald-500 transition-colors">HELOC Line of Credit</Link></li>
              <li><Link href="/rent-vs-buy" className="hover:text-emerald-500 transition-colors">Rent vs. Buy Calculator</Link></li>
            </ul>
          </div>

          {/* Live Data & Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              Live Market &amp; Hubs
            </h4>
            <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <li><Link href="/live-rates" className="hover:text-emerald-500 transition-colors flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-500" /> Live US Rates Feed</Link></li>
              <li><Link href="/mortgage-calculator/us" className="hover:text-emerald-500 transition-colors">US Mortgage Rules</Link></li>
              <li><Link href="/mortgage-calculator/ca" className="hover:text-emerald-500 transition-colors">Canada Semi-Annual Compound</Link></li>
              <li><Link href="/mortgage-calculator/uk" className="hover:text-emerald-500 transition-colors">UK Stamp Duty &amp; Mortgages</Link></li>
              <li><Link href="/mortgage-calculator/in" className="hover:text-emerald-500 transition-colors">India Home Loan Rules</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
              Financial Transparency
            </h4>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Rates and payment estimates generated are for informational and educational purposes only. Actual lender qualification and APR will vary based on creditworthiness, property appraisal, and underwriting guidelines.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <div>
            © {currentYear} {APP_NAME}. All rights reserved. Equal Housing Opportunity.
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-mono text-[11px]">Secure SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
