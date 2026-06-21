import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/experience/shell';

export const metadata: Metadata = {
  title: 'HerFlows — Menstrual Wellness Companion',
  description: 'A premium wellness companion for cycle awareness, personal routines, monthly kits, rewards, and support.',
  manifest: '/manifest',
};

export const viewport: Viewport = {
  themeColor: '#fffaf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
