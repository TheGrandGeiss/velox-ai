import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#8b5cf6', // Matches your manifest theme color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Disables zooming to feel like a native app
  userScalable: false,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Velox - AI Personal Assistant',
  description:
    'Sync Google Calendar, automate your schedule, and reclaim your time.',
  manifest: '/manifest.json',

  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5f6f7]`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
