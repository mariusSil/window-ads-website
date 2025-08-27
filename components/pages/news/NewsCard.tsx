import Link from 'next/link';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

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

interface NewsCardProps {
  article: NewsArticle;
  locale: Locale;
  translations: {
    readMoreText: string;
  };
  articleUrl: string;
}


export default function NewsCard({ article, locale, translations, articleUrl }: NewsCardProps) {
  const { localizedSEO } = article;
  
  return (
    <article className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden group">
      {/* Featured Image */}
      <div className="aspect-video bg-neutral-100 relative overflow-hidden">
        {localizedSEO.ogImage ? (
          <Image
            src={localizedSEO.ogImage}
            alt={localizedSEO.ogImageAlt || localizedSEO.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <Icon name="Newspaper" className="w-12 h-12 text-neutral-400" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-h3 text-secondary mb-3 group-hover:text-primary transition-colors duration-200">
          <Link href={articleUrl} className="hover:no-underline">
            {localizedSEO.title}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-body text-neutral-600 mb-4 line-clamp-3">
          {localizedSEO.description}
        </p>
        
        {/* Read More CTA */}
        <Link href={articleUrl}>
          <Button 
            variant="outline-red" 
            size="sm" 
            className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-200"
          >
            {translations.readMoreText}
            <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </article>
  );
}
