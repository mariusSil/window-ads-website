# Performance Optimization Plan - Window Ads Website

## PROMPT for AI Coding Assistant

You are tasked with optimizing the performance of a Next.js 14 website that currently has two critical performance issues:
1. **Gzip Compression: F grade (0 points)** - Content is not being compressed properly
2. **HTTP Requests: D grade (68 points)** - Too many HTTP requests are being made

## Current Architecture Analysis

The website uses:
- Next.js 14 with App Router
- Dynamic imports for components via ComponentRenderer.tsx
- Vercel deployment with custom headers
- Multiple external resources (fonts, analytics, chat widgets)

## Root Cause Analysis

### Gzip Compression Issue
- `compress: true` in next.config.js only works in development
- Vercel handles compression at CDN level but not optimally configured
- Missing proper compression headers and encoding directives

### HTTP Requests Issue
- 41+ React components loaded individually despite dynamic imports
- Multiple font variants being loaded
- External scripts (analytics, chat widgets) creating additional requests
- CSS chunks being generated separately
- Non-optimized resource loading patterns

## Implementation Plan

### Phase 1: Critical Fixes (HIGH PRIORITY)

#### 1.1 Audit External Resources
**Location:** `app/[locale]/layout.tsx`, `components/common/Header.tsx`
**Task:** Identify and optimize all external resources:
- Remove unused analytics/tracking scripts
- Consolidate font loading to single variant
- Audit chat widget implementation for request optimization
- Check for duplicate resource loading

**Expected Impact:** Reduce HTTP requests by 15-25%

#### 1.2 Enhanced Compression Configuration
**Location:** `next.config.js`, `vercel.json`
**Task:** Implement advanced compression settings:
```javascript
// Add to next.config.js experimental
experimental: {
  optimizeCss: true,
  gzipSize: true,
  webpackBuildWorker: true,
  cssChunking: 'strict',
  inlineCss: true
}
```

**Expected Impact:** Gzip F → A (95+ points)

### Phase 2: Component Bundling (MEDIUM PRIORITY)

#### 2.1 Update ComponentRenderer Architecture
**Location:** `components/ComponentRenderer.tsx`
**Task:** Replace individual dynamic imports with bundled components:
- Use `OptimizedBundle.tsx` for related components
- Group components by functionality (shared, pages, forms)
- Implement progressive loading strategy

**Implementation:**
```typescript
// Replace individual imports with bundles
const SharedBundle = dynamic(() => import('./OptimizedBundle').then(mod => mod.SharedComponentsBundle))
const ServiceBundle = dynamic(() => import('./OptimizedBundle').then(mod => mod.ServiceComponentsBundle))
```

**Expected Impact:** Reduce HTTP requests by 30-40%

#### 2.2 Font Optimization
**Location:** `app/[locale]/layout.tsx`
**Task:** Optimize font loading strategy:
```typescript
import { Inter } from 'next/font/google'
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
})
```

**Expected Impact:** Reduce font-related requests by 70%

### Phase 3: Resource Optimization (MEDIUM PRIORITY)

#### 3.1 Add Resource Hints
**Location:** `app/[locale]/layout.tsx`
**Task:** Add preconnect and dns-prefetch directives:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://analytics.google.com" />
<link rel="preload" href="/images/hero-bg.webp" as="image" />
```

#### 3.2 CSS Bundling Enhancement
**Location:** `next.config.js`
**Task:** Implement CSS optimization:
- Enable CSS chunking for better bundling
- Inline critical CSS for above-fold content
- Remove unused CSS with purgeCSS

### Phase 4: Advanced Optimizations (LOW PRIORITY)

#### 4.1 Critical CSS Implementation
**Task:** Extract and inline critical CSS for above-the-fold content
**Tools:** Use `critical` npm package or manual extraction

#### 4.2 Service Worker Implementation
**Task:** Implement service worker for aggressive caching
**Location:** `public/sw.js`

## Files to Modify

### High Priority
1. `next.config.js` - Enhanced compression and bundling settings
2. `vercel.json` - Compression headers and caching directives
3. `components/ComponentRenderer.tsx` - Bundle implementation
4. `app/[locale]/layout.tsx` - Font optimization and resource hints

### Medium Priority
5. `components/OptimizedBundle.tsx` - Component bundling strategy
6. `components/common/Header.tsx` - External resource audit
7. `package.json` - Build script optimization

### Low Priority
8. `public/sw.js` - Service worker implementation
9. CSS files - Critical CSS extraction

## Expected Performance Improvements

- **Gzip Compression:** F (0) → A (95+ points)
- **HTTP Requests:** D (68) → B+ (85+ points)
- **Overall GTmetrix Score:** Improvement of 20-30 points
- **Core Web Vitals:** Significant LCP and CLS improvements

## Testing Strategy

1. **Local Testing:** Use `npm run build` and analyze bundle size
2. **Staging Testing:** Deploy to Vercel preview and test with GTmetrix
3. **Production Testing:** Monitor Core Web Vitals in production
4. **A/B Testing:** Compare before/after performance metrics

## Implementation Order

1. **Week 1:** Phase 1 (Critical Fixes) - Focus on compression and external resource audit
2. **Week 2:** Phase 2 (Component Bundling) - Implement bundling strategy
3. **Week 3:** Phase 3 (Resource Optimization) - Add resource hints and CSS optimization
4. **Week 4:** Phase 4 (Advanced) - Critical CSS and service worker (optional)

## Success Metrics

- GTmetrix Performance Score > 90%
- Gzip Compression Grade: A
- HTTP Requests Grade: B+ or higher
- Core Web Vitals: All metrics in "Good" range
- Bundle size reduction: 20-30%
- Page load time improvement: 30-50%

## Risk Mitigation

- **Backup Strategy:** Create git branch before major changes
- **Rollback Plan:** Keep previous component loading as fallback
- **Testing:** Thorough testing on staging before production
- **Monitoring:** Implement performance monitoring post-deployment

## Dependencies Required

```json
{
  "critical": "^6.0.0",
  "webpack-bundle-analyzer": "^4.9.0",
  "@next/bundle-analyzer": "^14.0.0"
}
```

This plan provides a systematic approach to address both performance issues with measurable outcomes and clear implementation steps.
