import React from 'react';
import Image from 'next/image';
import { CTAButtons } from '@/components/common/CTAButtons';
import { getButtonText } from '@/lib/button-constants';
import { type Locale } from '@/lib/i18n';

interface ServiceArticleProps {
  translations: {
    title: string;
    subtitle?: string;
    image: {
      src: string;
      alt: string;
    };
    content: {
      introduction: string;
      sections: {
        title: string;
        content: string;
      }[];
    };
    cta: {
      title: string;
      description: string;
    };
  };
  locale: Locale;
}

export default function ServiceArticle({ translations, locale }: ServiceArticleProps) {
  // Validation with locale-aware fallback
  if (!translations || !translations.title) {
    const fallbackTitle = {
      en: 'Service Information',
      lt: 'Paslaugos Informacija',
      pl: 'Informacje o Usłudze',
      uk: 'Інформація про Послугу'
    };

    const fallbackDescription = {
      en: 'Loading service details...',
      lt: 'Kraunama paslaugos informacija...',
      pl: 'Ładowanie informacji o usłudze...',
      uk: 'Завантаження інформації про послугу...'
    };

    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-h1 text-secondary mb-4">
              {fallbackTitle[locale]}
            </h1>
            <p className="text-body text-neutral-600">
              {fallbackDescription[locale]}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <article className="py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-hero text-secondary mb-4">
            {translations.title}
          </h1>
          {translations.subtitle && (
            <p className="text-h3 text-neutral-600 max-w-3xl mx-auto">
              {translations.subtitle}
            </p>
          )}
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={translations.image.src}
                alt={translations.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-body text-neutral-700 leading-relaxed">
                {translations.content.introduction}
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              {translations.content.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-h3 text-secondary mb-3">
                    {section.title}
                  </h3>
                  <div 
                    className="text-body text-neutral-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-neutral-50 rounded-lg p-8 text-center">
          <h2 className="text-h2 text-secondary mb-4">
            {translations.cta.title}
          </h2>
          <p className="text-body text-neutral-600 mb-8 max-w-2xl mx-auto">
            {translations.cta.description}
          </p>
          <div className="flex justify-center">
          <CTAButtons
            locale={locale}
            translations={{
              technician: {
                prefillMessage: `I'm interested in ${translations.title}`
              },
              consultation: {
                prefillMessage: `I'd like a consultation about ${translations.title}`
              }
            }}
            technicianProps={{ variant: "default", size: "lg" }}
            consultationProps={{ variant: "outline-red", size: "lg" }}
            layout="horizontal"
          />
          </div>
        </section>
      </div>
    </article>
  );
}
