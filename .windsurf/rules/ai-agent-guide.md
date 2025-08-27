---
trigger: always_on
---

# AI Agent Guide - Langu-Remontas (12K Limit)

## Project Overview
Next.js 14 + TypeScript + i18n + automatic default components system for multilingual websites.

## 🚨 CRITICAL RULES

### Framework & Versions
- **Next.js**: 14.0.3 (App Router), **React**: ^18, **TypeScript**: ^5, **Package**: npm/yarn

### Project Structure
```
app/[locale]/          # Dynamic locale routing
components/
├── ui/               # UI components (Button, Dialog, Input)
├── common/           # CTAs, modals (RequestTechnicianButton, ConsultationButton)
├── shared/           # Page components (ServiceCards, Testimonials, Faq)
content/
├── pages/            # Page JSON files
├── shared/           # Shared content
├── collections/      # Dynamic content
└── routes.json       # URL routing
```

### Internationalization
**Locales**: `['en', 'pl', 'lt', 'uk']` (en = primary/fallback)

```typescript
import { isValidLocale, type Locale } from '@/lib/i18n';
if (isValidLocale(locale)) { /* proceed */ }

// ✅ CORRECT - Never import JSON directly
import { loadSharedContent, getLocalizedSharedContent } from '@/content/lib/content-resolver';
const content = await loadSharedContent('common');
const localized = getLocalizedSharedContent(content, locale);
```

### Default Components System
**9 components auto-included on every page:**
1. ServiceCards, 2. AccessoriesGrid, 3. Testimonials, 4. WhyChooseUs, 5. TechnicianTeam, 6. Partners, 7. Transformations, 8. PropertyTypes, 9. Faq

**Page Structure (70% less JSON):**
```json
{
  "pageId": "about",
  "seo": { "en": {"title": "...", "description": "..."}, "lt": {...}, "pl": {...}, "uk": {...} },
  "content": { "en": {"pageHeader": {...}}, "lt": {...}, "pl": {...}, "uk": {...} },
  "components": [
    { "type": "PageHeader", "contentKey": "pageHeader", "required": true }
  ],
  "componentOverrides": {
    "WhyChooseUs": { "contentKey": "whyChooseUs" },
    "Partners": { "disabled": true },
    "Faq": { "position": 2 }
  }
}
```

**Override Patterns:**
```json
// Page content: "contentKey": "whyChooseUs"
// Shared content: "contentKey": "shared:homepage-testimonials"  
// Disable: "disabled": true
// Reorder: "position": 2
// Inline: "customContent": {"en": {...}, "lt": {...}}
```

### Page Loading Pattern
```typescript
import { getFinalPageComponents, loadPageContent, getLocalizedContent } from '@/content/lib/content-resolver';

export default async function Page({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  if (!isValidLocale(locale)) notFound();
  
  const pageContent = await loadPageContent('homepage');
  if (!pageContent) return <div>Page not found</div>;
  
  const localizedContent = getLocalizedContent(pageContent, locale);
  const finalComponents = getFinalPageComponents(pageContent); // NEW: includes defaults + overrides
  
  const components = await Promise.all(finalComponents.map(async (component) => {
    let contentData = localizedContent[component.contentKey] || {};
    
    if ((component as any).customContent) {
      contentData = (component as any).customContent[locale] || (component as any).customContent.en;
    }
    else if (typeof contentData === 'string' && contentData.startsWith('shared:')) {
      const sharedContent = await loadSharedContent(`components/${contentData.replace('shared:', '')}`);
      contentData = getLocalizedSharedContent(sharedContent, locale);
    }
    
    return { type: component.type, props: { translations: contentData, locale } };
  }));
  
  return <ComponentRenderer components={components} />;
}
```

### CTA Button System
**Standardized components in `/components/common/`:**
```typescript
// Primary CTA (red solid) - opens RequestTechnicianModal
import { RequestTechnicianButton } from '@/components/common/RequestTechnicianButton';

// Secondary CTA (red outline) - opens same modal
import { ConsultationButton } from '@/components/common/ConsultationButton';

// Combined CTAs
import { CTAButtons } from '@/components/common/CTAButtons';
<CTAButtons locale={locale} translations={translations} 
  technicianProps={{ size: "sm" }} consultationProps={{ size: "sm" }} />

// NEVER hardcode button text - use constants
import { getButtonText } from '@/lib/button-constants';
getButtonText('CALL_TECHNICIAN', locale) // "CALL A TECHNICIAN"/"KVIESTI MEISTRĄ"/etc
getButtonText('CONSULTATION', locale)    // "CONSULTATION"/"KONSULTACIJA"/etc
```

### UI Components
**Import paths (uppercase file names):**
```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import Icon from '@/components/ui/Icon';

// Button variants & sizes
<Button variant="default" size="sm">Primary CTA</Button>      // Red solid, header
<Button variant="outline-red" size="default">Secondary</Button> // Red outline, content
<Button variant="primary" size="lg">Success Action</Button>    // Green, hero

// Icons (Lucide React)
<Icon name="Phone" className="w-5 h-5" />
<Icon name="Send" className="w-5 h-5" />        // Telegram
<Icon name="MessageSquare" className="w-5 h-5" /> // WhatsApp
```

### Component Registration
```typescript
// ComponentRenderer.tsx - ALL components must be registered
import Hero from './shared/Hero';
import ServiceCards from './shared/ServiceCards';

function SingleComponentRenderer({ type, props }) {
  switch (type.toLowerCase()) {
    case 'hero': return <Hero {...props} />;
    case 'servicecards': return <ServiceCards {...props} />;
    case 'freediagnostics': return <FreeDiagnostics {...props} />;
    default: return null;
  }
}
```

### Content Resolver API
```typescript
// Core functions
loadPageContent(pageId: string): Promise<PageContent | null>
loadSharedContent(contentType: string): Promise<any>
getLocalizedContent(pageContent: PageContent, locale: Locale): any
getLocalizedSharedContent(sharedContent: any, locale: Locale): any

// Default components system
getFinalPageComponents(pageContent: PageContent): ComponentConfig[]
mergeWithDefaultComponents(pageComponents: ComponentConfig[], overrides?: Record<string, ComponentOverride>): ComponentConfig[]
getDefaultSharedComponents(): ComponentConfig[]

// SEO & routing
getPageSEO(pageContent: PageContent, locale: Locale): SEOData
getRouteByPageId(pageId: string): Promise<RouteConfig | null>
```

### Theme System
**Colors**: primary=#DC2626 (red), success=#059669 (green), secondary=#1F2937 (dark gray)
**Typography**: text-hero (3rem), text-h1 (2rem), text-h2 (1.5rem), text-body (1rem)
**Spacing**: space-section (5rem), space-component (3rem), space-element (1.5rem)
**Responsive**: sm:640px, md:768px, lg:1024px, xl:1280px

### TypeScript Interfaces
```typescript
interface ComponentOverride {
  contentKey?: string;
  customContent?: any;
  disabled?: boolean;
  position?: number;
}

interface PageContent {
  pageId: string;
  seo: Record<Locale, SEOData>;
  content: Record<Locale, any>;
  components?: ComponentConfig[];
  componentOverrides?: Record<string, ComponentOverride>;
  defaultComponentsDisabled?: boolean;
}
```

## ⚠️ CRITICAL DON'Ts
1. **DON'T** hardcode locales/button text
2. **DON'T** import JSON directly  
3. **DON'T** bypass ComponentRenderer
4. **DON'T** use `any` types
5. **DON'T** use lowercase UI imports
6. **DON'T** manually declare default components
7. **DON'T** create separate CTA modals

## ✅ MANDATORY PRACTICES
1. **USE** content resolver functions
2. **VALIDATE** locales with `isValidLocale()`
3. **USE** `getFinalPageComponents()` for pages
4. **USE** `componentOverrides` for customization
5. **USE** standardized CTA components
6. **USE** `getButtonText()` for labels
7. **PROVIDE** fallback content (en locale)
8. **RESTART** dev server after Tailwind changes

## Quick Reference
**Page Creation**: Create `/content/pages/{id}.json` + add to `routes.json`
**Override Component**: `"componentOverrides": {"WhyChooseUs": {"contentKey": "custom"}}`
**Disable Component**: `"componentOverrides": {"Partners": {"disabled": true}}`
**CTA Buttons**: Use `CTAButtons` component with proper size props
**Content Keys**: `"hero"` = page content, `"shared:servicecards"` = shared content

## Emergency Debug
1. **Content missing**: Check file paths, locale fallbacks
2. **Component not rendering**: Verify ComponentRenderer registration
3. **Defaults missing**: Check `getFinalPageComponents()` usage
4. **Build errors**: Check TypeScript interfaces, import paths
5. **CTA issues**: Verify button constants, modal integration

**Dependencies**: Next.js 14.0.3, React ^18, TypeScript ^5, Tailwind ^3.3.0, Lucide React ^0.541.0

---
**Follow strictly. Deviations cause failures. Current implementation with default components system.**
