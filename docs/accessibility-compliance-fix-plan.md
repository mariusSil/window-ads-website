# Accessibility Compliance Fix Plan - Window Ads Website

## PROMPT for AI Coding Assistant

Fix the following accessibility violations identified in the window-ads-website project to ensure WCAG 2.1 AA compliance and improve user experience for assistive technology users.

## Critical Issues to Address

### 1. ARIA Compliance Issues (HIGH PRIORITY)
**Problem**: `[role]` elements do not have all required `[aria-*]` attributes
**Impact**: Screen readers cannot properly interpret interactive elements
**Fix Required**:
- Audit all components with `role` attributes in `/components/` directory
- Add missing `aria-label`, `aria-labelledby`, `aria-describedby` attributes
- Focus on modal dialogs, buttons, and navigation elements
- Specific components to check: `RequestTechnicianModal.tsx`, `ConsultationModal.tsx`, `MobileNavigation.tsx`

### 2. Color Contrast Issues (HIGH PRIORITY)
**Problem**: Background and foreground colors do not have sufficient contrast ratio
**Impact**: Users with visual impairments cannot read content properly
**Fix Required**:
- Check `tailwind.config.js` color definitions against WCAG AA standards (4.5:1 ratio)
- Update color combinations in components that fail contrast tests
- Focus on text over colored backgrounds, button states, and link colors
- Test with tools like WebAIM Contrast Checker

### 3. Definition List Structure (MEDIUM PRIORITY)
**Problem**: Definition list items are not wrapped in `<dl>` elements
**Impact**: Screen readers cannot properly navigate definition lists
**Fix Required**:
- Find components using `<dt>` and `<dd>` elements without proper `<dl>` wrapper
- Likely in FAQ components, service descriptions, or feature lists
- Update structure to: `<dl><dt>Term</dt><dd>Definition</dd></dl>`

### 4. Internationalization Issues (MEDIUM PRIORITY)
**Problem**: `<html>` element does not have a `[lang]` attribute
**Impact**: Screen readers cannot determine content language
**Fix Required**:
- Update `app/[locale]/layout.tsx` to include `lang` attribute on `<html>` element
- Ensure `lang` attribute matches current locale (en, lt, pl, uk)
- Add `hreflang` attributes to language switcher links

### 5. Link Accessibility (MEDIUM PRIORITY)
**Problem**: Links do not have a discernible name
**Impact**: Screen readers cannot identify link purpose
**Fix Required**:
- Audit all `<Link>` components for proper accessible names
- Add `aria-label` or ensure visible text describes link purpose
- Focus on navigation menus, CTA buttons, and footer links
- Check `components/common/` and `components/shared/` directories

## Implementation Strategy

### Phase 1: Critical Fixes (Week 1)
1. **ARIA Attributes**: Add missing ARIA attributes to modal dialogs and interactive elements
2. **Color Contrast**: Update Tailwind color palette to meet WCAG AA standards
3. **HTML Lang**: Add proper `lang` attributes to layout components

### Phase 2: Structure Fixes (Week 2)
1. **Definition Lists**: Fix `<dl>` structure in FAQ and feature components
2. **Link Names**: Ensure all links have discernible names
3. **Form Labels**: Verify all form inputs have proper labels

### Phase 3: Testing & Validation (Week 3)
1. **Automated Testing**: Run accessibility audits with axe-core or Lighthouse
2. **Manual Testing**: Test with screen readers (NVDA, JAWS, VoiceOver)
3. **User Testing**: Validate with actual users of assistive technology

## Files to Update

### Layout & Core
- `app/[locale]/layout.tsx` - Add lang attribute
- `tailwind.config.js` - Update color contrast ratios
- `components/ComponentRenderer.tsx` - Ensure proper ARIA roles

### Modal Components
- `components/common/RequestTechnicianModal.tsx`
- `components/common/ConsultationModal.tsx`
- Add: `role="dialog"`, `aria-labelledby`, `aria-describedby`, `aria-modal="true"`

### Navigation Components
- `components/common/MobileNavigation.tsx`
- `components/common/Header.tsx`
- Add: `aria-expanded`, `aria-controls`, `aria-current`

### Content Components
- `components/shared/Faq.tsx` - Fix definition list structure
- `components/shared/ServiceCards.tsx` - Ensure proper link names
- `components/shared/Testimonials.tsx` - Add proper ARIA labels

### Form Components
- `components/ui/Input.tsx` - Ensure label association
- `components/ui/Select.tsx` - Add proper ARIA attributes
- `components/ui/Checkbox.tsx` - Verify label connection

## Testing Commands

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/playwright eslint-plugin-jsx-a11y

# Run accessibility audit
npm run build
npm run start
# Use browser dev tools Lighthouse accessibility audit

# ESLint accessibility rules
npm run lint -- --fix
```

## Success Criteria

- [ ] All ARIA violations resolved
- [ ] Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] All definition lists properly structured
- [ ] HTML lang attributes present and correct
- [ ] All links have discernible names
- [ ] Lighthouse accessibility score ≥ 95
- [ ] No axe-core violations
- [ ] Manual screen reader testing passes

## Implementation Priority

1. **IMMEDIATE**: ARIA attributes and color contrast (affects all users)
2. **THIS WEEK**: HTML structure and lang attributes (SEO and accessibility)
3. **NEXT WEEK**: Link names and comprehensive testing

## Notes

- Follow existing project patterns and TypeScript interfaces
- Maintain current design while improving accessibility
- Test changes across all 4 locales (en, lt, pl, uk)
- Document accessibility patterns for future development
- Consider adding accessibility testing to CI/CD pipeline

## Expected Impact

- Improved screen reader compatibility
- Better SEO rankings (accessibility is ranking factor)
- Legal compliance with accessibility standards
- Enhanced user experience for all users
- Reduced bounce rate from users with disabilities

---

**Implementation Timeline**: 3 weeks
**Effort Level**: Medium (requires systematic component updates)
**Risk Level**: Low (mostly additive changes, minimal breaking changes)
