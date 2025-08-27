# Window & Door Repair Services Website

A professional multilingual website for window and door repair services built with Next.js 14, TypeScript, and a comprehensive internationalization system. Features advanced content management, component-driven architecture, and optimized user experience.

## 🌍 Multilingual Support

- **English** (en) - Primary language
- **Lithuanian** (lt) - Lietuvių kalba  
- **Polish** (pl) - Polski
- **Ukrainian** (uk) - Українська

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
window-ads-website/
├── app/
│   ├── [locale]/           # Dynamic locale routing
│   │   ├── [...slug]/      # Dynamic page routing
│   │   └── not-found.tsx   # 404 page
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   ├── common/            # CTA buttons, modals
│   ├── shared/            # Default page components
│   ├── pages/             # Page-specific components
│   └── layouts/           # Layout components
├── content/
│   ├── pages/             # Page content JSON files
│   ├── shared/            # Shared content & components
│   ├── collections/       # Dynamic content (news, services)
│   └── routes.json        # URL routing configuration
├── lib/                   # Utility functions
├── contexts/              # React contexts
└── public/               # Static assets
```

## 🎯 Key Features

### 🏗️ Architecture
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Dynamic routing** via `[...slug]` pattern
- **Component-driven** architecture with central renderer

### 🌐 Internationalization
- **4 locales** with proper URL routing
- **Content resolver** system for translations
- **SEO optimization** per locale
- **Fallback system** for missing translations

### 🎨 Design System
- **Professional color palette** (Red primary, Green success)
- **Typography hierarchy** (Hero, H1-H3, Body, CTA)
- **Consistent spacing** system
- **Responsive design** patterns
- **Accessibility** compliance (WCAG 2.1 AA)

### 📱 Components
- **Default components system** - 9 components auto-included on every page
- **Override system** for customization
- **CTA button system** with standardized modals
- **UI component library** with Radix UI integration

## 🔧 Content Management

### Page Structure
```json
{
  "pageId": "homepage",
  "seo": {
    "en": {"title": "...", "description": "..."},
    "lt": {"title": "...", "description": "..."}
  },
  "content": {
    "en": {"hero": {...}},
    "lt": {"hero": {...}}
  },
  "components": [
    {"type": "Hero", "contentKey": "hero"}
  ],
  "componentOverrides": {
    "Faq": {"contentKey": "shared:homepage-faq"}
  }
}
```

### Default Components (Auto-included)
1. **ServiceCards** - Service offerings grid
2. **AccessoriesGrid** - Product accessories
3. **Testimonials** - Customer reviews
4. **WhyChooseUs** - Value propositions
5. **TechnicianTeam** - Team showcase
6. **Partners** - Partner logos
7. **Transformations** - Before/after gallery
8. **PropertyTypes** - Property type grid
9. **Faq** - Frequently asked questions

### Content Override Patterns
```json
// Use shared content
"componentOverrides": {
  "Faq": {"contentKey": "shared:maintenance-faq"}
}

// Use page content
"componentOverrides": {
  "WhyChooseUs": {"contentKey": "whyChooseUs"}
}

// Disable component
"componentOverrides": {
  "Partners": {"disabled": true}
}

// Custom inline content
"componentOverrides": {
  "Faq": {
    "customContent": {
      "en": {"title": "Custom FAQ", "items": [...]},
      "lt": {"title": "Pritaikytas DUK", "items": [...]}
    }
  }
}
```

## 🎨 UI Components

### Button System
```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Primary (Red)</Button>
<Button variant="outline-red">Secondary (Red Outline)</Button>
<Button variant="success" showIcon={true}>Success with Check</Button>

// Sizes
<Button size="sm">Header CTAs</Button>
<Button size="default">Standard</Button>
<Button size="lg">Hero CTAs</Button>
```

### CTA Button System
```tsx
import { CTAButtons } from '@/components/common/CTAButtons';

<CTAButtons
  locale={locale}
  translations={translations}
  technicianProps={{ size: "sm" }}
  consultationProps={{ size: "sm" }}
/>
```

### Icon System
```tsx
import Icon from '@/components/ui/Icon';

<Icon name="Phone" className="w-5 h-5" />
<Icon name="MessageSquare" className="w-5 h-5" />
```

## 🔍 SEO & Performance

- **Dynamic metadata** generation per locale
- **Structured data** (JSON-LD) support
- **Sitemap generation** with hreflang
- **Core Web Vitals** optimization
- **Image optimization** with Next.js Image
- **Static export** support

## 🛠️ Development Guidelines

### Adding New Pages
1. Create content file in `/content/pages/[pageId].json`
2. Add route to `/content/routes.json`
3. Content automatically available at locale-specific URLs

### Creating Components
1. Create component in appropriate folder
2. Register in `ComponentRenderer.tsx`
3. Add TypeScript interfaces
4. Follow design system patterns

### Content Translation
- Use content resolver functions
- Never import JSON directly
- Provide fallbacks for missing translations
- Support all 4 locales

## 📋 Available Scripts

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint checking
npm run export       # Static export
```

## 🔧 Environment Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure email service** (optional):
   - Set up SMTP credentials in `.env.local`
   - See `README-EMAIL-INTEGRATION.md` for detailed setup

3. **Development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see the website.

## 📧 Email Integration

The project includes a complete email service with:
- **Contact form** submissions
- **Rate limiting** and spam protection
- **Multi-language** email templates
- **Nodemailer** integration

See `README-EMAIL-INTEGRATION.md` for setup instructions.

## 🔒 License

This project is licensed under a **Non-Commercial License**. See the [LICENSE](./LICENSE) file for details.

**Commercial use is prohibited** without explicit permission from the project maintainers.

## 🏢 About

This is a professional window and door repair service website featuring:

- **Expert technician services** for residential and commercial properties
- **Free diagnostics** and consultation services  
- **Emergency repair** capabilities
- **Quality guarantee** on all work
- **Multilingual support** for diverse customer base

Built with modern web technologies and optimized for conversion and user experience.

## 🔄 Project Template

This project serves as a comprehensive template for multilingual service websites with:
- **Reusable architecture** for similar businesses
- **Content management** system via JSON files
- **Component library** with standardized UI elements
- **SEO optimization** and performance best practices

See `README-template-usage.md` for guidance on adapting this template.

## 📚 Additional Documentation

- `README-EMAIL-INTEGRATION.md` - Email service setup and configuration
- `README-template-usage.md` - Guide for using this as a template
- `.windsurf/rules/` - Development guidelines and best practices
- `docs/` - Additional project documentation

---

**Tech Stack:** Next.js 14 • TypeScript • Tailwind CSS • Radix UI • Lucide React • Nodemailer
