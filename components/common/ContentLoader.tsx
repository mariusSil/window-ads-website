import React from 'react';
import { type Locale } from '@/lib/i18n';

interface ContentLoaderProps {
  locale: Locale;
  componentType: 'services' | 'accessories' | 'team' | 'properties' | 'transformations' | 'faq' | 'generic';
  className?: string;
  showTitle?: boolean;
  message?: 'loading' | 'unavailable' | 'not-found';
}

const getComponentTitle = (componentType: ContentLoaderProps['componentType'], locale: Locale): string => {
  const titles = {
    services: {
      lt: 'Paslaugos',
      pl: 'Usługi', 
      uk: 'Послуги',
      en: 'Services'
    },
    accessories: {
      lt: 'Priedai',
      pl: 'Akcesoria',
      uk: 'Аксесуари', 
      en: 'Accessories'
    },
    team: {
      lt: 'Mūsų komanda',
      pl: 'Nasz zespół',
      uk: 'Наша команда',
      en: 'Our Team'
    },
    properties: {
      lt: 'Objektų tipai',
      pl: 'Typy nieruchomości',
      uk: 'Типи об\'єктів',
      en: 'Property Types'
    },
    transformations: {
      lt: 'Transformacijos',
      pl: 'Transformacje',
      uk: 'Трансформації',
      en: 'Transformations'
    },
    faq: {
      lt: 'Dažnai užduodami klausimai',
      pl: 'Często zadawane pytania',
      uk: 'Часті запитання',
      en: 'Frequently Asked Questions'
    },
    generic: {
      lt: 'Turinys',
      pl: 'Treść',
      uk: 'Контент',
      en: 'Content'
    }
  };

  return titles[componentType][locale];
};

const getMessage = (message: ContentLoaderProps['message'], locale: Locale): string => {
  const messages = {
    loading: {
      lt: 'Turinys kraunamas...',
      pl: 'Ładowanie treści...',
      uk: 'Завантаження контенту...',
      en: 'Content loading...'
    },
    unavailable: {
      lt: 'Turinys šiuo metu nepasiekiamas',
      pl: 'Treść obecnie niedostępna',
      uk: 'Контент наразі недоступний',
      en: 'Content currently unavailable'
    },
    'not-found': {
      lt: 'Turinys nerastas',
      pl: 'Nie znaleziono treści',
      uk: 'Контент не знайдено',
      en: 'Content not found'
    }
  };

  return messages[message || 'loading'][locale];
};

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  locale,
  componentType,
  className = '',
  showTitle = true,
  message = 'loading'
}) => {
  return (
    <section className={`py-20 bg-neutral-50 ${className}`}>
      <div className="container-custom text-center">
        {showTitle && (
          <h2 className="text-h1 text-secondary mb-4">
            {getComponentTitle(componentType, locale)}
          </h2>
        )}
        <p className="text-body text-neutral-600">
          {getMessage(message, locale)}
        </p>
      </div>
    </section>
  );
};

export default ContentLoader;
