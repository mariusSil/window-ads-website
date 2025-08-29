# Accessibility Testing Guide - Window Ads Website

## 🧪 AUTOMATED TESTING SETUP

### 1. Install Testing Dependencies

```bash
npm install --save-dev @axe-core/playwright @playwright/test
npm install --save-dev axe-core @testing-library/jest-dom
```

### 2. Playwright Accessibility Tests

Create `/tests/accessibility.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Homepage accessibility audit', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Contact page accessibility audit', async ({ page }) => {
    await page.goto('/contact');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Service pages accessibility audit', async ({ page }) => {
    await page.goto('/services/window-repair');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Modal accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Open technician request modal
    await page.click('[data-testid="request-technician-button"]');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### 3. Jest Accessibility Tests

Create `/tests/components/accessibility.test.tsx`:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Faq from '@/components/shared/Faq';
import { RequestTechnicianModal } from '@/components/common/RequestTechnicianModal';

expect.extend(toHaveNoViolations);

describe('Component Accessibility', () => {
  test('FAQ component should be accessible', async () => {
    const mockTranslations = {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How long does window repair take?',
          answer: 'Most repairs are completed within 2-3 hours.'
        }
      ]
    };

    const { container } = render(
      <Faq translations={mockTranslations} locale="en" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Modal should be accessible', async () => {
    const mockTranslations = {
      title: 'Request Technician',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      submit: 'Submit'
    };

    const { container } = render(
      <RequestTechnicianModal
        isOpen={true}
        onClose={() => {}}
        locale="en"
        triggerType="technician"
        translations={mockTranslations}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## 📱 MANUAL TESTING CHECKLIST

### Keyboard Navigation Testing

#### ✅ Basic Navigation
- [ ] **Tab key** - Navigate through all interactive elements
- [ ] **Shift+Tab** - Navigate backwards through elements
- [ ] **Enter/Space** - Activate buttons and links
- [ ] **Arrow keys** - Navigate within menus and lists
- [ ] **Escape key** - Close modals and dropdowns

#### ✅ Form Navigation
- [ ] **Tab order** - Logical progression through form fields
- [ ] **Required fields** - Clear indication and validation
- [ ] **Error messages** - Keyboard accessible and announced
- [ ] **Submit button** - Accessible via keyboard

#### ✅ Modal Testing
- [ ] **Focus trap** - Focus stays within modal when open
- [ ] **Initial focus** - Focus moves to modal when opened
- [ ] **Close functionality** - ESC key closes modal
- [ ] **Return focus** - Focus returns to trigger element when closed

### Screen Reader Testing

#### NVDA (Windows)
```bash
# Download NVDA (free): https://www.nvaccess.org/download/
# Test with NVDA + Firefox combination
```

#### VoiceOver (macOS)
```bash
# Enable VoiceOver: System Preferences > Accessibility > VoiceOver
# Test with VoiceOver + Safari combination
```

#### JAWS (Windows)
```bash
# Commercial screen reader - most popular
# Test with JAWS + Chrome combination
```

### Screen Reader Test Scenarios

#### ✅ Page Structure
- [ ] **Headings** - Proper H1-H6 hierarchy announced
- [ ] **Landmarks** - Main, navigation, aside regions identified
- [ ] **Lists** - Proper list structure announced
- [ ] **Tables** - Headers and data cells properly associated

#### ✅ Interactive Elements
- [ ] **Links** - Purpose clear from link text alone
- [ ] **Buttons** - Action clearly described
- [ ] **Form controls** - Labels properly associated
- [ ] **Error messages** - Clearly announced and associated

#### ✅ Dynamic Content
- [ ] **Live regions** - Updates announced appropriately
- [ ] **Loading states** - Progress clearly communicated
- [ ] **Error states** - Problems clearly announced
- [ ] **Success messages** - Confirmations announced

## 🎨 VISUAL TESTING

### High Contrast Mode Testing

#### Windows High Contrast
```bash
# Enable: Settings > Ease of Access > High contrast
# Test all pages in high contrast mode
```

#### ✅ High Contrast Checklist
- [ ] **Text visibility** - All text readable against backgrounds
- [ ] **Focus indicators** - Visible focus states maintained
- [ ] **Interactive elements** - Buttons and links clearly visible
- [ ] **Icons** - Important icons remain visible or have text alternatives

### Zoom Testing

#### ✅ Zoom Levels
- [ ] **200% zoom** - All content accessible and readable
- [ ] **300% zoom** - Essential functionality maintained
- [ ] **400% zoom** - Core content still accessible
- [ ] **Mobile zoom** - Pinch-to-zoom functionality works

### Color Contrast Testing

#### Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- **Chrome DevTools**: Accessibility panel shows contrast ratios

#### ✅ Contrast Requirements
- [ ] **Normal text** - 4.5:1 minimum ratio (WCAG AA)
- [ ] **Large text** - 3:1 minimum ratio (18pt+ or 14pt+ bold)
- [ ] **UI components** - 3:1 minimum for interactive elements
- [ ] **Focus indicators** - 3:1 minimum against adjacent colors

## 🔧 BROWSER TESTING

### Chrome DevTools Accessibility Panel

```bash
# 1. Open DevTools (F12)
# 2. Go to Accessibility panel
# 3. Run audit on each page
# 4. Check accessibility tree
# 5. Verify ARIA attributes
```

### Firefox Accessibility Inspector

```bash
# 1. Open Developer Tools (F12)
# 2. Go to Accessibility tab
# 3. Check for issues
# 4. Verify color contrast
# 5. Test with screen reader simulation
```

### Safari Web Inspector

```bash
# 1. Enable Develop menu: Preferences > Advanced > Show Develop menu
# 2. Develop > Show Web Inspector
# 3. Audit tab > Run accessibility audit
```

## 📊 TESTING SCHEDULE

### Daily Testing (Development)
- [ ] **Automated tests** - Run with every build
- [ ] **Keyboard navigation** - Quick tab-through test
- [ ] **Focus indicators** - Verify visible focus states

### Weekly Testing
- [ ] **Screen reader** - Test new features with NVDA/VoiceOver
- [ ] **High contrast** - Check new components in high contrast mode
- [ ] **Mobile accessibility** - Test on actual mobile devices

### Monthly Testing
- [ ] **Full audit** - Complete accessibility audit with axe-core
- [ ] **User testing** - Test with actual users with disabilities
- [ ] **Performance** - Ensure accessibility features don't impact performance

### Release Testing
- [ ] **Cross-browser** - Test accessibility in all supported browsers
- [ ] **Cross-platform** - Test on Windows, macOS, iOS, Android
- [ ] **Multiple screen readers** - Test with NVDA, JAWS, VoiceOver
- [ ] **Lighthouse audit** - Achieve 95+ accessibility score

## 🚨 COMMON ISSUES & FIXES

### Definition Lists
```tsx
// ❌ WRONG - Orphaned dt/dd elements
<div>
  <dt>Question</dt>
  <dd>Answer</dd>
</div>

// ✅ CORRECT - Proper dl wrapper
<dl>
  <dt>Question</dt>
  <dd>Answer</dd>
</dl>
```

### Form Labels
```tsx
// ❌ WRONG - Missing label association
<label>Name</label>
<input type="text" />

// ✅ CORRECT - Proper association
<label htmlFor="name">Name</label>
<input id="name" type="text" />
```

### Button Accessibility
```tsx
// ❌ WRONG - Unclear button purpose
<button>Click here</button>

// ✅ CORRECT - Clear button purpose
<button>Request Window Repair Technician</button>
```

### Modal Accessibility
```tsx
// ❌ WRONG - Missing ARIA attributes
<div className="modal">
  <h2>Modal Title</h2>
  <p>Modal content</p>
</div>

// ✅ CORRECT - Proper ARIA implementation
<div 
  role="dialog" 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content</p>
</div>
```

## 📈 SUCCESS METRICS

### Target Scores
- **Lighthouse Accessibility**: 95+
- **axe-core Violations**: 0 critical, 0 serious
- **WCAG 2.1 AA Compliance**: 100%
- **Keyboard Navigation**: 100% functional

### Monitoring
- **Automated testing** - Part of CI/CD pipeline
- **Regular audits** - Monthly comprehensive reviews
- **User feedback** - Accessibility feedback collection
- **Performance impact** - Ensure accessibility doesn't slow site

---

**Next Steps**: 
1. Set up automated testing with Playwright and axe-core
2. Begin manual testing with keyboard navigation
3. Test with screen readers on key user journeys
4. Address any issues found during testing

**Priority**: HIGH - Essential for legal compliance and inclusive user experience
