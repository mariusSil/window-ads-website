import { ComponentRenderer } from '@/components/ComponentRenderer';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { resolvePageBySlug, getLocalizedContent, generatePageMetadata, getFinalPageComponents, loadSharedContent, getLocalizedSharedContent, getCollectionItems, loadNewsLabels, getLocalizedNewsLabels, type PageContent, type CollectionItem } from '@/content/lib/content-resolver';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    locale: string;
    slug: string[];
  };
}

// Generate metadata for dynamic pages
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const slugPath = params.slug?.join('/') || '';
  const content = await resolvePageBySlug(locale, slugPath);
  
  if (!content) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // Handle both regular pages and collection items
  const seoData = content.seo[locale] || content.seo.en;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    metadataBase: new URL(baseUrl),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    
    // Open Graph
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: 'website',
      locale: locale === 'lt' ? 'lt_LT' : 'en_US',
      siteName: 'Langu Remontas',
      images: [{
        url: seoData.ogImage,
        alt: seoData.ogImageAlt,
        width: 1200,
        height: 630,
      }],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: [seoData.ogImage],
    },
  };
}

function isPageContent(content: PageContent | CollectionItem): content is PageContent {
  return 'pageId' in content;
}

function isCollectionItem(content: PageContent | CollectionItem): content is CollectionItem {
  return 'itemId' in content && 'collection' in content;
}

export default async function DynamicPage({ params }: PageProps) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const slugPath = params.slug?.join('/') || '';
  
  // Resolve page content by slug
  const content = await resolvePageBySlug(locale, slugPath);
  
  if (!content) {
    notFound();
  }

  // Handle different content types
  if (isPageContent(content)) {
    // Regular page with components
    const localizedContent = getLocalizedContent(content, locale);
    
    // Get final components (page-specific + defaults with overrides)
    const finalComponents = getFinalPageComponents(content);
    
    const components = await Promise.all(finalComponents.map(async (component: any) => {
      let contentData = localizedContent[component.contentKey] || {};
      
      // Handle custom content from overrides
      if (component.customContent) {
        const customContent = component.customContent;
        contentData = customContent[locale] || customContent.en || customContent;
      }
      // Handle shared content references (like homepage does)
      else if (typeof contentData === 'string' && contentData.startsWith('shared:')) {
        const sharedContentKey = contentData.replace('shared:', '');
        const sharedContent = await loadSharedContent(`components/${sharedContentKey}`);
        contentData = getLocalizedSharedContent(sharedContent, locale);
      }
      // Handle direct shared content references in contentKey (About page pattern)
      else if (typeof component.contentKey === 'string' && component.contentKey.startsWith('shared:')) {
        const sharedContentKey = component.contentKey.replace('shared:', '');
        const sharedContent = await loadSharedContent(`components/${sharedContentKey}`);
        contentData = getLocalizedSharedContent(sharedContent, locale);
      }
      
      switch (component.type) {
        case 'PageHeader':
          return {
            type: 'PageHeader',
            props: {
              title: contentData.title || 'Page Title',
              subtitle: contentData.subtitle || ''
            }
          };
        case 'Content':
          return {
            type: 'Content',
            props: {
              content: typeof contentData === 'string' 
                ? contentData 
                : contentData
            }
          };
        case 'ContactForm':
          return {
            type: 'ContactForm',
            props: contentData
          };
        case 'PrivacyPolicy':
          return {
            type: 'PrivacyPolicy',
            props: {
              locale,
              sections: contentData || []
            }
          };
        case 'NewsListing':
          // Load news articles from collection
          const newsArticles = await getCollectionItems('news');
          
          // Sort by publish date (newest first)
          const sortedArticles = newsArticles.sort((a, b) => 
            new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime()
          );
          
          // Transform to expected format
          const transformedArticles = sortedArticles.map(article => {
            const localizedContent = article.content[locale] || article.content.en;
            const localizedSEO = article.seo[locale] || article.seo.en;
            
            return {
              itemId: article.itemId,
              collection: article.collection,
              publishDate: article.publishDate || '',
              author: article.author || '',
              localizedContent,
              localizedSEO: {
                ...localizedSEO,
                // Use featuredImage from content if ogImage not available
                ogImage: localizedSEO.ogImage || localizedContent.featuredImage,
                ogImageAlt: localizedSEO.ogImageAlt || localizedContent.featuredImageAlt
              },
              slugs: article.slugs
            };
          });
          
          return {
            type: 'NewsListing',
            props: {
              translations: contentData,
              locale: locale,
              newsArticles: transformedArticles
            }
          };
        default:
          return {
            type: component.type,
            props: {
              translations: contentData,
              locale: locale
            }
          };
      }
    }));

    return <ComponentRenderer components={components} />;
  } 
  
  if (isCollectionItem(content)) {
    const localizedContent = content.content[locale] || content.content.en || {};
    
    // Handle news articles with dedicated components
    if (content.collection === 'news') {
      // Load common content for CTAs
      const commonContent = await loadSharedContent('common');
      const localizedCommon = getLocalizedSharedContent(commonContent, locale);
      
      // Load news labels for translation
      const newsLabels = await loadNewsLabels();
      const localizedNewsLabels = getLocalizedNewsLabels(newsLabels, locale);
      
      // Load navigation translations
      const navigationContent = await loadSharedContent('components/news-navigation');
      const navigationTranslations = getLocalizedSharedContent(navigationContent, locale);
      
      // Get SEO data for fallbacks
      const localizedSEO = content.seo[locale] || content.seo.en || {};
      
      // Load navigation data for previous/next articles
      let previousArticle: { title: string; slug: string; featuredImage: string } | undefined = undefined;
      let nextArticle: { title: string; slug: string; featuredImage: string } | undefined = undefined;
      let relatedArticles: any[] = [];
      
      try {
        // Import news utilities
        const { getRelatedArticles, getPreviousNextArticles } = await import('@/lib/news-utils');
        
        // Get current article slug
        const currentSlug = content.slugs?.[locale] || content.itemId;
        console.log(`Loading navigation for article: ${currentSlug}, locale: ${locale}`);
        
        // Load related articles
        relatedArticles = await getRelatedArticles(currentSlug, locale, 6);
        console.log(`Found ${relatedArticles.length} related articles`);
        
        // Load previous/next navigation
        const navigation = await getPreviousNextArticles(currentSlug, locale);
        previousArticle = navigation.previous ? {
          title: navigation.previous.title,
          slug: navigation.previous.slug,
          featuredImage: navigation.previous.featuredImage
        } : undefined;
        
        nextArticle = navigation.next ? {
          title: navigation.next.title,
          slug: navigation.next.slug,
          featuredImage: navigation.next.featuredImage
        } : undefined;
        
        console.log(`Navigation loaded - Previous: ${previousArticle?.title || 'None'}, Next: ${nextArticle?.title || 'None'}`);
        
      } catch (e) {
        console.error('Failed to load navigation data:', e);
        relatedArticles = [];
        previousArticle = undefined;
        nextArticle = undefined;
      }
      
      // Helper function to load shared component content
      const getSharedComponentContent = async (componentKey: string) => {
        try {
          const content = await loadSharedContent(`components/${componentKey}`);
          return getLocalizedSharedContent(content, locale);
        } catch (error) {
          console.warn(`Failed to load shared component ${componentKey}:`, error);
          return {};
        }
      };

      const components = [
        {
          type: 'NewsArticleHero',
          props: {
            title: localizedContent.title || localizedSEO.title || '',
            excerpt: localizedContent.excerpt || localizedSEO.description || '',
            featuredImage: localizedContent.featuredImage || localizedSEO.ogImage || '/images/default-news.jpg',
            featuredImageAlt: localizedContent.featuredImageAlt || localizedSEO.ogImageAlt || localizedContent.title || '',
            publishDate: (content as any).publishDate || new Date().toISOString(),
            author: (content as any).author || 'expertTeam',
            readingTime: (content as any).readingTime,
            category: (content as any).category,
            locale: locale,
            newsLabels: localizedNewsLabels
          }
        },
        {
          type: 'NewsArticleContent',
          props: {
            introduction: localizedContent.introduction || '',
            sections: localizedContent.sections || [],
            locale: locale,
            newsLabels: localizedNewsLabels
          }
        },
        {
          type: 'NewsArticleNavigation',
          props: {
            currentArticle: {
              id: content.itemId || content.slugs?.[locale] || '',
              title: localizedContent.title || localizedSEO.title || ''
            },
            previousArticle: previousArticle,
            nextArticle: nextArticle,
            relatedArticles: relatedArticles,
            locale: locale,
            translations: navigationTranslations
          }
        },
        // Add shared components from about page
        {
          type: 'ServiceCards',
          props: {
            translations: await getSharedComponentContent('servicecards'),
            locale: locale
          }
        },
        {
          type: 'Testimonials',
          props: {
            translations: await getSharedComponentContent('testimonials'),
            locale: locale
          }
        },
        {
          type: 'WhyChooseUs',
          props: {
            translations: await getSharedComponentContent('whychooseus'),
            locale: locale
          }
        },
        {
          type: 'Faq',
          props: {
            translations: await getSharedComponentContent('faq'),
            locale: locale
          }
        }
      ];

      // Add news article structured data
      const newsStructuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": localizedContent.title || localizedSEO.title,
        "description": localizedContent.excerpt || localizedSEO.description,
        "image": localizedContent.featuredImage || localizedSEO.ogImage,
        "datePublished": (content as any).publishDate || new Date().toISOString(),
        "dateModified": (content as any).publishDate || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": (content as any).author || "Langu Remontas"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Langu Remontas",
          "logo": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://langu-remontas.com'}/images/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://langu-remontas.com'}/${locale}/${content.slugs?.[locale] || ''}`
        }
      };

      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(newsStructuredData),
            }}
          />
          <ComponentRenderer components={components} />
        </>
      );
    }
    
    // Handle other collection items (services, etc.) - use full component system
    const { getFinalCollectionComponents } = await import('@/content/lib/content-resolver');
    const finalComponents = getFinalCollectionComponents(content);

    console.log('Collection item processing:', {
      itemId: content.itemId,
      collection: content.collection,
      locale: locale,
      finalComponents: finalComponents.map(c => ({ type: c.type, contentKey: c.contentKey })),
      localizedContentKeys: Object.keys(localizedContent)
    });

    // Process components similar to regular pages
    const components = await Promise.all(finalComponents.map(async (component: any) => {
      let contentData = localizedContent[component.contentKey] || {};
      
      // Handle custom content from overrides
      if (component.customContent) {
        const customContent = component.customContent;
        contentData = customContent[locale] || customContent.en || customContent;
      }
      // Handle shared content references
      else if (typeof contentData === 'string' && contentData.startsWith('shared:')) {
        const sharedContentKey = contentData.replace('shared:', '');
        const sharedContent = await loadSharedContent(`components/${sharedContentKey}`);
        contentData = getLocalizedSharedContent(sharedContent, locale);
      }
      // Handle direct shared content references in contentKey
      else if (typeof component.contentKey === 'string' && component.contentKey.startsWith('shared:')) {
        const sharedContentKey = component.contentKey.replace('shared:', '');
        const sharedContent = await loadSharedContent(`components/${sharedContentKey}`);
        contentData = getLocalizedSharedContent(sharedContent, locale);
      }
      
      console.log(`Processing component ${component.type} with contentKey ${component.contentKey}:`, {
        hasContentData: !!contentData,
        contentDataKeys: typeof contentData === 'object' ? Object.keys(contentData) : 'not object',
        contentDataType: typeof contentData
      });
      
      // Handle specific component types with custom processing
      switch (component.type) {
        case 'ServiceArticle':
          return {
            type: 'ServiceArticle',
            props: {
              translations: contentData,
              locale: locale
            }
          };
        case 'ServiceHero':
          return {
            type: 'ServiceHero',
            props: {
              translations: contentData,
              locale: locale
            }
          };
        default:
          return {
            type: component.type,
            props: {
              translations: contentData,
              locale: locale
            }
          };
      }
    }));

    // Add structured data for other collection items
    const structuredData = content.collection === 'services' ? {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": localizedContent.hero?.title || content.seo[locale]?.title,
      "description": localizedContent.hero?.subtitle || content.seo[locale]?.description,
      "provider": {
        "@type": "Organization",
        "name": "Langu Remontas",
        "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://langu-remontas.com'
      }
    } : null;

    return (
      <>
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}
        <ComponentRenderer components={components} />
      </>
    );
  }

  // Fallback
  notFound();
}
