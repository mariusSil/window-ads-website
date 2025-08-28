---
trigger: model_decision
description: when creating or updating NEWS .json content
---

# News Collection Content Creation Rules

## PROMPT FOR AI AGENT

Create a comprehensive news article for the window-ads-website following the exact structure and content guidelines below. The article must be educational, SEO-optimized, and provide genuine value to homeowners interested in window maintenance, repair, or improvement.

## Article Structure Requirements

### 1. File Naming & Identification
```json
{
  "itemId": "descriptive-slug-name",
  "collection": "news",
  "template": "news-article",
  "slugs": {
    "en": "english-slug-max-60-chars-seo-optimized",
    "lt": "lietuviu-slug-max-60-chars-seo-optimized", 
    "pl": "polski-slug-max-60-chars-seo-optimized",
    "uk": "ukrainskyi-slug-max-60-chars-seo-optimized"
  }
}
```

**CRITICAL SLUG RULES:**
- Only English symbols allowed (no Lithuanian, Polish, Ukrainian letters)
- Max 60 characters per slug
- Use hyphens for word separation
- Include primary keyword in slug
- Make slugs descriptive and SEO-friendly

### 2. Article Metadata
```json
{
  "publishDate": "YYYY-MM-DD",
  "author": "Langu-Remontas Expert Team",
  "category": "maintenance|efficiency|repair|installation|safety|technology",
  "readingTime": 6-12,
  "featured": true|false
}
```

**Categories:**
- **maintenance**: Cleaning, upkeep, seasonal care
- **efficiency**: Energy savings, insulation, performance
- **repair**: Fixing issues, troubleshooting, restoration
- **installation**: New installations, replacements
- **safety**: Security, child safety, accident prevention
- **technology**: Smart windows, innovations, modern solutions

### 3. SEO Structure (All 4 Locales)

**Title Requirements:**
- 50-60 characters maximum
- Include primary keyword
- Action-oriented or benefit-focused
- Format: "Primary Keyword: Benefit | Secondary Keyword"

**Description Requirements:**
- 150-160 characters maximum
- Include 2-3 keywords naturally
- Clear value proposition
- Call-to-action implied

**Keywords:**
- 5-8 keywords per locale
- Mix of short-tail (1-2 words) and long-tail (3-5 words)
- Include local terms where relevant
- Focus on search intent

**OG Images:**
- Use ONLY images from `/images/images.json`
- Select contextually relevant image
- Format: `/images/filename.webp`
- Alt text must describe image content accurately

**Structured Data:**
- Always include Article schema
- Use organization as author and publisher
- Include proper dates and image references

### 4. Content Structure (All 4 Locales)

#### Hero Section
```json
"hero": {
  "title": "Compelling headline matching SEO title",
  "subtitle": "2-3 sentence summary of article value",
  "image": "/images/contextual-image.webp",
  "imageAlt": "Descriptive alt text for accessibility"
}
```

#### Article Content
```json
"article": {
  "introduction": "Hook paragraph + article overview",
  "sections": [
    {
      "heading": "H2 heading with keyword",
      "content": "2-3 paragraphs of valuable content",
      "image": "/images/section-relevant-image.webp",
      "imageAlt": "Descriptive alt text"
    }
  ],
  "conclusion": "Summary + call-to-action paragraph"
}
```

#### Quick Tips Section
```json
"quickTips": {
  "title": "Quick Tips",
  "tips": [
    "Actionable tip 1",
    "Actionable tip 2", 
    "Actionable tip 3"
  ]
}
```

#### FAQ Section
```json
"faq": {
  "title": "Frequently Asked Questions",
  "items": [
    {
      "question": "Common question about the topic",
      "answer": "Detailed, helpful answer"
    }
  ]
}
```

## Content Writing Guidelines

### Tone & Style
- **Professional but approachable**: Expert advice without jargon
- **Educational focus**: Teach, don't just sell
- **Problem-solving oriented**: Address real homeowner concerns
- **Trustworthy**: Use facts, statistics, and proven methods
- **Local relevance**: Consider climate and regulations for each locale

### Content Requirements
- **Minimum 1,500 words** per locale
- **Original content**: No copying from other sources
- **Actionable advice**: Readers should be able to implement suggestions
- **Visual descriptions**: Reference images meaningfully in text
- **Safety warnings**: Include when relevant
- **Professional recommendations**: When to call experts

### Writing Patterns

#### Introduction Formula
1. **Hook**: Relatable problem or surprising fact
2. **Problem**: What homeowners face
3. **Solution preview**: What the article will teach
4. **Credibility**: Why trust this advice

#### Section Structure
1. **Clear H2 heading** with keyword
2. **Opening paragraph**: Section overview
3. **Detailed explanation**: How-to or educational content
4. **Visual reference**: Mention accompanying image
5. **Practical tips**: Actionable takeaways

#### Conclusion Formula
1. **Summary**: Key points recap
2. **Next steps**: What readers should do
3. **Professional help**: When to contact experts
4. **Call-to-action**: Subtle service mention

## Image Usage Rules

### Available Images (from `/images/images.json`)
**Technical/Professional:**
- `/images/adjustment-tools.webp`
- `/images/professional-tools.webp`
- `/images/glass-unit-replacement.webp`
- `/images/weather-seals.webp`
- `/images/window-sealing.webp`

**Maintenance/Care:**
- `/images/maintenance-calendar.webp`
- `/images/maintenance-schedule-calendar.webp`
- `/images/window-maintenance-schedule.webp`
- `/images/winter-window-care.webp`

**Technology/Efficiency:**
- `/images/smart-technology.webp`
- `/images/smart-window-technology.webp`
- `/images/energy-efficient-windows-og.webp`

**Comparison/Analysis:**
- `/images/window-replacement-comparison.webp`

**OG Images (for SEO):**
- All images ending with `-og.webp`

### Image Selection Rules
1. **Contextual relevance**: Image must relate to section content
2. **Professional quality**: Use technical/professional images for how-to content
3. **Seasonal appropriateness**: Use winter images for winter topics
4. **Technology focus**: Use smart/technology images for efficiency articles
5. **One image per major section**: Don't overuse images

### Alt Text Requirements
- **Descriptive**: Explain what's shown in the image
- **Contextual**: Relate to surrounding content
- **Accessible**: Help screen readers understand content
- **Keyword integration**: Include relevant keywords naturally
- **Length**: 10-15 words maximum

## Localization Guidelines

### Lithuanian (lt)
- **Formal tone**: Use "Jūs" form
- **Technical terms**: Use Lithuanian equivalents when available
- **Local context**: Reference Lithuanian climate, regulations
- **Cultural adaptation**: Consider local building practices

### Polish (pl)
- **Professional tone**: Balanced formality
- **Technical vocabulary**: Use established Polish terms
- **Regional considerations**: Central European context
- **Practical focus**: Emphasize DIY culture

### Ukrainian (uk)
- **Respectful tone**: Consider current situation
- **Clear explanations**: Detailed technical information
- **Safety emphasis**: Highlight safety considerations
- **Resource awareness**: Consider material availability

### English (en)
- **International appeal**: Avoid region-specific references
- **Technical accuracy**: Use proper industry terminology
- **SEO optimization**: Primary locale for search optimization
- **Comprehensive coverage**: Most detailed content version

## Quality Checklist

### Content Quality
- [ ] Minimum 1,500 words per locale
- [ ] Original, valuable content
- [ ] Clear problem-solution structure
- [ ] Actionable advice included
- [ ] Professional credibility maintained
- [ ] Safety considerations addressed

### SEO Optimization
- [ ] Title 50-60 characters
- [ ] Description 150-160 characters
- [ ] Keywords naturally integrated
- [ ] Structured data included
- [ ] Image alt texts optimized
- [ ] Internal linking opportunities identified

### Technical Requirements
- [ ] Valid JSON structure
- [ ] All required fields completed
- [ ] Image paths verified in images.json
- [ ] Slugs follow naming conventions
- [ ] Dates in correct format
- [ ] Category properly assigned

### Localization Quality
- [ ] All 4 locales completed
- [ ] Cultural adaptations made
- [ ] Technical terms localized
- [ ] Tone appropriate for each locale
- [ ] Local context considered

## Example Topics for News Articles

### Maintenance Category
- "Seasonal Window Maintenance Checklist"
- "How to Clean Windows Like a Professional"
- "Signs Your Windows Need Immediate Attention"

### Efficiency Category  
- "Energy Efficient Windows: Complete Buyer's Guide"
- "Reducing Heat Loss Through Windows"
- "Smart Window Technologies for Modern Homes"

### Repair Category
- "DIY Window Repairs vs Professional Service"
- "Common Window Problems and Solutions"
- "When to Replace vs Repair Your Windows"

### Safety Category
- "Child Safety Features for Windows"
- "Window Security: Protecting Your Home"
- "Emergency Window Repair Procedures"

## Implementation Notes

1. **Research phase**: Understand the topic thoroughly before writing
2. **Keyword research**: Use tools to find relevant search terms
3. **Competitive analysis**: Check what competitors are writing about
4. **Expert consultation**: Verify technical accuracy
5. **User intent**: Focus on what readers actually want to know
6. **Conversion optimization**: Subtle mentions of professional services

This comprehensive guide ensures every news article provides genuine value while supporting business objectives through education-first content marketing.
