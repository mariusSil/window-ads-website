# AI Website Template - Usage Guide

This template is architected for easy reuse across different projects with minimal configuration changes.

## Template Architecture

### Core Components

#### **Header Component (`/components/Header.tsx`)**
- Responsive navigation with mobile menu
- Integrated language switcher
- Customizable logo and navigation items
- Active link highlighting

#### **Language Switcher (`/components/LanguageSwitcher.tsx`)**
- Dropdown language selection
- Automatic URL mapping for localized routes
- Flag icons and native language names
- Smooth transitions between locales

#### **Footer Component (`/components/Footer.tsx`)**
- Company information section
- Quick links and legal pages
- Social media links
- Responsive grid layout

#### **Template Configuration (`/components/TemplateConfig.tsx`)**
- Centralized configuration system
- Easy customization for new projects
- Type-safe configuration interface

## Quick Setup for New Projects

### 1. Update Template Configuration

Edit `/components/TemplateConfig.tsx`:

```typescript
export const customConfig: TemplateConfig = {
  site: {
    name: 'Your Company Name',
    description: 'Your company description',
    url: 'https://yourwebsite.com',
    logo: {
      text: 'Your Logo',
      // or image: '/images/logo.png'
    }
  },
  navigation: [
    {
      key: 'home',
      urls: { en: '', lt: '' },
      translationKey: 'navigation.home'
    },
    // Add your custom navigation items
  ],
  seo: {
    defaultTitle: 'Your Website Title',
    defaultDescription: 'Your website description',
    twitterHandle: '@yourhandle',
    ogImageDefault: '/images/og/your-default.jpg'
  }
};
```

### 2. Update Translation Files

**English (`/messages/en/common.json`):**
```json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "contact": "Contact"
  }
}
```

**Lithuanian (`/messages/lt/common.json`):**
```json
{
  "navigation": {
    "home": "Pagrindinis",
    "about": "Apie mus",
    "services": "Paslaugos",
    "contact": "Kontaktai"
  }
}
```

### 3. Add New Pages

Create page configuration in `/page-configs/`:

```json
{
  "pageId": "services",
  "urls": {
    "en": "services",
    "lt": "paslaugos"
  },
  "seo": {
    "en": {
      "title": "Our Services - Your Company",
      "description": "Discover our professional services...",
      "keywords": "services, professional, solutions",
      "ogImage": "/images/og/en-services.jpg",
      "ogImageAlt": "Our Services page"
    },
    "lt": {
      "title": "Mūsų paslaugos - Jūsų įmonė",
      "description": "Atraskite mūsų profesionalias paslaugas...",
      "keywords": "paslaugos, profesionalūs, sprendimai",
      "ogImage": "/images/og/lt-services.jpg",
      "ogImageAlt": "Mūsų paslaugų puslapis"
    }
  },
  "content": {
    "template": "services-page",
    "components": [
      {
        "type": "PageHeader",
        "translationKey": "services.hero"
      },
      {
        "type": "ServicesList",
        "translationKey": "services.list"
      }
    ]
  }
}
```

### 4. Environment Configuration

Update `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://yourwebsite.com
NEXT_PUBLIC_SITE_NAME=Your Website Name
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

## Key Features

### ✅ **SEO Optimized**
- Dynamic meta tags per locale
- Open Graph and Twitter Cards
- Structured data (JSON-LD)
- Proper hreflang implementation
- Canonical URLs

### ✅ **Internationalization**
- Localized URLs (`/en/about` → `/lt/apie-mus`)
- Page delegate system
- Translation management
- Language switcher

### ✅ **Performance**
- Static generation
- Image optimization
- Translation caching
- Minimal bundle size

### ✅ **Developer Experience**
- TypeScript throughout
- Component-based architecture
- Easy configuration
- Comprehensive documentation

## File Structure

```
template/
├── app/
│   ├── [locale]/
│   │   ├── [...slug]/page.tsx    # Dynamic localized pages
│   │   ├── layout.tsx            # Locale-specific layout
│   │   └── page.tsx              # Homepage
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root redirect
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── LanguageSwitcher.tsx      # Language selector
│   ├── Footer.tsx                # Site footer
│   └── TemplateConfig.tsx        # Configuration system
├── lib/
│   ├── i18n.ts                   # Internationalization utilities
│   └── page-resolver.ts          # URL resolution system
├── messages/
│   ├── en/                       # English translations
│   └── lt/                       # Lithuanian translations
└── page-configs/                 # Page configurations
    ├── about.json
    └── contact.json
```

## Adding New Locales

1. Add locale to `/lib/i18n.ts`:
```typescript
export const locales = ['en', 'lt', 'de'] as const;
```

2. Create translation files in `/messages/de/`

3. Update page configurations with new locale URLs

4. Add locale to language switcher in `/components/LanguageSwitcher.tsx`

This template provides a solid foundation for multilingual websites with optimal SEO performance and easy customization.
