import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import { SelectedItemProvider } from '@/contexts/SelectedItemContext';
import ReduxProvider from '@/components/ReduxProvider';
// import FloatingButtonWrapper from '@/components/FloatingButtonWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Superior Seats - Responsive Next.js App',
  description: 'A modern, responsive Next.js application built with Material UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeRegistry>
            <SelectedItemProvider>
              {children}
              {/* <FloatingButtonWrapper /> */}
            </SelectedItemProvider>
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
} 