import React from 'react';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { LearnMoreButton } from '@/components/common/LearnMoreButton';
import Icon from '@/components/ui/Icon';
import { generatePrefillMessageSync } from '@/lib/prefill-utils';
import { icons } from 'lucide-react';
import ContentLoader from '../common/ContentLoader';

interface PropertyType {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof icons; // Lucide icon name
  image: {
    src: string;
    alt: string;
    placeholder: string; // For development phase
  };
  features: string[];
  ctaText: string;
  ctaLink?: string; // Optional for future routing
}

interface PropertyTypesProps {
  locale: Locale;
  translations: {
    sectionTitle: string;
    sectionSubtitle: string;
    propertyTypes: PropertyType[];
    prefillTemplates?: {
      interestedIn: string;
      inquiryAbout: string;
      requestQuote: string;
    };
  };
  className?: string;
}

const PropertyTypes: React.FC<PropertyTypesProps> = ({
  translations,
  locale,
  className = ''
}) => {
  // Error handling for missing content
  if (!translations || !translations.propertyTypes || !Array.isArray(translations.propertyTypes)) {
    return <ContentLoader locale={locale} componentType="properties" message="loading" className={className} />;
  }

  return (
    <section className={`py-20 bg-neutral-50 ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h1 text-secondary mb-4">
            {translations.sectionTitle}
          </h2>
          <p className="text-body text-neutral-600 max-w-2xl mx-auto">
            {translations.sectionSubtitle}
          </p>
        </div>

        {/* Property Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {translations.propertyTypes.map((propertyType) => (
            <div
              key={propertyType.id}
              className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
            >
              {/* Property Type Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={propertyType.image.src}
                  alt={propertyType.image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Icon 
                    name={propertyType.icon} 
                    className="w-6 h-6 text-primary" 
                  />
                </div>

                {/* Title */}
                <h3 className="text-h3 text-secondary mb-3">
                  {propertyType.title}
                </h3>

                {/* Description */}
                <p className="text-body text-neutral-600 mb-4">
                  {propertyType.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {propertyType.features.map((feature, index) => (
                    <li 
                      key={index}
                      className="flex items-start text-sm text-neutral-600"
                    >
                      <Icon 
                        name="Check" 
                        className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" 
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <LearnMoreButton
                  variant="success"
                  size="sm"
                  className="w-full"
                  locale={locale}
                  customText={propertyType.ctaText}
                  prefillMessage={generatePrefillMessageSync(
                    translations.prefillTemplates,
                    'interestedIn',
                    `${propertyType.title.toLowerCase()} property services`
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
