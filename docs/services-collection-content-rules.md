# Services Collection Content Creation Rules

## PROMPT FOR AI AGENT

Create a comprehensive service page for the window-ads-website following the exact structure and pricing guidelines below. The service must be professionally presented, conversion-optimized, and provide clear value propositions with transparent pricing.

## Service Structure Requirements

### 1. File Naming & Identification
```json
{
  "itemId": "service-name-slug",
  "collection": "services",
  "template": "service-item",
  "slugs": {
    "en": "service-name-english-slug",
    "lt": "paslaugos-pavadinimas-lietuviu-slug",
    "pl": "nazwa-uslugi-polski-slug", 
    "uk": "nazva-posluhy-ukrainskyi-slug"
  }
}
```

**CRITICAL SLUG RULES:**
- Only English symbols allowed (no special characters)
- Max 40 characters per slug
- Use hyphens for word separation
- Match service category exactly
- Keep consistent across locales in meaning

### 2. SEO Structure (All 4 Locales)

**Title Formula:**
- Format: "Service Name | From €[Price] | Key Benefit"
- 50-60 characters maximum
- Include starting price prominently
- Highlight main differentiator

**Description Requirements:**
- 150-160 characters maximum
- Include service type, price range, and key benefit
- Use action words: "Expert", "Professional", "Guaranteed"
- End with clear value proposition

**Keywords Strategy:**
- Primary: Service name + location/language
- Secondary: Problem solved + solution type
- Long-tail: Specific service variations
- Price-related: "affordable", "competitive pricing"
- Quality: "professional", "expert", "guaranteed"

**OG Images:**
- Use contextually relevant images from `/images/images.json`
- Technical services: use tool/professional images
- Installation: use installation-related images
- Maintenance: use maintenance/care images

### 3. Content Structure (All 4 Locales)

#### Hero Section
```json
"hero": {
  "title": "Service Name",
  "subtitle": "Clear value proposition in 1-2 sentences explaining what problem this solves and why choose us",
  "priceFrom": "From €[amount]",
  "features": [
    "Key benefit 1 (warranty/guarantee)",
    "Key benefit 2 (speed/convenience)", 
    "Key benefit 3 (expertise/quality)",
    "Key benefit 4 (comprehensive service)"
  ],
  "image": "/images/contextual-service-image.webp",
  "imageAlt": "Professional [service name] in progress"
}
```

#### Service Details
```json
"serviceDetails": {
  "overview": "2-3 paragraph detailed explanation of the service, what's included, and expected outcomes",
  "process": {
    "title": "Our Process",
    "steps": [
      {
        "step": 1,
        "title": "Assessment/Consultation",
        "description": "What happens in initial step"
      },
      {
        "step": 2, 
        "title": "Preparation/Planning",
        "description": "How we prepare for the work"
      },
      {
        "step": 3,
        "title": "Execution/Implementation", 
        "description": "The actual service delivery"
      },
      {
        "step": 4,
        "title": "Quality Check/Completion",
        "description": "Final verification and handover"
      }
    ]
  }
}
```

#### Pricing Structure
```json
"pricing": {
  "basePrice": "€[amount]",
  "priceNote": "Starting price for standard [service type]",
  "factors": [
    "Factor affecting price 1",
    "Factor affecting price 2",
    "Factor affecting price 3"
  ],
  "included": [
    "What's included in base price 1",
    "What's included in base price 2", 
    "What's included in base price 3"
  ],
  "additionalServices": [
    {
      "name": "Optional service 1",
      "price": "€[amount]",
      "description": "Brief description"
    }
  ]
}
```

#### Why Choose Us
```json
"whyChooseUs": {
  "title": "Why Choose Our [Service Name]",
  "benefits": [
    {
      "icon": "Award",
      "title": "Guaranteed Quality",
      "description": "Specific quality guarantee"
    },
    {
      "icon": "Clock", 
      "title": "Fast Service",
      "description": "Timeframe commitment"
    },
    {
      "icon": "ShieldCheck",
      "title": "Warranty Protection", 
      "description": "Warranty details"
    },
    {
      "icon": "Users",
      "title": "Expert Team",
      "description": "Team expertise"
    }
  ]
}
```

#### Common Issues Addressed
```json
"commonIssues": {
  "title": "Problems We Solve",
  "issues": [
    {
      "problem": "Specific problem description",
      "solution": "How our service solves it",
      "timeframe": "How quickly we resolve it"
    }
  ]
}
```

#### FAQ Section
```json
"faq": {
  "title": "Frequently Asked Questions",
  "items": [
    {
      "question": "How much does [service] cost?",
      "answer": "Detailed pricing explanation with factors"
    },
    {
      "question": "How long does [service] take?",
      "answer": "Realistic timeframe with variables"
    },
    {
      "question": "Do you provide warranty?",
      "answer": "Warranty terms and coverage"
    },
    {
      "question": "What areas do you serve?",
      "answer": "Service area coverage"
    }
  ]
}
```

## Service Categories & Pricing Guidelines

### 1. Repair Services (€80-€200)
**Categories:**
- Window mechanism repair
- Glass replacement  
- Frame repair
- Gasket replacement
- Emergency repairs

**Pricing Structure:**
- Base price: €80-€120
- Complex repairs: €150-€200
- Emergency surcharge: +€30-€50
- Weekend/holiday: +20%

**Content Focus:**
- Problem-solving approach
- Before/after scenarios
- Warranty emphasis
- Speed of service

### 2. Maintenance Services (€60-€150)
**Categories:**
- Regular maintenance
- Seasonal preparation
- Preventive care
- Cleaning services

**Pricing Structure:**
- Single window: €15-€25
- Per visit: €60-€100
- Annual contracts: 15% discount
- Multiple windows: bulk pricing

**Content Focus:**
- Prevention benefits
- Cost savings long-term
- Seasonal relevance
- Maintenance schedules

### 3. Installation Services (€150-€500+)
**Categories:**
- New window installation
- Replacement installation
- Custom installations
- Accessory installation

**Pricing Structure:**
- Standard installation: €150-€250
- Complex installation: €300-€500
- Custom work: Quote-based
- Multiple units: volume discounts

**Content Focus:**
- Professional expertise
- Precision and quality
- Lifetime warranty
- Comprehensive service

### 4. Improvement Services (€100-€300)
**Categories:**
- Insulation improvement
- Energy efficiency upgrades
- Security enhancements
- Smart technology integration

**Pricing Structure:**
- Basic improvements: €100-€150
- Advanced upgrades: €200-€300
- Technology integration: €250-€400
- Consultation: €50 (deductible)

**Content Focus:**
- ROI and savings
- Modern solutions
- Technology benefits
- Long-term value

## Content Writing Guidelines

### Tone & Style
- **Professional confidence**: We are experts in our field
- **Solution-focused**: Every service solves specific problems
- **Transparent pricing**: Clear about costs and value
- **Customer-centric**: Focus on customer benefits and outcomes
- **Technical accuracy**: Use correct terminology without overwhelming

### Service Description Formula

#### Opening Hook
1. **Problem identification**: What issue does this service address?
2. **Solution preview**: How do we solve it uniquely?
3. **Credibility statement**: Why trust us with this service?

#### Service Explanation
1. **What's included**: Comprehensive service breakdown
2. **Process overview**: Step-by-step approach
3. **Quality standards**: What makes our service superior
4. **Outcome expectations**: What customers can expect

#### Value Proposition
1. **Time savings**: How we save customer time
2. **Cost effectiveness**: Value for money explanation
3. **Peace of mind**: Warranty and guarantee details
4. **Expertise advantage**: Why professional service matters

### Pricing Communication Rules

#### Price Transparency
- Always show starting price in hero section
- Explain what base price includes
- List factors that affect final price
- Provide price ranges for different scenarios

#### Value Justification
- Connect price to quality and warranty
- Compare DIY risks vs professional benefits
- Highlight long-term savings and benefits
- Emphasize expertise and proper tools

#### Pricing Psychology
- Use "From €X" format for starting prices
- Bundle services for better value perception
- Offer payment options when relevant
- Create urgency with limited-time offers

## Image Usage for Services

### Service Type Image Mapping

**Repair Services:**
- `/images/adjustment-tools.webp` - Tool-based repairs
- `/images/professional-tools.webp` - Professional repair work
- `/images/glass-unit-replacement.webp` - Glass-related services
- `/images/weather-seals.webp` - Sealing and weatherproofing

**Installation Services:**
- `/images/professional-installation-og.webp` - New installations
- `/images/professional-window-installation-og.webp` - Window installation
- `/images/window-replacement-comparison.webp` - Replacement services

**Maintenance Services:**
- `/images/maintenance-calendar.webp` - Scheduled maintenance
- `/images/window-maintenance-schedule.webp` - Regular upkeep
- `/images/winter-window-care.webp` - Seasonal maintenance

**Technology/Efficiency Services:**
- `/images/smart-technology.webp` - Smart window services
- `/images/energy-efficient-windows-og.webp` - Efficiency upgrades
- `/images/smart-window-technology.webp` - Technology integration

### Image Selection Criteria
1. **Service relevance**: Image must directly relate to service offered
2. **Professional quality**: Show professional work environment
3. **Tool visibility**: Include relevant tools and equipment
4. **Quality impression**: Convey expertise and attention to detail

## Localization Guidelines

### Lithuanian (lt)
- **Service terminology**: Use established Lithuanian trade terms
- **Pricing context**: Reference local market conditions
- **Regulatory mentions**: Include relevant Lithuanian building codes
- **Seasonal relevance**: Emphasize harsh winter conditions
- **Cultural approach**: Emphasize reliability and long-term relationships

### Polish (pl)
- **Professional standards**: Reference European quality standards
- **Technical precision**: Use precise technical vocabulary
- **Value emphasis**: Focus on quality-price ratio
- **Service culture**: Emphasize thoroughness and craftsmanship
- **Regional considerations**: Central European building practices

### Ukrainian (uk)
- **Clear communication**: Detailed explanations of processes
- **Quality assurance**: Emphasize reliability and warranty
- **Practical benefits**: Focus on immediate and long-term benefits
- **Safety emphasis**: Highlight safety and security aspects
- **Support approach**: Emphasize helpful, supportive service

### English (en)
- **International standards**: Reference global best practices
- **Technical accuracy**: Use industry-standard terminology
- **Comprehensive coverage**: Most detailed service descriptions
- **SEO optimization**: Primary locale for search optimization
- **Professional presentation**: Formal but accessible language

## Quality Checklist

### Service Content Quality
- [ ] Clear problem-solution alignment
- [ ] Transparent pricing structure
- [ ] Comprehensive service description
- [ ] Professional process explanation
- [ ] Strong value proposition
- [ ] Warranty and guarantee details

### Conversion Optimization
- [ ] Clear call-to-action placement
- [ ] Multiple contact opportunities
- [ ] Trust signals included
- [ ] Social proof elements
- [ ] Urgency or scarcity elements
- [ ] Easy-to-understand pricing

### Technical Requirements
- [ ] Valid JSON structure
- [ ] All required fields completed
- [ ] Correct image paths
- [ ] Proper slug formatting
- [ ] SEO elements optimized
- [ ] Schema markup ready

### Localization Quality
- [ ] All 4 locales completed
- [ ] Culturally appropriate content
- [ ] Local market pricing
- [ ] Regional service considerations
- [ ] Appropriate formality level

## Service Page Performance Goals

### Conversion Metrics
- **Page engagement**: 3+ minutes average time
- **Scroll depth**: 70%+ scroll to pricing section
- **Contact rate**: 5-8% of visitors contact
- **Quote requests**: 3-5% conversion to quote requests

### SEO Performance
- **Local search ranking**: Top 5 for service + location
- **Long-tail rankings**: Multiple page 1 rankings
- **Featured snippets**: Target FAQ and pricing snippets
- **Local pack inclusion**: Appear in map results

### User Experience
- **Page load speed**: Under 3 seconds
- **Mobile optimization**: Perfect mobile experience
- **Clear navigation**: Easy to find pricing and contact
- **Trust building**: Professional presentation throughout

This comprehensive guide ensures every service page converts visitors into customers while maintaining professional credibility and clear value communication.
