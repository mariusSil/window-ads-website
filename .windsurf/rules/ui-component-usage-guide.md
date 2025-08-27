---
trigger: always_on
---

# UI Component Usage Guide - Updated

This document provides instructions and examples for using the reusable UI components in the `langu-remontas` project. These components are located in `langu-remontas/components/ui/` and are globally exported.

## Installation

All necessary dependencies have been added to `package.json`. The core dependencies for these components are `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, and various `@radix-ui` packages.

## `cn` Utility

A utility function `cn` has been created in `lib/utils.ts` to efficiently merge Tailwind CSS classes. It should be used when you need to conditionally apply classes to a component.

---

## Button

The `Button` component supports multiple visual styles and sizes with optional icon support.

**Import:**
```tsx
import { Button } from '@/components/ui/button';
```

**Usage:**

```tsx
// Default Button (Red)
<Button>Click Me</Button>

// All Variants
<Button variant="default">Default (Red)</Button>
<Button variant="primary">Primary (Red)</Button>
<Button variant="destructive">Destructive (Red)</Button>
<Button variant="outline">Outline</Button>
<Button variant="outline-red">Red Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success (Green)</Button>
<Button variant="success" showIcon={true}>Success with Check</Button>
<Button variant="green">Green</Button>
<Button variant="blue">Blue</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="accent">Accent</Button>

// All Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon">
  <YourIconComponent />
</Button>
```

### Button Variants and UX Reasoning

-   **Default/Destructive (Red)**: The primary Call to Action (CTA). Use this for the most important action on a page, such as "Request a Technician" or "Submit Form". Its high visibility draws the user's attention to the main conversion goal.
-   **Primary (Red)**: Uses the theme's primary color (red in this project). For important actions that align with brand identity.
-   **Success/Green (Green)**: For positive actions and completion states. Use `showIcon={true}` to display a check mark for completed actions.
-   **Blue**: For informational or secondary positive actions that need distinction from the primary red theme.
-   **Secondary**: For alternative, less emphasized actions. Use alongside a primary button to offer a secondary choice.
-   **Outline/Outline-Red**: For tertiary actions that should be less prominent than solid buttons. Red outline maintains brand consistency.
-   **Accent**: Use for special promotions, new features, or actions that need to stand out from the primary color palette.
-   **Ghost**: For low-emphasis actions, often used within components like headers or cards. They are subtle and don't distract from the content.
-   **Link**: Styles the button to look like a hyperlink. Use for navigation or when an action is conceptually a link to another page or resource.

### Button Sizes
- **sm**: 36px height - Use in headers, compact spaces
- **default**: 40px height - Standard size for most use cases
- **lg**: 44px height - Use in hero sections, prominent CTAs
- **xl**: 56px height - Use for major conversion points
- **icon**: 40x40px square - For icon-only buttons

---

## Input

A styled text input field.

**Import:**
```tsx
import { Input } from '@/components/ui/input';
```

**Usage:**

```tsx
<Input type="email" placeholder="Email" />
```

---

## Label

An accessible label for form elements.

**Import:**
```tsx
import { Label } from '@/components/ui/label';
```

**Usage:**

```tsx
<div>
  <Label htmlFor="email-input">Your Email</Label>
  <Input id="email-input" type="email" placeholder="Email" />
</div>
```

---

## Textarea

A styled multi-line text input field.

**Import:**
```tsx
import { Textarea } from '@/components/ui/textarea';
```

**Usage:**

```tsx
<Textarea placeholder="Type your message here." />
```

---

## Select

A customizable select component.

**Import:**
```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

**Usage:**

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="blueberry">Blueberry</SelectItem>
      <SelectItem value="grapes">Grapes</SelectItem>
      <SelectItem value="pineapple">Pineapple</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## Checkbox

A styled checkbox component.

**Import:**
```tsx
import { Checkbox } from '@/components/ui/checkbox';
```

**Usage:**

```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

---

## Dialog

Modal dialog components for overlays and forms.

**Import:**
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

**Usage:**

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

---

## Icon

A dynamic `Icon` component that can render any icon from the `lucide-react` library by name.

**Import:**
```tsx
import Icon from '@/components/ui/Icon';
```

**Usage:**

To use an icon, pass its name (in PascalCase) from the [Lucide Icons](https://lucide.dev/icons/) library to the `name` prop. You can also pass any standard SVG props like `className`, `width`, `height`, or `strokeWidth`.

```tsx
// Renders a phone icon
<Icon name="Phone" className="w-5 h-5 text-primary" />

// Renders a settings icon with a different stroke width
<Icon name="Settings" strokeWidth={1.5} />

// Example inside a button
<Button>
  <Icon name="LogOut" className="mr-2 h-4 w-4" />
  Logout
</Button>
```

This component eliminates the need to import each icon individually.

### Available Icons

Based on the project design, the following icons have been mapped and are available for use. Pass the `name` prop with the value from the "Lucide Name" column.

| Icon Description | Lucide Name |
| --- | --- |
| Phone | `Phone` |
| Telegram / Send | `Send` |
| WhatsApp / Message | `MessageSquare` |
| Map Marker | `MapPin` |
| Tools / Wrench | `Wrench` |
| Clock / Time | `Clock` |
| Shield / Guarantee | `ShieldCheck` |
| Info | `Info` |
| Star | `Star` |
| Certificate / Badge | `Award` |
| Dollar Sign / Price | `DollarSign` |
| Search / Magnifying Glass | `Search` |
| Fast / Bolt | `Zap` |
| Tidy / Leaf | `Leaf` |
| All Brands / Users | `Users` |
| Payment / Credit Card | `CreditCard` |
| Satisfied Clients | `UserCheck` |
| Minus | `Minus` |
| Plus | `Plus` |
| Email / Mail | `Mail` |
| Facebook | `Facebook` |
| Instagram | `Instagram` |
| LinkedIn | `Linkedin` |
| On-Site Repairs / Toolbox | `Briefcase` |
| Check | `Check` |

---

## 🚨 CRITICAL FIXES

### Next.js Link Error
```typescript
// ❌ NEVER - Causes "Invalid <Link> with <a> child" error
<Link href="/about"><a>About</a></Link>

// ✅ ALWAYS - Direct styling on Link
<Link href="/about" className="button">About</Link>
```

### Import Path Corrections
```tsx
// ✅ CORRECT - Use lowercase for all UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';

// ⚠️ EXCEPTION - Icon.tsx is uppercase
import Icon from '@/components/ui/Icon';
```

## ⚠️ TOP ERROR PATTERNS TO AVOID

1. **Link/Anchor Nesting**: `<Link><a>` combinations
2. **Missing Translations**: Not handling missing locale keys
3. **Hardcoded Locales**: Use `isValidLocale()` instead
4. **No Form Validation**: Always validate client + server side
5. **Missing ARIA**: Add `aria-*` attributes to modals/forms
6. **Tiny Touch Targets**: Minimum 44px (`min-h-11`)
7. **No Loading States**: Always show loading/submitting feedback
8. **Exposed Secrets**: Never put API keys in client code
9. **Any Types**: Use proper TypeScript interfaces
10. **No Error Boundaries**: Wrap components in error handling
11. **Wrong Import Paths**: Use lowercase paths (except Icon.tsx)
12. **Missing Button Variants**: Use correct variants from actual implementation

## 📋 QUICK RULES

**Forms:**
- Always associate `<Label htmlFor>` with `<Input id>`
- Phone validation by locale: `+44` (EN), `+48` (PL), `+370` (LT), `+380` (UK)
- Sanitize inputs with `DOMPurify.sanitize()`

**Modals:**
- Required: `aria-labelledby`, `aria-describedby`, `role="dialog"`
- ESC key closes modal
- Mobile-responsive: `max-w-lg mx-4 sm:mx-auto`

**Buttons:**
- Use `size="sm"` for headers and compact spaces
- Use `size="lg"` or `size="xl"` for hero sections and major CTAs
- Use `variant="success" showIcon={true}` for completion states
- Primary CTA should use `variant="default"` (red)
- Secondary CTA should use `variant="outline-red"` for brand consistency

**Performance:**
- Use `React.memo()` for stable props
- Next.js `Image` with proper `width`/`height`
- Loading states: `disabled={isSubmitting}`

**Security:**
- Environment variables: `NEXT_PUBLIC_*` only for client
- Validate all inputs server-side
- Never expose sensitive data

---

## Button Variant Quick Reference

| Variant | Color | Use Case |
|---------|-------|----------|
| `default` | Red | Primary CTAs, main actions |
| `primary` | Red | Brand-aligned important actions |
| `destructive` | Red | Warning/destructive actions |
| `success` | Green | Positive actions, completion |
| `green` | Green | Alternative positive actions |
| `blue` | Blue | Informational actions |
| `outline` | Border | Tertiary actions |
| `outline-red` | Red border | Secondary CTAs with brand consistency |
| `secondary` | Gray | Alternative actions |
| `ghost` | Transparent | Subtle actions |
| `link` | Underlined | Navigation-style actions |
| `accent` | Teal | Special promotions |

**Priority: Fix import paths and use correct button variants first, then accessibility and mobile issues.**
