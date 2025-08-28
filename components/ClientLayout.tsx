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
        <main className="flex-1">
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
