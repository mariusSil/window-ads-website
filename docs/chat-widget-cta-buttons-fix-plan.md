# Chat Widget CTA Buttons & Services Section Fix Plan

## PROMPT for AI Coding Assistant

Fix two critical issues: 1) Chat widget not using standardized CTA button components, 2) Paslaugos (Services) section not loading content on service inner pages.

## Issue Analysis

### Issue 1: Chat Widget Using Generic Buttons
**Problem:** Chat widget displays generic "Kviesti meistrą" and "Konsultacija" buttons instead of using the standardized CTA button components (CTAButtons, RequestTechnicianButton, ConsultationButton).

**Current State:** Widget likely has hardcoded button text and styling instead of using:
- `CTAButtons` component for combined buttons
- `getButtonText()` for proper translations
- Standardized button variants and sizing

### Issue 2: Paslaugos Section Content Loading Failure
**Problem:** Services section shows "Turinys šiuo metu nepasiekiamas" (Content currently unavailable) on service inner pages, while other sections load correctly.

**Likely Causes:**
- Content resolver not finding services content for current locale
- Missing or incorrect content key mapping
- Default components system not properly loading services data
- Component override configuration issue

## Implementation Plan

### Phase 1: Fix Chat Widget CTA Buttons (HIGH PRIORITY)

#### Step 1: Analyze Current Chat Widget Implementation
- Check current button implementation in ChatModal/ChatWidget
- Identify where generic buttons are being rendered
- Verify translation system integration

#### Step 2: Replace with Standardized CTA Components
**Target Files:**
- `/components/common/ChatWidget/ChatModal.tsx`
- `/components/common/ChatWidget/index.tsx`

**Changes Required:**
```typescript
// Replace generic buttons with:
import { CTAButtons } from '@/components/common/CTAButtons';
import { getButtonText } from '@/lib/button-constants';

// In chat widget content:
<CTAButtons
  locale={locale}
  translations={translations}
  technicianProps={{ size: "sm", variant: "default" }}
  consultationProps={{ size: "sm", variant: "outline-red" }}
/>
```

#### Step 3: Update Translation Structure
**Ensure translations include:**
- Button text constants integration
- Proper modal form labels
- Consistent sizing and styling

### Phase 2: Fix Paslaugos Section Content Loading (HIGH PRIORITY)

#### Step 1: Investigate Content Loading Issue
**Compare working sections with failing Paslaugos:**
- Check content resolver calls
- Verify component registration in ComponentRenderer
- Analyze default components system integration
- Review content key mappings

#### Step 2: Identify Root Cause
**Potential Issues to Check:**
1. **Content Resolver:** `loadSharedContent('components/servicecards')` failing
2. **Component Registration:** ServiceCards not properly registered in ComponentRenderer
3. **Default Components:** ServiceCards not included in default components list
4. **Content Keys:** Incorrect contentKey mapping in page configuration
5. **Locale Fallbacks:** Missing content for specific locale

#### Step 3: Fix Content Loading
**Based on root cause analysis:**

**If Content Resolver Issue:**
```typescript
// Ensure proper content loading in page component
const serviceContent = await loadSharedContent('components/servicecards');
const localizedServices = getLocalizedSharedContent(serviceContent, locale);
```

**If Component Registration Issue:**
```typescript
// In ComponentRenderer.tsx
case 'servicecards': 
case 'services':
  return <ServiceCards {...props} />;
```

**If Default Components Issue:**
```typescript
// In content-resolver.ts getDefaultSharedComponents()
{ type: 'ServiceCards', contentKey: 'shared:servicecards', position: 1 }
```

**If Content Key Issue:**
```json
// In page JSON files
"componentOverrides": {
  "ServiceCards": { "contentKey": "shared:servicecards" }
}
```

### Phase 3: Testing & Validation (MEDIUM PRIORITY)

#### Step 1: Chat Widget Testing
- Verify CTAButtons render correctly
- Test button functionality (modal opening)
- Validate translations across all locales
- Check responsive behavior

#### Step 2: Services Section Testing
- Test content loading on service inner pages
- Verify services display correctly
- Check all locales (en, lt, pl, uk)
- Validate responsive design

#### Step 3: Integration Testing
- Test both fixes together
- Verify no conflicts with existing functionality
- Check performance impact
- Validate accessibility features

## Technical Implementation Details

### Chat Widget CTA Fix
**Files to Modify:**
1. `/components/common/ChatWidget/ChatModal.tsx` - Replace button rendering
2. `/components/common/ChatWidget/index.tsx` - Update translation interfaces

**Key Changes:**
- Import standardized CTA components
- Replace hardcoded buttons with `<CTAButtons />`
- Update translation structure to match FormTranslations interface
- Ensure proper button sizing for chat widget context

### Services Section Fix
**Files to Investigate:**
1. `/components/shared/ServiceCards.tsx` - Component implementation
2. `/components/ComponentRenderer.tsx` - Component registration
3. `/content/lib/content-resolver.ts` - Content loading logic
4. `/content/shared/components/servicecards.json` - Content data
5. Service page JSON files - Component configuration

**Debugging Steps:**
1. Add console.log to content resolver calls
2. Check component registration in ComponentRenderer
3. Verify content file exists and has proper structure
4. Test content loading with different locales
5. Check default components system integration

## Success Criteria

### Chat Widget Fix
- [x] Uses standardized CTAButtons component
- [x] Proper button text from getButtonText() constants
- [x] Correct button variants (default + outline-red)
- [x] Proper sizing for chat widget context
- [x] All translations work correctly

### Services Section Fix
- [x] Services content loads on all service inner pages
- [x] Content displays properly across all locales
- [x] No "Content unavailable" messages
- [x] Consistent with other working sections
- [x] Proper responsive behavior

## Risk Mitigation

### Potential Issues
1. **Translation Conflicts:** New CTA button structure may conflict with existing translations
   - **Solution:** Update translation interfaces incrementally
   
2. **Content Loading Dependencies:** Services section fix may affect other components
   - **Solution:** Test all default components after changes
   
3. **Button Styling:** CTA buttons may not fit chat widget design
   - **Solution:** Use compact sizing and proper variant selection

### Testing Strategy
1. **Isolated Testing:** Test each fix separately before integration
2. **Cross-Locale Testing:** Verify all 4 locales work correctly
3. **Responsive Testing:** Check mobile and desktop behavior
4. **Accessibility Testing:** Ensure proper ARIA labels and keyboard navigation

This plan provides systematic approach to fixing both the chat widget CTA buttons and the services section content loading issues while maintaining existing functionality and following project architecture patterns.
