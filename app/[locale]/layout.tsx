import type { Metadata } from 'next';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { loadPageContent, getPageSEO, loadSharedContent, getLocalizedSharedContent, generateFallbackSEO } from '@/content/lib/content-resolver';
import { ClientLayout } from '@/components/ClientLayout';

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
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png',
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
    <ClientLayout
      validLocale={validLocale}
      structuredData={structuredData}
      localizedNavigation={localizedNavigation}
      localizedCommon={localizedCommon}
      localizedFooter={localizedFooter}
    >
      {children}
    </ClientLayout>
  );
}
