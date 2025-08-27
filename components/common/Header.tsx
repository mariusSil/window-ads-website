'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RequestTechnicianButton } from '@/components/common/RequestTechnicianButton';
import { ConsultationButton } from '@/components/common/ConsultationButton';
import Icon from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';

interface HeaderProps {
  locale: Locale;
  translations: {
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
  logo?: {
    text?: string;
    image?: string;
    href?: string;
  };
  className?: string;
}

export function Header({ 
  locale, 
  translations,
  logo = { text: translations.common.redesign.logoText, href: `/${locale}` }, 
  className = ''
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Company Name */}
          <div className="flex-shrink-0">
            <Link href={logo.href || `/${locale}`} className="flex items-center space-x-3">
              {/* Logo Icon */}
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="Wrench" className="w-5 h-5 text-primary" />
              </div>
              <h1 className="hidden sm:block text-lg font-bold text-secondary">
                {logo.text || translations.common.redesign.logoText}
              </h1>
            </Link>
          </div>

          
          {/* Contact Icons & CTAs - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Contact Icons */}
            <div className="flex items-center space-x-4">
              <a 
                href={`tel:${translations.common.phone.replace(/\s/g, '')}`} 
                className="text-gray-600 hover:text-primary cursor-pointer transition-colors flex items-center"
                title={`Call ${translations.common.phone}`}
              >
                <Icon name="Phone" className="text-lg w-5 h-5" />
                <span className="ml-2 hidden min-[1000px]:inline text-sm">{translations.common.phone}</span>
              </a>
              <a 
                href={`https://t.me/${translations.common.redesign.header.contactIcons.telegram}`} 
                className="text-gray-600 hover:text-primary cursor-pointer transition-colors"
                title="Contact via Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Send" className="text-lg w-5 h-5" />
              </a>
              <a 
                href={`https://wa.me/${translations.common.redesign.header.contactIcons.whatsapp}`} 
                className="text-gray-600 hover:text-primary cursor-pointer transition-colors"
                title="Contact via WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="MessageSquare" className="text-lg w-5 h-5" />
              </a>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <RequestTechnicianButton
                variant="default" 
                size="sm" 
                className="rounded-button shadow-button"
                locale={locale}
              />
              <ConsultationButton
                variant="green" 
                size="sm" 
                className="rounded-button shadow-button"
                locale={locale}
              />
            </div>
          </div>

          {/* Mobile Contact & CTA */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Contact Icons */}
            <div className="flex items-center space-x-2">
              <a 
                href={`tel:${translations.common.phone.replace(/\s/g, '')}`} 
                className="text-gray-600 hover:text-primary cursor-pointer transition-colors p-2"
                title={`Call ${translations.common.phone}`}
              >
                <Icon name="Phone" className="text-lg w-5 h-5" />
              </a>
              <a 
                href={`https://t.me/${translations.common.redesign.header.contactIcons.telegram}`} 
                className="text-gray-600 hover:text-primary cursor-pointer transition-colors p-2"
                title="Contact via Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Send" className="text-lg w-5 h-5" />
              </a>
              <a 
                href={`https://wa.me/${translations.common.redesign.header.contactIcons.whatsapp}`} 
                className="text-gray-600 hover:text-primary cursor-pointer transition-colors p-2"
                title="Contact via WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="MessageSquare" className="text-lg w-5 h-5" />
              </a>
            </div>
            
            {/* Mobile CTA */}
            <RequestTechnicianButton
              variant="default" 
              size="sm" 
              className="rounded-button shadow-button"
              locale={locale}
            />
          </div>
        </div>
      </div>

    </header>
  );
}
