import React from 'react';
import { type Locale } from '@/lib/i18n';
import { ConsultationButton } from '@/components/common/ConsultationButton';
import Icon from '@/components/ui/Icon';

interface LargeCustomersProps {
  locale: Locale;
  translations: {
    headline: string;
    stats: {
      number: string;
      description: string;
    };
    testimonial: {
      quote: string;
      author: string;
      company: string;
      position: string;
    };
    trustIndicators: string[];
    ctaText?: string;
  };
  className?: string;
}

const LargeCustomers: React.FC<LargeCustomersProps> = ({
  translations,
  locale,
  className = ''
}) => {
  // Fallback content for missing translations
  if (!translations || !translations.headline) {
    const fallbackText = {
      en: 'Trusted by Large Customers',
      lt: 'Patikimi didelių klientų',
      pl: 'Zaufani przez dużych klientów',
      uk: 'Довіряють великі клієнти'
    };

    return (
      <section className={`py-16 bg- ${className}`}>
        <div className="container-custom text-center">
          <h2 className="text-h2 text-secondary mb-4">
            {fallbackText[locale] || fallbackText.en}
          </h2>
          <p className="text-body text-neutral-600">
            {locale === 'lt' ? 'Kraunama...' : 
             locale === 'pl' ? 'Ładowanie...' : 
             locale === 'uk' ? 'Завантаження...' : 'Loading...'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-h2 text-secondary mb-4">
              {translations.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stats and Trust Indicators */}
            <div className="space-y-8">
              {/* Main Stat */}
              {translations.stats && (
                <div className="text-center lg:text-left">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {translations.stats.number}
                  </div>
                  <p className="text-body text-neutral-600 font-medium">
                    {translations.stats.description}
                  </p>
                </div>
              )}

              {/* Trust Indicators */}
              {translations.trustIndicators && translations.trustIndicators.length > 0 && (
                <div className="space-y-3">
                  {translations.trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="Check" className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-body text-secondary">
                        {indicator}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Testimonial */}
            {translations.testimonial && (
              <div className="bg-neutral-50 p-8 rounded-card">
                <div className="mb-4">
                  <Icon name="Quote" className="w-8 h-8 text-primary/30" />
                </div>
                
                <blockquote className="text-body text-secondary mb-6 italic">
                  "{translations.testimonial.quote}"
                </blockquote>
                
                <div className="border-t border-neutral-200 pt-4">
                  <div className="font-semibold text-secondary">
                    {translations.testimonial.author}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {translations.testimonial.position}
                  </div>
                  <div className="text-sm text-primary font-medium">
                    {translations.testimonial.company}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-12">
            <ConsultationButton
              locale={locale}
              translations={{
                consultation: {
                  prefillMessage: ``
                }
              }}
              variant="outline-red"
              size="default"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargeCustomers;
