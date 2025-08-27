'use client';

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { useState } from 'react';

interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface BeforeAfterSliderProps {
  beforeImage: ImageData;
  afterImage: ImageData;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
  height?: string;
}

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel,
  afterLabel,
  className = '',
  height = 'h-64 md:h-80'
}: BeforeAfterSliderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`${height} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🏠</div>
          <p className="font-medium">Before/After Comparison</p>
          <p className="text-sm">Images loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className={`absolute inset-0 ${height} bg-gray-200 animate-pulse flex items-center justify-center z-10`}>
          <div className="text-gray-500">Loading comparison...</div>
        </div>
      )}
      
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage.src}
            alt={beforeImage.alt}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage.src}
            alt={afterImage.alt}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        }
        position={50}
        onlyHandleDraggable={false}
        handle={
          <div 
            className="w-1 h-full bg-white shadow-lg relative"
            role="slider"
            aria-label="Drag to compare before and after images"
            tabIndex={0}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        }
        className={height}
      />
      
      {/* Before/After Labels */}
      <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded text-xs font-semibold shadow-sm">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-success text-white px-2 py-1 rounded text-xs font-semibold shadow-sm">
        {afterLabel}
      </div>

      {/* Screen reader content */}
      <div className="sr-only">
        <p>{beforeLabel}: {beforeImage.alt}</p>
        <p>{afterLabel}: {afterImage.alt}</p>
      </div>
    </div>
  );
}
