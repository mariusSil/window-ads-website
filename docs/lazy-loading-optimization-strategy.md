# Lazy Loading Image Optimization Strategy

## PROMPT for AI Agent: Implement Comprehensive Lazy Loading for Google PageSpeed Optimization

### Project Context
The window-ads-website project uses Next.js 14 with TypeScript and has 27 local WebP images (1.10MB total) that need lazy loading optimization. The Hero component uses background images that should load immediately, while all other images should lazy load when entering the viewport.

### Current Image Usage Analysis
**Components with Images:**
- `Hero.tsx` - Background images (PRIORITY: immediate load)
- `ServiceCards.tsx` - Service thumbnails (LAZY LOAD)
- `AccessoriesGrid.tsx` - Product images (LAZY LOAD)
- `Partners.tsx` - Logo images (LAZY LOAD)
- `PropertyTypes.tsx` - Property thumbnails (LAZY LOAD)
- `TechnicianTeam.tsx` - Team photos (LAZY LOAD)
- `Testimonials.tsx` - Avatar images (LAZY LOAD)
- `Transformations.tsx` - Before/after images (LAZY LOAD)
- `NewsCard.tsx` - Article thumbnails (LAZY LOAD)
- `ServiceArticle.tsx` - Content images (LAZY LOAD)

**Image Sources:** All images are local WebP files in `/public/images/` directory (27 files, optimized from 29.93MB → 1.10MB)

### Implementation Strategy

#### 1. Create Intersection Observer Hook
**File:** `/hooks/useIntersectionObserver.ts`
```typescript
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  const shouldLoad = triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting;

  return { elementRef, isIntersecting, shouldLoad };
}
```

#### 2. Create Lazy Image Component
**File:** `/components/ui/LazyImage.tsx`
```typescript
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
```

#### 3. Update Component Implementations

**Priority Components (Immediate Load):**
- `Hero.tsx` - Keep existing background image implementation with `priority={true}`
- Above-the-fold content images

**Lazy Load Components (Update Required):**

**A. ServiceCards Component:**
```typescript
// Replace existing Image imports with LazyImage
import { LazyImage } from '@/components/ui/LazyImage';

// In component render:
<LazyImage
  src={service.image}
  alt={service.title}
  width={400}
  height={300}
  className="w-full h-48 object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**B. AccessoriesGrid Component:**
```typescript
<LazyImage
  src={accessory.image}
  alt={accessory.name}
  width={300}
  height={200}
  className="w-full h-40 object-cover rounded-lg"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
/>
```

**C. TechnicianTeam Component:**
```typescript
<LazyImage
  src={member.avatar}
  alt={member.name}
  width={150}
  height={150}
  className="w-24 h-24 rounded-full object-cover"
  sizes="150px"
/>
```

**D. Testimonials Component:**
```typescript
<LazyImage
  src={testimonial.avatar}
  alt={testimonial.name}
  width={60}
  height={60}
  className="w-12 h-12 rounded-full object-cover"
  sizes="60px"
/>
```

#### 4. Performance Optimizations

**A. Image Sizing Strategy:**
- **Hero images:** `priority={true}`, `sizes="100vw"`
- **Card thumbnails:** `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- **Avatars:** Fixed sizes like `"60px"` or `"150px"`
- **Gallery images:** `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"`

**B. Loading Thresholds:**
- **Default:** `rootMargin: '100px'` (load 100px before entering viewport)
- **Below fold:** `rootMargin: '200px'` (load 200px before for smoother experience)
- **Critical sections:** `rootMargin: '50px'` (load closer to viewport)

**C. Placeholder Strategy:**
- **Skeleton loading:** Gray animated placeholder for consistent layout
- **Blur placeholder:** For images with blur data URLs
- **Empty placeholder:** For simple loading states

#### 5. Next.js Configuration Updates

**File:** `next.config.js`
```javascript
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Existing config...
}
```

#### 6. Implementation Priority Order

**Phase 1: Core Infrastructure (HIGH PRIORITY)**
1. Create `useIntersectionObserver` hook
2. Create `LazyImage` component
3. Update `next.config.js` image settings

**Phase 2: Component Updates (MEDIUM PRIORITY)**
1. Update `ServiceCards.tsx` - Most visible, high impact
2. Update `AccessoriesGrid.tsx` - Product images
3. Update `TechnicianTeam.tsx` - Team photos
4. Update `Testimonials.tsx` - Avatar images

**Phase 3: Secondary Components (LOW PRIORITY)**
1. Update `Partners.tsx` - Logo images
2. Update `PropertyTypes.tsx` - Property thumbnails
3. Update `Transformations.tsx` - Before/after images
4. Update `NewsCard.tsx` and `ServiceArticle.tsx`

**Phase 4: Testing & Optimization (VALIDATION)**
1. Test with Google PageSpeed Insights
2. Validate Core Web Vitals improvements
3. Check mobile performance
4. Verify accessibility compliance

### Expected Performance Improvements

**Google PageSpeed Metrics:**
- **Largest Contentful Paint (LCP):** Improved by loading hero images first
- **Cumulative Layout Shift (CLS):** Reduced by proper image dimensions
- **First Input Delay (FID):** Better by reducing initial bundle size
- **Total Blocking Time:** Decreased by lazy loading non-critical images

**Specific Improvements:**
- **Initial page load:** 60-80% faster (only hero images load)
- **Network requests:** Reduced by 70-90% on initial load
- **Memory usage:** Lower by deferring image decoding
- **Mobile performance:** Significantly improved on slow connections

### Implementation Rules

**CRITICAL REQUIREMENTS:**
1. **NEVER** lazy load hero/above-the-fold images - use `priority={true}`
2. **ALWAYS** provide proper `width` and `height` to prevent layout shift
3. **ALWAYS** use appropriate `sizes` attribute for responsive images
4. **ALWAYS** include meaningful `alt` text for accessibility
5. **ALWAYS** test on mobile devices and slow connections

**COMPONENT PATTERNS:**
- Hero sections: `priority={true}`, immediate load
- Card grids: `LazyImage` with skeleton loading
- Avatars: `LazyImage` with fixed dimensions
- Gallery images: `LazyImage` with responsive sizes

**PERFORMANCE MONITORING:**
- Use Google PageSpeed Insights for validation
- Monitor Core Web Vitals in production
- Test on 3G connections for mobile optimization
- Validate accessibility with screen readers

### Files to Create/Modify

**New Files:**
- `/hooks/useIntersectionObserver.ts`
- `/components/ui/LazyImage.tsx`
- `/docs/lazy-loading-optimization-strategy.md` (this file)

**Files to Update:**
- `next.config.js` - Image optimization settings
- `components/shared/ServiceCards.tsx` - Replace Image with LazyImage
- `components/shared/AccessoriesGrid.tsx` - Replace Image with LazyImage
- `components/shared/TechnicianTeam.tsx` - Replace Image with LazyImage
- `components/shared/Testimonials.tsx` - Replace Image with LazyImage
- `components/shared/Partners.tsx` - Replace Image with LazyImage
- `components/shared/PropertyTypes.tsx` - Replace Image with LazyImage
- `components/shared/Transformations.tsx` - Replace Image with LazyImage
- `components/pages/news/NewsCard.tsx` - Replace Image with LazyImage
- `components/pages/services/ServiceArticle.tsx` - Replace Image with LazyImage

**Files to Keep Unchanged:**
- `components/shared/Hero.tsx` - Background images should load immediately

### Success Metrics

**Before Implementation:**
- Initial page load: ~2-3 seconds
- Images loaded on first paint: 10-15 images
- Network requests: 20-30 requests
- Mobile PageSpeed: 60-70

**After Implementation Target:**
- Initial page load: ~1-1.5 seconds
- Images loaded on first paint: 1-3 images (hero only)
- Network requests: 5-10 requests initially
- Mobile PageSpeed: 85-95

This strategy will significantly improve Google PageSpeed scores by implementing intelligent lazy loading while maintaining excellent user experience through proper loading states and accessibility compliance.
