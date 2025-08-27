import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Locale } from '@/lib/i18n';
import { ContentLoader } from '../common/ContentLoader';

// Lazy load the BeforeAfterSlider for performance
const BeforeAfterSlider = dynamic(
  () => import('../common/BeforeAfterSlider'),
  { 
    loading: () => (
      <div className="h-64 md:h-80 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading comparison...</div>
      </div>
    ),
    ssr: false
  }
);

interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface TransformationCase {
  id: string;
  beforeImage: ImageData | string; // Support both old and new formats
  afterImage: ImageData | string;
  title: string;
  description: string;
  client: string;
  location?: string;
  serviceType: string;
}

interface TransformationsProps {
  locale: Locale;
  translations: {
    sectionTitle: string;
    sectionSubtitle: string;
    beforeLabel: string;
    afterLabel: string;
    clientLabel: string;
    cases: TransformationCase[];
    request_technician_modal?: any;
  };
  className?: string;
}

// Placeholder component for development
const ImagePlaceholder = ({ width = "w-full", height = "h-48", description }: { width?: string; height?: string; description: string }) => (
  <div className={`${width} ${height} bg-neutral-200 rounded-lg flex items-center justify-center`}>
    <span className="text-neutral-600 font-medium text-center px-4 text-sm">{description}</span>
  </div>
);

// Helper function to normalize image data
const normalizeImageData = (image: ImageData | string, fallbackAlt: string): ImageData => {
  if (typeof image === 'string') {
    return {
      src: image,
      alt: fallbackAlt,
      width: 800,
      height: 600
    };
  }
  return image;
};

const Transformations = ({ locale, translations, className = '' }: TransformationsProps) => {  
  if (!translations) {
    return <ContentLoader locale={locale} componentType="transformations" message="loading" className={className} />;
  }
  
  if (!translations.cases) {
    return <ContentLoader locale={locale} componentType="transformations" message="unavailable" className={className} />;
  }
  
  if (!Array.isArray(translations.cases) || translations.cases.length === 0) {
    return <ContentLoader locale={locale} componentType="transformations" message="unavailable" className={className} />;
  }

  return (
    <section className={`bg-white py-20 ${className}`}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-h1 text-neutral-900 mb-4">
            {translations.sectionTitle}
          </h2>
          {translations.sectionSubtitle && (
            <p className="text-body text-neutral-600 max-w-3xl mx-auto">
              {translations.sectionSubtitle}
            </p>
          )}
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {translations.cases.map((transformationCase: TransformationCase, index: number) => {
            const beforeImage = normalizeImageData(
              transformationCase.beforeImage, 
              `Before - ${transformationCase.title}`
            );
            const afterImage = normalizeImageData(
              transformationCase.afterImage, 
              `After - ${transformationCase.title}`
            );
            
            return (
              <div key={transformationCase.id} className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden group">
                {/* Interactive Before/After Slider */}
                <div className="relative">
                  {beforeImage.src && afterImage.src ? (
                    <BeforeAfterSlider
                      beforeImage={beforeImage}
                      afterImage={afterImage}
                      beforeLabel={translations.beforeLabel}
                      afterLabel={translations.afterLabel}
                      height="h-64 md:h-80"
                    />
                  ) : (
                    // Fallback to placeholder if images are missing
                    <div className="h-64 md:h-80 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏠</div>
                        <p className="text-neutral-600 font-medium">Before/After Comparison</p>
                        <p className="text-sm text-neutral-500">{transformationCase.title}</p>
                      </div>
                    </div>
                  )}
                </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-h3 text-neutral-900 mb-2 group-hover:text-primary transition-colors duration-200">
                  {transformationCase.title}
                </h3>
                
                <p className="text-body text-neutral-600 mb-4 line-clamp-2">
                  {transformationCase.description}
                </p>

                {/* Client Info */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {translations.clientLabel} <span className="font-medium text-neutral-700">{transformationCase.client}</span>
                  </span>
                  {transformationCase.location && (
                    <span className="text-neutral-500">{transformationCase.location}</span>
                  )}
                </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Transformations;
