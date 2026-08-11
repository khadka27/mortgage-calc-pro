import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { APP_NAME, APP_URL, GA_MEASUREMENT_ID, GSC_VERIFICATION } from '@/lib/env';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | Accurate Multi-Currency Home Loan Estimates`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'Mathematically precise, transparent global mortgage calculator supporting 22+ countries, custom currencies, extra payment simulation, affordability, refinancing, and full amortization schedules.',
  metadataBase: new URL(APP_URL),
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
  openGraph: {
    siteName: APP_NAME,
    type: 'website',
    url: APP_URL,
  },
  ...(GSC_VERIFICATION
    ? { verification: { google: GSC_VERIFICATION } }
    : {}),
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                const str = String(event.reason && (event.reason.stack || event.reason.message || event.reason));
                if (str.includes('chrome-extension://') || str.includes('M_ID') || str.includes('executors')) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              });
              window.addEventListener('error', function(event) {
                const str = String(event.message || event.filename || '');
                if (str.includes('chrome-extension://') || str.includes('M_ID')) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              }, true);
            `,
          }}
        />
        {/* Google Analytics — only loads when GA_MEASUREMENT_ID is set */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}

        <ThemeProvider>
          <div className="flex-1" suppressHydrationWarning>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
