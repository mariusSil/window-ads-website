'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RequestTechnicianButton } from '@/components/common/RequestTechnicianButton';
import { ConsultationButton } from '@/components/common/ConsultationButton';
import Icon from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

interface NavigationItem {
  key: string;
  href: string;
  label: string;
}

interface MobileNavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  translations: {
    navigation: {
      main: NavigationItem[];
    };
    common: {
      phone: string;
      email: string;
      buttons: {
        request_technician: string;
        free_consultation: string;
      };
      redesign: {
        logoText: string;
        header: {
          contactIcons: {
            telegram: string;
            whatsapp: string;
          };
        };
      };
      [key: string]: any;
    };
  };
}

export function MobileNavigationMenu({ 
  isOpen, 
  onClose, 
  locale, 
  translations 
}: MobileNavigationMenuProps) {
  const { handleNavigation } = useSmartNavigation(locale);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const navItems = translations.navigation.main.map(item => ({
    ...item,
    href: item.href.startsWith('/') ? `/${locale}${item.href === '/' ? '' : item.href}` : `/${locale}/${item.href}`
  }));

  const handleLinkClick = () => {
    onClose();
  };

  const handleSmartNavigation = (key: string, href: string) => {
    handleNavigation(key, href);
    onClose(); // Close menu after navigation
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <div className={`
        fixed top-0 right-0 max-h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
        style={{ height: 'calc(100vh - env(safe-area-inset-top))' }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Fixed Header - Close Button */}
          <div className="flex-shrink-0 p-6 pb-0">
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-primary transition-colors rounded-md"
                aria-label="Close navigation menu"
              >
                <Icon name="X" className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
            {/* Navigation Links */}
            <nav className="space-y-6 mb-8">
              {navItems.map((item) => {
                const isSmartNavItem = ['services', 'accessories'].includes(item.key);
                
                if (isSmartNavItem) {
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSmartNavigation(item.key, item.href)}
                      className="block w-full text-left text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100 last:border-b-0"
                      aria-label={`Navigate to ${item.label}`}
                    >
                      {item.label}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="block text-lg font-medium text-gray-700 hover:text-primary transition-colors py-2 border-b border-gray-100 last:border-b-0"
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Contact Information */}
            <div className="pt-6 border-t border-gray-200 pb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Contact Us
              </h3>
              <div className="space-y-4">
                {/* Phone */}
                <a 
                  href={`tel:${translations.common.phone.replace(/\\s/g, '')}`} 
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                  title={`Call ${translations.common.phone}`}
                >
                  <Icon name="Phone" className="w-5 h-5 mr-3" />
                  <span className="text-sm">{translations.common.phone}</span>
                </a>

                {/* Social Contact Icons */}
                <div className="flex items-center space-x-4">
                  <a 
                    href={`https://t.me/${translations.common.redesign.header.contactIcons.telegram}`} 
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Contact via Telegram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="Send" className="w-5 h-5" />
                  </a>
                  <a 
                    href={`https://wa.me/${translations.common.redesign.header.contactIcons.whatsapp}`} 
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Contact via WhatsApp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="MessageSquare" className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer - CTAs */}
          <div className="flex-shrink-0 p-6 pt-0">
            <div className="space-y-3">
              <RequestTechnicianButton
                variant="default" 
                size="sm" 
                className="w-full rounded-button shadow-button"
                locale={locale}
              />
              <ConsultationButton
                variant="green" 
                size="sm" 
                className="w-full rounded-button shadow-button"
                locale={locale}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
