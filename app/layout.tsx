import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

import dynamic from 'next/dynamic';
import I18nProvider from '@/components/ui/i18n-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'College Registration Form',
  description: 'A fascinating form for college registration',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <I18nProvider>
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </I18nProvider>
    </html>
  );
}