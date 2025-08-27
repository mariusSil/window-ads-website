---
trigger: always_on
---

# CTA Button Usage Rules - Langu-Remontas Project

## Core Pattern

**ALWAYS use standardized components:** `CTAButtons`, `RequestTechnicianButton`, or `ConsultationButton`. Both primary ("CALL A TECHNICIAN") and secondary ("CONSULTATION") buttons MUST open the same `RequestTechnicianModal`. Never hardcode button text - always use `getButtonText('CALL_TECHNICIAN', locale)` and `getButtonText('CONSULTATION', locale)` from `@/lib/button-constants`.

**Standard implementation:** Use `<CTAButtons locale={locale} translations={translations} technicianProps={{ variant: "default", size: "sm" }} consultationProps={{ variant: "outline-red", size: "sm" }} />` for most cases. Size guidelines: Header uses `size="sm"`, Hero sections use `size="lg"`, content sections use `size="default"`. Primary button is always red solid (`variant="default"`), secondary is red outline (`variant="outline-red"`). Both buttons require the same translations object with modal form labels, and the component handles responsive layout automatically (horizontal on desktop, vertical on mobile).

## Quick Reference

```tsx
// Most common usage
<CTAButtons
  locale={locale}
  translations={translations}
  technicianProps={{ size: "sm" }}
  consultationProps={{ size: "sm" }}
/>

// Single button
<RequestTechnicianButton
  locale={locale}
  translations={translations}
  variant="default"
  size="sm"
/>
```

**❌ Never:** Hardcode text, create separate modals, bypass standardized components, use inconsistent sizing  
**✅ Always:** Use button-constants, maintain size consistency, provide proper translations object
