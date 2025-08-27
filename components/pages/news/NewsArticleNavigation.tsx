'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Locale } from '@/lib/i18n';
import { getCollectionItemUrl, getPageUrl } from '@/lib/url-utils';
import routes from '@/content/routes.json';

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  publishDate: string;
  slug: string;
  category?: string;
}

interface NavigationArticle {
  title: string;
  slug: string;
  featuredImage: string;
}

interface NavigationTranslations {
  backToNews: string;
  previousArticle: string;
  nextArticle: string;
  relatedArticles: string;
  readMore: string;
  shareArticle: string;
  printArticle: string;
  noRelatedArticles: string;
  loading: string;
}

interface NewsArticleNavigationProps {
  currentArticle: {
    id: string;
    title: string;
  };
  previousArticle?: NavigationArticle;
  nextArticle?: NavigationArticle;
  relatedArticles?: RelatedArticle[];
  locale: Locale;
  translations: NavigationTranslations;
}



export default function NewsArticleNavigation({
  currentArticle,
  previousArticle,
  nextArticle,
  relatedArticles = [],
  locale,
  translations
}: NewsArticleNavigationProps) {
  // Early validation to prevent runtime errors
  if (!currentArticle || !locale || !translations) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-600">
              {translations?.loading || 'Loading...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const texts = translations;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: currentArticle.title,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <Link href={getPageUrl('news', locale, routes)}>
              <Button variant="outline" className="flex items-center gap-2">
                <Icon name="ArrowLeft" className="w-4 h-4" />
                {texts.backToNews}
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Icon name="Share2" className="w-4 h-4" />
                {texts.shareArticle}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Icon name="Printer" className="w-4 h-4" />
                {texts.printArticle}
              </Button>
            </div>
          </div>

          {/* Previous/Next Navigation */}
          {(previousArticle || nextArticle) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {/* Previous Article */}
              <div className="md:col-span-1">
                {previousArticle ? (
                  <Link href={getCollectionItemUrl('news', previousArticle.slug, locale, routes)}>
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                        <Icon name="ArrowLeft" className="w-4 h-4" />
                        {texts.previousArticle}
                      </div>
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={previousArticle.featuredImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-secondary line-clamp-2 hover:text-primary transition-colors">
                            {previousArticle.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>

              {/* Next Article */}
              <div className="md:col-span-1">
                {nextArticle ? (
                  <Link href={getCollectionItemUrl('news', nextArticle.slug, locale, routes)}>
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                      <div className="flex items-center justify-end gap-2 text-sm text-neutral-600 mb-3">
                        {texts.nextArticle}
                        <Icon name="ArrowRight" className="w-4 h-4" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 min-w-0 text-right">
                          <h3 className="font-semibold text-secondary line-clamp-2 hover:text-primary transition-colors">
                            {nextArticle.title}
                          </h3>
                        </div>
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={nextArticle.featuredImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h2 className="text-h2 font-semibold text-secondary mb-8 flex items-center gap-2">
                <Icon name="BookOpen" className="w-6 h-6" />
                {texts.relatedArticles}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 6).map((article) => (
                  <Link key={article.id} href={getCollectionItemUrl('news', article.slug, locale, routes)}>
                    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">
                      {/* Article Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={article.featuredImage}
                          alt={article.featuredImageAlt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {article.category && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                              {article.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Article Content */}
                      <div className="p-6">

                        <h3 className="text-lg font-semibold text-secondary mb-3 line-clamp-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-neutral-700 text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-primary font-medium text-sm hover:underline">
                            {texts.readMore}
                          </span>
                          <Icon name="ArrowRight" className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Related Articles Message */}
          {relatedArticles.length === 0 && (
            <div className="text-center py-12">
              <Icon name="BookOpen" className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">{texts.noRelatedArticles}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
