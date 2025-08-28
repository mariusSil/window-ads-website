#!/usr/bin/env node

/**
 * News Content Analysis Script
 * Analyzes and improves news article content consistency across all translations
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
const NEWS_DIR = path.join(__dirname, '../content/collections/news');
const OUTPUT_DIR = path.join(__dirname, '../content-analysis-output');
const LOCALES = ['en', 'lt', 'pl', 'uk'];

// News linking keywords for internal linking
const NEWS_KEYWORDS = {
  'energy-efficient-windows': ['energy efficiency', 'heating costs', 'thermal performance', 'insulation', 'U-value'],
  'professional-window-installation': ['installation', 'professional fitting', 'window replacement', 'mounting'],
  'smart-window-technology': ['smart windows', 'automation', 'IoT', 'technology', 'smart home'],
  'window-adjustment-frequency': ['adjustment', 'maintenance', 'calibration', 'alignment'],
  'window-maintenance-schedule': ['maintenance', 'cleaning', 'care', 'upkeep', 'schedule'],
  'window-replacement-vs-repair': ['replacement', 'repair', 'renovation', 'upgrade'],
  'window-security-safety': ['security', 'safety', 'protection', 'break-in prevention'],
  'winter-maintenance-tips': ['winter care', 'cold weather', 'seasonal maintenance'],
  'winter-window-care': ['winter preparation', 'cold protection', 'weatherproofing']
};

// Service keywords for cross-linking to services
const SERVICE_KEYWORDS = {
  'glass-replacement': ['glass', 'glazing', 'window glass', 'broken glass'],
  'frame-repair': ['frame', 'window frame', 'frame damage'],
  'emergency-repair': ['emergency', 'urgent', '24/7'],
  'installation-service': ['installation', 'new windows', 'fitting'],
  'maintenance-service': ['maintenance', 'cleaning', 'servicing']
};

/**
 * Load all news articles
 */
async function loadNewsArticles() {
  console.log('📂 Loading news articles...');
  
  const files = await fs.readdir(NEWS_DIR);
  const articles = {};
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const articleId = file.replace('.json', '');
      const filePath = path.join(NEWS_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      articles[articleId] = JSON.parse(content);
      console.log(`  ✓ Loaded ${articleId}`);
    }
  }
  
  console.log(`📊 Total articles loaded: ${Object.keys(articles).length}\n`);
  return articles;
}

/**
 * Analyze content consistency across locales
 */
async function analyzeContentConsistency(articles) {
  console.log('🔍 Analyzing content consistency...\n');
  
  const analysis = {
    inconsistencies: [],
    missingTranslations: [],
    contentQualityIssues: [],
    recommendations: [],
    statistics: {
      totalArticles: Object.keys(articles).length,
      totalLocales: LOCALES.length,
      averageContentLength: {},
      averageReadingTime: 0,
      categoriesFound: new Set(),
      authorsFound: new Set()
    }
  };
  
  let totalReadingTime = 0;
  
  for (const [articleId, article] of Object.entries(articles)) {
    console.log(`Analyzing ${articleId}...`);
    
    // Collect statistics
    if (article.readingTime) {
      totalReadingTime += article.readingTime;
    }
    if (article.category) {
      analysis.statistics.categoriesFound.add(article.category);
    }
    if (article.author) {
      analysis.statistics.authorsFound.add(article.author);
    }
    
    // Check for missing translations
    for (const locale of LOCALES) {
      if (!article.content || !article.content[locale]) {
        analysis.missingTranslations.push({
          article: articleId,
          locale,
          issue: 'Missing entire locale content'
        });
      } else {
        // Check for missing sections within locale
        const enContent = article.content.en;
        const localeContent = article.content[locale];
        
        if (enContent && localeContent) {
          // Check for missing sections
          if (enContent.sections && !localeContent.sections) {
            analysis.missingTranslations.push({
              article: articleId,
              locale,
              section: 'sections',
              issue: 'Missing article sections'
            });
          } else if (enContent.sections && localeContent.sections) {
            const enSectionCount = enContent.sections.length;
            const localeSectionCount = localeContent.sections.length;
            
            if (enSectionCount !== localeSectionCount) {
              analysis.inconsistencies.push({
                article: articleId,
                locale,
                section: 'sections',
                issue: `Section count mismatch: EN(${enSectionCount}) vs ${locale.toUpperCase()}(${localeSectionCount})`
              });
            }
          }
        }
        
        // Analyze content length
        const contentStr = JSON.stringify(article.content[locale]);
        if (!analysis.statistics.averageContentLength[locale]) {
          analysis.statistics.averageContentLength[locale] = [];
        }
        analysis.statistics.averageContentLength[locale].push(contentStr.length);
      }
      
      // Check SEO data consistency
      if (!article.seo || !article.seo[locale]) {
        analysis.missingTranslations.push({
          article: articleId,
          locale,
          issue: 'Missing SEO data'
        });
      }
    }
    
    // Content quality checks
    const enContent = article.content?.en;
    if (enContent) {
      // Check for very short excerpts
      if (enContent.excerpt && enContent.excerpt.length < 100) {
        analysis.contentQualityIssues.push({
          article: articleId,
          locale: 'en',
          issue: 'Article excerpt too short (< 100 chars)',
          value: enContent.excerpt
        });
      }
      
      // Check for missing featured image
      if (!enContent.featuredImage) {
        analysis.contentQualityIssues.push({
          article: articleId,
          locale: 'en',
          issue: 'Missing featured image'
        });
      }
      
      // Check for missing introduction
      if (!enContent.introduction) {
        analysis.contentQualityIssues.push({
          article: articleId,
          locale: 'en',
          issue: 'Missing article introduction'
        });
      }
      
      // Check for articles with no sections
      if (!enContent.sections || enContent.sections.length === 0) {
        analysis.contentQualityIssues.push({
          article: articleId,
          locale: 'en',
          issue: 'Article has no content sections'
        });
      }
    }
    
    // Check for missing metadata
    if (!article.publishDate) {
      analysis.contentQualityIssues.push({
        article: articleId,
        issue: 'Missing publish date'
      });
    }
    
    if (!article.readingTime) {
      analysis.contentQualityIssues.push({
        article: articleId,
        issue: 'Missing reading time estimate'
      });
    }
    
    if (!article.category) {
      analysis.contentQualityIssues.push({
        article: articleId,
        issue: 'Missing category classification'
      });
    }
  }
  
  // Calculate statistics
  analysis.statistics.averageReadingTime = Math.round(totalReadingTime / Object.keys(articles).length);
  analysis.statistics.categoriesFound = Array.from(analysis.statistics.categoriesFound);
  analysis.statistics.authorsFound = Array.from(analysis.statistics.authorsFound);
  
  // Calculate average content lengths
  for (const locale of LOCALES) {
    if (analysis.statistics.averageContentLength[locale]) {
      const lengths = analysis.statistics.averageContentLength[locale];
      analysis.statistics.averageContentLength[locale] = {
        average: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length),
        min: Math.min(...lengths),
        max: Math.max(...lengths),
        count: lengths.length
      };
    }
  }
  
  // Generate recommendations
  if (analysis.missingTranslations.length > 0) {
    analysis.recommendations.push('Fix missing translations to ensure complete locale coverage');
  }
  if (analysis.inconsistencies.length > 0) {
    analysis.recommendations.push('Standardize article structure across all locales');
  }
  if (analysis.contentQualityIssues.length > 0) {
    analysis.recommendations.push('Address content quality issues for better reader engagement');
  }
  
  analysis.recommendations.push('Implement consistent internal linking between articles and services');
  analysis.recommendations.push('Add more engaging calls-to-action in article content');
  analysis.recommendations.push('Ensure all articles have complete metadata and SEO optimization');
  analysis.recommendations.push('Consider adding related articles suggestions');
  
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
async function generateContentImprovement(articleId, content, locale, otherArticles) {
  const systemPrompt = `You are a professional translator and cultural adaptation specialist for ${locale === 'en' ? 'English' : locale === 'lt' ? 'Lithuanian' : locale === 'pl' ? 'Polish' : 'Ukrainian'}. Your task is to create natural, culturally-appropriate article content that sounds like it was originally written by a native speaker for the local market.

CRITICAL TRANSLATION PRINCIPLES:
1. **NEVER translate word-for-word** - adapt the meaning naturally to sound native
2. **Use natural ${locale === 'en' ? 'English' : locale === 'lt' ? 'Lithuanian' : locale === 'pl' ? 'Polish' : 'Ukrainian'} sentence structures** - not English grammar patterns
3. **Write as a native speaker would** - engaging, informative tone that builds trust
4. **Adapt cultural context** for local market expectations and communication styles
5. **Use terminology that locals actually use** - not direct translations
6. **Follow local journalism and content norms** - appropriate tone and style

LINGUISTIC GUIDELINES FOR ${locale.toUpperCase()}:
${locale === 'lt' ? `
• Use natural Lithuanian sentence structures, not English word order
• Prefer compound words typical in Lithuanian journalism
• Use engaging, informative tone while maintaining Lithuanian directness
• Include cultural references to Lithuanian climate and home ownership patterns
• Use active voice and clear communication style preferred in Lithuanian media
• Avoid literal translations of English technical terms - use Lithuanian equivalents` : 
locale === 'pl' ? `
• Use natural Polish syntax with proper case declensions
• Employ engaging tone with professional credibility typical in Polish media
• Include specific details and explanations Polish readers expect
• Use Polish journalism style - informative but accessible
• Incorporate Polish home improvement terminology naturally
• Avoid Germanic or English sentence structures` :
locale === 'uk' ? `
• Use natural Ukrainian word order and grammar structures
• Employ warm, informative tone appropriate for Ukrainian readers
• Include practical benefits and actionable advice Ukrainian homeowners value
• Use Ukrainian technical terminology correctly
• Avoid Russian linguistic influences where possible
• Incorporate Ukrainian cultural context for home improvement decisions` : 
'• Write in clear, engaging English with informative, trustworthy tone'}

AVOID THESE PATTERNS:
${locale === 'lt' ? `
• Direct English word order translations
• Overly technical jargon without Lithuanian explanations
• Formal academic language - prefer accessible journalism style
• Literal translations of English home improvement terms` :
locale === 'pl' ? `
• Literal translations from English or German
• Overly complex technical terms without Polish context
• Informal blog style - maintain professional journalism standards
• Direct translations of English article structures` :
locale === 'uk' ? `
• Russian language influences or cognates
• Overly formal or academic language
• Direct translations without Ukrainian cultural adaptation
• Technical terms without practical Ukrainian context` :
'• Overly technical jargon without clear explanations'}

Available articles for internal linking: ${Object.keys(otherArticles).join(', ')}

News keywords for linking:
${Object.entries(NEWS_KEYWORDS).map(([article, keywords]) => 
  `${article}: ${keywords.join(', ')}`
).join('\n')}

Service keywords for cross-linking:
${Object.entries(SERVICE_KEYWORDS).map(([service, keywords]) => 
  `${service}: ${keywords.join(', ')}`
).join('\n')}

IMPORTANT: Return ONLY valid JSON content. The article should sound natural and engaging to local readers while maintaining professional credibility. Make it sound like it was originally written for ${locale === 'en' ? 'English' : locale === 'lt' ? 'Lithuanian' : locale === 'pl' ? 'Polish' : 'Ukrainian'} speakers, not translated.`;

  const userPrompt = `Improve this ${articleId} article content for ${locale} locale:

${JSON.stringify(content, null, 2)}

Focus on:
1. Making the content more engaging and informative
2. Adding natural internal links to related articles and services
3. Improving readability and flow
4. Maintaining all existing structure and data
5. Ensuring consistency with professional journalism standards
6. Adding actionable tips and insights for readers

Return ONLY the improved JSON content, no explanations or markdown formatting.`;

  try {
    const { text } = await generateText({
      model: deepinfra("google/gemini-2.5-pro"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      maxTokens: 6000,
      temperature: 0.3
    });

    return extractJsonFromText(text);
  } catch (error) {
    console.error(`❌ Error generating content for ${articleId} (${locale}):`, error.message);
    return null;
  }
}

/**
 * Process all articles with AI improvements
 */
async function processArticlesWithAI(articles) {
  console.log('🤖 Processing articles with AI improvements...\n');
  
  const improvedArticles = {};
  const processedCount = { success: 0, failed: 0 };
  
  for (const [articleId, article] of Object.entries(articles)) {
    console.log(`Processing ${articleId}...`);
    improvedArticles[articleId] = { ...article };
    
    for (const locale of LOCALES) {
      if (article.content && article.content[locale]) {
        console.log(`  🔄 Improving ${locale} content...`);
        
        const improved = await generateContentImprovement(
          articleId, 
          article.content[locale], 
          locale, 
          articles
        );
        
        if (improved) {
          try {
            // Try to parse the improved content
            const parsedContent = JSON.parse(improved);
            improvedArticles[articleId].content[locale] = parsedContent;
            console.log(`  ✅ ${locale} content improved`);
            processedCount.success++;
          } catch (parseError) {
            console.log(`  ⚠️  ${locale} content improvement failed (parse error)`);
            console.log(`     Raw response: ${improved.substring(0, 200)}...`);
            processedCount.failed++;
            
            // Keep original content if parsing fails
            improvedArticles[articleId].content[locale] = article.content[locale];
          }
        } else {
          console.log(`  ❌ ${locale} content improvement failed`);
          processedCount.failed++;
          
          // Keep original content if AI generation fails
          improvedArticles[articleId].content[locale] = article.content[locale];
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log(`  ✓ ${articleId} processing complete\n`);
  }
  
  console.log(`📊 Processing Summary:`);
  console.log(`  ✅ Successful improvements: ${processedCount.success}`);
  console.log(`  ❌ Failed improvements: ${processedCount.failed}\n`);
  
  return improvedArticles;
}

/**
 * Generate analysis report
 */
async function generateAnalysisReport(analysis, articles) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalArticles: Object.keys(articles).length,
      totalLocales: LOCALES.length,
      inconsistencies: analysis.inconsistencies.length,
      missingTranslations: analysis.missingTranslations.length,
      contentQualityIssues: analysis.contentQualityIssues.length,
      averageReadingTime: analysis.statistics.averageReadingTime,
      categories: analysis.statistics.categoriesFound,
      authors: analysis.statistics.authorsFound
    },
    statistics: analysis.statistics,
    details: analysis,
    articleBreakdown: {}
  };
  
  // Generate per-article breakdown
  for (const [articleId, article] of Object.entries(articles)) {
    const articleIssues = {
      missingTranslations: analysis.missingTranslations.filter(item => item.article === articleId),
      inconsistencies: analysis.inconsistencies.filter(item => item.article === articleId),
      qualityIssues: analysis.contentQualityIssues.filter(item => item.article === articleId)
    };
    
    const completeness = {};
    for (const locale of LOCALES) {
      const content = article.content?.[locale];
      const seo = article.seo?.[locale];
      completeness[locale] = {
        hasContent: !!content,
        hasSEO: !!seo,
        hasTitle: !!(content?.title),
        hasExcerpt: !!(content?.excerpt),
        hasIntroduction: !!(content?.introduction),
        hasSections: !!(content?.sections && content.sections.length > 0),
        sectionCount: content?.sections?.length || 0
      };
    }
    
    report.articleBreakdown[articleId] = {
      metadata: {
        publishDate: article.publishDate,
        author: article.author,
        category: article.category,
        readingTime: article.readingTime,
        featured: article.featured
      },
      issues: articleIssues,
      completeness,
      totalIssues: articleIssues.missingTranslations.length + 
                   articleIssues.inconsistencies.length + 
                   articleIssues.qualityIssues.length
    };
  }
  
  return report;
}

/**
 * Save results to files
 */
async function saveResults(analysis, improvedArticles, report) {
  console.log('💾 Saving results...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Save analysis report
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'news-analysis-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Save improved articles
  for (const [articleId, article] of Object.entries(improvedArticles)) {
    await fs.writeFile(
      path.join(OUTPUT_DIR, `news-${articleId}-improved.json`),
      JSON.stringify(article, null, 2)
    );
  }
  
  // Save human-readable summary
  const summary = `# News Content Analysis Report
Generated: ${new Date().toLocaleString()}

## Summary
- **Total Articles**: ${Object.keys(improvedArticles).length}
- **Total Locales**: ${LOCALES.length}
- **Inconsistencies Found**: ${analysis.inconsistencies.length}
- **Missing Translations**: ${analysis.missingTranslations.length}
- **Content Quality Issues**: ${analysis.contentQualityIssues.length}
- **Average Reading Time**: ${analysis.statistics.averageReadingTime} minutes
- **Categories**: ${analysis.statistics.categoriesFound.join(', ')}

## Content Statistics

### Average Content Length by Locale
${LOCALES.map(locale => {
  const stats = analysis.statistics.averageContentLength[locale];
  if (stats) {
    return `- **${locale.toUpperCase()}**: ${stats.average} chars (min: ${stats.min}, max: ${stats.max})`;
  }
  return `- **${locale.toUpperCase()}**: No data`;
}).join('\n')}

## Issues by Article

${Object.entries(report.articleBreakdown)
  .sort((a, b) => b[1].totalIssues - a[1].totalIssues)
  .map(([articleId, breakdown]) => {
    const issues = breakdown.issues;
    let articleReport = `### ${articleId} (${breakdown.totalIssues} issues)\n`;
    articleReport += `**Metadata**: ${breakdown.metadata.category} | ${breakdown.metadata.readingTime}min | ${breakdown.metadata.publishDate}\n\n`;
    
    if (issues.missingTranslations.length > 0) {
      articleReport += `**Missing Translations (${issues.missingTranslations.length}):**\n`;
      articleReport += issues.missingTranslations.map(item => 
        `- ${item.locale}: ${item.issue}`
      ).join('\n') + '\n\n';
    }
    
    if (issues.inconsistencies.length > 0) {
      articleReport += `**Inconsistencies (${issues.inconsistencies.length}):**\n`;
      articleReport += issues.inconsistencies.map(item => 
        `- ${item.locale} (${item.section}): ${item.issue}`
      ).join('\n') + '\n\n';
    }
    
    if (issues.qualityIssues.length > 0) {
      articleReport += `**Quality Issues (${issues.qualityIssues.length}):**\n`;
      articleReport += issues.qualityIssues.map(item => 
        `- ${item.locale || 'general'}: ${item.issue}`
      ).join('\n') + '\n\n';
    }
    
    return articleReport;
  }).join('\n')}

## Key Issues Found

### Missing Translations (${analysis.missingTranslations.length})
${analysis.missingTranslations.map(item => 
  `- **${item.article}** (${item.locale}): ${item.issue}`
).join('\n')}

### Content Inconsistencies (${analysis.inconsistencies.length})
${analysis.inconsistencies.map(item => 
  `- **${item.article}** (${item.locale}): ${item.issue}`
).join('\n')}

### Content Quality Issues (${analysis.contentQualityIssues.length})
${analysis.contentQualityIssues.map(item => 
  `- **${item.article}** (${item.locale || 'general'}): ${item.issue}`
).join('\n')}

## Recommendations
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Next Steps
1. **Priority 1**: Fix missing translations and SEO data
2. **Priority 2**: Resolve content structure inconsistencies
3. **Priority 3**: Address content quality issues
4. **Priority 4**: Implement internal linking strategy
5. **Priority 5**: Add related articles and cross-references

## Files Generated
- \`news-analysis-report.json\` - Detailed technical analysis
- \`news-analysis-summary.md\` - This human-readable report
- \`news-{article-id}-improved.json\` - AI-enhanced article files

To run the analysis again with different settings:
\`\`\`bash
DEEPINFRA_API_KEY=your-key node scripts/analyze-news-content.js
\`\`\`
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'news-analysis-summary.md'), summary);
  
  console.log(`✅ Results saved to ${OUTPUT_DIR}/`);
  console.log(`📄 Files created:`);
  console.log(`  - news-analysis-report.json (detailed technical data)`);
  console.log(`  - news-analysis-summary.md (human-readable report)`);
  console.log(`  - ${Object.keys(improvedArticles).length} improved article files`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting News Content Analysis\n');
  console.log('=' .repeat(50));
  
  try {
    // Load all articles
    const articles = await loadNewsArticles();
    
    // Analyze content consistency
    const analysis = await analyzeContentConsistency(articles);
    
    // Process articles with AI improvements
    const improvedArticles = await processArticlesWithAI(articles);
    
    // Generate analysis report
    const report = await generateAnalysisReport(analysis, articles);
    
    // Save all results
    await saveResults(analysis, improvedArticles, report);
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 News content analysis completed successfully!');
    console.log('\n📊 Quick Summary:');
    console.log(`   Articles analyzed: ${Object.keys(articles).length}`);
    console.log(`   Missing translations: ${analysis.missingTranslations.length}`);
    console.log(`   Inconsistencies: ${analysis.inconsistencies.length}`);
    console.log(`   Quality issues: ${analysis.contentQualityIssues.length}`);
    console.log(`   Average reading time: ${analysis.statistics.averageReadingTime} minutes`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the news-analysis-summary.md file');
    console.log('2. Fix critical issues (missing translations, inconsistencies)');
    console.log('3. Implement internal linking between articles and services');
    console.log('4. Monitor reader engagement and SEO performance');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, loadNewsArticles, analyzeContentConsistency, generateContentImprovement };
