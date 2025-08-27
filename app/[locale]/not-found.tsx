'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { type Locale, isValidLocale, defaultLocale } from '@/lib/i18n';
import { getButtonText } from '@/lib/button-constants';
import Icon from '@/components/ui/Icon';
import { CTAButtons } from '@/components/common/CTAButtons';
import { GoBackButton } from '@/components/common/GoBackButton';

interface NotFoundContent {
  title: string;
  subtitle: string;
  description: string;
  suggestions: {
    title: string;
    items: string[];
  };
  navigation: {
    homepage: string;
    services: string;
    contact: string;
    goBack: string;
  };
  ctaSection: {
    title: string;
    description: string;
  };
}

const notFoundTranslations: Record<Locale, NotFoundContent> = {
  en: {
    title: 'Page Not Found',
    subtitle: '404 Error',
    description: "The page you're looking for doesn't exist or has been moved.",
    suggestions: {
      title: 'What can you do?',
      items: [
        'Check the URL for typos',
        'Go back to the previous page',
        'Visit our homepage',
        'Contact us for assistance'
      ]
    },
    navigation: {
      homepage: 'Go to Homepage',
      services: 'Our Services',
      contact: 'Contact Us',
      goBack: 'Go Back'
    },
    ctaSection: {
      title: 'Need Help Finding What You\'re Looking For?',
      description: 'Our expert team is here to help. Get in touch for immediate assistance with your window and door needs.'
    }
  },
  lt: {
    title: 'Puslapis Nerastas',
    subtitle: '404 Klaida',
    description: 'Ieškomas puslapis neegzistuoja arba buvo perkeltas.',
    suggestions: {
      title: 'Ką galite daryti?',
      items: [
        'Patikrinkite URL klaidų',
        'Grįžkite į ankstesnį puslapį',
        'Apsilankykite mūsų pagrindiniame puslapyje',
        'Susisiekite su mumis pagalbos'
      ]
    },
    navigation: {
      homepage: 'Eiti į Pagrindinį',
      services: 'Mūsų Paslaugos',
      contact: 'Susisiekti',
      goBack: 'Grįžti'
    },
    ctaSection: {
      title: 'Reikia Pagalbos Rasti Tai, Ko Ieškote?',
      description: 'Mūsų ekspertų komanda pasiruošusi padėti. Susisiekite dėl skubios pagalbos su langų ir durų poreikiais.'
    }
  },
  pl: {
    title: 'Strona Nie Znaleziona',
    subtitle: 'Błąd 404',
    description: 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
    suggestions: {
      title: 'Co możesz zrobić?',
      items: [
        'Sprawdź URL pod kątem błędów',
        'Wróć do poprzedniej strony',
        'Odwiedź naszą stronę główną',
        'Skontaktuj się z nami o pomoc'
      ]
    },
    navigation: {
      homepage: 'Idź do Strony Głównej',
      services: 'Nasze Usługi',
      contact: 'Kontakt',
      goBack: 'Wróć'
    },
    ctaSection: {
      title: 'Potrzebujesz Pomocy w Znalezieniu Tego, Czego Szukasz?',
      description: 'Nasz zespół ekspertów jest tutaj, aby pomóc. Skontaktuj się z nami w celu natychmiastowej pomocy z potrzebami okien i drzwi.'
    }
  },
  uk: {
    title: 'Сторінка Не Знайдена',
    subtitle: 'Помилка 404',
    description: 'Сторінка, яку ви шукаєте, не існує або була переміщена.',
    suggestions: {
      title: 'Що ви можете зробити?',
      items: [
        'Перевірте URL на помилки',
        'Поверніться на попередню сторінку',
        'Відвідайте нашу головну сторінку',
        'Зв\'яжіться з нами за допомогою'
      ]
    },
    navigation: {
      homepage: 'Перейти на Головну',
      services: 'Наші Послуги',
      contact: 'Контакти',
      goBack: 'Назад'
    },
    ctaSection: {
      title: 'Потрібна Допомога у Пошуку Того, Що Шукаєте?',
      description: 'Наша команда експертів тут, щоб допомогти. Зв\'яжіться з нами для негайної допомоги з потребами вікон та дверей.'
    }
  }
};

export default function NotFound() {
  const pathname = usePathname();
  
  // Extract locale from pathname
  const segments = pathname.split('/').filter(Boolean);
  const detectedLocale = segments[0];
  const locale: Locale = isValidLocale(detectedLocale) ? detectedLocale : defaultLocale;
  
  // Get translations for current locale
  const content = notFoundTranslations[locale];
  
  // Create minimal translations for CTA buttons
  const minimalTranslations = {
    technician: {
      prefillMessage: `I need help with window and door services. I found your contact through your 404 page.`
    },
    consultation: {
      prefillMessage: `I would like a free consultation for window and door services.`
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main 404 Content */}
      <section className="py-section">
        <div className="container-custom max-w-4xl mx-auto text-center">
          {/* 404 Icon and Error Message */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon name="X" className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl font-bold text-red-600 mb-2">
              {content.subtitle}
            </h1>
            
            <h2 className="text-h1 text-secondary mb-4">
              {content.title}
            </h2>
            
            <p className="text-body text-neutral-600 max-w-2xl mx-auto mb-8">
              {content.description}
            </p>
          </div>

          {/* Suggestions Section */}
          <div className="mb-12">
            <h3 className="text-h2 text-secondary mb-6">
              {content.suggestions.title}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              {content.suggestions.items.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-center text-left p-4 bg-white rounded-lg shadow-sm">
                  <Icon name="Check" className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <span className="text-body text-neutral-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Go Back Button */}
          <div className="text-center mb-12">
            <GoBackButton text={content.navigation.goBack} />
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto mb-12">
            <h3 className="text-h2 text-secondary mb-4">
              {content.ctaSection.title}
            </h3>
            <p className="text-body text-neutral-600 mb-6">
              {content.ctaSection.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CTAButtons
                locale={locale}
                translations={minimalTranslations}
                technicianProps={{ variant: "default", size: "default" }}
                consultationProps={{ variant: "outline-red", size: "default" }}
                layout="horizontal"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
