import React from 'react';
import Image from 'next/image';

interface Partner {
  alt: string;
  src: string;
}

interface PartnersProps {
  content: {
    title: string;
    subtitle: string;
    logos: Partner[];
  };
  locale: string;
}

const Partners = ({ content, locale }: PartnersProps) => {

  if (!content || !Array.isArray(content.logos) || content.logos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container-custom mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{content.title}</h2>
        <p className="mt-4 text-lg text-gray-600">{content.subtitle}</p>
        <div className="mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center max-w-4xl">
          {content.logos.map((partner: Partner, index: number) => (
            <div
              key={index}
              className="group flex items-center justify-center p-4 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
            >
              <Image
                className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                src={partner.src}
                alt={partner.alt}
                width={120}
                height={48}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
