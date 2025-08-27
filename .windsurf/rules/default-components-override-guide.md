---
trigger: model_decision
description: when overriding shared components logic/translations inside page
---

# Default Components Override System - Developer Guide

## Overview

The langu-remontas project now includes an automatic default components system that eliminates the need to manually declare 9 core shared components on every page. This system provides:

- **Automatic inclusion** of 9 default shared components on all pages
- **Override capabilities** for customizing specific components per page
- **Backward compatibility** with existing page structures
- **Simplified JSON** with 70% less boilerplate code

## Default Components

These 9 components are automatically included on every page:

1. **ServiceCards** - `shared:servicecards`
2. **AccessoriesGrid** - `shared:accessoriesgrid` 
3. **Testimonials** - `shared:testimonials`
4. **WhyChooseUs** - `whyChooseUs` (page-specific by default)
5. **TechnicianTeam** - `shared:technicianteam`
6. **Partners** - `shared:partners`
7. **Transformations** - `shared:transformations`
8. **PropertyTypes** - `shared:propertytypes`
9. **Faq** - `shared:faq`

## Page JSON Structure

### New Simplified Structure

```json
{
  "pageId": "about",
  "template": "standard-page",
  "seo": { /* SEO data */ },
  "content": { /* page content */ },
  "components": [
    {
      "type": "PageHeader",
      "contentKey": "hero",
      "required": true
    }
  ],
  "componentOverrides": {
    "WhyChooseUs": {
      "contentKey": "whyChooseUs"
    }
  }
}
```

### Legacy Structure (Still Supported)

```json
{
  "pageId": "about",
  "components": [
    { "type": "PageHeader", "contentKey": "hero", "required": true },
    { "type": "ServiceCards", "contentKey": "shared:servicecards", "required": true },
    { "type": "AccessoriesGrid", "contentKey": "shared:accessoriesgrid", "required": true },
    // ... 7 more default components
  ]
}
```

## Override Patterns

### Pattern 1: Use Default Shared Content
```json
// No override needed - uses shared:servicecards automatically
```

### Pattern 2: Override with Page-Specific Content
```json
"componentOverrides": {
  "ServiceCards": {
    "contentKey": "customServices"
  }
}
```

### Pattern 3: Override with Different Shared Content
```json
"componentOverrides": {
  "Testimonials": {
    "contentKey": "shared:homepage-testimonials"
  }
}
```

### Pattern 4: Override with Inline Content
```json
"componentOverrides": {
  "WhyChooseUs": {
    "customContent": {
      "en": { "title": "Custom Title", "items": [...] },
      "lt": { "title": "Pritaikytas Pavadinimas", "items": [...] }
    }
  }
}
```

### Pattern 5: Disable Specific Component
```json
"componentOverrides": {
  "Partners": {
    "disabled": true
  }
}
```

### Pattern 6: Reorder Components
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

### Pattern 7: Disable All Default Components
```json
{
  "pageId": "special-page",
  "defaultComponentsDisabled": true,
  "components": [
    // Only these components will be rendered
  ]
}
```

## Implementation Details

### Content Resolution Priority

1. **Custom content** from `componentOverrides.customContent`
2. **Override content key** from `componentOverrides.contentKey`
3. **Page content** from `content[locale][component.contentKey]`
4. **Default shared content** from component's default `contentKey`

### Component Positioning

- Page-specific components (from `components` array) are rendered first
- Default components are appended unless already present
- Components with `position` override are inserted at specified positions
- Position numbers are sorted ascending (0, 1, 2, ...)

### Caching

The system includes intelligent caching:
- **Merged components cache** - Prevents recalculation of component arrays
- **Shared content cache** - Reuses loaded shared content across requests
- **Page content cache** - Caches loaded page configurations

## Migration Guide

### Step 1: Identify Redundant Components

Look for these patterns in existing page JSON files:
```json
"components": [
  { "type": "ServiceCards", "contentKey": "shared:servicecards", "required": true },
  { "type": "AccessoriesGrid", "contentKey": "shared:accessoriesgrid", "required": true },
  // ... other default components
]
```

### Step 2: Remove Default Components

Remove all 9 default components from the `components` array, keeping only page-specific components like:
- `PageHeader`
- `Content` 
- `ContactForm`
- Custom page components

### Step 3: Add Overrides (If Needed)

If any default component needs page-specific content, add to `componentOverrides`:
```json
"componentOverrides": {
  "WhyChooseUs": {
    "contentKey": "aboutWhyChooseUs"
  }
}
```

### Step 4: Test and Verify

Ensure all components render correctly and content loads properly.

## API Reference

### New Functions in content-resolver.ts

#### `getFinalPageComponents(pageContent: PageContent): ComponentConfig[]`
Returns the final list of components for a page, including defaults and overrides.

#### `mergeWithDefaultComponents(pageComponents, componentOverrides): ComponentConfig[]`
Merges page-specific components with default components, applying overrides.

#### `applyComponentOverrides(defaultComponents, overrides): ComponentConfig[]`
Applies override configuration to default components.

#### `getDefaultSharedComponents(): ComponentConfig[]`
Returns the list of default shared components for reference.

### New Interfaces

#### `ComponentOverride`
```typescript
interface ComponentOverride {
  contentKey?: string;        // Override content key
  customContent?: any;        // Inline content object
  disabled?: boolean;         // Disable this component
  position?: number;          // Reorder component
}
```

#### `PageContent` (Updated)
```typescript
interface PageContent {
  pageId: string;
  template: string;
  seo: Record<Locale, SEOData>;
  content: Record<Locale, any>;
  components?: ComponentConfig[];                    // Now optional
  componentOverrides?: Record<string, ComponentOverride>; // New
  defaultComponentsDisabled?: boolean;               // New
}
```

## Performance Impact

### Positive Impact
- **Reduced JSON parsing** - 70% smaller page JSON files
- **Better caching** - Shared components cached once, used everywhere
- **Faster builds** - Less JSON to process during build time

### Negligible Impact
- **Runtime overhead** - Minimal component merging logic
- **Memory usage** - Small increase for caching merged configurations

## Best Practices

### DO
- ✅ Use `componentOverrides` for page-specific customizations
- ✅ Keep page-specific components in the `components` array
- ✅ Test pages after migration to ensure correct rendering
- ✅ Use descriptive `contentKey` names for overrides

### DON'T
- ❌ Manually declare default components in `components` array
- ❌ Use `defaultComponentsDisabled: true` unless absolutely necessary
- ❌ Override components that don't need customization
- ❌ Use complex inline `customContent` when shared content works

## Troubleshooting

### Component Not Rendering
1. Check if component is in default list
2. Verify `componentOverrides` syntax
3. Ensure content key exists in page content
4. Check for `disabled: true` override

### Content Not Loading
1. Verify content key path (`shared:` prefix for shared content)
2. Check if shared content file exists
3. Ensure locale-specific content is available
4. Review content-resolver cache

### Build Errors
1. Check TypeScript interfaces match new structure
2. Verify all page JSON files have valid syntax
3. Ensure required components have `required: true`

## Examples

### Homepage (Simplified)
```json
{
  "pageId": "homepage",
  "components": [
    { "type": "Hero", "contentKey": "hero", "required": true },
    { "type": "FreeDiagnostics", "contentKey": "freeDiagnostics", "required": true }
  ],
  "componentOverrides": {
    "WhyChooseUs": { "contentKey": "whyChooseUs" }
  }
}
```

### About Page (Simplified)
```json
{
  "pageId": "about",
  "components": [
    { "type": "PageHeader", "contentKey": "hero", "required": true }
  ],
  "componentOverrides": {
    "WhyChooseUs": { "contentKey": "whyChooseUs" }
  }
}
```

### Contact Page (Custom)
```json
{
  "pageId": "contact",
  "components": [
    { "type": "PageHeader", "contentKey": "hero", "required": true },
    { "type": "ContactForm", "contentKey": "contactForm", "required": true }
  ],
  "componentOverrides": {
    "Partners": { "disabled": true },
    "Faq": { "position": 1 }
  }
}
```

## Migration Checklist

- [ ] Update content-resolver.ts with new functions
- [ ] Update page templates to use `getFinalPageComponents()`
- [ ] Migrate page JSON files to use override pattern
- [ ] Test all pages for correct component rendering
- [ ] Verify content loading works correctly
- [ ] Update documentation and team training
- [ ] Monitor performance after deployment

---

**Result**: 70% reduction in JSON boilerplate, improved maintainability, and enhanced flexibility for component customization while maintaining full backward compatibility.
