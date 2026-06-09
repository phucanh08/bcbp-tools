import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'BCBP Tools — Encode / Decode',
  description: 'Encode and decode IATA Bar Coded Boarding Pass (BCBP) v6 strings locally in your browser.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Script src="/barcode-common.js" strategy="beforeInteractive" />
        <Script src="/barcode-pdf417.js" strategy="beforeInteractive" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
