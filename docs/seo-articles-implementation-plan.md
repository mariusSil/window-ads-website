# SEO Articles Implementation Plan - Window-Ads-Website

## PROMPT FOR AI CODING ASSISTANT

Create 3 new SEO-optimized news articles for the window-ads-website project to improve search rankings and drive organic traffic. Follow the established content architecture and multilingual structure.

## Current Analysis

**Existing News Articles (9 total):**
- energy-efficient-windows.json
- professional-window-installation.json  
- smart-window-technology.json
- window-adjustment-frequency.json
- window-maintenance-schedule.json
- window-replacement-vs-repair.json
- window-security-safety.json
- winter-maintenance-tips.json
- winter-window-care.json

**Content Structure Pattern:**
```json
{
  "itemId": "article-slug",
  "collection": "news",
  "template": "news-article", 
  "slugs": { "en": "...", "lt": "...", "pl": "...", "uk": "..." },
  "publishDate": "YYYY-MM-DD",
  "author": "Langu-Remontas Expert Team",
  "category": "efficiency|maintenance|technology|security",
  "readingTime": 6-8,
  "featured": true/false,
  "seo": { 4 locales with title, description, keywords, ogImage, structuredData },
  "content": { 4 locales with hero, sections, conclusion }
}
```

## 3 NEW ARTICLE TOPICS (SEO-OPTIMIZED)

### 1. Window Condensation Problems & Solutions
**Target Keywords:** window condensation, moisture problems, humidity control, double glazing issues
**SEO Value:** High search volume, common customer problem
**Content Focus:** Causes, prevention, solutions for window condensation issues

### 2. Window Frame Materials Comparison Guide  
**Target Keywords:** window frame materials, uPVC vs aluminum, wooden window frames, composite frames
**SEO Value:** High commercial intent, comparison searches
**Content Focus:** Material pros/cons, durability, energy efficiency, cost analysis

### 3. Window Soundproofing & Noise Reduction
**Target Keywords:** soundproof windows, noise reduction, acoustic glazing, traffic noise
**SEO Value:** Growing urban concern, premium service opportunity  
**Content Focus:** Soundproofing techniques, glazing options, installation methods

## IMPLEMENTATION REQUIREMENTS

### Phase 1: Content Creation (HIGH PRIORITY)
1. **Create JSON files** in `/content/collections/news/`:
   - `window-condensation-solutions.json`
   - `window-frame-materials-guide.json` 
   - `window-soundproofing-guide.json`

2. **Content Structure** for each article:
   - **Hero Section**: Title, subtitle, featured image, reading time
   - **Introduction**: Problem overview, importance
   - **Main Sections** (4-6 sections): Detailed explanations, solutions, tips
   - **Conclusion**: Summary, call-to-action for services
   - **Word Count**: 1500-2000 words per locale

3. **Multilingual Content** (4 locales):
   - **English**: Primary content, SEO-optimized
   - **Lithuanian**: Localized for Lithuanian market
   - **Polish**: Adapted for Polish audience  
   - **Ukrainian**: Culturally appropriate translation

### Phase 2: SEO Optimization (MEDIUM PRIORITY)
1. **SEO Metadata** per locale:
   - **Title**: 50-60 characters, keyword-rich
   - **Description**: 150-160 characters, compelling
   - **Keywords**: 5-7 target keywords per article
   - **OG Images**: Use existing images from `/public/images/`

2. **Structured Data** (Schema.org Article):
   - Headline, description, image, datePublished
   - Author: "Langu-Remontas Expert Team"
   - Publisher organization details

3. **URL Slugs** (English symbols only):
   - `window-condensation-moisture-problems-solutions-guide`
   - `window-frame-materials-upvc-aluminum-wood-comparison`  
   - `soundproof-windows-noise-reduction-acoustic-glazing-guide`

### Phase 3: Image Optimization (MEDIUM PRIORITY)
1. **Select Images** from existing `/public/images/`:
   - Use relevant WebP images from images.json
   - Reuse: smart-technology-og.webp, professional-installation-og.webp
   - Optimize for article context and SEO

2. **Image Requirements**:
   - Hero images: 1200x630px (OG format)
   - Content images: 800x600px 
   - Alt text: SEO-optimized descriptions
   - Lazy loading compatible

### Phase 4: Technical Integration (LOW PRIORITY)
1. **Routes Configuration**:
   - News collection already configured in `routes.json`
   - No changes needed - dynamic routing handles new articles

2. **Component Integration**:
   - Uses existing NewsArticle.tsx component
   - ComponentRenderer automatically handles new articles
   - No component modifications required

## CONTENT GUIDELINES

### SEO Best Practices
- **Keyword Density**: 1-2% for primary keywords
- **Header Structure**: H1 (title), H2 (sections), H3 (subsections)
- **Internal Links**: Link to existing services and articles
- **External Links**: Authoritative sources for credibility
- **Meta Descriptions**: Action-oriented, benefit-focused

### Content Quality Standards
- **Expertise**: Technical accuracy, professional insights
- **Helpfulness**: Practical solutions, actionable advice  
- **Readability**: Clear language, logical flow
- **Localization**: Cultural adaptation, local regulations
- **Call-to-Actions**: Service inquiries, consultation requests

### Technical Requirements
- **Reading Time**: 6-8 minutes (1500-2000 words)
- **Categories**: "efficiency", "maintenance", "technology"
- **Featured Status**: Set 1-2 articles as featured
- **Publish Dates**: Recent dates (within last 3 months)
- **Author**: Consistent "Langu-Remontas Expert Team"

## FILES TO CREATE

### 1. Content Files (Required)
```
/content/collections/news/window-condensation-solutions.json
/content/collections/news/window-frame-materials-guide.json  
/content/collections/news/window-soundproofing-guide.json
```

### 2. No Route Changes Needed
- Dynamic routing via `[...slug]/page.tsx` handles new articles
- Collection configuration in `routes.json` already exists
- Sitemap generation automatically includes new articles

### 3. No Component Changes Needed
- NewsArticle.tsx component handles all article rendering
- ComponentRenderer.tsx processes news articles automatically
- Existing news page lists new articles automatically

## VALIDATION CHECKLIST

### Content Validation
- [ ] All 4 locales completed for each article
- [ ] SEO metadata optimized for each locale
- [ ] Structured data properly formatted
- [ ] Images selected from existing local files
- [ ] Internal links to services added
- [ ] Call-to-actions included

### Technical Validation  
- [ ] JSON syntax valid for all files
- [ ] Slug format follows English-only rule
- [ ] Category values match existing categories
- [ ] Reading time calculated accurately
- [ ] Publish dates are realistic

### SEO Validation
- [ ] Title length 50-60 characters
- [ ] Description length 150-160 characters  
- [ ] Keywords relevant and researched
- [ ] OG images properly referenced
- [ ] Schema markup complete

## EXPECTED RESULTS

### SEO Improvements
- **3 new ranking opportunities** for high-value keywords
- **Increased organic traffic** from problem-solving content
- **Enhanced topical authority** in window services
- **Better internal linking** structure

### Business Impact
- **Lead generation** from informational searches
- **Service awareness** for specialized offerings
- **Brand authority** as window experts
- **Customer education** reducing support queries

### Performance Metrics
- **Page load speed**: Maintained with existing lazy loading
- **Core Web Vitals**: No impact (uses existing components)
- **Mobile optimization**: Responsive design maintained
- **Accessibility**: WCAG compliance preserved

## IMPLEMENTATION ORDER

1. **Start with window-condensation-solutions.json** (highest search volume)
2. **Follow with window-frame-materials-guide.json** (commercial intent)
3. **Complete with window-soundproofing-guide.json** (niche opportunity)
4. **Test each article** before proceeding to next
5. **Validate SEO metadata** and structured data
6. **Verify multilingual content** quality and accuracy

This plan provides a comprehensive roadmap for adding 3 SEO-optimized articles that will enhance the website's search visibility and provide valuable content for potential customers across all supported locales.
