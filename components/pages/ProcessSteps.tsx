import { type Locale } from '@/lib/i18n';
import Icon from '@/components/ui/Icon';

interface ProcessStep {
  title: string;
  description: string;
  icon: string;
  duration?: string;
}

interface ProcessStepsProps {
  translations: {
    title: string;
    subtitle?: string;
    steps: ProcessStep[];
  };
  locale: Locale;
}

export default function ProcessSteps({ translations, locale }: ProcessStepsProps) {
  if (!translations || !translations.steps || translations.steps.length === 0) {
    return (
      <section className="py-20 bg-neutral-50">
        <div className="container-custom text-center">
          <h2 className="text-h1 text-secondary mb-4">
            {locale === 'lt' ? 'Kraunami proceso žingsniai...' : 
             locale === 'pl' ? 'Ładowanie kroków procesu...' : 
             locale === 'uk' ? 'Завантаження кроків процесу...' : 
             'Loading process steps...'}
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-neutral-50">
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

        {/* Process Steps */}
        <div className="relative">
          {/* Desktop: Horizontal Layout */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-8">
              {translations.steps.map((step, index) => (
                <div key={index} className="flex-1 relative">
                  {/* Connection Line */}
                  {index < translations.steps.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-primary/20 z-0" 
                         style={{ transform: 'translateX(50%)' }} />
                  )}
                  
                  {/* Step Circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Icon name={step.icon as any} className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Step Details */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {translations.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-h3 font-semibold text-secondary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-body text-neutral-600 mb-2">
                    {step.description}
                  </p>
                  {step.duration && (
                    <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                      <Icon name="Clock" className="w-4 h-4" />
                      <span>{step.duration}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Layout */}
          <div className="lg:hidden space-y-8">
            {translations.steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                {/* Step Number and Icon */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
                    <Icon name={step.icon as any} className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  {/* Connection Line */}
                  {index < translations.steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-primary/20 mt-4" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <h3 className="text-h3 font-semibold text-secondary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body text-neutral-600 mb-3">
                    {step.description}
                  </p>
                  {step.duration && (
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Icon name="Clock" className="w-4 h-4" />
                      <span>{step.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-md max-w-2xl mx-auto">
            <h3 className="text-h2 font-bold text-secondary mb-4">
              {locale === 'lt' ? 'Pasiruošę pradėti?' : 
               locale === 'pl' ? 'Gotowy do rozpoczęcia?' : 
               locale === 'uk' ? 'Готові розпочати?' : 
               'Ready to Get Started?'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {locale === 'lt' ? 'Susisiekite su mumis šiandien ir gaukite nemokamą konsultaciją bei tikslų kainų pasiūlymą.' : 
               locale === 'pl' ? 'Skontaktuj się z nami już dziś i otrzymaj bezpłatną konsultację oraz dokładną wycenę.' : 
               locale === 'uk' ? 'Зв\'яжіться з нами сьогодні та отримайте безкоштовну консультацію та точну оцінку.' : 
               'Contact us today for a free consultation and accurate quote.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                {locale === 'lt' ? 'Kviesti meistrą' : 
                 locale === 'pl' ? 'Wezwać technika' : 
                 locale === 'uk' ? 'Викликати техніка' : 
                 'Call a Technician'}
              </button>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                {locale === 'lt' ? 'Konsultacija' : 
                 locale === 'pl' ? 'Konsultacja' : 
                 locale === 'uk' ? 'Консультація' : 
                 'Consultation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
