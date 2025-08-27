---
trigger: model_decision
description: When creating a new page or changing content in page
---

# Content Management & Page Creation Guide - Langu-Remontas

## Table of Contents
1. [Content Architecture Overview](#content-architecture-overview)
2. [Translation System](#translation-system)
3. [Creating New Pages](#creating-new-pages)
4. [Component Override System](#component-override-system)
5. [Content Resolution Flow](#content-resolution-flow)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Content Architecture Overview

### Directory Structure
```
content/
├── lib/
│   └── content-resolver.ts     # Core content loading logic
├── pages/                      # Page-specific content
│   ├── homepage.json
│   ├── about.json
│   ├── contact.json
│   └── services.json
├── shared/
│   ├── common.json            # Site-wide content (navigation, footer)
│   └── components/            # Shared component content
│       ├── servicecards.json
│       ├── testimonials.json
│       └── faq.json
├── collections/               # Dynamic content (news, services)
│   ├── news/
│   └── services/
└── routes.json               # URL routing configuration
```

### Content Types

#### 1. Page Content (`/content/pages/*.json`)
- **Purpose**: Page-specific content and component configuration
- **Structure**: SEO data, localized content, components, overrides
- **Example**: `homepage.json`, `about.json`

#### 2. Shared Content (`/content/shared/*.json`)
- **Purpose**: Reusable content across multiple pages
- **Structure**: Localized content for common elements
- **Example**: `common.json` (navigation, footer), `components/servicecards.json`

#### 3. Collection Content (`/content/collections/*/`)
- **Purpose**: Dynamic content items (news articles, service pages)
- **Structure**: Individual JSON files with SEO and content data
- **Example**: News articles, service descriptions

## Translation System

### Supported Locales
- **Primary**: `en` (English) - Always required as fallback
- **Secondary**: `lt` (Lithuanian), `pl` (Polish), `uk` (Ukrainian)

### Translation Structure
```json
{
  "en": {
    "title": "Window Repair Services",
    "description": "Professional window repair..."
  },
  "lt": {
    "title": "Langų Remonto Paslaugos",
    "description": "Profesionalus langų remontas..."
  },
  "pl": {
    "title": "Usługi Naprawy Okien",
    "description": "Profesjonalna naprawa okien..."
  },
  "uk": {
    "title": "Послуги з Ремонту Вікон",
    "description": "Професійний ремонт вікон..."
  }
}
```

### Translation Rules
1. **English is mandatory** - Always provide English content as fallback
2. **Consistent structure** - All locales must have the same JSON structure
3. **Fallback chain**: `locale → en → empty string`
4. **SEO translations** - Include title, description, keywords, ogImage for each locale

## Creating New Pages

### Step 1: Create Page Content File

Create `/content/pages/your-page.json`:

```json
{
  "pageId": "your-page",
  "template": "standard-page",
  "seo": {
    "en": {
      "title": "Your Page Title | Site Name",
      "description": "Page description under 160 characters",
      "keywords": "keyword1, keyword2, keyword3",
      "ogImage": "/images/og/en-your-page.jpg",
      "ogImageAlt": "Alt text for OG image"
    },
    "lt": {
      "title": "Jūsų Puslapio Pavadinimas | Svetainės Pavadinimas",
      "description": "Puslapio aprašymas iki 160 simbolių",
      "keywords": "raktažodis1, raktažodis2, raktažodis3",
      "ogImage": "/images/og/lt-your-page.jpg",
      "ogImageAlt": "Alt tekstas OG paveikslėliui"
    },
    "pl": {
      "title": "Tytuł Twojej Strony | Nazwa Strony",
      "description": "Opis strony do 160 znaków",
      "keywords": "słowo1, słowo2, słowo3",
      "ogImage": "/images/og/pl-your-page.jpg",
      "ogImageAlt": "Tekst alternatywny dla obrazu OG"
    },
    "uk": {
      "title": "Назва Вашої Сторінки | Назва Сайту",
      "description": "Опис сторінки до 160 символів",
      "keywords": "ключове1, ключове2, ключове3",
      "ogImage": "/images/og/uk-your-page.jpg",
      "ogImageAlt": "Альтернативний текст для OG зображення"
    }
  },
  "content": {
    "en": {
      "pageHeader": {
        "title": "Your Page Title",
        "subtitle": "Page subtitle or description"
      },
      "customSection": {
        "title": "Custom Section",
        "content": "Your custom content here..."
      }
    },
    "lt": {
      "pageHeader": {
        "title": "Jūsų Puslapio Pavadinimas",
        "subtitle": "Puslapio paantraštė ar aprašymas"
      },
      "customSection": {
        "title": "Pritaikytas Skyrius",
        "content": "Jūsų pritaikytas turinys čia..."
      }
    },
    "pl": {
      "pageHeader": {
        "title": "Tytuł Twojej Strony",
        "subtitle": "Podtytuł lub opis strony"
      },
      "customSection": {
        "title": "Sekcja Niestandardowa",
        "content": "Twoja niestandardowa treść tutaj..."
      }
    },
    "uk": {
      "pageHeader": {
        "title": "Назва Вашої Сторінки",
        "subtitle": "Підзаголовок або опис сторінки"
      },
      "customSection": {
        "title": "Користувацький Розділ",
        "content": "Ваш користувацький контент тут..."
      }
    }
  },
  "components": [
    {
      "type": "PageHeader",
      "contentKey": "pageHeader",
      "required": true
    },
    {
      "type": "Content",
      "contentKey": "customSection",
      "required": true
    }
  ]
}
```

### Step 2: Add Route Configuration

Update `/content/routes.json`:

```json
{
  "routes": [
    {
      "pageId": "your-page",
      "urls": {
        "en": "your-page",
        "lt": "jusu-puslapis",
        "pl": "twoja-strona",
        "uk": "vasha-storinka"
      },
      "priority": 0.8,
      "changefreq": "monthly"
    }
  ]
}
```

### Step 3: Create Page Component (Optional)

If you need a custom page component, create `/app/[locale]/your-page/page.tsx`:

```tsx
import { ComponentRenderer } from '@/components/ComponentRenderer';
import { isValidLocale, defaultLocale, type Locale } from '@/lib/i18n';
import { loadPageContent, getLocalizedContent, getFinalPageComponents } from '@/content/lib/content-resolver';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { locale: string };
}

export default async function YourPage({ params }: PageProps) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  
  const pageContent = await loadPageContent('your-page');
  if (!pageContent) notFound();
  
  const localizedPageContent = getLocalizedContent(pageContent, locale);
  const finalComponents = getFinalPageComponents(pageContent);
  
  const components = await Promise.all(finalComponents.map(async (component) => {
    let contentData = localizedPageContent[component.contentKey] || {};
    
    // Handle custom content from overrides
    if ((component as any).customContent) {
      const customContent = (component as any).customContent;
      contentData = customContent[locale] || customContent.en || customContent;
    }
    // Handle shared content references
    else if (typeof contentData === 'string' && contentData.startsWith('shared:')) {
      const { loadSharedContent, getLocalizedSharedContent } = await import('@/content/lib/content-resolver');
      const sharedContentKey = contentData.replace('shared:', '');
      const sharedContent = await loadSharedContent(`components/${sharedContentKey}`);
      contentData = getLocalizedSharedContent(sharedContent, locale);
    }
    
    return {
      type: component.type,
      props: {
        translations: contentData,
        locale: locale
      }
    };
  }));

  return <ComponentRenderer components={components} />;
}
```

## Component Override System

### Default Components (Automatically Included)

Every page automatically gets these 9 components:

1. **ServiceCards** - `shared:servicecards`
2. **AccessoriesGrid** - `shared:accessoriesgrid`
3. **Testimonials** - `shared:testimonials`
4. **WhyChooseUs** - `whyChooseUs` (page-specific by default)
5. **TechnicianTeam** - `shared:technicianteam`
6. **Partners** - `shared:partners`
7. **Transformations** - `shared:transformations`
8. **PropertyTypes** - `shared:propertytypes`
9. **Faq** - `shared:faq`

### Override Patterns

#### Pattern 1: Use Default (No Override Needed)
```json
// ServiceCards will automatically use shared:servicecards
```

#### Pattern 2: Override with Page-Specific Content
```json
"componentOverrides": {
  "ServiceCards": {
    "contentKey": "customServices"
  }
}
```

#### Pattern 3: Override with Different Shared Content
```json
"componentOverrides": {
  "Testimonials": {
    "contentKey": "shared:homepage-testimonials"
  }
}
```

#### Pattern 4: Override with Inline Content
```json
"componentOverrides": {
  "WhyChooseUs": {
    "customContent": {
      "en": {
        "title": "Why Choose Our Service",
        "items": [
          {
            "icon": "Award",
            "title": "Expert Team",
            "description": "Professional technicians"
          }
        ]
      },
      "lt": {
        "title": "Kodėl Rinktis Mūsų Paslaugą",
        "items": [
          {
            "icon": "Award", 
            "title": "Ekspertų Komanda",
            "description": "Profesionalūs technikai"
          }
        ]
      }
    }
  }
}
```

#### Pattern 5: Disable Component
```json
"componentOverrides": {
  "Partners": {
    "disabled": true
  }
}
```

#### Pattern 6: Reorder Components
```json
"componentOverrides": {
  "Faq": {
    "position": 2
  },
  "ServiceCards": {
    "position": 8
  }
}
```

#### Pattern 7: Disable All Defaults
```json
{
  "pageId": "special-page",
  "defaultComponentsDisabled": true,
  "components": [
    // Only these components will render
  ]
}
```

## Content Resolution Flow

### 1. Page Loading Process
```
1. Load page content from /content/pages/{pageId}.json
2. Get final components using getFinalPageComponents()
3. For each component:
   a. Check for custom content in overrides
   b. Check for content key override
   c. Load page content using component.contentKey
   d. Handle shared content references (shared:*)
   e. Apply locale fallback (locale → en → empty)
4. Render components with resolved content
```

### 2. Content Key Resolution
```
Content Key Format: "shared:componentname" or "localContentKey"

Examples:
- "shared:servicecards" → /content/shared/components/servicecards.json
- "hero" → page.content[locale].hero
- "customSection" → page.content[locale].customSection
```

### 3. Locale Fallback Chain
```
1. Try requested locale (e.g., 'lt')
2. Fall back to English ('en')
3. Fall back to empty object/string
4. Component handles graceful degradation
```

## Best Practices

### Content Structure
1. **Consistent naming** - Use camelCase for content keys
2. **Descriptive keys** - `pageHeader`, `customServices`, `aboutTeam`
3. **Logical grouping** - Group related content in objects
4. **Reuse shared content** - Don't duplicate common elements

### Translation Guidelines
1. **Complete translations** - Always provide all 4 locales
2. **Cultural adaptation** - Adapt content for local markets
3. **Consistent terminology** - Use same terms across pages
4. **Professional tone** - Maintain business-appropriate language

### SEO Optimization
1. **Unique titles** - Each page needs unique title
2. **Meta descriptions** - Under 160 characters, compelling
3. **Keywords** - Relevant, not stuffed
4. **OG images** - Localized images when possible

### Component Usage
1. **Minimal overrides** - Only override when necessary
2. **Shared content first** - Prefer shared content over inline
3. **Consistent structure** - Match existing component patterns
4. **Test all locales** - Verify content in all languages

## Troubleshooting

### Common Issues

#### 1. Component Not Rendering
**Symptoms**: Component missing from page
**Causes**:
- Component disabled in overrides
- Content key doesn't exist
- Shared content file missing

**Solutions**:
```json
// Check for disabled override
"componentOverrides": {
  "ServiceCards": {
    "disabled": false  // or remove this property
  }
}

// Verify content key exists
"content": {
  "en": {
    "serviceCards": { /* content here */ }
  }
}

// Check shared content file exists
/content/shared/components/servicecards.json
```

#### 2. Content Not Loading
**Symptoms**: Empty content or fallback text
**Causes**:
- Missing locale in content
- Incorrect content key reference
- Shared content file doesn't exist

**Solutions**:
```json
// Add missing locale
"content": {
  "en": { "title": "English Title" },
  "lt": { "title": "Lithuanian Title" },  // Add this
  "pl": { "title": "Polish Title" },      // Add this
  "uk": { "title": "Ukrainian Title" }    // Add this
}

// Fix content key reference
"componentOverrides": {
  "ServiceCards": {
    "contentKey": "serviceCards"  // Match exact key in content
  }
}
```

#### 3. Translation Missing
**Symptoms**: English text showing on non-English pages
**Causes**:
- Missing translation for specific locale
- Incorrect locale structure

**Solutions**:
```json
// Add missing translations
"seo": {
  "en": { "title": "English Title" },
  "lt": { "title": "Lietuviškas Pavadinimas" },  // Add missing
  "pl": { "title": "Polski Tytuł" },             // Add missing
  "uk": { "title": "Українська Назва" }          // Add missing
}
```

#### 4. Page Not Found (404)
**Symptoms**: 404 error when accessing page
**Causes**:
- Missing route configuration
- Incorrect URL structure
- Page component not created

**Solutions**:
```json
// Add to routes.json
{
  "pageId": "your-page",
  "urls": {
    "en": "your-page",
    "lt": "jusu-puslapis",
    "pl": "twoja-strona", 
    "uk": "vasha-storinka"
  }
}
```

### Debug Tools

#### 1. Content Resolver Debug
```typescript
// Add to component for debugging
console.log('Final components:', finalComponents);
console.log('Localized content:', localizedPageContent);
```

#### 2. Network Tab
- Check for 404s on JSON files
- Verify correct content loading
- Monitor shared content requests

#### 3. React DevTools
- Inspect component props
- Verify translation data
- Check component hierarchy

## Quick Reference

### Page Creation Checklist
- [ ] Create `/content/pages/{pageId}.json`
- [ ] Add all 4 locale translations (en, lt, pl, uk)
- [ ] Include complete SEO data
- [ ] Add route to `/content/routes.json`
- [ ] Test page loads correctly
- [ ] Verify all translations display
- [ ] Check default components render
- [ ] Test component overrides work

### Content Key Patterns
- `"hero"` → page.content[locale].hero
- `"shared:servicecards"` → /content/shared/components/servicecards.json
- `"customSection"` → page.content[locale].customSection

### Override Quick Examples
```json
// Use page content
"componentOverrides": {
  "WhyChooseUs": { "contentKey": "whyChooseUs" }
}

// Use different shared content
"componentOverrides": {
  "Testimonials": { "contentKey": "shared:homepage-testimonials" }
}

// Disable component
"componentOverrides": {
  "Partners": { "disabled": true }
}
```

---

This guide provides the complete workflow for content management and page creation in the langu-remontas project. Follow these patterns for consistent, maintainable, and translatable content.
