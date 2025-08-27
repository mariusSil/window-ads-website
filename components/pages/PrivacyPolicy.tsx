import React from 'react';
import { Locale } from '@/lib/i18n';

interface PrivacyPolicySection {
  title: string;
  content: Array<{
    subtitle: string;
    text: string;
  }>;
}

interface PrivacyPolicyProps {
  locale: Locale;
  sections: PrivacyPolicySection[];
}

export default function PrivacyPolicy({ locale, sections }: PrivacyPolicyProps) {
  // Handle case where sections might be undefined or empty
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-space-section">
        <div className="text-center">
          <h2 className="text-h2 font-semibold text-primary mb-4">
            {locale === 'en' && 'Privacy Policy Content Not Available'}
            {locale === 'lt' && 'Privatumo politikos turinys nepasiekiamas'}
            {locale === 'pl' && 'Treść polityki prywatności niedostępna'}
            {locale === 'uk' && 'Зміст політики конфіденційності недоступний'}
          </h2>
          <p className="text-body text-neutral-600">
            {locale === 'en' && 'Please try again later or contact support.'}
            {locale === 'lt' && 'Bandykite dar kartą vėliau arba susisiekite su palaikymu.'}
            {locale === 'pl' && 'Spróbuj ponownie później lub skontaktuj się z pomocą techniczną.'}
            {locale === 'uk' && 'Спробуйте ще раз пізніше або зв\'яжіться з підтримкою.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-12">
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 pb-3 border-b border-neutral-200">
              {section.title}
            </h2>
            
            <div className="space-y-6">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-4">
                    {item.subtitle}
                  </h3>
                  <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-line">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      
    
    </div>
  );
}
