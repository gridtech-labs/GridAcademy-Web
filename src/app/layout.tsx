import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // (base URL for all SEO)
  metadataBase: new URL('https://www.gridacademy.in'),

  title: {
    default: "GridAcademy — India's Best Mock Test Platform",
    template: '%s | GridAcademy',
  },

  description:
    'Prepare for SSC, Banking, Railway, UPSC and more with expert-created mock tests from top coaching institutes.',

  keywords: [
    'mock test',
    'SSC CGL',
    'IBPS PO',
    'RRB NTPC',
    'UPSC',
    'competitive exam preparation India',
  ],

  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  alternates: {
    canonical: '/',
  },

  // OPEN GRAPH (Fixed with metadataBase support)
  openGraph: {
    title: "GridAcademy — India's Best Mock Test Platform",
    description:
      'Prepare for SSC, Banking, Railway, UPSC and more with expert-created mock tests.',
    url: '/',
    siteName: 'GridAcademy',
    images: [
      {
        url: '/og-image.jpg', // metadataBase automatically prefix karega
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  
  twitter: {
    card: 'summary_large_image',
    title: "GridAcademy — India's Best Mock Test Platform",
    description:
      'Prepare for SSC, Banking, Railway, UPSC and more with expert mock tests.',
    images: ['/og-image.jpg'],
  },

  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z3KQZWY3X6"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z3KQZWY3X6', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body className={`${inter.className} antialiased bg-gray-50`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}