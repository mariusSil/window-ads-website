import { type Locale } from '@/lib/i18n';
import Icon from '@/components/ui/Icon';

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  duration?: string;
  warranty?: string;
}

interface ServiceDetailsProps {
  translations: {
    title: string;
    subtitle?: string;
    services: ServiceItem[];
  };
  locale: Locale;
}

export default function ServiceDetails({ translations, locale }: ServiceDetailsProps) {
  if (!translations || !translations.services || translations.services.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-h1 text-secondary mb-4">
            {locale === 'lt' ? 'Kraunami paslaugų duomenys...' : 
             locale === 'pl' ? 'Ładowanie danych usług...' : 
             locale === 'uk' ? 'Завантаження даних послуг...' : 
             'Loading service details...'}
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h1 font-bold text-secondary mb-4">
            {translations.title}
          </h2>
          {translations.subtitle && (
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              {translations.subtitle}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {translations.services.map((service, index) => (
            <div 
              key={index}
              className="bg-neutral-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:bg-white border border-transparent hover:border-primary/20"
            >
              {/* Service Icon */}
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon name={service.icon as any} className="w-8 h-8 text-white" />
              </div>

              {/* Service Title */}
              <h3 className="text-h3 font-semibold text-secondary mb-3">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-body text-neutral-600 mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Service Details */}
              <div className="space-y-2">
                {service.duration && (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Icon name="Clock" className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                )}
                {service.warranty && (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Icon name="ShieldCheck" className="w-4 h-4" />
                    <span>{service.warranty}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Icon name="Info" className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {locale === 'lt' ? 'Profesionalus aptarnavimas' : 
                   locale === 'pl' ? 'Profesjonalna obsługa' : 
                   locale === 'uk' ? 'Професійне обслуговування' : 
                   'Professional Service'}
                </h4>
                <p className="text-blue-800 text-sm">
                  {locale === 'lt' ? 'Visi darbai atliekami sertifikuotų specialistų su 5 metų garantija. Naudojame tik originalias dalis ir aukštos kokybės medžiagas.' : 
                   locale === 'pl' ? 'Wszystkie prace wykonywane przez certyfikowanych specjalistów z 5-letnią gwarancją. Używamy tylko oryginalnych części i wysokiej jakości materiałów.' : 
                   locale === 'uk' ? 'Всі роботи виконуються сертифікованими спеціалістами з 5-річною гарантією. Використовуємо лише оригінальні деталі та високоякісні матеріали.' : 
                   'All work performed by certified specialists with 5-year warranty. We use only original parts and high-quality materials.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
