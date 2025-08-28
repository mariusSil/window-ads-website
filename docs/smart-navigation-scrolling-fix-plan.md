# Smart Navigation Scrolling Fix Plan

## PROMPT for AI Coding Assistant

Fix the navigation scrolling issue where "priedai" (accessories) and "paslaugos" (services) navigation links always navigate to separate pages instead of scrolling to sections when they exist on the current page.

## Current Problem Analysis

**Issue**: Navigation items for "services" and "accessories" always navigate to dedicated pages (`/paslaugos`, `/priedai`) even when the sections exist on the current page (homepage). This creates poor UX as users expect smooth scrolling to sections when available.

**Current Behavior**:
1. User clicks "Priedai" or "Paslaugos" in navigation
2. `useSmartNavigation` hook is called with navigation logic
3. Hook always navigates to dedicated page first, then attempts to scroll
4. This causes page reload/navigation even when sections exist on current page

**Root Cause**: The `useSmartNavigation` hook doesn't properly check if target sections exist on the current page before deciding to navigate or scroll.

## Required Implementation

### 1. Enhanced Section Detection Logic

**File**: `/hooks/useSmartNavigation.ts`

**Changes Needed**:
- Add `checkSectionExists()` function to detect if target section ID exists in DOM
- Modify `handleNavigation()` to prioritize scrolling over navigation when section exists
- Improve section detection to handle both direct IDs and component-based sections
- Add fallback logic for when sections don't exist on current page

**Logic Flow**:
```typescript
1. User clicks navigation item (services/accessories)
2. Check if section exists on current page using document.getElementById()
3. IF section exists → Scroll to section with smooth behavior
4. IF section doesn't exist → Navigate to dedicated page + scroll after load
5. Handle edge cases (loading states, navigation timing)
```

### 2. Section ID Mapping

**Current Section IDs**:
- Services: `id="services"` (ServiceCards.tsx line 67)
- Accessories: `id="accessories"` (AccessoriesGrid.tsx line 130)

**Navigation Key Mapping**:
- Navigation key "services" → Section ID "services"
- Navigation key "accessories" → Section ID "accessories"

### 3. Page Detection Logic

**Pages with Sections**:
- Homepage: Contains both `services` and `accessories` sections
- Services page (`/paslaugos`): Contains `services` section only
- Accessories page (`/priedai`): Contains `accessories` section only
- Other pages: No sections, should always navigate

### 4. Implementation Steps

#### Step 1: Update useSmartNavigation Hook
```typescript
// Enhanced section detection
const checkSectionExists = useCallback((sectionId: string): boolean => {
  const element = document.getElementById(sectionId);
  return element !== null && element.offsetParent !== null; // Visible check
}, []);

// Improved navigation logic
const handleNavigation = useCallback((key: string, href: string) => {
  const targetSection = key === 'services' ? 'services' : 'accessories';
  
  // First check if section exists on current page
  if (checkSectionExists(targetSection)) {
    // Section exists - scroll to it
    const scrollSuccess = scrollToSection(targetSection);
    if (scrollSuccess) {
      return; // Successfully scrolled, no navigation needed
    }
  }
  
  // Section doesn't exist or scroll failed - navigate to page
  router.push(href);
  
  // After navigation, attempt to scroll with retry logic
  const attemptScroll = (attempts = 0) => {
    if (attempts >= 10) return; // Max 1 second of retries
    
    setTimeout(() => {
      const scrolled = scrollToSection(targetSection);
      if (!scrolled) {
        attemptScroll(attempts + 1);
      }
    }, 100);
  };
  
  attemptScroll();
}, [pathname, router, scrollToSection, checkSectionExists]);
```

#### Step 2: Enhanced Scroll Function
```typescript
const scrollToSection = useCallback((elementId: string): boolean => {
  const element = document.getElementById(elementId);
  if (!element || element.offsetParent === null) {
    return false; // Element not found or not visible
  }

  // Calculate precise header offset
  const getHeaderOffset = () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const headerHeight = header?.offsetHeight || 64;
    const navHeight = nav?.offsetHeight || 48;
    return headerHeight + navHeight + 20; // 20px buffer
  };

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - getHeaderOffset();

  window.scrollTo({
    top: Math.max(0, offsetPosition), // Prevent negative scroll
    behavior: 'smooth'
  });

  return true;
}, []);
```

#### Step 3: Mobile Navigation Integration

**File**: `/components/common/MobileNavigationMenu.tsx`

**Required Changes**:
- Apply same smart navigation logic to mobile menu
- Ensure mobile menu closes after scroll/navigation
- Handle touch-specific scroll behavior

#### Step 4: Navigation Component Updates

**File**: `/components/common/Navigation.tsx`

**Current Implementation**: Already uses `useSmartNavigation` hook correctly
**Required Changes**: None - the hook enhancement will automatically fix the behavior

### 5. Testing Scenarios

#### Test Case 1: Homepage Navigation
- **Action**: Click "Priedai" on homepage
- **Expected**: Smooth scroll to accessories section (no page navigation)
- **Current**: Navigates to `/priedai` page

#### Test Case 2: Cross-Page Navigation
- **Action**: Click "Priedai" from `/about` page
- **Expected**: Navigate to `/priedai` page + scroll to accessories section
- **Current**: Works correctly

#### Test Case 3: Same-Page Navigation
- **Action**: Click "Paslaugos" while already on `/paslaugos` page
- **Expected**: Scroll to services section (no page reload)
- **Current**: May cause unnecessary navigation

#### Test Case 4: Mobile Navigation
- **Action**: Use mobile menu to navigate to sections
- **Expected**: Same behavior as desktop + menu closes
- **Current**: Needs verification

### 6. Performance Considerations

**Optimizations**:
- Cache section existence checks to avoid repeated DOM queries
- Use `requestAnimationFrame` for smooth scroll timing
- Implement scroll position restoration for browser back/forward
- Add loading states during navigation transitions

**Memory Management**:
- Clean up event listeners and timeouts
- Avoid memory leaks in scroll retry logic
- Use proper cleanup in useEffect hooks

### 7. Accessibility Improvements

**ARIA Support**:
- Add `aria-current="page"` for active navigation items
- Implement focus management after scroll/navigation
- Ensure keyboard navigation works with new logic

**Screen Reader Support**:
- Announce scroll actions to screen readers
- Provide alternative text for navigation state changes
- Maintain proper heading hierarchy after scroll

### 8. Error Handling

**Edge Cases**:
- Handle cases where sections are dynamically loaded
- Manage scroll behavior during page transitions
- Fallback for browsers without smooth scroll support
- Handle rapid navigation clicks (debouncing)

**Debugging**:
- Add console warnings for failed section detection
- Log navigation decisions for debugging
- Implement error boundaries for navigation failures

## Expected Results

**Before Fix**:
- Navigation always causes page navigation
- Poor UX with unnecessary page loads
- Inconsistent behavior between pages

**After Fix**:
- Smart detection of existing sections
- Smooth scrolling when sections exist on current page
- Fallback navigation when sections don't exist
- Consistent behavior across all pages and devices
- Improved performance (no unnecessary page loads)
- Better accessibility and user experience

## Implementation Priority

1. **HIGH**: Update `useSmartNavigation` hook with enhanced section detection
2. **HIGH**: Test homepage navigation behavior (services/accessories)
3. **MEDIUM**: Verify mobile navigation integration
4. **MEDIUM**: Add error handling and edge case management
5. **LOW**: Performance optimizations and accessibility enhancements

## Files to Modify

1. `/hooks/useSmartNavigation.ts` - Core logic enhancement
2. `/components/common/MobileNavigationMenu.tsx` - Mobile integration (if needed)
3. Add tests to verify behavior across different pages

## Success Criteria

- ✅ Clicking "Priedai" on homepage scrolls to accessories section (no navigation)
- ✅ Clicking "Paslaugos" on homepage scrolls to services section (no navigation)  
- ✅ Navigation from pages without sections works correctly (navigates + scrolls)
- ✅ Mobile navigation behaves identically to desktop
- ✅ Smooth scroll animation with proper header offset
- ✅ Accessibility maintained throughout navigation changes
