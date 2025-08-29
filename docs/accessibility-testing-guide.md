# Accessibility Testing Guide - Window Ads Website

## Automated Testing Tools

### 1. Lighthouse Accessibility Audit
```bash
# Run in Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"
5. Target score: 95+ points
```

### 2. axe-core Browser Extension
```bash
# Install axe DevTools extension
1. Install from Chrome Web Store
2. Open DevTools → axe DevTools tab
3. Click "Scan ALL of my page"
4. Review violations and fix
```

### 3. WAVE Web Accessibility Evaluation Tool
```bash
# Online tool
1. Visit https://wave.webaim.org/
2. Enter website URL
3. Review errors, alerts, and features
4. Fix all critical errors
```

## Manual Testing Checklist

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and menus
- [ ] Arrow keys work in menus and carousels
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Screen Reader Testing
- [ ] Install NVDA (Windows) or VoiceOver (Mac)
- [ ] Test with screen reader enabled
- [ ] All content is announced properly
- [ ] Headings create logical structure
- [ ] Form labels are associated correctly
- [ ] Images have meaningful alt text

### Color Contrast
- [ ] Text meets 4.5:1 contrast ratio (normal text)
- [ ] Large text meets 3:1 contrast ratio
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators are visible
- [ ] Test with WebAIM Contrast Checker

### Mobile Accessibility
- [ ] Touch targets are minimum 44px
- [ ] Content reflows properly
- [ ] Zoom up to 200% without horizontal scroll
- [ ] Voice control works (iOS/Android)

## Component-Specific Tests

### Modal Dialogs
- [ ] `role="dialog"` present
- [ ] `aria-modal="true"` set
- [ ] `aria-labelledby` references title
- [ ] `aria-describedby` references description
- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element

### Navigation Menus
- [ ] `role="navigation"` present
- [ ] `aria-label` describes purpose
- [ ] Current page marked with `aria-current="page"`
- [ ] Expandable menus use `aria-expanded`
- [ ] Menu items properly grouped

### Forms
- [ ] All inputs have associated labels
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages linked with `aria-describedby`
- [ ] Fieldsets group related inputs
- [ ] Form submission provides feedback

### FAQ/Accordion
- [ ] Proper `<dl>`, `<dt>`, `<dd>` structure
- [ ] Buttons use `aria-expanded`
- [ ] Content linked with `aria-controls`
- [ ] Keyboard navigation works

## WCAG 2.1 AA Compliance Checklist

### Level A Requirements
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] Content is keyboard accessible
- [ ] No seizure-inducing content
- [ ] Page has proper heading structure

### Level AA Requirements
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Text can resize to 200%
- [ ] Content reflows at 320px width
- [ ] Focus indicators are visible
- [ ] Page has lang attribute

## Testing Commands

### Install Testing Dependencies
```bash
npm install --save-dev @axe-core/playwright eslint-plugin-jsx-a11y
```

### ESLint Accessibility Rules
```javascript
// .eslintrc.js
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
}
```

### Playwright Accessibility Tests
```javascript
// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Browser Testing Matrix

### Desktop Browsers
- [ ] Chrome + NVDA
- [ ] Firefox + NVDA  
- [ ] Safari + VoiceOver
- [ ] Edge + NVDA

### Mobile Testing
- [ ] iOS Safari + VoiceOver
- [ ] Android Chrome + TalkBack
- [ ] Touch navigation
- [ ] Voice control

## Performance Impact

### Accessibility Features Performance
- [ ] ARIA attributes don't slow rendering
- [ ] Focus management is smooth
- [ ] Screen reader announcements are timely
- [ ] Keyboard navigation is responsive

## Common Issues Fixed

### 1. Missing ARIA Labels
```tsx
// Before
<button onClick={handleClick}>
  <Icon name="Close" />
</button>

// After  
<button onClick={handleClick} aria-label="Close dialog">
  <Icon name="Close" />
</button>
```

### 2. Improper Heading Structure
```tsx
// Before
<h1>Page Title</h1>
<h3>Section Title</h3>

// After
<h1>Page Title</h1>
<h2>Section Title</h2>
```

### 3. Missing Form Labels
```tsx
// Before
<input type="email" placeholder="Email" />

// After
<label htmlFor="email">Email Address</label>
<input id="email" type="email" placeholder="Email" />
```

### 4. Poor Color Contrast
```css
/* Before */
.text-gray-500 { color: #6b7280; } /* 3.1:1 ratio */

/* After */
.text-gray-600 { color: #475569; } /* 4.6:1 ratio */
```

## Success Criteria

### Automated Tests
- [ ] Lighthouse Accessibility Score: 95+
- [ ] axe-core: 0 violations
- [ ] WAVE: 0 errors
- [ ] ESLint jsx-a11y: 0 errors

### Manual Tests  
- [ ] Full keyboard navigation works
- [ ] Screen reader announces all content
- [ ] All interactive elements have 44px+ touch targets
- [ ] Color contrast meets WCAG AA standards
- [ ] Content works at 200% zoom

### User Testing
- [ ] Users with disabilities can complete key tasks
- [ ] Navigation is intuitive with assistive technology
- [ ] Forms are easy to complete
- [ ] Error messages are clear and helpful

## Maintenance

### Regular Audits
- [ ] Run accessibility tests monthly
- [ ] Include accessibility in code reviews
- [ ] Test new features with screen readers
- [ ] Monitor user feedback for accessibility issues

### Training
- [ ] Team trained on WCAG guidelines
- [ ] Developers know common accessibility patterns
- [ ] Designers consider accessibility in mockups
- [ ] QA includes accessibility in test plans

---

**Next Steps**: Run automated tests, fix any remaining violations, and conduct user testing with assistive technology users.
