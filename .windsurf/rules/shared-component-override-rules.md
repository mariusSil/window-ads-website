# Shared Component Override Rules

## System Overview
9 default components auto-included on every page. Override via `componentOverrides` in page/collection JSON.

## Default Components
1. **ServiceCards** - `shared:servicecards`
2. **AccessoriesGrid** - `shared:accessoriesgrid` 
3. **Testimonials** - `shared:testimonials`
4. **WhyChooseUs** - `whyChooseUs`
5. **TechnicianTeam** - `shared:technicianteam`
6. **Partners** - `shared:partners`
7. **Transformations** - `shared:transformations`
8. **PropertyTypes** - `shared:propertytypes`
9. **Faq** - `shared:faq`

## Content Resolution
- `shared:key` → `/content/shared/components/key.json`
- `key` → page content object

## Override Patterns

### ✅ Valid
```json
// Use existing shared content
"componentOverrides": {
  "Faq": { "contentKey": "shared:faq" }
}

// Use page content (must exist in page's content object)
"componentOverrides": {
  "Faq": { "contentKey": "serviceFaq" }
}

// Disable component
"componentOverrides": {
  "Faq": { "disabled": true }
}

// Reorder position
"componentOverrides": {
  "Faq": { "position": 2 }
}

// Custom inline content
"componentOverrides": {
  "Faq": {
    "customContent": {
      "en": { "title": "FAQ", "items": [...] },
      "lt": { "title": "DUK", "items": [...] }
    }
  }
}
```

### ❌ Invalid
```json
// Non-existent shared file
"Faq": { "contentKey": "shared:missing-file" }

// Wrong case (use PascalCase)
"faq": { "contentKey": "shared:faq" }

// Missing page content key
"Faq": { "contentKey": "nonExistentKey" }
```

## Registration Rules
- Override keys: PascalCase (`"Faq"`, `"ServiceCards"`)
- Renderer keys: lowercase (`case 'faq':`)
- Must match exactly

## Content Structure
### Shared Files: `/content/shared/components/[key].json`
```json
{
  "en": { "title": "...", "items": [...] },
  "lt": { "title": "...", "items": [...] },
  "pl": { "title": "...", "items": [...] },
  "uk": { "title": "...", "items": [...] }
}
```

## Common Errors
- **"Cannot read properties of undefined"** → Add validation before accessing content
- **"Content structure not recognized"** → Verify file exists and structure matches
- **"Component not rendering"** → Use PascalCase names in overrides
- **"Shared content not found"** → Create missing file or use existing key

## Quick Examples
```json
// Service page with custom FAQ
{
  "componentOverrides": {
    "Faq": { "contentKey": "serviceFaq" }
  },
  "content": {
    "en": {
      "serviceFaq": { "title": "FAQ", "items": [...] }
    }
  }
}

// Disable and reorder components
{
  "componentOverrides": {
    "Partners": { "disabled": true },
    "Testimonials": { "position": 1 }
  }
}
```

**Rule**: Always validate content exists before referencing in overrides.
