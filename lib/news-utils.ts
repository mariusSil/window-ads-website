import { Locale } from '@/lib/i18n';
import { loadCollectionItems } from '@/content/lib/content-resolver';

// News labels translation interfaces
export interface NewsLabelsTranslations {
  metadata: {
    publishedLabel: string;
    authorLabel: string;
    readTimeLabel: string;
    updatedLabel: string;
  };
  navigation: {
    breadcrumbHome: string;
    breadcrumbNews: string;
    backToNews: string;
    nextArticle: string;
    previousArticle: string;
  };
  content: {
    loadingText: string;
    errorText: string;
    shareLabel: string;
    copyLinkLabel: string;
    printLabel: string;
  };
  sections: {
    tipsLabel: string;
    benefitsLabel: string;
    warningLabel: string;
    calloutLabel: string;
    introductionLabel: string;
    conclusionLabel: string;
  };
  cta: {
    defaultPrimary: string;
    defaultSecondary: string;
    scheduleService: string;
    getQuote: string;
    contactExpert: string;
    freeConsultation: string;
    scheduleWinterService: string;
    getMaintenanceQuote: string;
    emergencyRepair: string;
    bookInspection: string;
  };
  authors: {
    expertTeam: string;
    maintenanceSpecialist: string;
    windowExpert: string;
    technicalTeam: string;
  };
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  publishDate: string;
  slug: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

interface CollectionItem {
  slugs: Record<Locale, string>;
  content: Record<Locale, any>;
  seo: Record<Locale, any>;
  publishDate?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

/**
 * Get related articles based on category and tags
 */
export async function getRelatedArticles(
  currentArticleSlug: string,
  locale: Locale,
  limit: number = 6
): Promise<NewsArticle[]> {
  try {
    console.log(`Loading collection items for news...`);
    const allArticles = await loadCollectionItems('news');
    console.log(`Loaded ${allArticles.length} total articles`);
    
    if (!allArticles || allArticles.length === 0) {
      console.warn('No articles found in collection');
      return [];
    }

    // Filter out current article and convert to NewsArticle format
    const otherArticles = allArticles
      .filter(article => {
        const articleSlug = article.slugs?.[locale];
        const isCurrentArticle = articleSlug === currentArticleSlug;
        if (isCurrentArticle) {
          console.log(`Filtering out current article: ${articleSlug}`);
        }
        return !isCurrentArticle;
      })
      .map(article => convertToNewsArticle(article, locale))
      .filter(article => article !== null) as NewsArticle[];

    console.log(`Found ${otherArticles.length} other articles after filtering`);

    // Get current article for comparison
    const currentArticle = allArticles
      .find(article => article.slugs?.[locale] === currentArticleSlug);
    
    if (!currentArticle) {
      console.warn(`Current article not found with slug: ${currentArticleSlug}`);
      return otherArticles.slice(0, limit);
    }

    const currentCategory = (currentArticle as any).category;
    const currentTags = (currentArticle as any).tags || [];

    // Score articles based on relevance
    const scoredArticles = otherArticles.map(article => {
      let score = 0;
      
      // Same category gets high score
      if (currentCategory && article.category === currentCategory) {
        score += 10;
      }
      
      // Shared tags get medium score
      if (currentTags.length > 0 && article.tags) {
        const sharedTags = article.tags.filter(tag => currentTags.includes(tag));
        score += sharedTags.length * 3;
      }
      
      // Featured articles get small boost
      if (article.featured) {
        score += 1;
      }
      
      // More recent articles get small boost
      const daysSincePublish = Math.floor(
        (Date.now() - new Date(article.publishDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePublish < 30) {
        score += 2;
      } else if (daysSincePublish < 90) {
        score += 1;
      }
      
      return { ...article, score };
    });

    // Sort by score and return top results
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error loading related articles:', error);
    return [];
  }
}

/**
 * Get previous and next articles chronologically
 */
export async function getPreviousNextArticles(
  currentArticleSlug: string,
  locale: Locale
): Promise<{ previous?: NewsArticle; next?: NewsArticle }> {
  try {
    const allArticles = await loadCollectionItems('news');
    if (!allArticles || allArticles.length === 0) return {};

    // Convert and sort by publish date
    const sortedArticles = allArticles
      .map(article => convertToNewsArticle(article, locale))
      .filter(article => article !== null)
      .sort((a, b) => new Date(b!.publishDate).getTime() - new Date(a!.publishDate).getTime()) as NewsArticle[];

    const currentIndex = sortedArticles.findIndex(
      article => article.slug === currentArticleSlug
    );

    if (currentIndex === -1) return {};

    return {
      previous: currentIndex > 0 ? sortedArticles[currentIndex - 1] : undefined,
      next: currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : undefined
    };
    
  } catch (error) {
    console.error('Error loading previous/next articles:', error);
    return {};
  }
}

/**
 * Get featured articles for homepage or other sections
 */
export async function getFeaturedArticles(
  locale: Locale,
  limit: number = 3
): Promise<NewsArticle[]> {
  try {
    const allArticles = await loadCollectionItems('news');
    if (!allArticles || allArticles.length === 0) return [];

    const articles = allArticles
      .map(article => convertToNewsArticle(article, locale))
      .filter(article => article !== null) as NewsArticle[];

    // First try to get explicitly featured articles
    const featuredArticles = articles.filter(article => article.featured);
    
    if (featuredArticles.length >= limit) {
      return featuredArticles
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, limit);
    }

    // If not enough featured articles, get most recent ones
    return articles
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error loading featured articles:', error);
    return [];
  }
}

/**
 * Convert collection item to NewsArticle format
 */
function convertToNewsArticle(
  item: CollectionItem,
  locale: Locale
): NewsArticle | null {
  try {
    const localizedContent = item.content?.[locale] || item.content?.en || {};
    const localizedSEO = item.seo?.[locale] || item.seo?.en || {};
    
    if (!localizedContent.title && !localizedSEO.title) {
      console.warn(`Skipping article without title: ${(item as any).itemId || 'unknown'}`);
      return null; // Skip articles without titles
    }

    const article = {
      id: (item as any).itemId || item.slugs?.[locale] || '',
      title: localizedContent.title || localizedSEO.title || '',
      excerpt: localizedContent.excerpt || localizedSEO.description || '',
      featuredImage: localizedContent.featuredImage || localizedSEO.ogImage || '/images/default-news.jpg',
      featuredImageAlt: localizedContent.featuredImageAlt || localizedSEO.ogImageAlt || localizedContent.title || '',
      publishDate: (item as any).publishDate || new Date().toISOString(),
      slug: item.slugs?.[locale] || '',
      category: (item as any).category,
      tags: (item as any).tags || [],
      featured: (item as any).featured || false
    };

    console.log(`Converted article: ${article.title} (${article.slug})`);
    return article;
  } catch (error) {
    console.error('Error converting article:', error, item);
    return null;
  }
}

/**
 * Format date for display in different locales
 */
export function formatArticleDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const localeMap = {
    en: 'en-US',
    lt: 'lt-LT',
    pl: 'pl-PL',
    uk: 'uk-UA'
  };
  
  return date.toLocaleDateString(localeMap[locale], options);
}

/**
 * Calculate reading time based on content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format read time with locale-specific label
 */
export function formatReadTime(minutes: number, locale: Locale, translations: NewsLabelsTranslations): string {
  const label = translations?.metadata?.readTimeLabel || 'min read';
  return `${minutes} ${label}`;
}

/**
 * Get author name from translation key
 */
export function getAuthorName(authorKey: string, locale: Locale, translations: NewsLabelsTranslations): string {
  if (translations?.authors?.[authorKey as keyof typeof translations.authors]) {
    return translations.authors[authorKey as keyof typeof translations.authors];
  }
  
  // Fallback to hardcoded translations if not found in translations object
  const authorNames: Record<string, Record<Locale, string>> = {
    expertTeam: {
      en: 'Expert Team',
      lt: 'Ekspertų komanda', 
      pl: 'Zespół ekspertów',
      uk: 'Команда експертів'
    },
    maintenanceSpecialist: {
      en: 'Maintenance Specialist',
      lt: 'Priežiūros specialistas',
      pl: 'Specjalista ds. konserwacji',
      uk: 'Спеціаліст з обслуговування'
    },
    windowExpert: {
      en: 'Window Expert',
      lt: 'Langų ekspertas',
      pl: 'Ekspert od okien',
      uk: 'Експерт з вікон'
    },
    technicalTeam: {
      en: 'Technical Team',
      lt: 'Techninė komanda',
      pl: 'Zespół techniczny',
      uk: 'Технічна команда'
    }
  };
  
  return authorNames[authorKey]?.[locale] || authorNames[authorKey]?.en || authorKey;
}

/**
 * Get CTA text from translation key
 */
export function getCtaText(ctaKey: string, translations: NewsLabelsTranslations): string {
  if (translations?.cta?.[ctaKey as keyof typeof translations.cta]) {
    return translations.cta[ctaKey as keyof typeof translations.cta];
  }
  return translations?.cta?.defaultPrimary || 'Learn More';
}

/**
 * Get section type label
 */
export function getSectionTypeLabel(type: string, translations: NewsLabelsTranslations): string {
  switch(type) {
    case 'tips-list':
    case 'tips':
      return translations?.sections?.tipsLabel || 'Tips';
    case 'warning-section':
    case 'warning':
      return translations?.sections?.warningLabel || 'Important';
    case 'benefits':
      return translations?.sections?.benefitsLabel || 'Benefits';
    case 'callout':
      return translations?.sections?.calloutLabel || 'Note';
    case 'introduction':
      return translations?.sections?.introductionLabel || 'Introduction';
    case 'conclusion':
      return translations?.sections?.conclusionLabel || 'Conclusion';
    default:
      return '';
  }
}

/**
 * Get loading text with fallback
 */
export function getLoadingText(locale: Locale, translations?: NewsLabelsTranslations): string {
  if (translations?.content?.loadingText) {
    return translations.content.loadingText;
  }
  
  // Fallback based on locale
  switch (locale) {
    case 'lt': return 'Kraunama...';
    case 'pl': return 'Ładowanie...';
    case 'uk': return 'Завантаження...';
    default: return 'Loading...';
  }
}

/**
 * Get error text with fallback
 */
export function getErrorText(locale: Locale, translations?: NewsLabelsTranslations): string {
  if (translations?.content?.errorText) {
    return translations.content.errorText;
  }
  
  // Fallback based on locale
  switch (locale) {
    case 'lt': return 'Nepavyko įkelti turinio';
    case 'pl': return 'Nie udało się załadować treści';
    case 'uk': return 'Не вдалося завантажити вміст';
    default: return 'Failed to load content';
  }
}
