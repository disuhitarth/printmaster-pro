import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from './components/SessionProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | PrintMaster Pro',
    default: 'PrintMaster Pro - Professional Screen Printing Production Management'
  },
  description: 'Enterprise-grade PWA for screen printing production management. Transform your workflow from job intake to shipping with precision, speed, and professional polish.',
  keywords: ['screen printing', 'production management', 'kanban board', 'job tracking', 'print shop software', 'workflow automation'],
  authors: [{ name: 'PrintMaster Pro Team' }],
  creator: 'PrintMaster Pro',
  publisher: 'PrintMaster Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrintMaster Pro',
    startupImage: [
      {
        url: '/splash-2048x2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PrintMaster Pro" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div id="root">
            {children}
          </div>
          {/* Portal for modals and overlays */}
          <div id="modal-root"></div>
        </SessionProvider>
      </body>
    </html>
  );
}