import { Locale } from '@/lib/i18n';

interface RouteConfig {
  routes: Array<{
    pageId: string;
    urls: Record<Locale, string>;
    priority?: number;
    changefreq?: string;
  }>;
  collections: Record<string, {
    basePath: Record<Locale, string>;
    itemRoute: string;
    priority?: number;
    changefreq?: string;
  }>;
  defaultLocale: string;
  supportedLocales: string[];
}

/**
 * Generate URL for a collection item (e.g., news article, service page)
 * @param collection - Collection name (e.g., 'news', 'services')
 * @param slug - Item slug
 * @param locale - Target locale
 * @param routes - Routes configuration object
 * @returns Locale-specific URL for the collection item
 */
export function getCollectionItemUrl(
  collection: string, 
  slug: string, 
  locale: Locale,
  routes: RouteConfig
): string {
  const collectionConfig = routes.collections[collection];
  if (!collectionConfig) {
    console.warn(`Collection "${collection}" not found in routes`);
    return `/${locale}/${collection}/${slug}`;
  }

  const basePath = collectionConfig.basePath[locale] || collectionConfig.basePath.en;
  return `/${locale}/${basePath}/${slug}`;
}

/**
 * Generate URL for a page (e.g., homepage, about, contact)
 * @param pageId - Page identifier
 * @param locale - Target locale
 * @param routes - Routes configuration object
 * @returns Locale-specific URL for the page
 */
export function getPageUrl(
  pageId: string,
  locale: Locale,
  routes: RouteConfig
): string {
  const route = routes.routes.find(r => r.pageId === pageId);
  if (!route) {
    console.warn(`Page "${pageId}" not found in routes`);
    return `/${locale}/${pageId}`;
  }

  const url = route.urls[locale] || route.urls.en;
  return `/${locale}${url ? `/${url}` : ''}`;
}

/**
 * Get collection base path for a specific locale
 * @param collection - Collection name
 * @param locale - Target locale
 * @param routes - Routes configuration object
 * @returns Base path for the collection in the specified locale
 */
export function getCollectionBasePath(
  collection: string,
  locale: Locale,
  routes: RouteConfig
): string {
  const collectionConfig = routes.collections[collection];
  if (!collectionConfig) {
    console.warn(`Collection "${collection}" not found in routes`);
    return collection;
  }

  return collectionConfig.basePath[locale] || collectionConfig.basePath.en;
}

/**
 * Generate breadcrumb data for a collection item
 * @param collection - Collection name
 * @param itemTitle - Title of the current item
 * @param locale - Target locale
 * @param routes - Routes configuration object
 * @returns Array of breadcrumb items
 */
export function getCollectionBreadcrumbs(
  collection: string,
  itemTitle: string,
  locale: Locale,
  routes: RouteConfig
): Array<{ label: string; href: string }> {
  const homeLabel = locale === 'lt' ? 'Pagrindinis' : 
                   locale === 'pl' ? 'Strona główna' :
                   locale === 'uk' ? 'Головна' : 'Home';
  
  const collectionLabel = getCollectionBasePath(collection, locale, routes);
  
  return [
    { label: homeLabel, href: `/${locale}` },
    { label: collectionLabel, href: getPageUrl(collection, locale, routes) },
    { label: itemTitle, href: '' } // Current page, no link
  ];
}
