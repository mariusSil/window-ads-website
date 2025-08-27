'use client';

import React from 'react';
import { RequestTechnicianButton } from '../common/RequestTechnicianButton';
import { ConsultationButton } from '../common/ConsultationButton';
import { Button } from '@/components/ui/Button';
import Icon from '../ui/Icon';
import { Locale } from '@/lib/i18n';

interface ProcessStep {
  step: number;
  icon: string;
  title: string;
  description: string;
  duration?: string;
}

interface GuaranteeItem {
  icon: string;
  title: string;
  description: string;
}

interface CTAButton {
  text: string;
  link?: string;
  action?: 'modal' | 'consultation' | 'link';
  variant: 'default' | 'outline-red' | 'secondary' | 'emergency';
  icon?: string;
  phone?: string;
}

interface EmergencyContact {
  text: string;
  phone: string;
  availability: string;
}

interface TrustIndicator {
  icon: string;
  text: string;
  value?: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FreeDiagnosticsProps {
  translations: {
    title: string;
    subtitle?: string;
    items: FeatureItem[];
    cta: CTAButton[];
  };
  className?: string;
  locale: Locale;
}

export function FreeDiagnostics({ locale, translations, className = '' }: FreeDiagnosticsProps) {
  const {
    title = '',
    subtitle = '',
    items = [],
    cta = []
  } = translations || {};
  const handleCTAClick = (button: CTAButton) => {
    // Track conversion for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'diagnostics_request', {
        event_category: 'conversion',
        event_label: 'free_diagnostics_section',
        value: 1
      });
    }
    
    if (button.phone && button.variant === 'emergency') {
      window.location.href = `tel:${button.phone}`;
    }
  };

  return (
    <section 
      className={`py-16 bg-white ${className}`}
      aria-labelledby="diagnostics-title"
      role="region"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="diagnostics-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Features Grid */}
        {items && items.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map((item, index) => (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="flex flex-col items-center">
                    {/* Feature Icon */}
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon 
                        name={item.icon as any} 
                        className="w-8 h-8 text-white" 
                      />
                    </div>
                    
                    {/* Feature Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        {cta && cta.length > 0 && (
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {cta.map((button, index) => {
                if (button.action === 'modal') {
                  // Primary button - opens modal
                  return (
                    <RequestTechnicianButton
                      key={index}
                      variant={button.variant as any}
                      size="lg"
                      className="px-8 py-3 text-base font-semibold"
                      locale={locale}
                    />
                  );
                } else if (button.action === 'consultation' || button.text.toLowerCase().includes('consultation') || button.text.toLowerCase().includes('konsultacija') || button.text.toLowerCase().includes('консультація')) {
                  // Secondary button - opens consultation modal
                  return (
                    <ConsultationButton
                      key={index}
                      variant={button.variant as any}
                      size="lg"
                      className="px-8 py-3 text-base font-semibold"
                      locale={locale}
                    />
                  );
                } else {
                  // Regular link button
                  return (
                    <a key={index} href={button.link} className="inline-block">
                      <Button
                        variant={button.variant as any}
                        size="lg"
                        className="px-8 py-3 text-base font-semibold"
                      >
                        {button.text}
                      </Button>
                    </a>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
