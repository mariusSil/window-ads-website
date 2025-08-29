'use client';

import { Header } from '@/components/common/Header';
import { Navigation } from '@/components/common/Navigation';
import { Footer } from '@/components/common/Footer';
import { MobileNavigationMenu } from '@/components/common/MobileNavigationMenu';
import ChatWidget from '@/components/common/ChatWidget';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { type Locale } from '@/lib/i18n';

interface ClientLayoutProps {
  children: React.ReactNode;
  validLocale: Locale;
  structuredData: string;
  localizedNavigation: any;
  localizedCommon: any;
  localizedFooter: any;
}


export function ClientLayout({ 
  children, 
  validLocale, 
  structuredData, 
  localizedNavigation, 
  localizedCommon, 
  localizedFooter
}: ClientLayoutProps) {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      {/* Skip Link for Keyboard Navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Skip to main content"
      >
        {validLocale === 'lt' ? 'Pereiti prie pagrindinio turinio' :
         validLocale === 'pl' ? 'Przejdź do głównej treści' :
         validLocale === 'uk' ? 'Перейти до основного вмісту' :
         'Skip to main content'}
      </a>
      <div className="min-h-screen bg-white flex flex-col">
        <Header 
          locale={validLocale}
          translations={{
            common: localizedCommon || {}
          }}
        />
        <Navigation
          locale={validLocale}
          translations={{
            navigation: localizedNavigation || { main: [] }
          }}
          onMobileMenuToggle={toggleMenu}
        />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer 
          locale={validLocale}
          translations={{
            redesign: localizedCommon?.redesign || { footer: {} },
            navigation: { items: localizedNavigation?.main || [] },
            services: { items: [] }
          }}
        />
        <MobileNavigationMenu
          isOpen={isOpen}
          onClose={closeMenu}
          locale={validLocale}
          translations={{
            navigation: localizedNavigation || { main: [] },
            common: localizedCommon || {}
          }}
        />
        <ChatWidget
          locale={validLocale}
          translations={localizedCommon?.chatWidget || {
            bubble: { tooltip: 'Chat with us', ariaLabel: 'Open chat widget' },
            modal: { title: 'How can we help you?', subtitle: 'Write to us and we\'ll try to answer your questions immediately.', closeButton: 'Close chat' },
            form: { nameLabel: 'Full Name', emailLabel: 'Email Address', phoneLabel: 'Phone Number', messageLabel: 'Your Question', submitButton: 'Send Message', successMessage: 'Thank you! We\'ll contact you within 2 hours.', errorMessage: 'Error sending message. Please try again.' }
          }}
        />
      </div>
    </>
  );
}
