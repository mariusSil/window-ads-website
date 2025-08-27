import { type Locale } from '@/lib/i18n';
import { CTAButtons } from '@/components/common/CTAButtons';
import Icon from '@/components/ui/Icon';

interface ServiceHeroProps {
  translations: {
    title: string;
    subtitle: string;
    priceFrom: string;
    features: string[];
    emergencyNote?: string;
  };
  locale: Locale;
}

export default function ServiceHero({ translations, locale }: ServiceHeroProps) {
  if (!translations || !translations.title) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container-custom text-center">
          <h1 className="text-h1 text-secondary mb-4">
            {locale === 'lt' ? 'Kraunama paslauga...' : 
             locale === 'pl' ? 'Ładowanie usługi...' : 
             locale === 'uk' ? 'Завантаження послуги...' : 
             'Loading service...'}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Service Title */}
          <h1 className="text-hero font-bold text-secondary mb-6">
            {translations.title}
          </h1>

          {/* Service Subtitle */}
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            {translations.subtitle}
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md px-6 py-4 border-l-4 border-primary">
              <div className="flex items-center gap-3">
                <Icon name="DollarSign" className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {translations.priceFrom}
                </span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          {translations.features && translations.features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
              {translations.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/70 rounded-lg px-4 py-3">
                  <Icon name="Check" className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-secondary">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <CTAButtons
              locale={locale}
              translations={{}}
              technicianProps={{ variant: "default", size: "lg" }}
              consultationProps={{ variant: "outline-red", size: "lg" }}
              layout="horizontal"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
