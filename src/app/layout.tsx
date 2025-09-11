import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import { SelectedItemProvider } from '@/contexts/SelectedItemContext';
import ReduxProvider from '@/components/ReduxProvider';
import AutoRefreshInitializer from '@/components/AutoRefreshInitializer';

// import FloatingButtonWrapper from '@/components/FloatingButtonWrapper';
import './globals.css';

const inter = Raleway({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Superior Seats - Responsive Next.js App',
  description: 'A modern, responsive Next.js application built with Material UI',
  icons: {
    icon: '/superiorlogo/logored.png',
    shortcut: '/superiorlogo/logored.png',
    apple: '/superiorlogo/logored.png',
  },
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
              <AutoRefreshInitializer />
              {children}
              {/* <FloatingButtonWrapper /> */}
            </SelectedItemProvider>
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
} 