'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { URLTranslator } from '@/lib/url-translator';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

const localeNames: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  lt: { name: 'Lietuvių', flag: '🇱🇹' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  uk: { name: 'Українська', flag: '🇺🇦' },
};

export function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = async (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    try {
      // Use URLTranslator to get the correct localized URL
      const translatedURL = await URLTranslator.translateURL(pathname, newLocale);
      
      if (translatedURL) {
        router.push(translatedURL);
      } else {
        // Fallback: simple locale replacement for homepage and unknown pages
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '';
        const fallbackPath = `/${newLocale}${pathWithoutLocale}`;
        router.push(fallbackPath);
      }
    } catch (error) {
      console.error('Error switching language:', error);
      // Fallback to simple replacement
      const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '';
      const fallbackPath = `/${newLocale}${pathWithoutLocale}`;
      router.push(fallbackPath);
    }

    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{localeNames[currentLocale].flag}</span>
        <span className="hidden xl:block">{localeNames[currentLocale].name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200 ${
                  locale === currentLocale
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
                role="menuitem"
              >
                <span className="text-lg">{localeNames[locale].flag}</span>
                <span>{localeNames[locale].name}</span>
                {locale === currentLocale && (
                  <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
