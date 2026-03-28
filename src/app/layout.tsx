import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'GridAcademy — India\'s Best Mock Test Platform', template: '%s | GridAcademy' },
  description: 'Prepare for SSC, Banking, Railway, UPSC and more with expert-created mock tests from top coaching institutes.',
  keywords: 'mock test, SSC CGL, IBPS PO, RRB NTPC, UPSC, competitive exam preparation India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
