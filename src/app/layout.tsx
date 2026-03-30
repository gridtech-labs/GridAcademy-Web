import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: "GridAcademy — India's Best Mock Test Platform", template: '%s | GridAcademy' },
  description: 'Prepare for SSC, Banking, Railway, UPSC and more with expert-created mock tests from top coaching institutes.',
  keywords: 'mock test, SSC CGL, IBPS PO, RRB NTPC, UPSC, competitive exam preparation India',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3KQZWY3X6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z3KQZWY3X6');
          `}
        </Script>
      </head>

      <body className={`${inter.className} antialiased bg-gray-50`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}