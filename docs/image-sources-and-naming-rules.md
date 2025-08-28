# Image Sources and Naming Convention Rules

## PROMPT FOR AI AGENT

When creating content for the window-ads-website, you MUST ONLY use images from the approved local image collection. Never reference external URLs or create new image requirements. Follow the strict naming and usage conventions outlined below.

## 🚨 CRITICAL IMAGE RULES

### 1. ONLY Use Local Images
```json
// ✅ CORRECT - Use only these approved images
"image": "/images/smart-technology.webp"
"ogImage": "/images/energy-efficient-windows-og.webp"

// ❌ FORBIDDEN - Never use external URLs
"image": "https://storage.googleapis.com/..."
"image": "https://example.com/image.jpg"
```

### 2. Image Source Location
**Primary Source**: `/Users/mariussilenskis/Development/silotech/websites/langu-remontas/public/images/images.json`
**Physical Files**: `/Users/mariussilenskis/Development/silotech/websites/langu-remontas/public/images/`

## Available Image Inventory

### Professional/Technical Images
```json
{
  "tools_and_equipment": [
    "/images/adjustment-tools.webp",
    "/images/professional-tools.webp"
  ],
  "installation_work": [
    "/images/professional-installation-og.webp",
    "/images/professional-window-installation-og.webp",
    "/images/glass-unit-replacement.webp"
  ],
  "repair_components": [
    "/images/weather-seals.webp",
    "/images/window-sealing.webp"
  ]
}
```

### Maintenance and Care Images
```json
{
  "maintenance_scheduling": [
    "/images/maintenance-calendar.webp",
    "/images/maintenance-schedule-calendar.webp",
    "/images/window-maintenance-schedule.webp",
    "/images/maintenance-schedule-og.webp",
    "/images/window-maintenance-schedule-og.webp"
  ],
  "seasonal_care": [
    "/images/winter-window-care.webp",
    "/images/winter-window-care-og.webp",
    "/images/winter-care-og.webp",
    "/images/winter-maintenance-og.webp"
  ]
}
```

### Technology and Efficiency Images
```json
{
  "smart_technology": [
    "/images/smart-technology.webp",
    "/images/smart-window-technology.webp",
    "/images/smart-technology-og.webp",
    "/images/smart-window-technology-og.webp",
    "/images/smart-windows-og.webp"
  ],
  "energy_efficiency": [
    "/images/energy-efficient-windows-og.webp"
  ]
}
```

### Comparison and Analysis Images
```json
{
  "comparisons": [
    "/images/window-replacement-comparison.webp",
    "/images/window-replacement-comparison-og.webp"
  ],
  "guides": [
    "/images/window-adjustment-frequency-og.webp",
    "/images/window-adjustment-guide-og.webp"
  ]
}
```

### Security and Safety Images
```json
{
  "security": [
    "/images/window-security-safety-og.webp"
  ]
}
```

## Image Selection Rules by Content Type

### 1. News Articles

#### Maintenance Topics
- **Primary**: `/images/maintenance-calendar.webp`
- **Secondary**: `/images/window-maintenance-schedule.webp`
- **OG Image**: `/images/maintenance-schedule-og.webp`

#### Technology Topics
- **Primary**: `/images/smart-technology.webp`
- **Secondary**: `/images/smart-window-technology.webp`
- **OG Image**: `/images/smart-technology-og.webp`

#### Repair Topics
- **Primary**: `/images/adjustment-tools.webp`
- **Secondary**: `/images/professional-tools.webp`
- **OG Image**: `/images/professional-installation-og.webp`

#### Seasonal Topics
- **Primary**: `/images/winter-window-care.webp`
- **Secondary**: `/images/winter-maintenance-og.webp`
- **OG Image**: `/images/winter-care-og.webp`

#### Energy Efficiency Topics
- **Primary**: `/images/energy-efficient-windows-og.webp`
- **Secondary**: `/images/smart-window-technology.webp`
- **OG Image**: `/images/energy-efficient-windows-og.webp`

### 2. Service Pages

#### Installation Services
- **Hero**: `/images/professional-window-installation-og.webp`
- **Process**: `/images/professional-installation-og.webp`
- **OG Image**: `/images/professional-installation-og.webp`

#### Repair Services
- **Hero**: `/images/adjustment-tools.webp`
- **Process**: `/images/professional-tools.webp`
- **Components**: `/images/glass-unit-replacement.webp`
- **OG Image**: `/images/professional-tools.webp`

#### Maintenance Services
- **Hero**: `/images/maintenance-calendar.webp`
- **Schedule**: `/images/window-maintenance-schedule.webp`
- **OG Image**: `/images/maintenance-schedule-og.webp`

#### Technology Services
- **Hero**: `/images/smart-technology.webp`
- **Features**: `/images/smart-window-technology.webp`
- **OG Image**: `/images/smart-technology-og.webp`

### 3. Standard Pages

#### Homepage
- **Hero Background**: `/images/professional-window-installation-og.webp`
- **Services**: `/images/professional-tools.webp`
- **Technology**: `/images/smart-technology.webp`
- **OG Image**: `/images/professional-installation-og.webp`

#### About Page
- **Hero**: `/images/professional-tools.webp`
- **Team**: `/images/professional-installation-og.webp`
- **OG Image**: `/images/professional-window-installation-og.webp`

#### Contact Page
- **Hero**: `/images/professional-tools.webp`
- **Services**: `/images/maintenance-calendar.webp`
- **OG Image**: `/images/professional-installation-og.webp`

#### Business Page
- **Hero**: `/images/professional-installation-og.webp`
- **Services**: `/images/professional-tools.webp`
- **OG Image**: `/images/professional-window-installation-og.webp`

## Image Naming Convention Analysis

### Pattern Recognition
```
Format: [topic]-[type]-[variant].webp
Examples:
- smart-technology.webp (main content image)
- smart-technology-og.webp (Open Graph version)
- window-maintenance-schedule.webp (specific feature)
- professional-window-installation-og.webp (service-specific OG)
```

### Image Type Suffixes
- **No suffix**: Main content images for articles/sections
- **-og**: Open Graph images optimized for social sharing (1200x630)
- **-calendar**: Calendar/scheduling related images
- **-comparison**: Before/after or comparison images
- **-guide**: Step-by-step or instructional images

### Topic Categories
- **smart-**: Technology and smart window features
- **professional-**: Professional services and expertise
- **maintenance-**: Upkeep and care procedures
- **window-**: General window-related content
- **winter-**: Seasonal maintenance and care
- **energy-**: Energy efficiency and performance
- **adjustment-**: Repair and adjustment procedures

## Alt Text Guidelines

### Professional Images
```json
{
  "/images/professional-tools.webp": "Professional window repair tools and equipment",
  "/images/professional-installation-og.webp": "Professional window installation service in progress",
  "/images/adjustment-tools.webp": "Window adjustment tools for professional repair work"
}
```

### Technology Images
```json
{
  "/images/smart-technology.webp": "Smart window technology and automation features",
  "/images/smart-window-technology.webp": "Modern smart window control system",
  "/images/energy-efficient-windows-og.webp": "Energy efficient window performance demonstration"
}
```

### Maintenance Images
```json
{
  "/images/maintenance-calendar.webp": "Window maintenance schedule and calendar planning",
  "/images/winter-window-care.webp": "Winter window care and maintenance procedures",
  "/images/window-maintenance-schedule.webp": "Professional window maintenance schedule"
}
```

### Repair Images
```json
{
  "/images/glass-unit-replacement.webp": "Professional glass unit replacement procedure",
  "/images/weather-seals.webp": "Window weather sealing and insulation work",
  "/images/window-sealing.webp": "Professional window sealing application"
}
```

## Image Usage Best Practices

### 1. Contextual Relevance
- Match image content to text content
- Use technical images for how-to content
- Use professional images for service descriptions
- Use maintenance images for care instructions

### 2. SEO Optimization
- Always use -og versions for Open Graph images
- Include relevant keywords in alt text
- Match image content to page topic
- Use descriptive, accessible alt text

### 3. User Experience
- Choose high-quality, professional images
- Ensure images support the content narrative
- Use consistent image style across pages
- Optimize for mobile viewing

### 4. Performance Considerations
- All images are already optimized WebP format
- Use appropriate image for content context
- Don't overuse images in single content piece
- Prioritize above-fold images

## Content Creation Workflow

### Step 1: Identify Content Type
- News article → Use topic-specific images
- Service page → Use service-relevant images  
- Standard page → Use professional/brand images

### Step 2: Select Primary Image
- Choose main content image from appropriate category
- Ensure contextual relevance to content
- Use professional images for credibility

### Step 3: Choose OG Image
- Always use -og version for social sharing
- Must be 1200x630 optimized
- Should represent page content accurately

### Step 4: Write Alt Text
- Describe image content accurately
- Include relevant keywords naturally
- Keep under 15 words
- Focus on accessibility

### Step 5: Validate Selection
- Confirm image exists in images.json
- Check path format is correct
- Ensure alt text is descriptive
- Verify contextual relevance

## Quality Checklist

### Image Selection
- [ ] Image exists in approved images.json list
- [ ] Path format is correct (/images/filename.webp)
- [ ] Image content matches page/section topic
- [ ] Professional quality and relevance
- [ ] Appropriate for target audience

### Alt Text Quality
- [ ] Descriptive and accessible
- [ ] Under 15 words
- [ ] Includes relevant keywords
- [ ] Describes actual image content
- [ ] Helpful for screen readers

### SEO Optimization
- [ ] OG images use -og versions
- [ ] Alt text supports page keywords
- [ ] Image filename relates to content
- [ ] Proper image-to-content ratio
- [ ] Mobile-optimized selection

### Performance
- [ ] Using optimized WebP format
- [ ] Not overusing images per page
- [ ] Appropriate image sizes
- [ ] Fast loading considerations
- [ ] Responsive design support

## Emergency Fallbacks

### If Specific Image Not Available
1. Use closest topically related image
2. Choose professional-tools.webp as general fallback
3. Use maintenance-calendar.webp for scheduling content
4. Use smart-technology.webp for modern/tech content

### If OG Image Not Available
1. Use closest -og version available
2. Fallback to professional-installation-og.webp
3. Ensure 1200x630 optimization maintained

This comprehensive guide ensures consistent, professional image usage across all content while maintaining performance and SEO optimization.
