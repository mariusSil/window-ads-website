import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { loadPageContent, getPageSEO, loadSharedContent, getLocalizedSharedContent, generateFallbackSEO } from '@/content/lib/content-resolver';
import { ClientLayout } from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

// Static metadata to avoid hydration issues
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};


export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const validLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  
  // Load homepage content for structured data
  const pageContent = await loadPageContent('homepage');
  const structuredData = pageContent?.seo[validLocale]?.structuredData ? 
    JSON.stringify(pageContent.seo[validLocale].structuredData) : '';
  
  // Load shared content for header and footer
  const navigationContent = await loadSharedContent('navigation');
  const commonContent = await loadSharedContent('common');
  const footerContent = await loadSharedContent('footer');
  
  const localizedNavigation = getLocalizedSharedContent(navigationContent, validLocale);
  const localizedCommon = getLocalizedSharedContent(commonContent, validLocale);
  const localizedFooter = getLocalizedSharedContent(footerContent, validLocale);

  return (
    <html lang={validLocale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
      </head>
      <body className={inter.className}>
        <ClientLayout
          validLocale={validLocale}
          structuredData={structuredData}
          localizedNavigation={localizedNavigation}
          localizedCommon={localizedCommon}
          localizedFooter={localizedFooter}
        >
          {children}
        </ClientLayout>
        <SpeedInsights />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
