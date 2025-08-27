import React from 'react';
import Icon from '../ui/Icon';
import { CTAButtons } from '../common/CTAButtons';
import { type Locale } from '@/lib/i18n';

interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

interface CTAButton {
  text: string;
  action?: string;
  link?: string;
  variant: string;
}

interface WhyChooseUsProps {
  translations: {
    title: string;
    subtitle: string;
    items: WhyChooseUsItem[];
    cta?: CTAButton[];
    request_technician_modal?: {
      [key: string]: string;
    };
  };
  locale: Locale;
}

const WhyChooseUs = React.memo(({ translations, locale }: WhyChooseUsProps) => {
  if (!translations || !Array.isArray(translations.items) || translations.items.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container-custom mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-h1 font-semibold tracking-tight text-neutral-900">{translations.title}</h2>
          <p className="mt-4 text-body text-neutral-600">{translations.subtitle}</p>
        </div>
        
        <div className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {translations.items.map((item: WhyChooseUsItem, index: number) => (
              <div key={index} className="group">
                <div className="flex flex-row items-center gap-4">
                  <div className="h-full flex items-center justify-center transition-transform duration-300">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center my-1 transition-transform duration-300">
                      <Icon 
                        name={item.icon as any} 
                        className="w-8 h-8 text-white" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {translations.cta && translations.cta.length > 0 && (
          <div className="mt-12 flex justify-center">
            <CTAButtons
              locale={locale}
              translations={{}}
              technicianProps={{ 
                variant: "default", 
                size: "lg" 
              }}
              consultationProps={{ 
                variant: "outline-red", 
                size: "lg" 
              }}
              layout="horizontal"
              className="justify-center"
            />
          </div>
        )}
      </div>
    </section>
  );
});

export default WhyChooseUs;
