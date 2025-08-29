# Standard Pages Content Creation Rules

## PROMPT FOR AI AGENT

Create a comprehensive standard page for the window-ads-website following the exact structure and content guidelines below. Standard pages include About, Contact, Homepage, Business, Accessories, Privacy Policy, and other core website pages that provide essential business information and user experience.

## Page Structure Requirements

### 1. File Naming & Identification
```json
{
  "pageId": "page-identifier",
  "template": "standard-page",
  "seo": { /* SEO for all 4 locales */ },
  "content": { /* Content for all 4 locales */ },
  "components": [ /* Optional page-specific components */ ],
  "componentOverrides": { /* Override default components */ }
}
```

**Page ID Rules:**
- Use lowercase with hyphens
- Match URL slug exactly
- Keep under 20 characters
- Descriptive and clear

### 2. SEO Structure (All 4 Locales)

**Title Requirements:**
- 50-60 characters maximum
- Include business name for brand recognition
- Format: "Page Purpose - Business Name" or "Page Purpose | Key Benefit"
- Include primary keyword for the page

**Description Requirements:**
- 150-160 characters maximum
- Clear value proposition
- Include location (Lithuania) for local SEO
- Action-oriented language

**Keywords Strategy:**
- Primary: Page purpose + business type + location
- Secondary: Services offered + benefits
- Long-tail: Specific user intents
- Brand: Business name variations

**OG Images:**
- Use professional, brand-representative images
- Business pages: team or facility images
- Service pages: relevant service images
- Info pages: professional/trust-building images

### 3. Standard Page Types & Content Structure

## 3.1 Homepage (`homepage.json`)

### Purpose
Primary landing page that converts visitors into leads through clear value proposition and service overview.

### Content Structure
```json
"content": {
  "hero": {
    "title": "Primary value proposition headline",
    "subtitle": "Supporting explanation of services and benefits",
    "backgroundImage": "/images/hero-background.webp",
    "ctaText": "Primary CTA button text"
  },
  "services": {
    "title": "Our Services",
    "subtitle": "Brief overview of service categories",
    "description": "Paragraph explaining service approach and quality"
  },
  "whyChooseUs": {
    "title": "Why Choose Us",
    "subtitle": "Unique selling propositions",
    "items": [
      {
        "icon": "Award",
        "title": "Key benefit 1",
        "description": "Detailed explanation"
      }
    ]
  }
}
```

### Component Strategy
- Use ALL default components
- Override positioning for optimal flow
- Customize content for homepage-specific messaging
- Ensure strong conversion funnel

## 3.2 About Page (`about.json`)

### Purpose
Build trust and credibility through team introduction, company history, and expertise demonstration.

### Content Structure
```json
"content": {
  "hero": {
    "title": "About [Company Name]",
    "subtitle": "Company mission and value proposition",
    "backgroundImage": "/images/team-or-facility.webp"
  },
  "story": {
    "title": "Our Story",
    "content": "Company history, founding principles, growth journey"
  },
  "team": {
    "title": "Our Team", 
    "subtitle": "Meet the experts",
    "description": "Team expertise and qualifications"
  },
  "values": {
    "title": "Our Values",
    "items": [
      {
        "icon": "ShieldCheck",
        "title": "Quality",
        "description": "Commitment to excellence"
      }
    ]
  },
  "certifications": {
    "title": "Certifications & Expertise",
    "items": ["Certification 1", "Certification 2"]
  }
}
```

### Trust Building Elements
- Professional team photos
- Years of experience
- Certifications and qualifications
- Customer testimonials
- Quality guarantees

## 3.3 Contact Page (`contact.json`)

### Purpose
Provide multiple contact methods and encourage direct communication with clear contact forms.

### Content Structure
```json
"content": {
  "hero": {
    "title": "Contact Us",
    "subtitle": "Get in touch for professional window services",
    "backgroundImage": "/images/contact-professional.webp"
  },
  "contactInfo": {
    "phone": {
      "title": "Call Us",
      "number": "+370 XXX XXXXX",
      "description": "Available 24/7 for emergencies"
    },
    "email": {
      "title": "Email Us", 
      "address": "info@company.com",
      "description": "Response within 2 hours"
    },
    "address": {
      "title": "Visit Us",
      "street": "Street Address",
      "city": "City, Country",
      "description": "Office hours and directions"
    }
  },
  "serviceAreas": {
    "title": "Service Areas",
    "description": "Areas we serve",
    "areas": ["Area 1", "Area 2", "Area 3"]
  }
}
```

### Contact Optimization
- Multiple contact methods
- Clear response time expectations
- Service area coverage
- Emergency contact information
- Professional contact form

## 3.4 Business Page (`business.json`)

### Purpose
Target B2B clients with commercial services, bulk pricing, and business-specific benefits.

### Content Structure
```json
"content": {
  "hero": {
    "title": "Business Services",
    "subtitle": "Professional window services for commercial properties",
    "backgroundImage": "/images/commercial-building.webp"
  },
  "businessServices": {
    "title": "Commercial Services",
    "services": [
      {
        "name": "Office Buildings",
        "description": "Service description",
        "benefits": ["Benefit 1", "Benefit 2"]
      }
    ]
  },
  "bulkPricing": {
    "title": "Volume Discounts",
    "description": "Pricing advantages for bulk orders",
    "tiers": [
      {
        "volume": "10-50 windows",
        "discount": "10% discount"
      }
    ]
  }
}
```

### B2B Focus Elements
- Commercial expertise
- Volume pricing
- Business hours flexibility
- Maintenance contracts
- Invoice and payment terms

## 3.5 Accessories Page (`accessories.json`)

### Purpose
Showcase window accessories and complementary products with clear product information.

### Content Structure
```json
"content": {
  "hero": {
    "title": "Window Accessories",
    "subtitle": "Complete your windows with professional accessories",
    "backgroundImage": "/images/accessories-display.webp"
  },
  "categories": {
    "title": "Accessory Categories",
    "items": [
      {
        "name": "Security Accessories",
        "description": "Locks, handles, security features",
        "image": "/images/security-accessories.webp"
      }
    ]
  },
  "installation": {
    "title": "Professional Installation",
    "description": "Why professional installation matters",
    "benefits": ["Benefit 1", "Benefit 2"]
  }
}
```

## 4. Content Writing Guidelines

### Tone & Style for Standard Pages

#### Homepage
- **Confident and welcoming**: First impression matters
- **Benefit-focused**: What customers gain
- **Action-oriented**: Clear next steps
- **Professional credibility**: Establish expertise immediately

#### About Page
- **Personal and trustworthy**: Build human connection
- **Professional expertise**: Demonstrate qualifications
- **Story-driven**: Engaging company narrative
- **Value-focused**: Why the company exists

#### Contact Page
- **Accessible and helpful**: Easy to reach
- **Responsive commitment**: Clear response expectations
- **Professional availability**: Business hours and emergency contact
- **Location-specific**: Local presence emphasis

#### Business Page
- **Professional and efficient**: B2B communication style
- **Results-oriented**: Focus on business outcomes
- **Scalable solutions**: Handle large projects
- **Partnership approach**: Long-term business relationships

### Writing Patterns for Standard Pages

#### Hero Section Formula
1. **Clear value proposition**: What do you offer?
2. **Target audience identification**: Who is this for?
3. **Unique differentiator**: Why choose us?
4. **Clear next step**: What should visitors do?

#### Content Section Structure
1. **Compelling headline**: Benefit-focused H2
2. **Supporting explanation**: 2-3 sentences of detail
3. **Proof points**: Evidence, testimonials, or credentials
4. **Visual support**: Relevant image or graphic
5. **Call-to-action**: Next step for engagement

#### Trust Building Elements
1. **Social proof**: Testimonials, reviews, case studies
2. **Credentials**: Certifications, experience, awards
3. **Transparency**: Clear pricing, processes, guarantees
4. **Accessibility**: Easy contact, responsive service
5. **Local presence**: Community involvement, local knowledge

## 5. Component Override Strategy

### Default Components for Standard Pages
All standard pages include these 9 default components:
1. ServiceCards
2. AccessoriesGrid  
3. Testimonials
4. WhyChooseUs
5. TechnicianTeam
6. Partners
7. Transformations
8. PropertyTypes
9. Faq

### Override Patterns by Page Type

#### Homepage Overrides
```json
"componentOverrides": {
  "ServiceCards": { "contentKey": "homepage-services" },
  "WhyChooseUs": { "contentKey": "homepage-benefits" },
  "Testimonials": { "position": 3 },
  "Faq": { "contentKey": "homepage-faq" }
}
```

#### About Page Overrides
```json
"componentOverrides": {
  "TechnicianTeam": { "contentKey": "about-team", "position": 2 },
  "WhyChooseUs": { "contentKey": "about-values" },
  "Partners": { "position": 8 },
  "Transformations": { "disabled": true }
}
```

#### Contact Page Overrides
```json
"componentOverrides": {
  "ServiceCards": { "contentKey": "contact-services" },
  "Faq": { "contentKey": "contact-faq", "position": 3 },
  "AccessoriesGrid": { "disabled": true },
  "Transformations": { "disabled": true }
}
```

#### Business Page Overrides
```json
"componentOverrides": {
  "ServiceCards": { "contentKey": "business-services" },
  "WhyChooseUs": { "contentKey": "business-benefits" },
  "PropertyTypes": { "contentKey": "commercial-properties" },
  "Testimonials": { "contentKey": "business-testimonials" }
}
```

## 6. Image Usage for Standard Pages

### Page-Specific Image Guidelines

#### Homepage Images
- **Hero background**: Professional, high-quality building or window image
- **Service sections**: Use service-specific images from available collection
- **Trust building**: Professional team or facility images

#### About Page Images  
- **Team photos**: Professional headshots or team group photos
- **Facility images**: Workshop, office, or professional environment
- **Work examples**: Before/after or process images

#### Contact Page Images
- **Professional contact**: Office environment or professional consultation
- **Location images**: Building exterior or service area maps
- **Communication**: Phone, email, or meeting imagery

#### Business Page Images
- **Commercial focus**: Office buildings, commercial properties
- **Scale demonstration**: Large projects or multiple units
- **Professional service**: Business meeting or consultation imagery

### Available Images Mapping
```json
{
  "professional": [
    "/images/professional-tools.webp",
    "/images/smart-window-technology-og.webp", 
    "/images/professional-window-installation-og.webp"
  ],
  "technical": [
    "/images/adjustment-tools.webp",
    "/images/glass-unit-replacement.webp",
    "/images/weather-seals.webp"
  ],
  "maintenance": [
    "/images/maintenance-calendar.webp",
    "/images/window-maintenance-schedule.webp",
    "/images/maintenance-calendar.webp"
  ],
  "technology": [
    "/images/smart-technology.webp",
    "/images/smart-window-technology.webp",
    "/images/energy-efficient-windows-og.webp"
  ]
}
```

## 7. Localization Guidelines for Standard Pages

### Lithuanian (lt) - Primary Market
- **Local emphasis**: "Visoje Lietuvoje" (throughout Lithuania)
- **Seasonal relevance**: Harsh winters, energy efficiency focus
- **Cultural approach**: Family business values, long-term relationships
- **Regulatory context**: Lithuanian building codes and standards
- **Professional terminology**: Established Lithuanian trade terms

### Polish (pl) - Secondary Market
- **European standards**: EU quality and safety standards
- **Professional presentation**: Formal business communication
- **Technical precision**: Detailed technical specifications
- **Value proposition**: Quality-price ratio emphasis
- **Regional context**: Central European building practices

### Ukrainian (uk) - Support Market
- **Clear communication**: Detailed, helpful explanations
- **Quality assurance**: Reliability and warranty emphasis
- **Practical benefits**: Immediate and long-term value
- **Safety focus**: Security and protection aspects
- **Supportive approach**: Understanding and helpful service

### English (en) - International/SEO
- **Global standards**: International best practices
- **Comprehensive coverage**: Most detailed content version
- **SEO optimization**: Primary language for search optimization
- **Professional presentation**: Formal but accessible language
- **Technical accuracy**: Industry-standard terminology

## 8. Quality Checklist for Standard Pages

### Content Quality
- [ ] Clear value proposition on every page
- [ ] Consistent brand voice and messaging
- [ ] Comprehensive information without overwhelming
- [ ] Strong calls-to-action throughout
- [ ] Trust-building elements included
- [ ] Mobile-optimized content structure

### SEO Optimization
- [ ] Unique title and description per page
- [ ] Keyword optimization without stuffing
- [ ] Internal linking opportunities
- [ ] Image alt texts optimized
- [ ] Structured data where applicable
- [ ] Local SEO elements included

### User Experience
- [ ] Clear navigation and page hierarchy
- [ ] Fast loading times
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Contact information easily accessible
- [ ] Professional visual presentation

### Conversion Optimization
- [ ] Multiple contact opportunities
- [ ] Clear value propositions
- [ ] Trust signals and social proof
- [ ] Reduced friction in contact process
- [ ] Emergency contact options
- [ ] Service area coverage clear

This comprehensive guide ensures every standard page serves its specific purpose while maintaining consistent brand messaging and optimal user experience across all locales.
