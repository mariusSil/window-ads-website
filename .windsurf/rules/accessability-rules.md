---
trigger: always_on
---

# Accessibility Compliance Rules - Window Ads Website

## 🚨 CRITICAL: WCAG 2.1 AA Compliance

These rules MUST be followed to prevent accessibility violations. Add to ESLint configuration and code review checklist.

## 1. HTML Structure Rules

### Lang Attributes (CRITICAL)
```tsx
// ✅ ALWAYS - Add lang attribute to html element
<html lang={locale}>

// ✅ ALWAYS - Add hreflang to language switcher links
<Link href="/en/page" hreflang="en">English</Link>
<Link href="/lt/page" hreflang="lt">Lietuvių</Link>

// ❌ NEVER - Missing lang attributes
<html> // Missing lang
<Link href="/en/page">English</Link> // Missing hreflang
```

### Definition Lists Structure
```tsx
// ✅ CORRECT - Proper dl structure
<dl>
  <dt>Question</dt>
  <dd>Answer</dd>
</dl>

// ❌ FORBIDDEN - Orphaned dt/dd elements
<dt>Question</dt>
<dd>Answer</dd>
```

## 2. ARIA Compliance Rules

### Modal Dialogs (CRITICAL)
```tsx
// ✅ REQUIRED - Complete modal ARIA
<Dialog 
  open={isOpen} 
  onOpenChange={onClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  role="dialog"
  aria-modal="true"
>
  <DialogContent>
    <DialogTitle id="dialog-title">Title</DialogTitle>
    <div id="dialog-description">Description</div>
  </DialogContent>
</Dialog>

// ❌ FORBIDDEN - Missing ARIA attributes
<Dialog open={isOpen}> // Missing aria-labelledby, aria-modal, role
```

### Interactive Elements
```tsx
// ✅ REQUIRED - Button with proper ARIA
<button
  onClick={toggleMenu}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  aria-label="Toggle navigation menu"
>

// ✅ REQUIRED - Navigation with current page
<nav aria-label="Main navigation">
  <Link href="/services" aria-current={pathname === '/services' ? 'page' : undefined}>
    Services
  </Link>
</nav>

// ❌ FORBIDDEN - Missing ARIA states
<button onClick={toggleMenu}> // Missing aria-expanded, aria-controls
```

### Form Elements
```tsx
// ✅ REQUIRED - Proper label association
<Label htmlFor="email-input">Email Address</Label>
<Input id="email-input" type="email" aria-describedby="email-help" />
<div id="email-help">We'll never share your email</div>

// ❌ FORBIDDEN - Missing label association
<Input type="email" /> // Missing id and label connection
```

## 3. Color Contrast Rules

### Text Contrast Requirements
```scss
// ✅ REQUIRED - WCAG AA compliant ratios
.text-primary { color: #DC2626; } // 4.5:1 on white background
.text-secondary { color: #374151; } // 7.1:1 on white background
.bg-muted { background: #f1f5f9; } // Light backgrounds need dark text

// ❌ FORBIDDEN - Insufficient contrast
.text-light-gray { color: #d1d5db; } // 2.3:1 ratio - FAILS
.text-primary-light { color: #fca5a5; } // 2.1:1 ratio - FAILS
```

### Button State Contrast
```tsx
// ✅ REQUIRED - All states meet contrast requirements
<Button 
  variant="default" // #DC2626 background, white text (4.5:1+)
  className="hover:bg-red-700" // Darker on hover maintains contrast
>

// ❌ FORBIDDEN - Poor contrast states
<Button className="bg-gray-300 text-gray-400"> // 2.8:1 ratio - FAILS
```

## 4. Link Accessibility Rules

### Discernible Names
```tsx
// ✅ REQUIRED - Clear link purpose
<Link href="/services" aria-label="View our window repair services">
  Learn More
</Link>

<Link href="/contact">
  Contact Our Window Experts
</Link>

// ❌ FORBIDDEN - Ambiguous link text
<Link href="/services">Click Here</Link>
<Link href="/contact">More Info</Link>
```

### External Links
```tsx
// ✅ REQUIRED - External link indicators
<Link 
  href="https://external.com" 
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visit external site (opens in new tab)"
>
  External Link
  <Icon name="ExternalLink" className="ml-1 h-4 w-4" aria-hidden="true" />
</Link>
```

## 5. Image Accessibility Rules

### Alt Text Requirements
```tsx
// ✅ REQUIRED - Descriptive alt text
<Image 
  src="/window-repair.jpg" 
  alt="Technician installing new double-pane window in residential home"
  width={400} 
  height={300} 
/>

// ✅ DECORATIVE - Empty alt for decorative images
<Image 
  src="/decoration.svg" 
  alt="" 
  width={100} 
  height={100}
  aria-hidden="true"
/>

// ❌ FORBIDDEN - Missing or poor alt text
<Image src="/image.jpg" alt="image" /> // Generic alt text
<Image src="/photo.jpg" /> // Missing alt attribute
```

## 6. Focus Management Rules

### Keyboard Navigation
```tsx
// ✅ REQUIRED - Proper focus management
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
    previousFocusRef.current?.focus(); // Return focus
  }
};

// ✅ REQUIRED - Focus trapping in modals
<Dialog onOpenChange={(open) => {
  if (open) {
    firstFocusableRef.current?.focus();
  }
}}>
```

### Focus Indicators
```scss
// ✅ REQUIRED - Visible focus indicators
.focus-visible:focus {
  outline: 2px solid #DC2626;
  outline-offset: 2px;
}

// ❌ FORBIDDEN - Removing focus indicators
button:focus { outline: none; } // NEVER remove without replacement
```

## 7. Component-Specific Rules

### FAQ Components
```tsx
// ✅ REQUIRED - Proper definition list structure
<dl className="faq-list">
  {items.map((item, index) => (
    <div key={index}>
      <dt>
        <button
          aria-expanded={openIndex === index}
          aria-controls={`faq-answer-${index}`}
          id={`faq-question-${index}`}
        >
          {item.question}
        </button>
      </dt>
      <dd id={`faq-answer-${index}`} aria-labelledby={`faq-question-${index}`}>
        {item.answer}
      </dd>
    </div>
  ))}
</dl>
```

### Navigation Components
```tsx
// ✅ REQUIRED - Proper navigation structure
<nav aria-label="Main navigation">
  <ul role="list">
    <li>
      <Link 
        href="/services" 
        aria-current={pathname === '/services' ? 'page' : undefined}
      >
        Services
      </Link>
    </li>
  </ul>
</nav>
```

## 8. Testing Requirements

### Automated Testing
```bash
# REQUIRED - Run before every commit
npm run lint:a11y
npm run test:accessibility
```

### Manual Testing Checklist
- [ ] Tab navigation works through all interactive elements
- [ ] Screen reader announces all content properly
- [ ] Color contrast meets WCAG AA standards
- [ ] All images have appropriate alt text
- [ ] Forms have proper labels and error messages
- [ ] Modals trap focus and return focus on close

## 9. ESLint Configuration

Add to `.eslintrc.json`:
```json
{
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/lang": "error",
    "jsx-a11y/no-aria-hidden-on-focusable": "error"
  }
}
```

## 10. IDE Prevention Settings

### VS Code Settings
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "accessibility.signals.sounds": true
}
```

## 🚨 IMMEDIATE ACTIONS REQUIRED

1. **Install ESLint Plugin**: `npm install --save-dev eslint-plugin-jsx-a11y`
2. **Update Layout**: Add `lang={validLocale}` to `<html>` element
3. **Fix Modals**: Add all required ARIA attributes to dialog components
4. **Test Colors**: Verify all color combinations meet 4.5:1 contrast ratio
5. **Audit Links**: Ensure all links have descriptive text or aria-label

## 🎯 SUCCESS METRICS

- Lighthouse Accessibility Score: ≥ 95
- axe-core Violations: 0
- Manual Screen Reader Test: Pass
- Keyboard Navigation: 100% functional
- Color Contrast: WCAG AA compliant

**Rule: Every component MUST pass accessibility audit before merge. No exceptions.**
