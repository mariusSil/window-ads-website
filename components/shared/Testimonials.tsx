import React from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { CTAButtons } from '../common/CTAButtons';
import { type Locale } from '@/lib/i18n';

interface TestimonialItem {
  quote: string;
  name: string;
  avatar: string;
  rating: number;
}

interface TestimonialsProps {
  locale: Locale;
  translations: {
    title: string;
    subtitle?: string;
    items: TestimonialItem[];
    request_technician_modal?: any;
  };
  className?: string;
}

const Testimonials = ({ locale, translations, className = '' }: TestimonialsProps) => {
  if (!translations || !Array.isArray(translations.items) || translations.items.length === 0) {
    return null;
  }

  return (
    <section className={`bg-accent py-20 ${className}`}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-h1 text-neutral-900 mb-4">
            {translations.title}
          </h2>
          {translations.subtitle && (
            <p className="text-body text-neutral-600 max-w-2xl mx-auto">
              {translations.subtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {translations.items.map((testimonial: TestimonialItem, index: number) => (
            <div key={index} className="flex flex-col rounded-card shadow-card bg-white overflow-hidden">
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icon 
                        key={i} 
                        name="Star" 
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-body text-neutral-600">
                    <p>"{testimonial.quote}"</p>
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                  </div>
                </figcaption>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center">
          <CTAButtons
            locale={locale}
            translations={{}}
            technicianProps={{ 
              variant: "primary", 
              size: "lg" 
            }}
            consultationProps={{ 
              variant: "outline-red", 
              size: "lg" 
            }}
            layout="horizontal"
            className="gap-4"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
