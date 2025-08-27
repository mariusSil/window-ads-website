import { headers } from 'next/headers';
import { defaultLocale, isValidLocale, type Locale } from '@/lib/i18n';

/**
 * Detect locale for 404 pages using multiple strategies
 * Priority: URL segments > Headers > Referrer > Default
 */
export async function detectLocaleForNotFound(): Promise<Locale> {
  try {
    // Strategy 1: Check headers for referrer URL
    const headersList = headers();
    const referrer = headersList.get('referer');
    
    if (referrer) {
      try {
        const url = new URL(referrer);
        const segments = url.pathname.split('/');
        const potentialLocale = segments[1];
        
        if (isValidLocale(potentialLocale)) {
          return potentialLocale;
        }
      } catch (error) {
        // Invalid URL, continue to next strategy
      }
    }
    
    // Strategy 2: Check Accept-Language header
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,lt;q=0.8")
      const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().toLowerCase())
        .map(lang => lang.split('-')[0]); // Extract primary language code
      
      for (const lang of languages) {
        if (isValidLocale(lang)) {
          return lang as Locale;
        }
      }
    }
    
    // Strategy 3: Check for locale-specific paths in referrer
    if (referrer) {
      const lowerReferrer = referrer.toLowerCase();
      for (const locale of ['uk', 'lt', 'pl', 'en']) {
        if (lowerReferrer.includes(`/${locale}/`) || lowerReferrer.endsWith(`/${locale}`)) {
          return locale as Locale;
        }
      }
    }
    
  } catch (error) {
    console.warn('Error detecting locale for 404 page:', error);
  }
  
  // Fallback to default locale
  return defaultLocale;
}

/**
 * Get locale from pathname (client-side utility)
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  return isValidLocale(potentialLocale) ? potentialLocale : defaultLocale;
}

/**
 * Detect locale from browser (client-side)
 */
export function detectClientLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  // Try current pathname first
  const pathname = window.location.pathname;
  const localeFromPath = getLocaleFromPathname(pathname);
  if (localeFromPath !== defaultLocale) {
    return localeFromPath;
  }
  
  // Try browser language
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  if (isValidLocale(browserLang)) {
    return browserLang as Locale;
  }
  
  return defaultLocale;
}
