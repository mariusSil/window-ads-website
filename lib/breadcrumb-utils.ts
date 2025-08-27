import { Locale } from '@/lib/i18n';
import routes from '@/content/routes.json';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

/**
 * Get locale-specific URL for a page by pageId
 */
export function getPageUrl(pageId: string, locale: Locale): string {
  const route = routes.routes.find(r => r.pageId === pageId);
  if (!route) {
    console.warn(`Route not found for pageId: ${pageId}`);
    return `/${locale}`;
  }
  
  const localizedUrl = route.urls[locale] || route.urls.en || '';
  return `/${locale}${localizedUrl ? `/${localizedUrl}` : ''}`;
}

/**
 * Get locale-specific URL for a collection item
 */
export function getCollectionItemUrl(
  collectionType: keyof typeof routes.collections, 
  slug: string, 
  locale: Locale
): string {
  const collection = routes.collections[collectionType];
  if (!collection) {
    console.warn(`Collection not found: ${collectionType}`);
    return `/${locale}`;
  }
  
  const basePath = collection.basePath[locale] || collection.basePath.en;
  return `/${locale}/${basePath}/${slug}`;
}

/**
 * Get breadcrumb texts for all common pages
 */
export function getBreadcrumbTexts(locale: Locale) {
  const texts = {
    en: { 
      home: 'Home', 
      news: 'News', 
      services: 'Services', 
      about: 'About',
      accessories: 'Accessories',
      business: 'Business Clients',
      contact: 'Contact'
    },
    lt: { 
      home: 'Pagrindinis', 
      news: 'Naujienos', 
      services: 'Paslaugos', 
      about: 'Apie mus',
      accessories: 'Priedai',
      business: 'Verslo klientui',
      contact: 'Kontaktai'
    },
    pl: { 
      home: 'Strona główna', 
      news: 'Aktualności', 
      services: 'Usługi', 
      about: 'O nas',
      accessories: 'Akcesoria',
      business: 'Klienci biznesowi',
      contact: 'Kontakt'
    },
    uk: { 
      home: 'Головна', 
      news: 'Новини', 
      services: 'Послуги', 
      about: 'Про нас',
      accessories: 'Аксесуари',
      business: 'Бізнес клієнти',
      contact: 'Контакти'
    }
  };
  
  return texts[locale] || texts.en;
}

/**
 * Generate breadcrumb items for common page patterns
 */
export function generateBreadcrumbs(
  currentPageId: string, 
  locale: Locale, 
  currentTitle?: string
): BreadcrumbItem[] {
  const breadcrumbTexts = getBreadcrumbTexts(locale);
  const items: BreadcrumbItem[] = [];
  
  // Always start with home
  items.push({
    label: breadcrumbTexts.home,
    href: getPageUrl('homepage', locale)
  });
  
  // Add parent pages based on current page
  switch (currentPageId) {
    case 'news-article':
      items.push({
        label: breadcrumbTexts.news,
        href: getPageUrl('news', locale)
      });
      break;
    case 'service-item':
      items.push({
        label: breadcrumbTexts.services,
        href: getPageUrl('services', locale)
      });
      break;
    case 'accessory-item':
      items.push({
        label: breadcrumbTexts.accessories,
        href: getPageUrl('accessories', locale)
      });
      break;
    case 'business-item':
      items.push({
        label: breadcrumbTexts.business,
        href: getPageUrl('business', locale)
      });
      break;
  }
  
  // Add current page if title provided
  if (currentTitle) {
    items.push({
      label: currentTitle,
      href: '#',
      current: true
    });
  }
  
  return items;
}

/**
 * Generate breadcrumbs for news articles specifically
 */
export function generateNewsBreadcrumbs(
  articleTitle: string,
  locale: Locale
): BreadcrumbItem[] {
  const breadcrumbTexts = getBreadcrumbTexts(locale);
  
  return [
    {
      label: breadcrumbTexts.home,
      href: getPageUrl('homepage', locale)
    },
    {
      label: breadcrumbTexts.news,
      href: getPageUrl('news', locale)
    },
    {
      label: articleTitle,
      href: '#',
      current: true
    }
  ];
}

/**
 * Validate if a pageId exists in routes
 */
export function isValidPageId(pageId: string): boolean {
  return routes.routes.some(route => route.pageId === pageId);
}

/**
 * Validate if a collection type exists
 */
export function isValidCollectionType(collectionType: string): boolean {
  return Object.keys(routes.collections).includes(collectionType);
}
