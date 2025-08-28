# Chat Widget Implementation Plan - Window Ads Website

## PROMPT for AI Coding Assistant

Implement a marketing chat widget system for the window-ads-website that mimics messenger-style chat interfaces (like Tawk.to or Facebook Messenger) but serves as a lead capture tool rather than actual chat functionality.

## Project Requirements

### Core Functionality
- **Chat Bubble**: Fixed position floating button (bottom-right corner)
- **Contact Form**: Opens on bubble click with same fields as existing contact page
- **Email Integration**: Uses existing `/api/send-email` endpoint and email service
- **Marketing Message**: Lithuanian text "Kuo galime Jums padėti? Parašykite ir pasistengsime atsakyti į Jūsų klausimus nedelsiant."
- **Lead Capture**: No actual chat - just contact form submission for sales team follow-up

### Technical Architecture

#### 1. Component Structure
```
components/
├── common/
│   ├── ChatWidget/
│   │   ├── ChatBubble.tsx          # Floating chat button
│   │   ├── ChatModal.tsx           # Modal container with form
│   │   ├── ChatForm.tsx            # Contact form (reuse existing logic)
│   │   └── index.tsx               # Main widget component
│   └── ...existing components
```

#### 2. Integration Points

**Existing Components to Reuse:**
- `ContactForm.tsx` logic and validation
- `Button`, `Input`, `Label`, `Textarea`, `Select` UI components
- `Dialog` component for modal functionality
- Email service from `lib/email/email-service.ts`

**Translation Integration:**
- Use existing `common.json` structure
- Add new `chatWidget` section with multilingual support
- Leverage `getButtonText()` and prefill utilities

#### 3. Content Structure

**New Translation Keys (add to `/content/shared/common.json`):**
```json
{
  "en": {
    "chatWidget": {
      "bubble": {
        "tooltip": "Chat with us",
        "ariaLabel": "Open chat widget"
      },
      "modal": {
        "title": "How can we help you?",
        "subtitle": "Write to us and we'll try to answer your questions immediately.",
        "closeButton": "Close chat"
      },
      "form": {
        "nameLabel": "Full Name",
        "emailLabel": "Email Address", 
        "phoneLabel": "Phone Number",
        "messageLabel": "Your Question",
        "submitButton": "Send Message",
        "successMessage": "Thank you! We'll contact you within 2 hours.",
        "errorMessage": "Error sending message. Please try again."
      }
    }
  },
  "lt": {
    "chatWidget": {
      "bubble": {
        "tooltip": "Susisiekite su mumis",
        "ariaLabel": "Atidaryti pokalbių valdiklį"
      },
      "modal": {
        "title": "Kuo galime Jums padėti?",
        "subtitle": "Parašykite ir pasistengsime atsakyti į Jūsų klausimus nedelsiant.",
        "closeButton": "Uždaryti pokalbį"
      },
      "form": {
        "nameLabel": "Vardas Pavardė",
        "emailLabel": "El. pašto adresas",
        "phoneLabel": "Telefono numeris", 
        "messageLabel": "Jūsų klausimas",
        "submitButton": "Siųsti žinutę",
        "successMessage": "Ačiū! Susisieksime su jumis per 2 valandas.",
        "errorMessage": "Klaida siunčiant žinutę. Bandykite dar kartą."
      }
    }
  }
  // ... pl, uk translations
}
```

#### 4. Implementation Details

**ChatBubble Component:**
- Fixed position: `fixed bottom-6 right-6 z-50`
- Animated pulse effect to attract attention
- MessageSquare icon from existing Icon component
- Hover states and accessibility support
- Mobile responsive (smaller on mobile)

**ChatModal Component:**
- Uses existing Dialog UI component
- Responsive design (full-screen on mobile, modal on desktop)
- Smooth animations (slide-up from bottom-right)
- Backdrop blur effect
- Escape key and click-outside to close

**ChatForm Component:**
- Simplified version of ContactForm.tsx
- Fields: name (required), email (required), phone (optional), message (required)
- Same validation and submission logic
- Form type: `'chat'` for email service differentiation
- Honeypot spam protection
- Loading states and success/error feedback

**Email Integration:**
- Extend `UnifiedEmailData` type to include `'chat'` form type
- Update email templates to handle chat submissions
- Subject line: `[CHAT] New Chat Message - ${name}`
- Priority handling (chat messages = higher priority)

#### 5. Global Integration

**Layout Integration:**
```tsx
// app/[locale]/layout.tsx
import ChatWidget from '@/components/common/ChatWidget';

export default function RootLayout({ children, params }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget locale={params.locale} />
      </body>
    </html>
  );
}
```

**State Management:**
- Local component state (no global state needed)
- Persist form data in sessionStorage (prevent data loss)
- Track widget interactions for analytics

#### 6. User Experience & Interaction Design

**Chat Widget States & Behavior:**

*Initial State (Page Load):*
- Widget appears after 3-second delay to avoid immediate distraction
- Subtle pulse animation every 10 seconds to attract attention
- Tooltip appears on hover: "Chat with us" / "Susisiekite su mumis"
- Badge indicator (red dot) shows for first-time visitors

*Opening Behavior:*
- Click bubble → Modal slides up from bottom-right corner (desktop)
- Click bubble → Full-screen modal slides up from bottom (mobile)
- Smooth 300ms CSS transition with easing
- Background blur effect (backdrop-filter: blur(4px))
- Focus automatically moves to first form field
- Bubble transforms into close button (X icon)

*Closing Behavior:*
- Click X button → Modal slides down and disappears
- Click outside modal → Modal closes (with confirmation if form has data)
- Press Escape key → Modal closes (with confirmation if form has data)
- Auto-close after successful submission (3-second delay with success message)

*Form Interaction States:*
- Empty form → Can close immediately
- Partially filled form → Show confirmation dialog: "Are you sure you want to close? Your message will be lost."
- Submitted form → Show success state for 3 seconds, then auto-close
- Error state → Keep modal open, highlight errors, allow retry

**State Persistence & Cookie Management:**

*localStorage Strategy:*
```javascript
// Widget state tracking
const WIDGET_STORAGE_KEY = 'chatWidget_state';
const FORM_DRAFT_KEY = 'chatWidget_formDraft';

// Stored data structure
{
  hasInteracted: boolean,           // User has opened widget before
  lastInteraction: timestamp,       // Last time widget was opened
  submissionCount: number,          // Number of successful submissions
  dismissedCount: number,           // Number of times closed without submitting
  formDraft: {                      // Auto-saved form data
    name: string,
    email: string,
    phone: string,
    message: string,
    timestamp: number
  }
}
```

*Cookie Usage (GDPR Compliant):*
- **No tracking cookies** - only functional localStorage
- **Session-based** - cleared on browser close if user prefers
- **Opt-out mechanism** - "Don't show again" option after 3 dismissals
- **Data retention** - Form drafts expire after 24 hours

*Privacy Considerations:*
- Clear privacy notice in modal footer
- Form data encrypted in localStorage
- Auto-clear sensitive data after submission
- Respect Do Not Track browser settings

**Detailed Interaction Flows:**

*First-Time Visitor Flow:*
1. Page loads → Widget appears after 3s delay with pulse animation
2. Red badge indicator shows "new message" style
3. Hover shows tooltip with call-to-action
4. Click opens modal with welcome message
5. Form pre-fills with any available data (if returning visitor)

*Returning Visitor Flow:*
1. Check localStorage for previous interactions
2. If submitted before → Reduce pulse frequency, no badge
3. If dismissed 3+ times → Hide widget (respect user preference)
4. If has draft → Show "Continue message" indicator

*Form Submission Flow:*
1. User fills form → Auto-save to localStorage every 2 seconds
2. Click submit → Show loading state with spinner
3. Success → Green checkmark animation + success message
4. Error → Red error message + retry button
5. Auto-close after 3 seconds (success) or keep open (error)

*Mobile-Specific Behaviors:*
- Bubble positioned to avoid iOS Safari bottom bar
- Full-screen modal prevents background scrolling
- Form fields optimized for mobile keyboards
- Swipe-down gesture to close modal
- Haptic feedback on interactions (iOS)

**Animation & Micro-Interactions:**

*Bubble Animations:*
```css
/* Pulse animation for attention */
@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

/* Hover state */
.chat-bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}
```

*Modal Animations:*
```css
/* Slide up from bottom-right */
@keyframes slideUpRight {
  from {
    opacity: 0;
    transform: translateY(100%) translateX(50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
  }
}
```

*Form Interactions:*
- Input focus → Subtle glow effect
- Button hover → Slight scale increase
- Success submission → Checkmark animation
- Error state → Shake animation
- Loading → Spinner with brand colors

**Accessibility Implementation:**

*ARIA Labels & Roles:*
```tsx
// Chat bubble
<button
  aria-label="Open chat widget to contact us"
  aria-describedby="chat-tooltip"
  role="button"
  tabIndex={0}
>

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="chat-modal-title"
  aria-describedby="chat-modal-description"
>
```

*Keyboard Navigation:*
- Tab order: Bubble → Close button → Form fields → Submit button
- Enter key opens/submits, Escape key closes
- Focus trap within modal when open
- Skip links for screen readers

*Screen Reader Support:*
- Announce modal open/close states
- Form validation errors read aloud
- Success/error messages announced
- Loading states communicated

**Mobile Optimization Details:**

*Touch Targets:*
- Minimum 44px touch targets (Apple guidelines)
- Bubble: 60px diameter (exceeds minimum)
- Form buttons: 48px height minimum
- Adequate spacing between interactive elements

*Viewport Handling:*
```css
/* Prevent zoom on input focus */
input, textarea, select {
  font-size: 16px; /* iOS requirement */
}

/* Safe area handling for iPhone X+ */
.chat-bubble {
  bottom: calc(24px + env(safe-area-inset-bottom));
  right: calc(24px + env(safe-area-inset-right));
}
```

*Performance Considerations:*
- Lazy load modal content until first interaction
- Optimize images for different screen densities
- Use CSS transforms for animations (GPU acceleration)
- Debounce form auto-save to prevent excessive writes

#### 7. Performance Considerations

**Lazy Loading:**
- Load chat modal only when bubble is clicked
- Dynamic imports for form components
- Minimize initial bundle impact

**Optimization:**
- Debounced form validation
- Efficient re-renders with React.memo
- Minimal DOM manipulation
- CSS-in-JS or CSS modules for styling

#### 8. Analytics & Tracking

**Comprehensive Event Tracking:**

*Widget Interaction Events:*
```javascript
// Widget lifecycle events
trackEvent('chat_widget_loaded', { timestamp, page_url, user_agent });
trackEvent('chat_widget_shown', { delay_seconds: 3, has_badge: boolean });
trackEvent('chat_bubble_clicked', { interaction_count, time_on_page });
trackEvent('chat_modal_opened', { trigger: 'bubble_click' | 'auto_prompt' });
trackEvent('chat_modal_closed', { 
  method: 'x_button' | 'outside_click' | 'escape_key' | 'auto_close',
  time_open_seconds: number,
  form_completion_percentage: number
});

// Form interaction events
trackEvent('chat_form_started', { field_focused: 'name' | 'email' | 'phone' | 'message' });
trackEvent('chat_form_field_completed', { field_name, time_to_complete_seconds });
trackEvent('chat_form_auto_saved', { fields_completed: string[], draft_size_bytes });
trackEvent('chat_form_validation_error', { field_name, error_type });
trackEvent('chat_form_submitted', { 
  submission_attempt: number,
  fields_completed: string[],
  time_to_submit_seconds: number,
  form_completion_time_total: number
});
trackEvent('chat_form_success', { submission_id, response_time_ms });
trackEvent('chat_form_error', { error_type, retry_count });

// User behavior events
trackEvent('chat_widget_dismissed', { dismissal_count, reason: 'manual' | 'auto' });
trackEvent('chat_draft_restored', { draft_age_hours, fields_restored: string[] });
trackEvent('chat_widget_hidden', { reason: 'max_dismissals' | 'user_preference' });
```

*Conversion Funnel Tracking:*
```javascript
// Funnel stages
const FUNNEL_STAGES = {
  WIDGET_SEEN: 'widget_impression',
  BUBBLE_HOVERED: 'bubble_hover', 
  MODAL_OPENED: 'modal_open',
  FORM_STARTED: 'form_start',
  FORM_COMPLETED: 'form_submit',
  SUBMISSION_SUCCESS: 'conversion_complete'
};

// Funnel progression tracking
trackFunnelStep(FUNNEL_STAGES.WIDGET_SEEN, {
  page_type: 'homepage' | 'service' | 'contact' | 'other',
  device_type: 'mobile' | 'tablet' | 'desktop',
  traffic_source: document.referrer
});
```

*Performance Metrics:*
```javascript
// Widget performance tracking
trackPerformance('chat_widget_load_time', loadTimeMs);
trackPerformance('chat_modal_render_time', renderTimeMs);
trackPerformance('chat_form_submission_time', submissionTimeMs);
trackPerformance('chat_widget_memory_usage', memoryUsageMB);

// User experience metrics
trackUX('time_to_first_interaction', timeMs);
trackUX('form_completion_rate', percentage);
trackUX('error_recovery_rate', percentage);
trackUX('mobile_vs_desktop_usage', { mobile: percentage, desktop: percentage });
```

*A/B Testing Framework:*
```javascript
// Widget variant testing
const WIDGET_VARIANTS = {
  CONTROL: 'default_red_bubble',
  VARIANT_A: 'pulsing_animation',
  VARIANT_B: 'message_preview',
  VARIANT_C: 'delayed_appearance'
};

// Assign user to test group
const userVariant = assignToVariant(userId, WIDGET_VARIANTS);
trackEvent('ab_test_assignment', { 
  test_name: 'chat_widget_design',
  variant: userVariant,
  user_segment: getUserSegment()
});
```

#### 9. Testing Strategy

**Unit Tests:**
- Form validation logic
- Email service integration
- Component rendering
- Accessibility compliance

**Integration Tests:**
- End-to-end form submission
- Email delivery verification
- Cross-browser compatibility
- Mobile device testing

#### 10. Deployment Considerations

**Environment Variables:**
- Reuse existing email configuration
- No additional API keys required
- Feature flag for enabling/disabling widget

**Rollout Strategy:**
- Deploy to staging first
- A/B test widget visibility
- Monitor conversion rates
- Gradual rollout to production

## Implementation Priority

### Phase 1: Core Components (High Priority)
1. Create ChatBubble component with basic styling
2. Implement ChatModal with Dialog integration
3. Build ChatForm with existing form logic
4. Add translations to common.json

### Phase 2: Integration (High Priority)
1. Integrate with existing email service
2. Add to layout for global availability
3. Implement responsive design
4. Add accessibility features

### Phase 3: Enhancement (Medium Priority)
1. Add animations and micro-interactions
2. Implement analytics tracking
3. Add performance optimizations
4. Create comprehensive tests

### Phase 4: Polish (Low Priority)
1. Advanced styling and theming
2. Additional language support
3. A/B testing capabilities
4. Advanced analytics integration

## Success Metrics

**Primary KPIs:**
- Chat widget engagement rate (clicks/views)
- Form completion rate (submissions/opens)
- Lead quality (email responses from sales team)
- Conversion rate improvement

**Secondary Metrics:**
- Page load impact (performance)
- Mobile vs desktop usage
- Time to form completion
- User feedback and satisfaction

## Risk Mitigation

**Technical Risks:**
- Performance impact on page load → Lazy loading implementation
- Mobile usability issues → Responsive design testing
- Email delivery problems → Reuse existing tested service
- Accessibility compliance → Follow WCAG guidelines

**Business Risks:**
- Low engagement rates → A/B testing and optimization
- Spam submissions → Honeypot and rate limiting
- Sales team overwhelm → Proper email categorization
- User experience degradation → Careful UX design

## File Changes Required

### New Files:
- `/components/common/ChatWidget/ChatBubble.tsx`
- `/components/common/ChatWidget/ChatModal.tsx`
- `/components/common/ChatWidget/ChatForm.tsx`
- `/components/common/ChatWidget/index.tsx`

### Modified Files:
- `/content/shared/common.json` (add chatWidget translations)
- `/lib/email/validation.ts` (add 'chat' form type)
- `/lib/email/email-service.ts` (update templates for chat)
- `/app/[locale]/layout.tsx` (add ChatWidget component)

### Optional Enhancements:
- `/lib/analytics.ts` (chat widget tracking)
- `/hooks/useChatWidget.ts` (custom hook for state management)
- `/styles/chat-widget.css` (dedicated styling if needed)

## Conclusion

This implementation leverages existing architecture and components to create a professional chat widget that serves as an effective lead capture tool. The modular approach ensures maintainability while the reuse of existing systems minimizes development time and potential bugs.

The widget will provide a modern, messenger-like experience that encourages user engagement while seamlessly integrating with the existing email workflow for sales team follow-up.
