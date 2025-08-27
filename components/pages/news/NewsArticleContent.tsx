import React from 'react';
import { Locale } from '@/lib/i18n';
import { processContentWithCallouts } from '@/lib/markdown-utils';
import { NewsLabelsTranslations, getLoadingText, getSectionTypeLabel } from '@/lib/news-utils';

interface ArticleSection {
  id: string;
  title: string;
  content: string;
  tips?: string[];
  benefits?: string[];
  warning?: string;
  callout?: string;
}

interface NewsArticleContentProps {
  introduction: string;
  sections: ArticleSection[];
  locale: Locale;
  newsLabels?: NewsLabelsTranslations;
}


export default function NewsArticleContent({
  introduction,
  sections,
  locale,
  newsLabels
}: NewsArticleContentProps) {
  // Early validation to prevent runtime errors
  if (!locale || !sections) {
    return (
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-600">
              {getLoadingText(locale, newsLabels)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          {introduction && (
            <div className="prose prose-lg max-w-none mb-12">
              <div 
                className="text-lg text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processContentWithCallouts(introduction) }}
              />
            </div>
          )}

          {/* Article Sections */}
          {sections && sections.map((section) => (
            <div key={section.id} id={section.id} className="mb-16">
              {/* Section Title */}
              <h2 className="text-h2 font-semibold text-secondary mb-6">
                {section.title}
              </h2>

              {/* Section Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="news-content"
                  dangerouslySetInnerHTML={{ 
                    __html: processContentWithCallouts(section.content, {
                      tips: section.tips,
                      benefits: section.benefits,
                      warning: section.warning,
                      callout: section.callout
                    })
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
