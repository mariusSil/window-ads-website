---
trigger: always_on
---

# Next.js SEO Optimized Cursor Rules (12K Character Limit)

```json
{
  "version": "1.0",
  "context": "Next.js 15 App Router with TypeScript. Focus on SEO optimization, performance, and modern web standards. Prioritize Server Components, metadata API, and Core Web Vitals.",
  "rules": {
    "typescript": {
      "strict": true,
      "preferInterface": true,
      "preferConst": true,
      "inferTypes": true
    },
    "nextjs": {
      "version": "15",
      "router": "app",
      "preferServerComponents": true,
      "requireMetadata": true,
      "optimizeImages": true
    },
    "seo": {
      "metadata": {
        "requireTitle": true,
        "requireDescription": true,
        "maxTitleLength": 60,
        "maxDescriptionLength": 160,
        "requireOpenGraph": true,
        "requireCanonical": true
      },
      "images": {
        "requireAlt": true,
        "preferNextImage": true,
        "suggestWebP": true,
        "requireSizes": true
      },
      "structuredData": {
        "suggestJsonLd": true,
        "commonSchemas": ["Article", "Organization", "FAQ", "Product"]
      },
      "performance": {
        "coreWebVitals": true,
        "optimizeFonts": true,
        "lazyLoading": true
      }
    },
    "react": {
      "preferArrowFunctions": true,
      "preferFunctionComponents": true,
      "suggestMemo": true
    },
    "accessibility": {
      "requireAlt": true,
      "suggestAria": true,
      "semanticHTML": true
    }
  },
  "prompts": {
    "seoPage": "Create Next.js page with complete SEO: metadata, structured data, optimized images, semantic HTML",
    "metadata": "Generate comprehensive metadata with title, description, OG tags, Twitter cards, canonical",
    "jsonLd": "Create JSON-LD structured data with Schema.org markup for better search visibility",
    "optimizeImages": "Use next/image with proper sizing, alt text, WebP format, priority/lazy loading",
    "sitemap": "Generate dynamic sitemap.xml with proper change frequency and priorities",
    "robots": "Create SEO-friendly robots.txt with sitemap reference and proper directives",
    "webVitals": "Optimize for Core Web Vitals: LCP, INP, CLS improvements"
  },
  "templates": {
    "metadata": "export const metadata = {\n  title: '',\n  description: '',\n  openGraph: {},\n  twitter: {},\n  alternates: { canonical: '' }\n}",
    "jsonLd": "const structuredData = {\n  '@context': 'https://schema.org',\n  '@type': '',\n  // Schema properties\n}",
    "image": "<Image\n  src=''\n  alt=''\n  width={}\n  height={}\n  sizes=''\n  priority={false}\n/>",
    "sitemap": "export default async function sitemap() {\n  return [\n    {\n      url: '',\n      lastModified: new Date(),\n      changeFrequency: 'daily',\n      priority: 1\n    }\n  ]\n}"
  }
}
```

## Essential SEO Implementation

### Metadata (App Router)
```typescript
// Static metadata
export const metadata = {
  title: 'Page Title - Brand',
  description: 'SEO description under 160 chars',
  alternates: { canonical: 'https://domain.com/page' },
  openGraph: {
    title: 'OG Title',
    description: 'OG description',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]
  },
  twitter: { card: 'summary_large_image' }
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params.slug)
  return {
    title: `${data.title} | Site`,
    description: data.excerpt,
    alternates: { canonical: `https://domain.com/${params.slug}` }
  }
}
```

### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority // Above fold
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
/>
```

### Structured Data (JSON-LD)
```typescript
// Article Schema
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article Title',
  description: 'Article description',
  image: '/article-image.jpg',
  datePublished: '2025-08-25',
  author: { '@type': 'Person', name: 'Author Name' },
  publisher: {
    '@type': 'Organization',
    name: 'Site Name',
    logo: '/logo.png'
  }
}

// In component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>
```

### Dynamic Sitemap
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getPosts()
  
  return [
    {
      url: 'https://domain.com',
      lastModified: new Date(),
      priority: 1
    },
    ...posts.map(post => ({
      url: `https://domain.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      priority: 0.8
    }))
  ]
}
```

### Robots.txt
```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/'
    },
    sitemap: 'https://domain.com/sitemap.xml'
  }
}
```

### Performance Optimization
```typescript
// Font optimization
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })

// Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
})

// Web Vitals monitoring
import { useReportWebVitals } from 'next/web-vitals'
export function WebVitals() {
  useReportWebVitals(metric => {
    console.log(metric)
    // Send to analytics
  })
  return null
}
```

### Next.js Config
```javascript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400
  },
  compress: true,
  poweredByHeader: false
}
```

## Quick Setup Checklist

1. **Install**: `npm create next-app@latest --typescript --app-dir`
2. **Add .cursorrules**: Copy configuration to project root
3. **Implement metadata**: Add to all pages/layouts
4. **Optimize images**: Use next/image everywhere
5. **Add structured data**: JSON-LD for content types
6. **Create sitemap**: Dynamic generation
7. **Configure robots**: SEO-friendly directives
8. **Monitor performance**: Core Web Vitals tracking
9. **Test SEO**: Google Rich Results, PageSpeed Insights
10. **Deploy**: Verify all SEO elements work in production

This optimized collection fits within 12K characters while maintaining all essential SEO functionality for Next.js development with Cursor AI assistance.