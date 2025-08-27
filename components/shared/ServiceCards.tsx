import React from 'react';
import Image from 'next/image';
import { RequestTechnicianButton } from '../common/RequestTechnicianButton';
import { type Locale } from '@/lib/i18n';
import ContentLoader from '../common/ContentLoader';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  priceFrom: string;
  image: {
    src: string;
    alt: string;
  };
  isEmergency?: boolean;
  prefillText: string;
}

interface ServiceCardsProps {
  translations: {
    sectionTitle: string;
    sectionSubtitle: string;
    buttonText: string;
    services: ServiceCard[];
  };
  modalTranslations: {
    triggerButton: string;
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    privacyPolicyText: string;
    privacyPolicyLink: string;
    submitButton: string;
  };
  locale: Locale;
  className?: string;
}

export function ServiceCards({ 
  translations,
  modalTranslations,
  locale,
  className = ""
}: ServiceCardsProps) {
  // Add validation for translations object
  if (!translations || typeof translations !== 'object') {
    console.warn('ServiceCards: Invalid translations object received:', translations);
    return <ContentLoader locale={locale} componentType="services" message="loading" />;
  }

  const { sectionTitle, sectionSubtitle, services } = translations;

  if (!services || services.length === 0) {
    return <ContentLoader locale={locale} componentType="services" message="unavailable" />;
  }

  return (
    <section id="services" className={`py-14 bg-neutral-50 ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-space-component">
          <h2 className="text-h1 text-secondary mb-4">{sectionTitle}</h2>
          <p className="text-body text-neutral-600 max-w-3xl mx-auto">{sectionSubtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service: ServiceCard) => (
            <div 
              key={service.id} 
              className={`bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col`}
            >
              {/* Service Image */}
              <div className="w-full h-48 relative bg-neutral-100 overflow-hidden">
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Service Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-h3 text-secondary mb-2 sm:mb-3">{service.title}</h3>
                <p className="text-body text-neutral-600 flex-grow mb-3 sm:mb-4 leading-relaxed min-h-[4.5rem]">
                  {service.description}
                </p>
                
                {/* Price and CTA */}
                <div className="mt-auto">
                  <p className="text-lg font-semibold text-secondary mb-3 sm:mb-4">{service.priceFrom}</p>
                  <RequestTechnicianButton
                    variant="default"
                    size="sm"
                    className="w-full"
                    prefillMessage={service.prefillText}
                    locale={locale}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
