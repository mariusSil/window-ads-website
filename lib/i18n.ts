// Supported locales
export const locales = ['en', 'pl', 'lt', 'uk'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

/**
 * Validate if locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale from pathname or return default
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  return isValidLocale(potentialLocale) ? potentialLocale : defaultLocale;
}

/**
 * Get translation by key with dot notation support
 */
export function getTranslation(obj: any, key: string, fallback?: string): string {
  const keys = key.split('.');
  let result = obj;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof result === 'string' ? result : fallback || key;
}
