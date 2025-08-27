---
trigger: always_on
---

# No Hardcoded Content Rule

## 🚨 CRITICAL: NEVER HARDCODE USER-FACING CONTENT

### ❌ FORBIDDEN
```tsx
<Button>Learn More</Button>
prefillMessage={`I'm interested in ${item.title}`}
```

### ✅ CORRECT
```tsx
<Button>{getButtonText('LEARN_MORE', locale)}</Button>
prefillMessage={generatePrefillMessageSync(translations.prefillTemplates, 'interestedIn', item.title)}
```

## Translation Sources

1. **Common** (`/content/shared/common.json`): buttons, prefillTemplates, forms, accessibility
2. **Component** (`/content/shared/components/*.json`): component-specific content
3. **Page** (`/content/pages/*.json`): page-specific content

## Required Patterns

### Prefill Messages
```tsx
import { generatePrefillMessageSync } from '@/lib/prefill-utils';
prefillMessage={generatePrefillMessageSync(translations.prefillTemplates, 'interestedIn', item.title)}
```

### Button Text
```tsx
import { getButtonText } from '@/lib/button-constants';
<Button>{getButtonText('CALL_TECHNICIAN', locale)}</Button>
```

### Component Props
```tsx
interface Props {
  locale: Locale;
  translations: {
    title: string;
    prefillTemplates?: { interestedIn: string; inquiryAbout: string; };
  };
}
```

## IDE Prevention Rules

**ESLint:**
```javascript
rules: { 'no-hardcoded-strings': 'error' }
```

**Watch for:**
- `prefillMessage=".*"`
- `<.*>[A-Za-z]{3,}</.*>`
- Hardcoded button text

## Validation Checklist
- [ ] No hardcoded strings
- [ ] Use `getButtonText()` for buttons
- [ ] Use `generatePrefillMessageSync()` for messages
- [ ] Support all 4 locales (en, lt, pl, uk)
- [ ] Provide fallbacks for missing translations

## Emergency Fallbacks
```tsx
const text = translations?.title || 'Default English Text';
console.warn(`Missing translation: ${key} for locale: ${locale}`);
```

**Rule: Always use translation system, prefill utilities, and button constants for maintainable multilingual content.**
