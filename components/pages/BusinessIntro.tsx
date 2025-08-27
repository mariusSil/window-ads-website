import React from 'react';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';

interface BusinessIntroProps {
  locale: Locale;
  translations: {
    headline: string;
    subtext: string;
    keyMessage: string;
    image: {
      src: string;
      alt: string;
    };
  };
  className?: string;
}

const BusinessIntro: React.FC<BusinessIntroProps> = ({
  translations,
  locale,
  className = ''
}) => {
  // Fallback content for missing translations
  if (!translations || !translations.headline) {
    const fallbackText = {
      en: 'Professional Services for All Property Types',
      lt: 'Profesionalios paslaugos visų tipų nekilnojamajam turtui',
      pl: 'Profesjonalne usługi dla wszystkich typów nieruchomości',
      uk: 'Професійні послуги для всіх типів нерухомості'
    };

    return (
      <section className={`py-20 bg-white ${className}`}>
        <div className="container-custom text-center">
          <h2 className="text-h1 text-secondary mb-4">
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
    <section className={`py-20 bg-white ${className}`}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-hero text-secondary leading-tight">
              {translations.headline}
            </h1>
            
            <p className="text-body text-neutral-600 text-lg leading-relaxed">
              {translations.subtext}
            </p>
            
            <div className="bg-neutral-50 p-6 rounded-card">
              <p className="text-body text-secondary font-medium">
                {translations.keyMessage}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-card overflow-hidden shadow-card">
              <Image
                src={translations.image?.src || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4fd55c0734-cf15265bac353682e426.png'}
                alt={translations.image?.alt || 'Professional window repair technicians'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/5 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessIntro;
