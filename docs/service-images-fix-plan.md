# Service Page Image Rendering Fix Plan

## Root Cause Analysis

**CRITICAL ISSUE IDENTIFIED:**
- Service content files reference `/images/services/` paths (e.g., `/images/services/window-repair-main.jpg`)
- Available images are in `/images/news/` paths with Google Storage URLs in `images.json`
- **Mismatch:** Services expect `/services/` but images.json only contains `/news/` mappings

**Current State:**
- ServiceArticle component expects `translations.image.src` from service content
- Service JSON files use non-existent `/images/services/` paths
- Available images are mapped from `/images/news/` to Google Storage URLs
- No image mapping utility exists to resolve correct URLs

## Implementation Strategy

### Phase 1: Create Image Mapping Utility (HIGH PRIORITY)

**File:** `/lib/image-utils.ts`
```typescript
interface ImageMapping {
  old: string;
  new: string;
}

interface ImageMappings {
  mappings: ImageMapping[];
}

// Load and resolve image URLs from images.json
export function resolveImageUrl(imagePath: string): string {
  // Implementation to map service image paths to available news images
}

// Get appropriate image for service type
export function getServiceImage(serviceType: string): string {
  // Map service types to available images
}
```

### Phase 2: Service-to-Image Mapping Strategy

**Service Type Mappings:**
- `window-repair` → `/images/news/window-replacement-comparison.jpg`
- `glass-replacement` → `/images/news/glass-unit-replacement.jpg`
- `installation-service` → `/images/news/professional-installation-og.jpg`
- `maintenance-service` → `/images/news/maintenance-schedule.jpg`
- `window-adjustment` → `/images/news/adjustment-tools.jpg`
- `emergency-repair` → `/images/news/professional-tools.jpg`
- `frame-repair` → `/images/news/window-replacement-comparison.jpg`
- `gasket-replacement` → `/images/news/weather-seals.jpg`
- `mechanism-replacement` → `/images/news/adjustment-tools.jpg`
- `insulation-improvement` → `/images/news/energy-efficient-windows-og.jpg`

### Phase 3: Update Service Content Files

**Strategy Options:**

#### Option A: Direct URL Replacement (RECOMMENDED)
Replace `/images/services/` paths with Google Storage URLs directly in service JSON files.

**Benefits:**
- Immediate fix
- No component changes needed
- Uses existing proven images

#### Option B: Dynamic Resolution
Update ServiceArticle component to use image mapping utility.

**Benefits:**
- Centralized image management
- Easier future updates
- Fallback image support

### Phase 4: Component Enhancement (OPTIONAL)

**File:** `/components/pages/services/ServiceArticle.tsx`
```typescript
import { resolveImageUrl, getServiceImage } from '@/lib/image-utils';

// Enhanced image handling with fallbacks
const imageUrl = translations.image?.src 
  ? resolveImageUrl(translations.image.src)
  : getServiceImage(serviceType);
```

## Implementation Priority

### Immediate Fix (Option A - Direct Replacement)
1. **Update all service JSON files** with correct Google Storage URLs
2. **Map service types to appropriate images** from available news images
3. **Test image rendering** across all service pages

### Long-term Solution (Option B - Dynamic Resolution)
1. **Create image mapping utility** with fallback support
2. **Update ServiceArticle component** to use utility
3. **Implement image optimization** and caching

## Service Image Assignments

Based on available images and service types:

```json
{
  "window-repair": "https://storage.googleapis.com/uxpilot-auth.appspot.com/b974bc17a2-38c41de1f061104e55fb.png",
  "glass-replacement": "https://storage.googleapis.com/uxpilot-auth.appspot.com/b974bc17a2-38c41de1f061104e55fb.png",
  "installation-service": "https://storage.googleapis.com/uxpilot-auth.appspot.com/c8c69828a1-d8edbc2ff80d41521467.png",
  "maintenance-service": "https://storage.googleapis.com/uxpilot-auth.appspot.com/f5eb646de5-ebbb4355ecccb9a69282.png",
  "window-adjustment": "https://storage.googleapis.com/uxpilot-auth.appspot.com/12a6c44cf3-fcbe09748e6b2d45f416.png",
  "emergency-repair": "https://storage.googleapis.com/uxpilot-auth.appspot.com/c8c69828a1-d8edbc2ff80d41521467.png",
  "frame-repair": "https://storage.googleapis.com/uxpilot-auth.appspot.com/b974bc17a2-38c41de1f061104e55fb.png",
  "gasket-replacement": "https://storage.googleapis.com/uxpilot-auth.appspot.com/3a4d7cba09-4bde6cf2e23ae16afc24.png",
  "mechanism-replacement": "https://storage.googleapis.com/uxpilot-auth.appspot.com/12a6c44cf3-fcbe09748e6b2d45f416.png",
  "insulation-improvement": "https://storage.googleapis.com/uxpilot-auth.appspot.com/52cec45fd9-0bb2094feddef88f1bd9.png"
}
```

## Files to Modify

### Service Content Files (10 files):
- `/content/collections/services/window-repair.json`
- `/content/collections/services/glass-replacement.json`
- `/content/collections/services/installation-service.json`
- `/content/collections/services/maintenance-service.json`
- `/content/collections/services/window-adjustment.json`
- `/content/collections/services/emergency-repair.json`
- `/content/collections/services/frame-repair.json`
- `/content/collections/services/gasket-replacement.json`
- `/content/collections/services/mechanism-replacement.json`
- `/content/collections/services/insulation-improvement.json`

### Update Pattern for Each Service:
```json
"image": {
  "src": "https://storage.googleapis.com/uxpilot-auth.appspot.com/[appropriate-image-id].png",
  "alt": "Professional [service-type] service"
}
```

## Success Criteria

1. **All service pages display images correctly**
2. **Images are contextually appropriate for service type**
3. **All 4 locales (en, lt, pl, uk) show images**
4. **No broken image links or 404 errors**
5. **Images load with proper Next.js optimization**

## Testing Checklist

- [ ] Window repair page shows image
- [ ] Glass replacement page shows image  
- [ ] Installation service page shows image
- [ ] Maintenance service page shows image
- [ ] Window adjustment page shows image
- [ ] Emergency repair page shows image
- [ ] Frame repair page shows image
- [ ] Gasket replacement page shows image
- [ ] Mechanism replacement page shows image
- [ ] Insulation improvement page shows image
- [ ] All locales (en/lt/pl/uk) display images
- [ ] Images are responsive and properly sized
- [ ] Alt text is appropriate for each service

## Prevention Rules

1. **Always use existing image assets** from images.json
2. **Map service types to contextually relevant images**
3. **Provide fallback images** for missing assets
4. **Use Google Storage URLs** for reliable image delivery
5. **Test image rendering** across all locales and devices
6. **Document image assignments** for future reference

## Implementation Timeline

- **Phase 1 (Immediate):** Update service JSON files with correct URLs (1-2 hours)
- **Phase 2 (Short-term):** Test all service pages and locales (30 minutes)
- **Phase 3 (Long-term):** Create image utility for future scalability (2-3 hours)

**Total Estimated Time:** 4-6 hours for complete implementation and testing
