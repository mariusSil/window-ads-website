import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { Locale } from '@/lib/i18n';
import { generateNewsBreadcrumbs } from '@/lib/breadcrumb-utils';
import { Breadcrumb, BreadcrumbStructuredData } from '@/components/ui/Breadcrumb';
import { NewsLabelsTranslations, formatReadTime, getAuthorName, getLoadingText } from '@/lib/news-utils';

interface NewsArticleHeroProps {
  title: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  publishDate: string;
  author: string;
  readingTime?: number;
  category?: string;
  locale: Locale;
  newsLabels?: NewsLabelsTranslations;
}

const formatDate = (dateString: string, locale: Locale): string => {
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
};

const getShareText = (locale: Locale, newsLabels?: NewsLabelsTranslations) => {
  if (newsLabels?.content?.shareLabel) {
    return newsLabels.content.shareLabel;
  }
  
  const texts = {
    en: 'Share article',
    lt: 'Dalintis straipsniu',
    pl: 'Udostępnij artykuł',
    uk: 'Поділитися статтею'
  };
  return texts[locale];
};

export default function NewsArticleHero({
  title,
  excerpt,
  featuredImage,
  featuredImageAlt,
  publishDate,
  author,
  readingTime,
  category,
  locale,
  newsLabels
}: NewsArticleHeroProps) {
  // Early validation to prevent runtime errors
  if (!title || !locale) {
    return (
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-neutral-600">
              {getLoadingText(locale, newsLabels)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const breadcrumbItems = generateNewsBreadcrumbs(title, locale);
  const shareText = getShareText(locale, newsLabels);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = encodeURIComponent(title);
  
  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={breadcrumbItems} 
          locale={locale} 
          className="text-neutral-600 mb-8" 
        />
        
        {/* SEO Structured Data */}
        <BreadcrumbStructuredData items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Category Badge */}
            {category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {category}
                </span>
              </div>
            )}

            {/* Article Title */}
            <h1 className="text-hero font-bold text-secondary mb-6 leading-tight">
              {title}
            </h1>

            {/* Article Excerpt */}
            <p className="text-xl text-neutral-700 mb-6 leading-relaxed">
              {excerpt}
            </p>

            {/* Article Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-8">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" className="w-4 h-4" />
                <span>
                  {newsLabels?.metadata?.publishedLabel || 'Published'}: {formatDate(publishDate, locale)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon name="User" className="w-4 h-4" />
                <span>
                  {newsLabels?.metadata?.authorLabel || 'By'}: {getAuthorName(author, locale, newsLabels || {} as NewsLabelsTranslations)}
                </span>
              </div>
              
              {readingTime && (
                <div className="flex items-center gap-2">
                  <Icon name="Clock" className="w-4 h-4" />
                  <span>
                    {newsLabels ? formatReadTime(readingTime, locale, newsLabels) : `${readingTime} min read`}
                  </span>
                </div>
              )}
            </div>
          
          </div>

          {/* Featured Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={featuredImage}
                  alt={featuredImageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
