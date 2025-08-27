'use client';

import { type Locale } from '@/lib/i18n';

export class URLTranslator {
  /**
   * Translate URL from current locale to target locale using API endpoint
   * Handles both collection items and static pages
   */
  static async translateURL(currentURL: string, targetLocale: Locale): Promise<string | null> {
    try {
      const response = await fetch('/api/translate-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentURL,
          targetLocale
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedURL || null;
    } catch (error) {
      console.error('Error translating URL:', error);
      return null;
    }
  }

  /**
   * Check if URL is a collection item URL by making API call
   */
  static async isCollectionURL(url: string): Promise<boolean> {
    try {
      // We can determine this by trying to translate the URL
      // If it successfully translates, it's likely a valid URL structure
      const result = await this.translateURL(url, 'en'); // Use 'en' as test locale
      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract locale from URL path
   */
  static extractLocale(url: string): Locale | null {
    const pathParts = url.replace(/^\//, '').split('/');
    const locale = pathParts[0];
    
    const validLocales: Locale[] = ['en', 'lt', 'pl', 'uk'];
    return validLocales.includes(locale as Locale) ? locale as Locale : null;
  }

  /**
   * Get all language variants for current URL
   */
  static async getAllLanguageVariants(currentURL: string): Promise<Record<Locale, string | null>> {
    const variants: Record<string, string | null> = {
      en: null,
      lt: null,
      pl: null,
      uk: null
    };

    const locales: Locale[] = ['en', 'lt', 'pl', 'uk'];

    for (const locale of locales) {
      variants[locale] = await this.translateURL(currentURL, locale);
    }

    return variants as Record<Locale, string | null>;
  }

  /**
   * Normalize URL path (remove trailing slashes, etc.)
   */
  static normalizePath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }
}
