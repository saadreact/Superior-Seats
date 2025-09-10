import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import { SelectedItemProvider } from '@/contexts/SelectedItemContext';
import ReduxProvider from '@/components/ReduxProvider';
import Script from 'next/script';

// import FloatingButtonWrapper from '@/components/FloatingButtonWrapper';
import './globals.css';

const inter = Raleway({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Superior Seats - Responsive Next.js App',
  description: 'A modern, responsive Next.js application built with Material UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const env = (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
  const sdkSrc = env === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://web.squarecdn.com" />
        <link rel="dns-prefetch" href="https://web.squarecdn.com" />
        <link rel="preconnect" href="https://sandbox.web.squarecdn.com" />
        <link rel="dns-prefetch" href="https://sandbox.web.squarecdn.com" />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeRegistry>
            <SelectedItemProvider>
              {children}
              {/* <FloatingButtonWrapper /> */}
            </SelectedItemProvider>
          </ThemeRegistry>
        </ReduxProvider>
        {/* Preload Square SDK globally so checkout sees it instantly */}
        <Script src={sdkSrc} strategy="beforeInteractive" />
      </body>
    </html>
  );
} 