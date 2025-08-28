#!/usr/bin/env node

/**
 * Enhanced Content Translation Script
 * Focuses on natural, culturally-appropriate translations rather than direct translations
 * Emphasizes local language norms and conversational tone
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
const CONTENT_DIRS = {
  services: path.join(__dirname, '../content/collections/services'),
  news: path.join(__dirname, '../content/collections/news')
};
const OUTPUT_DIR = path.join(__dirname, '../content-translation-output');
const LOCALES = ['en', 'lt', 'pl', 'uk'];

// Cultural and linguistic guidelines for each locale
const LOCALE_GUIDELINES = {
  lt: {
    language: 'Lithuanian',
    culturalContext: 'Baltic region, emphasis on quality and reliability, direct but warm communication style',
    linguisticNorms: [
      'Use natural Lithuanian sentence structures, not English word order',
      'Prefer compound words typical in Lithuanian (e.g., "langų remontas" not "langų taisymas")',
      'Use familiar, conversational tone rather than overly formal language',
      'Include cultural references to Lithuanian home ownership and climate concerns',
      'Use active voice and direct communication style preferred in Lithuanian business',
      'Avoid literal translations of English idioms - use Lithuanian equivalents'
    ],
    commonPhrases: {
      'professional service': 'profesionalus aptarnavimas',
      'same day service': 'tos pačios dienos paslauga',
      'quality guarantee': 'kokybės garantija',
      'experienced team': 'patyrusi komanda',
      'affordable prices': 'prieinamos kainos'
    },
    avoidPatterns: [
      'Direct English word order translations',
      'Overly technical jargon without explanation',
      'Formal bureaucratic language',
      'Literal translations of "expert" as "ekspertas" (prefer "specialistas" or "meistras")'
    ]
  },
  pl: {
    language: 'Polish',
    culturalContext: 'Central European, value-conscious consumers, appreciate detailed explanations and warranties',
    linguisticNorms: [
      'Use natural Polish syntax with proper case declensions',
      'Employ conversational tone with professional credibility',
      'Include specific technical details Polish customers expect',
      'Use Polish business communication style - direct but respectful',
      'Incorporate Polish home improvement terminology naturally',
      'Avoid Germanic or English sentence structures'
    ],
    commonPhrases: {
      'professional service': 'profesjonalny serwis',
      'same day service': 'usługa tego samego dnia',
      'quality guarantee': 'gwarancja jakości',
      'experienced team': 'doświadczony zespół',
      'affordable prices': 'przystępne ceny'
    },
    avoidPatterns: [
      'Literal translations from English or German',
      'Overly complex technical terms without context',
      'Informal slang in professional contexts',
      'Direct translations of English marketing phrases'
    ]
  },
  uk: {
    language: 'Ukrainian',
    culturalContext: 'Eastern European, practical approach to home improvement, emphasis on durability and value',
    linguisticNorms: [
      'Use natural Ukrainian word order and grammar structures',
      'Employ warm, trustworthy tone appropriate for service industry',
      'Include practical benefits and long-term value propositions',
      'Use Ukrainian technical terminology correctly',
      'Avoid Russian linguistic influences where possible',
      'Incorporate Ukrainian cultural context for home ownership'
    ],
    commonPhrases: {
      'professional service': 'професійний сервіс',
      'same day service': 'послуга того ж дня',
      'quality guarantee': 'гарантія якості',
      'experienced team': 'досвідчена команда',
      'affordable prices': 'доступні ціни'
    },
    avoidPatterns: [
      'Russian language influences or cognates',
      'Overly formal or bureaucratic language',
      'Direct translations without cultural adaptation',
      'Technical terms without practical context'
    ]
  }
};

/**
 * Generate culturally-appropriate translation
 */
async function generateNaturalTranslation(content, sourceLocale, targetLocale, contentType) {
  const guidelines = LOCALE_GUIDELINES[targetLocale];
  
  if (!guidelines) {
    throw new Error(`No guidelines defined for locale: ${targetLocale}`);
  }

  const systemPrompt = `You are a professional translator and cultural adaptation specialist for ${guidelines.language}. Your task is to create natural, culturally-appropriate translations that sound like they were originally written by a native speaker for the local market.

CRITICAL TRANSLATION PRINCIPLES:
1. **NEVER translate word-for-word** - adapt the meaning naturally
2. **Use natural ${guidelines.language} sentence structures** - not English grammar patterns
3. **Write as a native speaker would** - conversational yet professional
4. **Adapt cultural context** - ${guidelines.culturalContext}
5. **Follow local business communication norms** - appropriate tone and style
6. **Use industry-standard terminology** - but explain technical terms naturally

LINGUISTIC GUIDELINES FOR ${guidelines.language.toUpperCase()}:
${guidelines.linguisticNorms.map(norm => `• ${norm}`).join('\n')}

COMMON NATURAL PHRASES TO USE:
${Object.entries(guidelines.commonPhrases).map(([en, local]) => `• "${en}" → "${local}"`).join('\n')}

AVOID THESE PATTERNS:
${guidelines.avoidPatterns.map(pattern => `• ${pattern}`).join('\n')}

CONTENT TYPE: ${contentType} (adapt tone accordingly)
SOURCE LANGUAGE: ${sourceLocale}
TARGET LANGUAGE: ${guidelines.language}

IMPORTANT: Return ONLY the translated JSON content. Do not include explanations, markdown formatting, or additional text. The translation should sound natural and engaging to local customers while maintaining professional credibility.`;

  const userPrompt = `Translate and culturally adapt this ${contentType} content to natural ${guidelines.language}:

${JSON.stringify(content, null, 2)}

Focus on:
1. Natural ${guidelines.language} expressions and sentence flow
2. Cultural adaptation for local market expectations
3. Conversational yet professional tone
4. Industry terminology that locals would actually use
5. Avoiding direct translation patterns
6. Making it sound like it was originally written for ${guidelines.language} speakers

Return only the adapted JSON structure with natural ${guidelines.language} content.`;

  try {
    const { text } = await generateText({
      model: deepinfra("google/gemini-2.5-pro"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      maxTokens: 6000,
      temperature: 0.4 // Slightly higher for more natural language variation
    });

    return extractJsonFromText(text);
  } catch (error) {
    console.error(`❌ Translation error for ${targetLocale}:`, error.message);
    return null;
  }
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
 * Load content files from directory
 */
async function loadContentFiles(directory, contentType) {
  console.log(`📂 Loading ${contentType} files from ${directory}...`);
  
  const files = await fs.readdir(directory);
  const content = {};
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const itemId = file.replace('.json', '');
      const filePath = path.join(directory, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      content[itemId] = JSON.parse(fileContent);
      console.log(`  ✓ Loaded ${itemId}`);
    }
  }
  
  console.log(`📊 Total ${contentType} files loaded: ${Object.keys(content).length}\n`);
  return content;
}

/**
 * Process content with enhanced natural translations
 */
async function processContentWithNaturalTranslations(contentItems, contentType) {
  console.log(`🌍 Processing ${contentType} with natural translations...\n`);
  
  const improvedContent = {};
  const processedCount = { success: 0, failed: 0 };
  
  for (const [itemId, item] of Object.entries(contentItems)) {
    console.log(`Processing ${itemId}...`);
    improvedContent[itemId] = { ...item };
    
    // Use English as the source for translation
    const sourceContent = item.content?.en;
    if (!sourceContent) {
      console.log(`  ⚠️  No English content found for ${itemId}, skipping...`);
      continue;
    }
    
    for (const targetLocale of LOCALES.slice(1)) { // Skip 'en'
      console.log(`  🔄 Creating natural ${targetLocale} translation...`);
      
      const naturalTranslation = await generateNaturalTranslation(
        sourceContent,
        'en',
        targetLocale,
        contentType
      );
      
      if (naturalTranslation) {
        try {
          const parsedContent = JSON.parse(naturalTranslation);
          improvedContent[itemId].content[targetLocale] = parsedContent;
          console.log(`  ✅ ${targetLocale} natural translation completed`);
          processedCount.success++;
        } catch (parseError) {
          console.log(`  ⚠️  ${targetLocale} translation failed (parse error)`);
          console.log(`     Raw response: ${naturalTranslation.substring(0, 200)}...`);
          processedCount.failed++;
          
          // Keep original content if parsing fails
          improvedContent[itemId].content[targetLocale] = item.content?.[targetLocale] || {};
        }
      } else {
        console.log(`  ❌ ${targetLocale} translation failed`);
        processedCount.failed++;
        
        // Keep original content if AI generation fails
        improvedContent[itemId].content[targetLocale] = item.content?.[targetLocale] || {};
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log(`  ✓ ${itemId} processing complete\n`);
  }
  
  console.log(`📊 ${contentType} Processing Summary:`);
  console.log(`  ✅ Successful translations: ${processedCount.success}`);
  console.log(`  ❌ Failed translations: ${processedCount.failed}\n`);
  
  return improvedContent;
}

/**
 * Save enhanced content to files
 */
async function saveEnhancedContent(content, contentType) {
  console.log(`💾 Saving enhanced ${contentType} content...`);
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Save enhanced content files
  for (const [itemId, item] of Object.entries(content)) {
    await fs.writeFile(
      path.join(OUTPUT_DIR, `${contentType}-${itemId}-enhanced.json`),
      JSON.stringify(item, null, 2)
    );
  }
  
  // Save summary report
  const summary = `# Enhanced Natural Translation Report - ${contentType.toUpperCase()}
Generated: ${new Date().toLocaleString()}

## Translation Approach

### Key Improvements
- **Natural Language Flow**: Translations follow native language patterns, not English structures
- **Cultural Adaptation**: Content adapted for local market expectations and communication styles
- **Conversational Tone**: Professional yet approachable language that builds trust
- **Local Terminology**: Industry terms that locals actually use, not direct translations
- **Context Awareness**: Cultural and practical context appropriate for each market

### Locale-Specific Enhancements

#### Lithuanian (LT)
- Natural Lithuanian sentence structures and compound words
- Warm but direct communication style typical in Baltic business culture
- Climate and home ownership context relevant to Lithuanian market
- Professional terminology without overly formal bureaucratic language

#### Polish (PL)
- Proper Polish syntax with correct case declensions
- Detailed explanations and warranty information Polish customers expect
- Central European business communication norms
- Technical details presented in accessible way

#### Ukrainian (UK)
- Natural Ukrainian grammar and word order
- Practical, value-focused messaging appropriate for market
- Warm, trustworthy tone for service industry
- Ukrainian cultural context for home improvement decisions

## Files Generated
${Object.keys(content).map(itemId => `- ${contentType}-${itemId}-enhanced.json`).join('\n')}

## Next Steps
1. Review enhanced translations for accuracy and tone
2. Test with native speakers for naturalness
3. Apply approved translations to production content
4. Monitor user engagement and feedback

## Quality Assurance
- All translations prioritize natural language over literal accuracy
- Cultural context adapted for local market expectations
- Professional tone maintained while being conversational
- Technical terms explained in accessible language
`;

  await fs.writeFile(
    path.join(OUTPUT_DIR, `${contentType}-natural-translation-report.md`),
    summary
  );
  
  console.log(`✅ Enhanced ${contentType} content saved to ${OUTPUT_DIR}/`);
  console.log(`📄 Files created:`);
  console.log(`  - ${Object.keys(content).length} enhanced ${contentType} files`);
  console.log(`  - ${contentType}-natural-translation-report.md`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Enhanced Natural Translation Process\n');
  console.log('=' .repeat(60));
  console.log('FOCUS: Natural, culturally-appropriate translations');
  console.log('AVOID: Direct word-for-word translations');
  console.log('GOAL: Content that sounds native to each language');
  console.log('=' .repeat(60) + '\n');
  
  try {
    // Process services content
    console.log('📋 PROCESSING SERVICES CONTENT\n');
    const servicesContent = await loadContentFiles(CONTENT_DIRS.services, 'services');
    const enhancedServices = await processContentWithNaturalTranslations(servicesContent, 'services');
    await saveEnhancedContent(enhancedServices, 'services');
    
    console.log('\n' + '=' .repeat(60) + '\n');
    
    // Process news content
    console.log('📰 PROCESSING NEWS CONTENT\n');
    const newsContent = await loadContentFiles(CONTENT_DIRS.news, 'news');
    const enhancedNews = await processContentWithNaturalTranslations(newsContent, 'news');
    await saveEnhancedContent(enhancedNews, 'news');
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Enhanced Natural Translation Process Completed!');
    console.log('\n📊 Summary:');
    console.log(`   Services processed: ${Object.keys(enhancedServices).length}`);
    console.log(`   News articles processed: ${Object.keys(enhancedNews).length}`);
    console.log(`   Target locales: ${LOCALES.slice(1).join(', ')}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review enhanced translations for naturalness and accuracy');
    console.log('2. Test with native speakers from each target market');
    console.log('3. Apply approved translations using apply-enhanced-content.js');
    console.log('4. Monitor user engagement and conversion improvements');
    
  } catch (error) {
    console.error('❌ Enhanced translation process failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, generateNaturalTranslation, loadContentFiles, processContentWithNaturalTranslations };
