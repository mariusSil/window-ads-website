import React from 'react';
interface CtaBannerProps {
  content: {
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  locale: string;
}

const CtaBanner = ({ content, locale }: CtaBannerProps) => {
  // Provide fallback content if content is undefined
  if (!content || !content.title) {
    const fallbackContent = {
      en: {
        title: 'Get Professional Window & Door Services',
        subtitle: 'Contact our expert team for quality repairs and installations',
        primaryCta: { label: 'Call Technician', href: '/contact' },
        secondaryCta: { label: 'Get Quote', href: '/contact' }
      },
      lt: {
        title: 'Gaukite Profesionalias Langų ir Durų Paslaugas',
        subtitle: 'Susisiekite su mūsų ekspertų komanda dėl kokybišku remonto ir montavimo',
        primaryCta: { label: 'Kviesti Meistrą', href: '/contact' },
        secondaryCta: { label: 'Gauti Pasiūlymą', href: '/contact' }
      },
      pl: {
        title: 'Uzyskaj Profesjonalne Usługi Okien i Drzwi',
        subtitle: 'Skontaktuj się z naszym zespołem ekspertów w sprawie wysokiej jakości napraw i instalacji',
        primaryCta: { label: 'Wezwać Technika', href: '/contact' },
        secondaryCta: { label: 'Otrzymaj Wycenę', href: '/contact' }
      },
      uk: {
        title: 'Отримайте Професійні Послуги Вікон та Дверей',
        subtitle: 'Зв\'яжіться з нашою командою експертів для якісного ремонту та встановлення',
        primaryCta: { label: 'Викликати Техніка', href: '/contact' },
        secondaryCta: { label: 'Отримати Пропозицію', href: '/contact' }
      }
    };

    const fallback = fallbackContent[locale as keyof typeof fallbackContent] || fallbackContent.en;
    content = fallback;
  }

  return (
    <div className="bg-gray-100 py-8">
      <div className="container-custom mx-auto flex flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{content.title}</h2>
          <p className="text-lg text-gray-600">{content.subtitle}</p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row">
          <a
            href={`/${locale}${content.primaryCta.href}`}
            className="inline-block rounded-md bg-red-600 px-8 py-3 text-center font-semibold text-white hover:bg-red-700"
          >
            {content.primaryCta.label}
          </a>
          <a
            href={`/${locale}${content.secondaryCta.href}`}
            className="inline-block rounded-md bg-blue-600 px-8 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            {content.secondaryCta.label}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CtaBanner;
