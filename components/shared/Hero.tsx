'use client';

import Icon from '@/components/ui/Icon';
import { CTAButtons } from '../common/CTAButtons';
import { Locale } from '@/lib/i18n';
import { useParallax } from '@/hooks/useParallax';

// Icon mapping function to handle string icon names from content
const getIconByName = (iconName: string) => {
  const iconMap: { [key: string]: string } = {
    'Wrench': 'Wrench',
    'Clock': 'Clock',
    'ShieldCheck': 'ShieldCheck',
    'Shield': 'ShieldCheck',
    'Phone': 'Phone',
    'Info': 'Info',
    'Tools': 'Wrench',
    'MapMarker': 'MapPin',
    'Calendar': 'Calendar',
    'Comments': 'MessageSquare'
  };
  
  return iconMap[iconName] || 'Wrench'; // fallback to wrench icon
};

interface HeroProps {
  locale: Locale;
  translations: {
    badge: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      subtitle: string;
    }>;
    rating: {
      stars: number;
      reviews: string;
    };
    image: {
      src: string;
      alt: string;
    };
    cta: Array<{
      text: string;
      link: string;
      variant: string;
      icon: string;
    }>;
    // Add modal translations for CTAButtons
    triggerButton?: string;
    title?: string;
    nameLabel?: string;
    namePlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    cityLabel?: string;
    cityPlaceholder?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    serviceLabel?: string;
    servicePlaceholder?: string;
    messageLabel?: string;
    messagePlaceholder?: string;
    submitButton?: string;
    successMessage?: string;
  };
  backgroundImage?: string;
  className?: string;
  parallaxSpeed?: number;
  enableParallax?: boolean;
}

export function Hero({ 
  locale,
  translations,
  backgroundImage = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d13f0792a2-b2486b2cccf0c1039aa4.png',
  className = '',
  parallaxSpeed = 0.12,
  enableParallax = true
}: HeroProps) {

  const { elementRef, transform } = useParallax({ 
    speed: parallaxSpeed, 
    disabled: !enableParallax 
  });

  // Add null checks to prevent undefined access errors
  if (!translations) {
    console.error('Hero: translations is required but was undefined')
    return null
  }

  // Use translations.features from content instead of hardcoded values
  const trustIndicators = translations.features || [];

  return (
    <section 
      ref={elementRef}
      className={`relative min-h-[600px] flex items-center text-white py-12 md:py-12 lg:py-16 overflow-hidden ${className}`}
    >
      {/* Parallax Background Layer */}
      <div 
        className="absolute inset-0 w-full h-[120%] -top-[10%] parallax-element"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: transform,
          willChange: 'transform'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.6) 100%)'
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div>
            {/* Badge */}
            {translations.badge && (
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Icon name="MapPin" className="w-4 h-4 text-primary" />
              <span>{translations.badge}</span>
              </div>
            )}
          
          {/* Main Heading */}
          <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight lg:leading-[1.1] text-white">
              {translations.title}
            </h1>
          </div>
                    {/* Subtitle */}
          <div className="max-w-2xl">
           <p className="text-sm sm:text-base md:text-lg mb-6 text-gray-300 leading-relaxed">
              {translations.subtitle}
            </p>
            </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mb-6">
            {trustIndicators.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon name={getIconByName(feature.icon) as any} className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-white">{feature.title}</p>
                  <p className="text-xs text-white">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          {translations.cta && (
            <div className="mb-8">
              <CTAButtons 
                locale={locale}
                translations={{}}
                technicianProps={{ variant: "primary", size: "xl" }}
                consultationProps={{ variant: "blue", size: "xl" }}
              />
            </div>
          )}

          {/* Rating */}
          {translations.rating && (
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(Math.floor(translations.rating.stars))].map((_, index) => (
                    <Icon key={index} name="Star" className="w-5 h-5 fill-current" />
                  ))}
                  {translations.rating.stars % 1 !== 0 && (
                    <Icon name="Star" className="w-5 h-5 opacity-50 fill-current" />
                  )}
                <span className="ml-2 text-white font-bold text-sm sm:text-base">{translations.rating.stars}/5 rating</span>
              </div>
              <span className="text-gray-400">•</span>
              <p className="text-gray-300 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: translations.rating.reviews.replace(/(\d+)/, '<strong>$1</strong>') }} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
