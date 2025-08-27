'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Icon from '@/components/ui/Icon';
import { type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

interface NavigationItem {
  key: string;
  href: string;
  label: string;
}

interface NavigationProps {
  locale: Locale;
  translations: {
    navigation: {
      main: NavigationItem[];
    };
  };
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function Navigation({ locale, translations, onMobileMenuToggle, className = '' }: NavigationProps) {
  const pathname = usePathname();
  const { handleNavigation } = useSmartNavigation(locale);
  
  const navItems = translations.navigation.main.map(item => ({
    ...item,
    href: item.href.startsWith('/') ? `/${locale}${item.href === '/' ? '' : item.href}` : `/${locale}/${item.href}`
  }));

  const isActiveLink = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };


  return (
    <nav className={cn("bg-accent border-b border-gray-200 sticky top-16 z-40", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between h-12">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const isSmartNavItem = ['services', 'accessories'].includes(item.key);
              
              if (isSmartNavItem) {
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.key, item.href)}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                      isActiveLink(item.href) ? "text-secondary" : "text-gray-600"
                    )}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label.toUpperCase()}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActiveLink(item.href) ? "text-secondary" : "text-gray-600"
                  )}
                >
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-12">
            {/* Language Switcher - Left */}
            <div className="flex items-center">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            
            {/* Hamburger Menu Toggle - Right */}
            <button
              onClick={onMobileMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-secondary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Icon name="Menu" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
