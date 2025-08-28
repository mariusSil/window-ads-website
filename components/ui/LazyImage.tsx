'use client';

import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  style,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { elementRef, shouldLoad } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  // If priority is true, load immediately (for hero images)
  if (priority) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={true}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        fill={fill}
        style={style}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    );
  }

  return (
    <div
      ref={elementRef}
      className={`relative ${className}`}
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Lazy loaded image */}
      {shouldLoad && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes={sizes}
          priority={false}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          fill={fill}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}
