import { type Locale, isValidLocale } from '@/lib/i18n';

export interface RouteConfig {
  pageId: string;
  urls: Record<Locale, string>;
  priority: number;
  changefreq: string;
}

export interface ComponentOverride {
  contentKey?: string;
  customContent?: any;
  disabled?: boolean;
  position?: number; // For reordering
}

export interface PageContent {
  pageId: string;
  template: string;
  seo: Record<Locale, SEOData>;
  content: Record<Locale, any>;
  components?: ComponentConfig[]; // Now optional
  componentOverrides?: Record<string, ComponentOverride>; // New
  defaultComponentsDisabled?: boolean; // Option to disable all defaults
}

export interface ComponentConfig {
  type: string;
  contentKey: string;
  required: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogImageAlt: string;
  structuredData?: any;
}

export interface CollectionConfig {
  basePath: Record<Locale, string>;
  itemRoute: string;
  priority: number;
  changefreq: string;
}

export interface RoutesConfig {
  routes: RouteConfig[];
  collections?: Record<string, CollectionConfig>;
  defaultLocale: Locale;
  supportedLocales: Locale[];
}

export interface CollectionItem {
  itemId: string;
  collection: string;
  template: string;
  slugs?: Record<Locale, string>;
  seo: Record<Locale, SEOData>;
  content: Record<Locale, any>;
  publishDate?: string;
  author?: string;
  components?: ComponentConfig[];
  componentOverrides?: Record<string, ComponentOverride>;
  defaultComponentsDisabled?: boolean;
}

// Default component configuration
const DEFAULT_SHARED_COMPONENTS: ComponentConfig[] = [
  { type: 'ServiceCards', contentKey: 'shared:servicecards', required: true },
  { type: 'AccessoriesGrid', contentKey: 'shared:accessoriesgrid', required: true },
  { type: 'Testimonials', contentKey: 'shared:testimonials', required: true },
  { type: 'WhyChooseUs', contentKey: 'whyChooseUs', required: true },
  { type: 'TechnicianTeam', contentKey: 'shared:technicianteam', required: true },
  { type: 'Partners', contentKey: 'shared:partners', required: true },
  { type: 'Transformations', contentKey: 'shared:transformations', required: true },
  { type: 'PropertyTypes', contentKey: 'shared:propertytypes', required: true },
  { type: 'Faq', contentKey: 'shared:faq', required: true }
];

// Cache for loaded configurations
const routesConfigCache = new Map<string, RoutesConfig>();
const pageContentCache = new Map<string, PageContent>();
const collectionItemCache = new Map<string, CollectionItem>();
const sharedContentCache = new Map<string, any>();
const mergedComponentsCache = new Map<string, ComponentConfig[]>();

// Load main routes configuration
export async function loadRoutesConfig(): Promise<RoutesConfig> {
  const cacheKey = 'routes';
  
  if (routesConfigCache.has(cacheKey)) {
    return routesConfigCache.get(cacheKey)!;
  }

  try {
    const config = await import('@/content/routes.json') as unknown as { default: RoutesConfig };
    const routesConfig = config.default as RoutesConfig;
    routesConfigCache.set(cacheKey, routesConfig);
    return routesConfig;
  } catch (error) {
    console.error('Failed to load routes configuration:', error);
    throw new Error('Routes configuration not found');
  }
}

// Load complete page content
export async function loadPageContent(pageId: string): Promise<PageContent | null> {
  if (pageContentCache.has(pageId)) {
    return pageContentCache.get(pageId)!;
  }

  try {
    const content = await import(`@/content/pages/${pageId}.json`);
    const pageContent = content.default as PageContent;
    pageContentCache.set(pageId, pageContent);
    return pageContent;
  } catch (error) {
    console.warn(`Page content not found: ${pageId}`);
    return null;
  }
}

// Load shared content
export async function loadSharedContent(contentType: string): Promise<any> {
  const cacheKey = contentType;
  
  if (sharedContentCache.has(cacheKey)) {
    return sharedContentCache.get(cacheKey)!;
  }

  try {
    const content = await import(`@/content/shared/${contentType}.json`);
    const sharedContent = content.default;
    sharedContentCache.set(cacheKey, sharedContent);
    return sharedContent;
  } catch (error) {
    console.warn(`Shared content not found: ${contentType}`);
    return {};
  }
}

// Load form translations
export async function loadFormTranslations(locale: Locale): Promise<any> {
  const forms = await loadSharedContent('forms');
  return getLocalizedSharedContent(forms, locale);
}

// Load news labels
export async function loadNewsLabels(): Promise<any> {
  return loadSharedContent('news-labels');
}

// Get localized news labels
export function getLocalizedNewsLabels(newsLabels: any, locale: Locale): any {
  return getLocalizedSharedContent(newsLabels, locale);
}

// Load collection item content (server-side only)
export async function loadCollectionItem(collection: string, itemId: string): Promise<CollectionItem | null> {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    console.warn('loadCollectionItem should only be called on server-side');
    return null;
  }

  const cacheKey = `collection-${collection}-${itemId}`;
  
  if (collectionItemCache.has(cacheKey)) {
    return collectionItemCache.get(cacheKey)!;
  }
  
  try {
    const { promises: fs } = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'content', 'collections', collection, `${itemId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const content = JSON.parse(fileContent);
    
    collectionItemCache.set(cacheKey, content);
    return content;
  } catch (error) {
    console.error(`Error loading collection item ${collection}/${itemId}:`, error);
    return null;
  }
}

// Get all collection items for a category (server-side only)
export async function getCollectionItems(collection: string): Promise<CollectionItem[]> {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    console.warn('getCollectionItems should only be called on server-side');
    return [];
  }

  try {
    const { promises: fs } = require('fs');
    const path = require('path');
    const collectionDir = path.join(process.cwd(), 'content', 'collections', collection);
    
    const files = await fs.readdir(collectionDir);
    const jsonFiles = files.filter((file: string) => file.endsWith('.json'));
    
    const items: CollectionItem[] = [];
    for (const file of jsonFiles) {
      const filePath = path.join(collectionDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const item = JSON.parse(fileContent);
      items.push(item);
    }
    
    return items;
  } catch (error) {
    console.error(`Error loading collection items for ${collection}:`, error);
    return [];
  }
}

// Find collection item by localized slug
export async function findCollectionItemBySlug(collection: string, locale: Locale, slug: string): Promise<CollectionItem | null> {
  console.log(`[DEBUG] Finding collection item - collection: "${collection}", locale: "${locale}", slug: "${slug}"`);
  
  // Decode URL-encoded slug to handle special characters
  const decodedSlug = decodeURIComponent(slug);
  console.log(`[DEBUG] Decoded slug: "${decodedSlug}"`);
  
  const items = await getCollectionItems(collection);
  console.log(`[DEBUG] Loaded ${items.length} items from collection "${collection}"`);
  
  for (const item of items) {
    console.log(`[DEBUG] Checking item: ${item.itemId}, slugs:`, item.slugs);
    
    // Check if item has localized slugs - try both original and decoded slug
    if (item.slugs && (item.slugs[locale] === slug || item.slugs[locale] === decodedSlug)) {
      console.log(`[DEBUG] MATCH FOUND: ${item.itemId} matches slug "${decodedSlug}" for locale "${locale}"`);
      return item;
    }
    // Fallback to itemId if no localized slugs - try both original and decoded
    if (!item.slugs && (item.itemId === slug || item.itemId === decodedSlug)) {
      console.log(`[DEBUG] FALLBACK MATCH: ${item.itemId} matches slug "${decodedSlug}"`);
      return item;
    }
  }
  
  console.log(`[DEBUG] NO MATCH FOUND for slug "${decodedSlug}" in collection "${collection}"`);
  return null;
}

// Resolve collection item by slug
export async function resolveCollectionItem(locale: Locale, category: string, slug: string): Promise<CollectionItem | null> {
  const routesConfig = await loadRoutesConfig();
  
  if (!routesConfig.collections || !routesConfig.collections[category]) {
    return null;
  }
  
  const collectionConfig = routesConfig.collections[category];
  const basePath = collectionConfig.basePath[locale];
  
  // Check if the category matches the expected base path
  if (!basePath) return null;
  
  // Find collection item by localized slug
  return await findCollectionItemBySlug(category, locale, slug);
}

// Enhanced page resolution that handles both regular pages and collection items
export async function resolvePageBySlug(locale: Locale, slug: string): Promise<PageContent | CollectionItem | null> {
  console.log(`[DEBUG] Resolving slug: "${slug}" for locale: ${locale}`);
  
  const routesConfig = await loadRoutesConfig();
  
  // First, try to resolve as a regular page
  const route = routesConfig.routes.find(r => r.urls[locale] === slug);
  if (route) {
    console.log(`[DEBUG] Found regular page: ${route.pageId}`);
    return await loadPageContent(route.pageId);
  }
  
  // If not a regular page, check if it's a collection item (category/slug format)
  if (routesConfig.collections && slug.includes('/')) {
    const slugParts = slug.split('/');
    const category = slugParts[0];
    const itemSlug = slugParts.slice(1).join('/'); // Handle multi-part slugs
    
    console.log(`[DEBUG] Checking collection - category: "${category}", itemSlug: "${itemSlug}"`);
    
    // Find the collection that matches this category
    for (const [collectionName, collectionConfig] of Object.entries(routesConfig.collections)) {
      const basePath = collectionConfig.basePath[locale];
      console.log(`[DEBUG] Comparing "${basePath}" with "${category}" for collection: ${collectionName}`);
      
      if (basePath === category) {
        const result = await resolveCollectionItem(locale, collectionName, itemSlug);
        console.log(`[DEBUG] Collection resolution result:`, result ? 'FOUND' : 'NOT FOUND');
        return result;
      }
    }
  }
  
  console.log(`[DEBUG] No resolution found for slug: "${slug}"`);
  return null;
}

// Get localized content for a page
export function getLocalizedContent(pageContent: PageContent, locale: Locale): any {
  return pageContent.content[locale] || pageContent.content.en || {};
}

// Get localized content for a collection item
export function getLocalizedCollectionContent(collectionItem: CollectionItem, locale: Locale): any {
  return collectionItem.content[locale] || collectionItem.content.en || {};
}

// Get SEO data for a page with fallback support
export function getPageSEO(pageContent: PageContent, locale: Locale, fallbackSEO?: Partial<SEOData>): SEOData {
  const pageSEO = pageContent.seo[locale] || pageContent.seo.en;
  
  // If no fallback provided, return page SEO as-is
  if (!fallbackSEO) {
    return pageSEO;
  }
  
  // Merge page SEO with fallback, prioritizing page data
  return {
    title: pageSEO?.title || fallbackSEO.title || 'Website',
    description: pageSEO?.description || fallbackSEO.description || '',
    keywords: pageSEO?.keywords || fallbackSEO.keywords || '',
    ogImage: pageSEO?.ogImage || fallbackSEO.ogImage || '/og.png',
    ogImageAlt: pageSEO?.ogImageAlt || fallbackSEO.ogImageAlt || fallbackSEO.title || 'Website',
    structuredData: pageSEO?.structuredData || fallbackSEO.structuredData
  };
}

// Generate fallback SEO data from common content
export function generateFallbackSEO(commonContent: any, locale: Locale, baseUrl: string): SEOData {
  const localizedCommon = getLocalizedSharedContent(commonContent, locale);
  const siteName = localizedCommon?.site?.name || 'Website';
  const siteDescription = localizedCommon?.site?.description || '';
  const siteKeywords = localizedCommon?.site?.keywords || '';
  
  return {
    title: siteName,
    description: siteDescription,
    keywords: siteKeywords,
    ogImage: '/og.png',
    ogImageAlt: siteName,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "description": siteDescription,
      "url": baseUrl,
      "publisher": {
        "@type": "Organization",
        "name": siteName
      }
    }
  };
}

// Generate complete SEO metadata for any page with centralized fallback
export async function generatePageMetadata(
  pageId: string, 
  locale: Locale, 
  baseUrl?: string
): Promise<{
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogImageAlt: string;
  siteName: string;
  structuredData?: any;
}> {
  const resolvedBaseUrl = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Load common content for fallback
  const commonContent = await loadSharedContent('common');
  const fallbackSEO = generateFallbackSEO(commonContent, locale, resolvedBaseUrl);
  const localizedCommon = getLocalizedSharedContent(commonContent, locale);
  const siteName = localizedCommon?.site?.name || 'Website';
  
  // Try to load page content
  const pageContent = await loadPageContent(pageId);
  let seoData = fallbackSEO;
  
  if (pageContent) {
    seoData = getPageSEO(pageContent, locale, fallbackSEO);
  }
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    ogImage: seoData.ogImage,
    ogImageAlt: seoData.ogImageAlt,
    siteName,
    structuredData: seoData.structuredData
  };
}

// Get localized shared content
export function getLocalizedSharedContent(sharedContent: any, locale: Locale): any {
  return sharedContent[locale] || sharedContent.en || {};
}

// Get all routes for sitemap generation
export async function getAllRoutes(): Promise<RouteConfig[]> {
  const routesConfig = await loadRoutesConfig();
  return routesConfig.routes;
}

// Get supported locales
export async function getSupportedLocales(): Promise<Locale[]> {
  const routesConfig = await loadRoutesConfig();
  return routesConfig.supportedLocales;
}

// Get default locale
export async function getDefaultLocale(): Promise<Locale> {
  const routesConfig = await loadRoutesConfig();
  return routesConfig.defaultLocale;
}

// Generate all localized URLs for sitemap
export async function generateAllLocalizedUrls(): Promise<Array<{ locale: Locale; slug: string; pageId: string; priority: number; changefreq: string }>> {
  const routes = await getAllRoutes();
  const urls: Array<{ locale: Locale; slug: string; pageId: string; priority: number; changefreq: string }> = [];
  
  // Add static page URLs
  for (const route of routes) {
    for (const locale of Object.keys(route.urls) as Locale[]) {
      urls.push({
        locale,
        slug: route.urls[locale],
        pageId: route.pageId,
        priority: route.priority,
        changefreq: route.changefreq
      });
    }
  }
  
  // Add collection item URLs
  const collectionUrls = await generateCollectionUrls();
  urls.push(...collectionUrls);
  
  return urls;
}

// Generate collection URLs for sitemap
export async function generateCollectionUrls(): Promise<Array<{ locale: Locale; slug: string; pageId: string; priority: number; changefreq: string }>> {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    return [];
  }

  const urls: Array<{ locale: Locale; slug: string; pageId: string; priority: number; changefreq: string }> = [];
  const routesConfig = await loadRoutesConfig();
  
  if (!routesConfig.collections) {
    return urls;
  }

  const fs = await import('fs');
  const path = await import('path');
  
  for (const [collectionName, collectionConfig] of Object.entries(routesConfig.collections)) {
    try {
      const collectionDir = path.join(process.cwd(), 'content', 'collections', collectionName);
      
      if (!fs.existsSync(collectionDir)) {
        continue;
      }
      
      const files = fs.readdirSync(collectionDir).filter(file => file.endsWith('.json'));
      
      for (const file of files) {
        const itemId = file.replace('.json', '');
        const collectionItem = await loadCollectionItem(collectionName, itemId);
        
        if (collectionItem && collectionItem.slugs) {
          for (const locale of Object.keys(collectionItem.slugs) as Locale[]) {
            const basePath = collectionConfig.basePath[locale] || collectionConfig.basePath.en;
            const itemSlug = collectionItem.slugs[locale];
            const fullSlug = `${basePath}/${itemSlug}`;
            
            urls.push({
              locale,
              slug: fullSlug,
              pageId: `${collectionName}/${itemId}`,
              priority: collectionConfig.priority,
              changefreq: collectionConfig.changefreq
            });
          }
        }
      }
    } catch (error) {
      console.warn(`Error processing collection ${collectionName}:`, error);
    }
  }
  
  return urls;
}

// Get route configuration by page ID
export async function getRouteByPageId(pageId: string): Promise<RouteConfig | null> {
  const routesConfig = await loadRoutesConfig();
  return routesConfig.routes.find(route => route.pageId === pageId) || null;
}

// Get localized URL for a page
export async function getLocalizedUrl(pageId: string, locale: Locale): Promise<string | null> {
  const route = await getRouteByPageId(pageId);
  return route?.urls[locale] || null;
}

// Resolve page ID from current URL path
export async function resolvePageIdFromPath(locale: Locale, path: string): Promise<string | null> {
  // Remove leading slash and locale from path
  const cleanPath = path.replace(`/${locale}`, '').replace(/^\//, '') || '';
  
  const routesConfig = await loadRoutesConfig();
  const route = routesConfig.routes.find(r => r.urls[locale] === cleanPath);
  
  return route?.pageId || null;
}

// Apply component overrides to default components
export function applyComponentOverrides(
  defaultComponents: ComponentConfig[],
  overrides: Record<string, ComponentOverride>
): ComponentConfig[] {
  const result: ComponentConfig[] = [];
  const positionMap = new Map<number, ComponentConfig>();
  
  // Process each default component
  for (const component of defaultComponents) {
    const override = overrides[component.type];
    
    // Skip if disabled
    if (override?.disabled) {
      continue;
    }
    
    // Create component with potential overrides
    const finalComponent: ComponentConfig = {
      type: component.type,
      contentKey: override?.contentKey || component.contentKey,
      required: component.required
    };
    
    // Add custom content if provided
    if (override?.customContent) {
      (finalComponent as any).customContent = override.customContent;
    }
    
    // Handle positioning
    if (override?.position !== undefined) {
      positionMap.set(override.position, finalComponent);
    } else {
      result.push(finalComponent);
    }
  }
  
  // Insert positioned components at their specified positions
  const sortedPositions = Array.from(positionMap.keys()).sort((a, b) => a - b);
  for (const position of sortedPositions) {
    const component = positionMap.get(position)!;
    if (position >= result.length) {
      result.push(component);
    } else {
      result.splice(position, 0, component);
    }
  }
  
  return result;
}

// Merge page components with defaults
export function mergeWithDefaultComponents(
  pageComponents: ComponentConfig[] = [],
  componentOverrides?: Record<string, ComponentOverride>
): ComponentConfig[] {
  const cacheKey = `${JSON.stringify(pageComponents)}-${JSON.stringify(componentOverrides || {})}`;
  
  if (mergedComponentsCache.has(cacheKey)) {
    return mergedComponentsCache.get(cacheKey)!;
  }
  
  // Start with page-specific components
  let result = [...pageComponents];
  
  // Apply overrides to default components
  const processedDefaults = componentOverrides 
    ? applyComponentOverrides(DEFAULT_SHARED_COMPONENTS, componentOverrides)
    : [...DEFAULT_SHARED_COMPONENTS];
  
  // Add default components that aren't already in page components
  for (const defaultComponent of processedDefaults) {
    const existsInPage = result.some(comp => comp.type === defaultComponent.type);
    if (!existsInPage) {
      result.push(defaultComponent);
    }
  }
  
  mergedComponentsCache.set(cacheKey, result);
  return result;
}

// Get final components for a page (with defaults and overrides)
export function getFinalPageComponents(
  pageContent: PageContent
): ComponentConfig[] {
  // If default components are explicitly disabled, use only page components
  if (pageContent.defaultComponentsDisabled) {
    return pageContent.components || [];
  }
  
  // Otherwise, merge with defaults
  return mergeWithDefaultComponents(
    pageContent.components,
    pageContent.componentOverrides
  );
}

// Get final components for a collection item (with defaults and overrides)
export function getFinalCollectionComponents(
  collectionItem: CollectionItem
): ComponentConfig[] {
  // If default components are explicitly disabled, use only item components
  if (collectionItem.defaultComponentsDisabled) {
    return collectionItem.components || [];
  }
  
  // Otherwise, merge with defaults
  return mergeWithDefaultComponents(
    collectionItem.components,
    collectionItem.componentOverrides
  );
}

// Get default shared components (for reference)
export function getDefaultSharedComponents(): ComponentConfig[] {
  return [...DEFAULT_SHARED_COMPONENTS];
}

// URL Translation Functions for Language Switching

// Get localized collection URL for specific item and locale
export async function getLocalizedCollectionURL(
  collection: string,
  itemId: string,
  targetLocale: Locale
): Promise<string | null> {
  try {
    const routesConfig = await loadRoutesConfig();
    const collectionConfig = routesConfig.collections?.[collection];
    
    if (!collectionConfig) {
      return null;
    }

    // Load the collection item to get its localized slug
    const collectionItem = await loadCollectionItem(collection, itemId);
    if (!collectionItem) {
      return null;
    }

    const basePath = collectionConfig.basePath[targetLocale];
    const localizedSlug = collectionItem.slugs?.[targetLocale];
    
    if (!basePath || !localizedSlug) {
      return null;
    }

    return `/${targetLocale}/${basePath}/${localizedSlug}`;
  } catch (error) {
    console.error('Error getting localized collection URL:', error);
    return null;
  }
}

// Parse collection URL to extract collection, itemId, and locale
export async function parseCollectionURL(
  url: string
): Promise<{ collection: string; itemId: string; locale: Locale } | null> {
  try {
    const routesConfig = await loadRoutesConfig();
    
    // Remove leading slash and split path
    const pathParts = url.replace(/^\//, '').split('/');
    
    if (pathParts.length < 3) {
      return null;
    }

    const [locale, basePath, slug] = pathParts;
    
    if (!isValidLocale(locale)) {
      return null;
    }

    // Find matching collection by basePath
    for (const [collectionName, config] of Object.entries(routesConfig.collections || {})) {
      if (config.basePath[locale as Locale] === basePath) {
        // Find item by slug in this collection
        const itemId = await findItemIdBySlug(collectionName, slug, locale as Locale);
        if (itemId) {
          return {
            collection: collectionName,
            itemId,
            locale: locale as Locale
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing collection URL:', error);
    return null;
  }
}

// Find item ID by slug and locale
async function findItemIdBySlug(
  collection: string,
  slug: string,
  locale: Locale
): Promise<string | null> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const collectionDir = path.join(process.cwd(), 'content', 'collections', collection);
    
    if (!fs.existsSync(collectionDir)) {
      return null;
    }

    const files = fs.readdirSync(collectionDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(collectionDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (content.slugs && content.slugs[locale] === slug) {
        return content.itemId;
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding item by slug:', error);
    return null;
  }
}

// Get all URL variants for a collection item
export async function getAllURLVariants(
  collection: string,
  itemId: string
): Promise<Record<Locale, string>> {
  const variants: Record<string, string> = {};
  const locales: Locale[] = ['en', 'lt', 'pl', 'uk'];

  for (const locale of locales) {
    const url = await getLocalizedCollectionURL(collection, itemId, locale);
    if (url) {
      variants[locale] = url;
    }
  }

  return variants as Record<Locale, string>;
}

// Load all items from a collection
export async function loadCollectionItems(collection: string): Promise<any[]> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const collectionDir = path.join(process.cwd(), 'content', 'collections', collection);
    
    if (!fs.existsSync(collectionDir)) {
      console.warn(`Collection directory not found: ${collectionDir}`);
      return [];
    }

    const files = fs.readdirSync(collectionDir).filter(file => file.endsWith('.json'));
    const items = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(collectionDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        items.push(content);
      } catch (error) {
        console.warn(`Error loading collection item ${file}:`, error);
      }
    }

    return items;
  } catch (error) {
    console.error(`Error loading collection items for ${collection}:`, error);
    return [];
  }
}

// Get localized static page URL
export async function getLocalizedStaticPageURL(
  currentPath: string,
  targetLocale: Locale
): Promise<string | null> {
  try {
    const routesConfig = await loadRoutesConfig();
    
    // Remove locale prefix from current path
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}\//, '/').replace(/^\//, '');
    
    // Find matching route by URL in any locale
    for (const route of routesConfig.routes) {
      for (const [locale, url] of Object.entries(route.urls)) {
        if (url === pathWithoutLocale) {
          const targetUrl = route.urls[targetLocale];
          return targetUrl ? `/${targetLocale}/${targetUrl}`.replace(/\/+/g, '/').replace(/\/$/, '') || `/${targetLocale}` : null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting localized static page URL:', error);
    return null;
  }
}
