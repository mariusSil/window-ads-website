# Performance Optimization Plan - Window Ads Website

## PROMPT for AI Agent: Implement Performance Optimizations for Better Core Web Vitals

### Performance Issues Identified
1. **Make fewer HTTP requests** (Grade F - 0 points)
2. **Compress components with gzip** (Grade F - 0 points)  
3. **Use cookie-free domains** (Grade F - 0 points)
4. **Add Expires headers** (Grade B - 78 points)
5. **Make favicon small and cacheable** (Grade B - 90 points)
6. **Avoid empty src or href** (Grade A - 100 points)

### Implementation Strategy

#### 1. HTTP Request Optimization (Critical - Grade F)

**Current Issues:**
- Multiple separate CSS/JS files
- Unoptimized component loading
- Excessive network requests

**Solutions:**
```javascript
// next.config.js - Add bundle optimization
const nextConfig = {
  // ... existing config
  experimental: {
    optimizeCss: true,
    bundlePagesRouterDependencies: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization
  output: 'standalone',
}
```

**Component Optimization:**
- Implement dynamic imports for non-critical components
- Use React.lazy() for heavy components
- Bundle related components together

#### 2. Gzip Compression (Critical - Grade F)

**Current Issue:** No compression enabled

**Solution:**
```javascript
// next.config.js - Enable compression
const nextConfig = {
  // ... existing config
  compress: true,
  poweredByHeader: false,
  
  // Custom headers for better compression
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

**Vercel Configuration:**
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

#### 3. Cookie-Free Domains (Critical - Grade F)

**Current Issue:** Static assets served with cookies

**Solutions:**
- Move static assets to CDN subdomain
- Configure Next.js for cookieless static serving
- Optimize image delivery

```javascript
// next.config.js - Static asset optimization
const nextConfig = {
  // ... existing config
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://static.yourdomain.com' : '',
  
  images: {
    // ... existing config
    unoptimized: false,
    loader: 'default',
    domains: ['static.yourdomain.com'],
  },
}
```

#### 4. Expires Headers (Improve from B to A)

**Current Score:** 78 points - needs improvement

**Solution:**
```javascript
// next.config.js - Enhanced caching headers
async headers() {
  return [
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        {
          key: 'Expires',
          value: new Date(Date.now() + 31536000000).toUTCString(),
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/favicon.ico',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400',
        },
      ],
    },
  ]
},
```

#### 5. Favicon Optimization (Improve from B to A)

**Current Score:** 90 points - minor improvements needed

**Actions:**
1. Optimize favicon.ico size (currently in public/)
2. Add proper caching headers
3. Consider using SVG favicon for better compression

```javascript
// app/layout.tsx - Optimized favicon
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}
```

### Implementation Files to Modify

**Configuration Files:**
1. `next.config.js` - Add compression, headers, optimization
2. `vercel.json` - Create for deployment optimization
3. `app/layout.tsx` - Optimize favicon metadata

**Component Optimizations:**
1. `components/shared/` - Add dynamic imports for heavy components
2. `components/ui/` - Bundle related UI components
3. `app/[locale]/layout.tsx` - Optimize font loading

### Expected Performance Improvements

**Before:**
- HTTP Requests: Grade F (0 points)
- Compression: Grade F (0 points)
- Cookie-free: Grade F (0 points)
- Expires: Grade B (78 points)
- Favicon: Grade B (90 points)

**After:**
- HTTP Requests: Grade B+ (85+ points)
- Compression: Grade A (95+ points)
- Cookie-free: Grade A (90+ points)
- Expires: Grade A (95+ points)
- Favicon: Grade A (95+ points)

### Implementation Order

1. **Phase 1 (High Impact):** Compression + Headers (30 min)
2. **Phase 2 (Medium Impact):** HTTP Request optimization (45 min)
3. **Phase 3 (Polish):** Cookie-free domains + Favicon (30 min)

### Monitoring

After implementation, test with:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse CI

### Notes

- All changes maintain existing functionality
- No breaking changes to current codebase
- Incremental improvements that can be deployed separately
- Focus on Core Web Vitals improvement
