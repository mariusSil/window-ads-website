#!/usr/bin/env node

/**
 * Service Content Analysis Script
 * Analyzes and improves service content consistency across all translations
 * Uses DeepInfra AI to ensure human-like content with proper internal linking
 */

import { createDeepInfra } from "@ai-sdk/deepinfra";
import { generateText } from "ai";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DeepInfra client
const deepinfra = createDeepInfra({
  apiKey: process.env.DEEPINFRA_API_KEY || "YXhfBfvoSFTaDGdTG8GEk7fr45UnNI53",
});

// Configuration
const SERVICES_DIR = path.join(__dirname, '../content/collections/services');
const OUTPUT_DIR = path.join(__dirname, '../content-analysis-output');
const LOCALES = ['en', 'lt', 'pl', 'uk'];

// Service linking keywords for internal linking
const SERVICE_KEYWORDS = {
  'glass-replacement': ['glass', 'glazing', 'window glass', 'broken glass', 'cracked glass'],
  'frame-repair': ['frame', 'window frame', 'frame damage', 'frame restoration'],
  'gasket-replacement': ['gasket', 'seal', 'weatherstrip', 'insulation'],
  'emergency-repair': ['emergency', 'urgent', '24/7', 'immediate'],
  'installation-service': ['installation', 'new windows', 'window fitting', 'mounting'],
  'insulation-improvement': ['insulation', 'energy efficiency', 'thermal', 'heat loss'],
  'maintenance-service': ['maintenance', 'cleaning', 'servicing', 'upkeep'],
  'mechanism-replacement': ['mechanism', 'hardware', 'handles', 'locks'],
  'window-adjustment': ['adjustment', 'alignment', 'fitting', 'calibration'],
  'window-repair': ['repair', 'fix', 'restoration', 'window problems']
};

/**
 * Load all service files
 */
async function loadServices() {
  console.log('📂 Loading service files...');
  
  const files = await fs.readdir(SERVICES_DIR);
  const services = {};
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const serviceId = file.replace('.json', '');
      const filePath = path.join(SERVICES_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      services[serviceId] = JSON.parse(content);
      console.log(`  ✓ Loaded ${serviceId}`);
    }
  }
  
  console.log(`📊 Total services loaded: ${Object.keys(services).length}\n`);
  return services;
}

/**
 * Analyze content consistency across locales
 */
async function analyzeContentConsistency(services) {
  console.log('🔍 Analyzing content consistency...\n');
  
  const analysis = {
    inconsistencies: [],
    missingTranslations: [],
    contentQualityIssues: [],
    recommendations: []
  };
  
  for (const [serviceId, service] of Object.entries(services)) {
    console.log(`Analyzing ${serviceId}...`);
    
    // Check for missing translations
    for (const locale of LOCALES) {
      if (!service.content[locale]) {
        analysis.missingTranslations.push({
          service: serviceId,
          locale,
          issue: 'Missing entire locale content'
        });
      } else {
        // Check for missing sections within locale
        const enSections = Object.keys(service.content.en || {});
        const localeSections = Object.keys(service.content[locale] || {});
        
        for (const section of enSections) {
          if (!localeSections.includes(section)) {
            analysis.missingTranslations.push({
              service: serviceId,
              locale,
              section,
              issue: `Missing section: ${section}`
            });
          }
        }
      }
    }
    
    // Analyze content structure consistency
    const enContent = service.content.en;
    if (enContent) {
      for (const locale of LOCALES.slice(1)) { // Skip 'en'
        const localeContent = service.content[locale];
        if (localeContent) {
          // Check hero section consistency
          if (enContent.hero && localeContent.hero) {
            const enFeatures = enContent.hero.features?.length || 0;
            const localeFeatures = localeContent.hero.features?.length || 0;
            
            if (enFeatures !== localeFeatures) {
              analysis.inconsistencies.push({
                service: serviceId,
                locale,
                section: 'hero.features',
                issue: `Feature count mismatch: EN(${enFeatures}) vs ${locale.toUpperCase()}(${localeFeatures})`
              });
            }
          }
          
          // Check service details consistency
          if (enContent.serviceDetails?.services && localeContent.serviceDetails?.services) {
            const enServices = enContent.serviceDetails.services.length;
            const localeServices = localeContent.serviceDetails.services.length;
            
            if (enServices !== localeServices) {
              analysis.inconsistencies.push({
                service: serviceId,
                locale,
                section: 'serviceDetails.services',
                issue: `Service count mismatch: EN(${enServices}) vs ${locale.toUpperCase()}(${localeServices})`
              });
            }
          }
        }
      }
    }
  }
  
  return analysis;
}

/**
 * Extract JSON from AI response text
 */
function extractJsonFromText(text) {
  // Try to find JSON block in the response
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
  // Try to find JSON object directly
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.substring(jsonStart, jsonEnd + 1);
  }
  
  // Return original text if no JSON structure found
  return text;
}

/**
 * Generate AI-powered content improvements
 */
async function generateContentImprovement(serviceId, content, locale, otherServices) {
  const systemPrompt = `You are a professional translator and cultural adaptation specialist for ${locale === 'en' ? 'English' : locale === 'lt' ? 'Lithuanian' : locale === 'pl' ? 'Polish' : 'Ukrainian'}. Your task is to create natural, culturally-appropriate content that sounds like it was originally written by a native speaker for the local market.

CRITICAL TRANSLATION PRINCIPLES:
1. **NEVER translate word-for-word** - adapt the meaning naturally to sound native
2. **Use natural ${locale === 'en' ? 'English' : locale === 'lt' ? 'Lithuanian' : locale === 'pl' ? 'Polish' : 'Ukrainian'} sentence structures** - not English grammar patterns
3. **Write as a native speaker would** - conversational yet professional tone
4. **Adapt cultural context** for local market expectations and communication styles
5. **Use industry terminology that locals actually use** - not direct translations
6. **Follow local business communication norms** - appropriate tone and style

LINGUISTIC GUIDELINES FOR ${locale.toUpperCase()}:
${locale === 'lt' ? `
• Use natural Lithuanian sentence structures, not English word order
• Prefer compound words typical in Lithuanian (e.g., "langų remontas" not "langų taisymas")
• Use familiar, conversational tone rather than overly formal language
• Include cultural references to Lithuanian home ownership and climate concerns
• Use active voice and direct communication style preferred in Lithuanian business
• Avoid literal translations of English idioms - use Lithuanian equivalents` : 
locale === 'pl' ? `
• Use natural Polish syntax with proper case declensions
• Employ conversational tone with professional credibility
• Include specific technical details Polish customers expect
• Use Polish business communication style - direct but respectful
• Incorporate Polish home improvement terminology naturally
• Avoid Germanic or English sentence structures` :
locale === 'uk' ? `
• Use natural Ukrainian word order and grammar structures
• Employ warm, trustworthy tone appropriate for service industry
• Include practical benefits and long-term value propositions
• Use Ukrainian technical terminology correctly
• Avoid Russian linguistic influences where possible
• Incorporate Ukrainian cultural context for home ownership` : 
'• Write in clear, professional English with engaging, conversational tone'}

AVOID THESE PATTERNS:
${locale === 'lt' ? `
• Direct English word order translations
• Overly technical jargon without explanation
• Formal bureaucratic language
• Literal translations of "expert" as "ekspertas" (prefer "specialistas" or "meistras")` :
locale === 'pl' ? `
• Literal translations from English or German
• Overly complex technical terms without context
• Informal slang in professional contexts
• Direct translations of English marketing phrases` :
locale === 'uk' ? `
• Russian language influences or cognates
• Overly formal or bureaucratic language
• Direct translations without cultural adaptation
• Technical terms without practical context` :
'• Overly technical jargon without explanation'}

Available services for internal linking: ${Object.keys(otherServices).join(', ')}

Service keywords for linking:
${Object.entries(SERVICE_KEYWORDS).map(([service, keywords]) => 
  `${service}: ${keywords.join(', ')}`
).join('\n')}

IMPORTANT: Return ONLY valid JSON content. The content should sound natural and engaging to local customers while maintaining professional credibility. Make it sound like it was originally written for ${locale === 'en' ? 'English' : locale === 'lt' ? 'Lithuanian' : locale === 'pl' ? 'Polish' : 'Ukrainian'} speakers, not translated.`;

  const userPrompt = `Improve this ${serviceId} service content for ${locale} locale:

${JSON.stringify(content, null, 2)}

Focus on:
1. Making the content more engaging and human-like
2. Adding natural internal links to related services
3. Improving readability and flow
4. Maintaining all existing structure and data
5. Ensuring consistency with professional service standards

Return ONLY the improved JSON content, no explanations or markdown formatting.`;

  try {
    const { text } = await generateText({
      model: deepinfra("google/gemini-2.5-pro"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      maxTokens: 4000,
      temperature: 0.3
    });

    return extractJsonFromText(text);
  } catch (error) {
    console.error(`❌ Error generating content for ${serviceId} (${locale}):`, error.message);
    return null;
  }
}

/**
 * Process all services with AI improvements
 */
async function processServicesWithAI(services) {
  console.log('🤖 Processing services with AI improvements...\n');
  
  const improvedServices = {};
  const processedCount = { success: 0, failed: 0 };
  
  for (const [serviceId, service] of Object.entries(services)) {
    console.log(`Processing ${serviceId}...`);
    improvedServices[serviceId] = { ...service };
    
    for (const locale of LOCALES) {
      if (service.content[locale]) {
        console.log(`  🔄 Improving ${locale} content...`);
        
        const improved = await generateContentImprovement(
          serviceId, 
          service.content[locale], 
          locale, 
          services
        );
        
        if (improved) {
          try {
            // Try to parse the improved content
            const parsedContent = JSON.parse(improved);
            improvedServices[serviceId].content[locale] = parsedContent;
            console.log(`  ✅ ${locale} content improved`);
            processedCount.success++;
          } catch (parseError) {
            console.log(`  ⚠️  ${locale} content improvement failed (parse error)`);
            console.log(`     Raw response: ${improved.substring(0, 200)}...`);
            processedCount.failed++;
            
            // Keep original content if parsing fails
            improvedServices[serviceId].content[locale] = service.content[locale];
          }
        } else {
          console.log(`  ❌ ${locale} content improvement failed`);
          processedCount.failed++;
          
          // Keep original content if AI generation fails
          improvedServices[serviceId].content[locale] = service.content[locale];
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`  ✓ ${serviceId} processing complete\n`);
  }
  
  console.log(`📊 Processing Summary:`);
  console.log(`  ✅ Successful improvements: ${processedCount.success}`);
  console.log(`  ❌ Failed improvements: ${processedCount.failed}\n`);
  
  return improvedServices;
}

/**
 * Generate analysis report
 */
async function generateAnalysisReport(analysis, services) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalServices: Object.keys(services).length,
      totalLocales: LOCALES.length,
      inconsistencies: analysis.inconsistencies.length,
      missingTranslations: analysis.missingTranslations.length,
      contentQualityIssues: analysis.contentQualityIssues.length
    },
    details: analysis,
    recommendations: [
      'Fix missing translations to ensure complete locale coverage',
      'Standardize content structure across all locales',
      'Implement consistent internal linking strategy',
      'Review and improve content quality for better user engagement',
      'Add more specific calls-to-action in service descriptions'
    ]
  };
  
  return report;
}

/**
 * Save results to files
 */
async function saveResults(analysis, improvedServices, report) {
  console.log('💾 Saving results...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Save analysis report
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'content-analysis-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Save improved services
  for (const [serviceId, service] of Object.entries(improvedServices)) {
    await fs.writeFile(
      path.join(OUTPUT_DIR, `${serviceId}-improved.json`),
      JSON.stringify(service, null, 2)
    );
  }
  
  // Save human-readable summary
  const summary = `# Service Content Analysis Report
Generated: ${new Date().toLocaleString()}

## Summary
- Total Services: ${Object.keys(improvedServices).length}
- Total Locales: ${LOCALES.length}
- Inconsistencies Found: ${analysis.inconsistencies.length}
- Missing Translations: ${analysis.missingTranslations.length}

## Key Issues Found

### Missing Translations
${analysis.missingTranslations.map(item => 
  `- ${item.service} (${item.locale}): ${item.issue}`
).join('\n')}

### Content Inconsistencies
${analysis.inconsistencies.map(item => 
  `- ${item.service} (${item.locale}): ${item.issue}`
).join('\n')}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Next Steps
1. Review improved content files in content-analysis-output/
2. Apply approved changes to original service files
3. Test all internal links and content flow
4. Monitor user engagement metrics after implementation
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'analysis-summary.md'), summary);
  
  console.log(`✅ Results saved to ${OUTPUT_DIR}/`);
  console.log(`📄 Files created:`);
  console.log(`  - content-analysis-report.json`);
  console.log(`  - analysis-summary.md`);
  console.log(`  - ${Object.keys(improvedServices).length} improved service files`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Service Content Analysis\n');
  console.log('=' .repeat(50));
  
  try {
    // Load all services
    const services = await loadServices();
    
    // Analyze content consistency
    const analysis = await analyzeContentConsistency(services);
    
    // Process services with AI improvements
    const improvedServices = await processServicesWithAI(services);
    
    // Generate analysis report
    const report = await generateAnalysisReport(analysis, services);
    
    // Save all results
    await saveResults(analysis, improvedServices, report);
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 Content analysis completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the analysis report and improved content');
    console.log('2. Test the improved content in a staging environment');
    console.log('3. Apply approved changes to production');
    console.log('4. Monitor user engagement and SEO performance');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, loadServices, analyzeContentConsistency, generateContentImprovement };
