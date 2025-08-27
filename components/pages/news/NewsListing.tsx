'use client';

import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import NewsCard from './NewsCard';
import { getCollectionItemUrl, getPageUrl } from '@/lib/url-utils';
import routes from '@/content/routes.json';

interface NewsArticle {
  itemId: string;
  collection: string;
  localizedContent: any;
  localizedSEO: {
    title: string;
    description: string;
    ogImage?: string;
    ogImageAlt?: string;
  };
  slugs?: Record<Locale, string>;
}

interface NewsListingProps {
  locale: Locale;
  translations: {
    sectionTitle: string;
    sectionSubtitle?: string;
    noArticlesTitle: string;
    noArticlesDescription: string;
    readMoreText: string;
  };
  newsArticles?: NewsArticle[];
}

function NoArticlesState({ translations, locale }: { translations: NewsListingProps['translations']; locale: Locale }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Newspaper" className="w-12 h-12 text-neutral-400" />
      </div>
      <h3 className="text-h2 text-secondary mb-4">{translations.noArticlesTitle}</h3>
      <p className="text-body text-neutral-600 mb-8 max-w-md mx-auto">
        {translations.noArticlesDescription}
      </p>
      <Link href={getPageUrl('contact', locale, routes)}>
        <Button variant="default" size="default">
          <Icon name="MessageSquare" className="mr-2 w-5 h-5" />
          Contact Us
        </Button>
      </Link>
    </div>
  );
}

export default function NewsListing({ locale, translations, newsArticles = [] }: NewsListingProps) {

  // Generate article URL using utility function
  const getArticleUrl = (article: NewsArticle) => {
    const slug = article.slugs?.[locale] || article.itemId;
    return getCollectionItemUrl('news', slug, locale, routes);
  };

  // Fallback content if no translations provided
  if (!translations || !translations.sectionTitle) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-h1 text-secondary mb-4">
            {locale === 'lt' ? 'Naujienos' : 
             locale === 'pl' ? 'Aktualności' : 
             locale === 'uk' ? 'Новини' : 'News'}
          </h2>
          <p className="text-body text-neutral-600">Loading news articles...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-secondary mb-4">{translations.sectionTitle}</h1>
          {translations.sectionSubtitle && (
            <p className="text-body text-neutral-600 max-w-2xl mx-auto">
              {translations.sectionSubtitle}
            </p>
          )}
        </div>
        
        {/* Articles Grid */}
        {newsArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <NewsCard
                key={article.itemId}
                article={article}
                locale={locale}
                translations={{
                  readMoreText: translations.readMoreText
                }}
                articleUrl={getArticleUrl(article)}
              />
            ))}
          </div>
        ) : (
          <NoArticlesState translations={translations} locale={locale} />
        )}
      </div>
    </section>
  );
}
