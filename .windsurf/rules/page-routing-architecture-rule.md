---
trigger: always_on
---

# Page Routing Architecture Rule

## CRITICAL: Never Create Individual page.tsx Files for Content Pages

The langu-remontas project uses a **centralized routing system** via `/app/[locale]/[...slug]/page.tsx` that dynamically resolves ALL pages based on `routes.json` configuration. The contact page already exists and is accessible at `/contact` (or localized URLs like `/kontaktai`, `/kontakt`, `/kontakty`) because it's defined in `routes.json` with `pageId: "contact"`.

**Architecture Pattern:**
- `routes.json` defines all available pages and their URLs
- `[...slug]/page.tsx` handles ALL dynamic routing using `resolvePageBySlug()`
- Content files in `/content/pages/` provide page data
- Components are rendered via `ComponentRenderer` with the default components system

**For Contact Page Updates:** Only modify `/content/pages/contact.json` content structure and create new components in `/components/pages/contact/` or `/components/shared/`. The routing, metadata generation, and component rendering are handled automatically by the existing system. Never create `/app/[locale]/contact/page.tsx` as it will conflict with the dynamic routing system.
