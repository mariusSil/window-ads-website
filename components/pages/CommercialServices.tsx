import React from 'react';
import { type Locale } from '@/lib/i18n';
import Icon from '@/components/ui/Icon';
import { ConsultationButton } from '../common/ConsultationButton';

interface CommercialServicesProps {
  locale: Locale;
  translations: {
    headline: string;
    subtext: string;
    keyPoints: string[];
    ctaText?: string;
  };
  className?: string;
}

const CommercialServices: React.FC<CommercialServicesProps> = ({
  translations,
  locale,
  className = ''
}) => {
  // Fallback content for missing translations
  if (!translations || !translations.headline) {
    const fallbackText = {
      en: 'We Also Serve Commercial & Industrial Properties',
      lt: 'Taip pat aptarnaujame komercinius ir pramonės objektus',
      pl: 'Obsługujemy również nieruchomości komercyjne i przemysłowe',
      uk: 'Ми також обслуговуємо комерційну та промислову нерухомість'
    };

    return (
      <section className={`py-16 bg-neutral-50 ${className}`}>
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
    <section className={`py-16 bg-neutral-50 ${className}`}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h2 className="text-h2 text-secondary mb-4">
            {translations.headline}
          </h2>
          
          <p className="text-body text-neutral-600 mb-8 text-lg">
            {translations.subtext}
          </p>

          {/* Key Points Grid */}
          {translations.keyPoints && translations.keyPoints.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {translations.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3 text-left">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                    <Icon name="Check" className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-body text-secondary font-medium">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="flex justify-center">
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
      </div>
    </section>
  );
};

export default CommercialServices;
