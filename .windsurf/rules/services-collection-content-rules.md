---
trigger: model_decision
description: when creating or updating service .json collection item
---

# Services Collection Content Creation Rules (Concise)

## PROMPT FOR AI AGENT
Create professional service pages for window-ads-website with conversion-optimized structure, transparent pricing, and clear value propositions following exact guidelines below.

## 1. File Structure & Naming
```json
{
  "itemId": "service-name-slug",
  "collection": "services", 
  "template": "service-item",
  "slugs": {
    "en": "english-slug", "lt": "lietuviu-slug", 
    "pl": "polski-slug", "uk": "ukrainskyi-slug"
  }
}
```
**Slug Rules:** English symbols only, max 40 chars, hyphens for spaces, consistent meaning across locales.

## 2. SEO Requirements (All 4 Locales)
**Title:** "Service Name | From €[Price] | Key Benefit" (50-60 chars)
**Description:** Service type + price range + benefit (150-160 chars)
**Keywords:** Service+location, problem+solution, price-related, quality terms
**Images:** Use contextual images from `/images/images.json`

## 3. Content Structure

### Hero Section
```json
"hero": {
  "title": "Service Name",
  "subtitle": "Problem solved + why choose us (1-2 sentences)",
  "priceFrom": "From €[amount]",
  "features": ["Warranty/guarantee", "Speed/convenience", "Expertise/quality", "Comprehensive service"],
  "image": "/images/contextual-service.webp",
  "imageAlt": "Professional [service] in progress"
}
```

### Service Details
```json
"serviceDetails": {
  "overview": "2-3 paragraphs: service explanation, inclusions, outcomes",
  "process": {
    "title": "Our Process",
    "steps": [
      {"step": 1, "title": "Assessment", "description": "Initial step"},
      {"step": 2, "title": "Preparation", "description": "Planning phase"},
      {"step": 3, "title": "Execution", "description": "Service delivery"},
      {"step": 4, "title": "Quality Check", "description": "Final verification"}
    ]
  }
}
```

### Pricing Structure
```json
"pricing": {
  "basePrice": "€[amount]",
  "priceNote": "Starting price for standard [service]",
  "factors": ["Price factor 1", "Price factor 2", "Price factor 3"],
  "included": ["Base inclusion 1", "Base inclusion 2", "Base inclusion 3"],
  "additionalServices": [{"name": "Optional service", "price": "€[amount]", "description": "Brief desc"}]
}
```

### Why Choose Us
```json
"whyChooseUs": {
  "benefits": [
    {"icon": "Award", "title": "Guaranteed Quality", "description": "Quality guarantee"},
    {"icon": "Clock", "title": "Fast Service", "description": "Timeframe commitment"},
    {"icon": "ShieldCheck", "title": "Warranty Protection", "description": "Warranty details"},
    {"icon": "Users", "title": "Expert Team", "description": "Team expertise"}
  ]
}
```

### Common Issues & FAQ
```json
"commonIssues": {
  "issues": [{"problem": "Issue description", "solution": "Our solution", "timeframe": "Resolution time"}]
},
"faq": {
  "items": [
    {"question": "Cost question", "answer": "Pricing explanation"},
    {"question": "Timeline question", "answer": "Timeframe details"},
    {"question": "Warranty question", "answer": "Warranty terms"},
    {"question": "Service area question", "answer": "Coverage area"}
  ]
}
```

## 4. Service Categories & Pricing

### Repair Services (€80-€200)
- **Types:** Mechanism repair, glass replacement, frame repair, gasket replacement, emergency
- **Pricing:** Base €80-€120, Complex €150-€200, Emergency +€30-€50, Weekend +20%
- **Focus:** Problem-solving, before/after, warranty, speed

### Maintenance Services (€60-€150)  
- **Types:** Regular maintenance, seasonal prep, preventive care, cleaning
- **Pricing:** Single €15-€25, Visit €60-€100, Annual -15%, Bulk pricing
- **Focus:** Prevention benefits, cost savings, seasonal relevance

### Installation Services (€150-€500+)
- **Types:** New installation, replacement, custom, accessories
- **Pricing:** Standard €150-€250, Complex €300-€500, Custom quote-based
- **Focus:** Professional expertise, precision, lifetime warranty

### Improvement Services (€100-€300)
- **Types:** Insulation, energy efficiency, security, smart technology
- **Pricing:** Basic €100-€150, Advanced €200-€300, Tech €250-€400
- **Focus:** ROI/savings, modern solutions, long-term value

## 5. Content Guidelines

### Writing Formula
1. **Opening:** Problem identification → Solution preview → Credibility
2. **Service:** What's included → Process → Quality standards → Outcomes  
3. **Value:** Time savings → Cost effectiveness → Peace of mind → Expertise

### Pricing Communication
- Show starting price in hero
- Explain base price inclusions
- List price factors
- Justify value vs cost
- Use "From €X" format

### Tone by Locale
- **Lithuanian:** Reliability, long-term relationships, harsh winters
- **Polish:** European standards, quality-price ratio, craftsmanship
- **Ukrainian:** Clear communication, safety emphasis, supportive service
- **English:** International standards, technical accuracy, comprehensive

## 6. Image Mapping

**Repair:** `/images/adjustment-tools.webp`, `/images/professional-tools.webp`
**Installation:** `/images/professional-installation-og.webp`, `/images/window-replacement-comparison.webp`
**Maintenance:** `/images/maintenance-calendar.webp`, `/images/winter-window-care.webp`
**Technology:** `/images/smart-technology.webp`, `/images/energy-efficient-windows-og.webp`

## 7. Quality Checklist

### Content Quality
- [ ] Clear problem-solution alignment
- [ ] Transparent pricing structure  
- [ ] Professional process explanation
- [ ] Strong value proposition
- [ ] Warranty details included

### Conversion Optimization
- [ ] Clear CTAs placed strategically
- [ ] Multiple contact opportunities
- [ ] Trust signals included
- [ ] Easy-to-understand pricing
- [ ] Urgency elements

### Technical Requirements
- [ ] Valid JSON structure
- [ ] All required fields completed
- [ ] Correct image paths
- [ ] Proper slug formatting
- [ ] SEO elements optimized

### Localization Quality
- [ ] All 4 locales completed
- [ ] Culturally appropriate content
- [ ] Local market pricing
- [ ] Regional considerations
- [ ] Appropriate formality level

## 8. Performance Goals

**Conversion:** 3+ min engagement, 70%+ scroll depth, 5-8% contact rate
**SEO:** Top 5 local rankings, multiple page 1 long-tail, featured snippets
**UX:** <3s load speed, perfect mobile, clear navigation, professional presentation

This guide ensures every service page converts visitors while maintaining professional credibility and clear value communication across all locales.
