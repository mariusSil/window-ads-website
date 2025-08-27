import Image from 'next/image'
import { ComponentProps } from 'react'

interface OptimizedImageProps extends Omit<ComponentProps<typeof Image>, 'src'> {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

/**
 * Optimized Image component with SEO best practices
 * - Automatic format optimization (WebP/AVIF)
 * - Responsive sizing
 * - Layout shift prevention
 * - Lazy loading by default
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      className={className}
      sizes={sizes}
      {...props}
    />
  )
}

/**
 * Hero Image component for above-the-fold images
 * - Priority loading for LCP optimization
 * - Full viewport width sizing
 */
export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'priority' | 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      sizes="100vw"
      className={className}
      {...props}
    />
  )
}

/**
 * Gallery Image component for image collections
 * - Optimized for grid layouts
 * - Responsive sizing for different screen sizes
 */
export function GalleryImage({
  src,
  alt,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={className}
      {...props}
    />
  )
}

/**
 * Thumbnail Image component for small preview images
 * - Optimized for small sizes
 * - Fixed dimensions for consistent layout
 */
export function ThumbnailImage({
  src,
  alt,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes="(max-width: 640px) 50vw, 25vw"
      className={className}
      {...props}
    />
  )
}
