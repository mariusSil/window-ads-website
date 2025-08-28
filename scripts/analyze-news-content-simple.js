#!/usr/bin/env node

/**
 * Simplified News Content Analysis Script
 * Focuses on analysis first, then optional AI improvements
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NEWS_DIR = path.join(__dirname, '../content/collections/news');
const OUTPUT_DIR = path.join(__dirname, '../content-analysis-output');
const LOCALES = ['en', 'lt', 'pl', 'uk'];

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
      authorsFound: new Set(),
      publishDates: [],
      featuredArticles: 0
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
    if (article.publishDate) {
      analysis.statistics.publishDates.push(article.publishDate);
    }
    if (article.featured) {
      analysis.statistics.featuredArticles++;
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
          // Check required fields
          const requiredFields = ['title', 'excerpt', 'introduction'];
          for (const field of requiredFields) {
            if (enContent[field] && !localeContent[field]) {
              analysis.missingTranslations.push({
                article: articleId,
                locale,
                section: field,
                issue: `Missing ${field}`
              });
            }
          }
          
          // Check sections consistency
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
      } else {
        // Check SEO completeness
        const seoData = article.seo[locale];
        if (!seoData.title) {
          analysis.contentQualityIssues.push({
            article: articleId,
            locale,
            issue: 'Missing SEO title'
          });
        }
        if (!seoData.description) {
          analysis.contentQualityIssues.push({
            article: articleId,
            locale,
            issue: 'Missing SEO description'
          });
        }
        if (seoData.description && seoData.description.length > 160) {
          analysis.contentQualityIssues.push({
            article: articleId,
            locale,
            issue: `SEO description too long (${seoData.description.length} chars, max 160)`
          });
        }
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
          value: enContent.excerpt.length
        });
      }
      
      // Check for very long excerpts
      if (enContent.excerpt && enContent.excerpt.length > 300) {
        analysis.contentQualityIssues.push({
          article: articleId,
          locale: 'en',
          issue: 'Article excerpt too long (> 300 chars)',
          value: enContent.excerpt.length
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
      
      // Check for sections without content
      if (enContent.sections) {
        enContent.sections.forEach((section, index) => {
          if (!section.content || section.content.length < 100) {
            analysis.contentQualityIssues.push({
              article: articleId,
              locale: 'en',
              issue: `Section ${index + 1} has insufficient content (< 100 chars)`
            });
          }
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
    } else if (article.readingTime < 1 || article.readingTime > 30) {
      analysis.contentQualityIssues.push({
        article: articleId,
        issue: `Unusual reading time: ${article.readingTime} minutes (expected 1-30)`
      });
    }
    
    if (!article.category) {
      analysis.contentQualityIssues.push({
        article: articleId,
        issue: 'Missing category classification'
      });
    }
    
    if (!article.author) {
      analysis.contentQualityIssues.push({
        article: articleId,
        issue: 'Missing author information'
      });
    }
  }
  
  // Calculate statistics
  analysis.statistics.averageReadingTime = totalReadingTime > 0 ? Math.round(totalReadingTime / Object.keys(articles).length) : 0;
  analysis.statistics.categoriesFound = Array.from(analysis.statistics.categoriesFound);
  analysis.statistics.authorsFound = Array.from(analysis.statistics.authorsFound);
  analysis.statistics.publishDates.sort();
  
  // Calculate average content lengths
  for (const locale of LOCALES) {
    if (analysis.statistics.averageContentLength[locale] && analysis.statistics.averageContentLength[locale].length > 0) {
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
  analysis.recommendations.push('Optimize reading times and content structure for better engagement');
  
  return analysis;
}

/**
 * Generate detailed content report
 */
async function generateContentReport(articles, analysis) {
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
      authors: analysis.statistics.authorsFound,
      featuredArticles: analysis.statistics.featuredArticles
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
        hasFeaturedImage: !!(content?.featuredImage),
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
async function saveResults(analysis, articles, report) {
  console.log('💾 Saving results...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Save detailed analysis report
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'news-analysis-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Save human-readable summary
  const summary = `# News Content Analysis Report
Generated: ${new Date().toLocaleString()}

## Summary
- **Total Articles**: ${Object.keys(articles).length}
- **Total Locales**: ${LOCALES.length}
- **Inconsistencies Found**: ${analysis.inconsistencies.length}
- **Missing Translations**: ${analysis.missingTranslations.length}
- **Content Quality Issues**: ${analysis.contentQualityIssues.length}
- **Average Reading Time**: ${analysis.statistics.averageReadingTime} minutes
- **Featured Articles**: ${analysis.statistics.featuredArticles}
- **Categories**: ${analysis.statistics.categoriesFound.join(', ')}

## Content Statistics

### Average Content Length by Locale
${LOCALES.map(locale => {
  const stats = analysis.statistics.averageContentLength[locale];
  if (stats && stats.average) {
    return `- **${locale.toUpperCase()}**: ${stats.average} chars (min: ${stats.min}, max: ${stats.max})`;
  }
  return `- **${locale.toUpperCase()}**: No data`;
}).join('\n')}

### Publication Timeline
- **Earliest**: ${analysis.statistics.publishDates[0] || 'N/A'}
- **Latest**: ${analysis.statistics.publishDates[analysis.statistics.publishDates.length - 1] || 'N/A'}

## Issues by Article

${Object.entries(report.articleBreakdown)
  .sort((a, b) => b[1].totalIssues - a[1].totalIssues)
  .map(([articleId, breakdown]) => {
    const issues = breakdown.issues;
    let articleReport = `### ${articleId} (${breakdown.totalIssues} issues)\n`;
    articleReport += `**Metadata**: ${breakdown.metadata.category} | ${breakdown.metadata.readingTime}min | ${breakdown.metadata.publishDate}${breakdown.metadata.featured ? ' | FEATURED' : ''}\n\n`;
    
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
5. **Priority 5**: Add AI-powered content improvements

## Files Generated
- \`news-analysis-report.json\` - Detailed technical analysis
- \`news-analysis-summary.md\` - This human-readable report

To run AI-powered content improvements after fixing these issues, use:
\`\`\`bash
DEEPINFRA_API_KEY=your-key node scripts/analyze-news-content.js
\`\`\`
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'news-analysis-summary.md'), summary);
  
  console.log(`✅ Results saved to ${OUTPUT_DIR}/`);
  console.log(`📄 Files created:`);
  console.log(`  - news-analysis-report.json (detailed technical data)`);
  console.log(`  - news-analysis-summary.md (human-readable report)`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting News Content Analysis (Simple Mode)\n');
  console.log('=' .repeat(60));
  
  try {
    // Load all articles
    const articles = await loadNewsArticles();
    
    // Analyze content consistency
    const analysis = await analyzeContentConsistency(articles);
    
    // Generate detailed report
    const report = await generateContentReport(articles, analysis);
    
    // Save all results
    await saveResults(analysis, articles, report);
    
    console.log('\n' + '=' .repeat(60));
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
    console.log('3. Run AI improvements after fixing structural issues');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, loadNewsArticles, analyzeContentConsistency };
