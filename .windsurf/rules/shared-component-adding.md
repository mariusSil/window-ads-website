---
trigger: model_decision
description: than adding or updating component in shared folder
---

# Component Integration Checklist - Langu-Remontas Project

## MANDATORY Steps for Adding New Components

### Phase 1: Component Creation
- [ ] **Create Component File** - `/components/shared/ComponentName.tsx`
  - Use proper TypeScript interfaces (no `any` types)
  - Follow responsive grid patterns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - Use design system classes: `container-custom`, `text-h1`, `rounded-card`, `shadow-card`
  - Include proper accessibility attributes
  - Handle empty/missing data gracefully

### Phase 2: Content Management
- [ ] **Create Content File** - `/content/shared/components/componentname.json`
  - Include all 4 locales: `en`, `lt`, `pl`, `uk`
  - Use consistent structure across all locales
  - Provide fallback content for missing translations
  - Follow naming convention: lowercase filename

### Phase 3: Component Registration
- [ ] **Update ComponentRenderer.tsx**
  - Add import: `import ComponentName from './shared/ComponentName';`
  - Add case in switch statement: `case 'componentname': return <ComponentName {...props} />;`
  - Use lowercase component type in case statement

### Phase 4: Homepage Integration
- [ ] **Update homepage.json Content References**
  - Add to all 4 locale sections: `"componentName": "shared:componentname"`
  - Maintain consistent naming: camelCase in content, lowercase in shared reference
  - Position correctly in content flow

- [ ] **Update homepage.json Components Array**
  - Add component object: `{ "type": "ComponentName", "contentKey": "componentName" }`
  - Use PascalCase for type, camelCase for contentKey
  - Position in correct order in components array

### Phase 5: Modal Integration (CRITICAL - Often Missed)
- [ ] **Update page.tsx Modal Logic**
  - Add component type to modal condition in line 104: `|| component.type === 'ComponentName'`
  - This is REQUIRED for components with CTA buttons
  - Missing this step causes "translations undefined" errors

### Phase 6: Verification
- [ ] **Test Component Loading**
  - Verify component renders without errors
  - Check all locales display correct translations
  - Test responsive behavior on mobile/tablet/desktop
  - Validate content loading from shared references

## Common Issues & Solutions

### Issue: Component Not Rendering
**Causes:**
- Missing import in ComponentRenderer.tsx
- Incorrect case in switch statement
- Missing content reference in homepage.json
- Typo in component type or contentKey

**Solution:**
- Verify all 4 integration steps completed
- Check console for error messages
- Ensure naming consistency across all files

### Issue: Content Not Loading
**Causes:**
- Missing shared content reference
- Incorrect content file path
- Missing locale in content file
- Typo in shared reference string

**Solution:**
- Verify content file exists in correct location
- Check shared reference format: `"shared:componentname"`
- Ensure all 4 locales have content

### Issue: Modal Not Working
**Causes:**
- Component not added to modal condition in page.tsx
- Missing request_technician_modal in translations

**Solution:**
- Add component type to line 104 condition
- Verify modal content is being passed

## File Naming Conventions

### Component Files
- **Location**: `/components/shared/`
- **Format**: `ComponentName.tsx` (PascalCase)
- **Import**: `import ComponentName from './shared/ComponentName';`

### Content Files
- **Location**: `/content/shared/components/`
- **Format**: `componentname.json` (lowercase)
- **Reference**: `"shared:componentname"`

### Homepage References
- **Content Key**: `"componentName"` (camelCase)
- **Component Type**: `"ComponentName"` (PascalCase)
- **Shared Reference**: `"shared:componentname"` (lowercase)

## Required Design System Classes

### Layout
- `container-custom` - Standard container with responsive padding
- `py-20` - Section vertical padding
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8` - Responsive grid

### Typography
- `text-h1` - Main section titles
- `text-h2` - Subsection titles
- `text-body` - Body text
- `text-neutral-900` - Dark text
- `text-neutral-600` - Light text

### Components
- `rounded-card` - Card border radius
- `shadow-card` - Card shadow
- `bg-white` - Card background
- `text-primary` - Brand color text

## Debugging Commands

```bash
# Check if component file exists
ls -la components/shared/ComponentName.tsx

# Check if content file exists
ls -la content/shared/components/componentname.json

# Verify content structure
cat content/shared/components/componentname.json | jq '.en'

# Check homepage integration
grep -n "componentName" content/pages/homepage.json
```

## Success Criteria Checklist

### Technical Requirements
- [ ] TypeScript interfaces defined (no `any` types)
- [ ] Component registered in ComponentRenderer.tsx
- [ ] Content file created with all 4 locales
- [ ] Homepage.json updated with content references
- [ ] Components array includes new component
- [ ] Responsive design implemented
- [ ] Error handling for missing data

### Content Requirements
- [ ] All locales have complete translations
- [ ] Content structure is consistent
- [ ] Shared references work correctly
- [ ] SEO metadata included if needed

### Visual Requirements
- [ ] Follows design system patterns
- [ ] Responsive on all screen sizes
- [ ] Proper spacing and typography
- [ ] Accessibility attributes included
- [ ] Loading states handled

## Emergency Fixes

### Component Not Showing
1. Check browser console for errors
2. Verify ComponentRenderer.tsx registration
3. Check homepage.json content references
4. Validate content file structure

### Content Not Loading
1. Verify shared reference format
2. Check content file path and naming
3. Ensure all required locales present
4. Test content-resolver functions

### Styling Issues
1. Verify design system classes used
2. Check responsive breakpoints
3. Validate Tailwind class names
4. Test on multiple screen sizes

---

**CRITICAL**: Always follow this checklist completely. Missing any step will result in component not rendering or functioning properly.
