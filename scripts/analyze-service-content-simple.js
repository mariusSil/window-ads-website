#!/usr/bin/env node

/**
 * Simplified Service Content Analysis Script
 * Focuses on analysis first, then optional AI improvements
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SERVICES_DIR = path.join(__dirname, '../content/collections/services');
const OUTPUT_DIR = path.join(__dirname, '../content-analysis-output');
const LOCALES = ['en', 'lt', 'pl', 'uk'];

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
    recommendations: [],
    statistics: {
      totalServices: Object.keys(services).length,
      totalLocales: LOCALES.length,
      contentSections: {},
      averageContentLength: {}
    }
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
        
        // Analyze content length
        const contentStr = JSON.stringify(service.content[locale]);
        if (!analysis.statistics.averageContentLength[locale]) {
          analysis.statistics.averageContentLength[locale] = [];
        }
        analysis.statistics.averageContentLength[locale].push(contentStr.length);
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
          
          // Check pricing consistency
          if (enContent.pricing?.packages && localeContent.pricing?.packages) {
            const enPackages = enContent.pricing.packages.length;
            const localePackages = localeContent.pricing.packages.length;
            
            if (enPackages !== localePackages) {
              analysis.inconsistencies.push({
                service: serviceId,
                locale,
                section: 'pricing.packages',
                issue: `Package count mismatch: EN(${enPackages}) vs ${locale.toUpperCase()}(${localePackages})`
              });
            }
          }
        }
      }
    }
    
    // Content quality checks
    if (enContent) {
      // Check for very short descriptions
      if (enContent.hero?.subtitle && enContent.hero.subtitle.length < 50) {
        analysis.contentQualityIssues.push({
          service: serviceId,
          locale: 'en',
          issue: 'Hero subtitle too short (< 50 chars)',
          value: enContent.hero.subtitle
        });
      }
      
      // Check for missing emergency notes
      if (!enContent.hero?.emergencyNote && serviceId === 'emergency-repair') {
        analysis.contentQualityIssues.push({
          service: serviceId,
          locale: 'en',
          issue: 'Emergency service missing emergency note'
        });
      }
      
      // Check for missing warranty information
      if (enContent.serviceDetails?.services) {
        const servicesWithoutWarranty = enContent.serviceDetails.services.filter(s => !s.warranty);
        if (servicesWithoutWarranty.length > 0) {
          analysis.contentQualityIssues.push({
            service: serviceId,
            locale: 'en',
            issue: `${servicesWithoutWarranty.length} services missing warranty information`
          });
        }
      }
    }
  }
  
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
    analysis.recommendations.push('Standardize content structure across all locales');
  }
  if (analysis.contentQualityIssues.length > 0) {
    analysis.recommendations.push('Address content quality issues for better user engagement');
  }
  
  analysis.recommendations.push('Implement consistent internal linking strategy');
  analysis.recommendations.push('Add more specific calls-to-action in service descriptions');
  analysis.recommendations.push('Ensure all services have complete warranty and pricing information');
  
  return analysis;
}

/**
 * Generate detailed content report
 */
async function generateContentReport(services, analysis) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalServices: Object.keys(services).length,
      totalLocales: LOCALES.length,
      inconsistencies: analysis.inconsistencies.length,
      missingTranslations: analysis.missingTranslations.length,
      contentQualityIssues: analysis.contentQualityIssues.length
    },
    statistics: analysis.statistics,
    details: analysis,
    serviceBreakdown: {}
  };
  
  // Generate per-service breakdown
  for (const [serviceId, service] of Object.entries(services)) {
    const serviceIssues = {
      missingTranslations: analysis.missingTranslations.filter(item => item.service === serviceId),
      inconsistencies: analysis.inconsistencies.filter(item => item.service === serviceId),
      qualityIssues: analysis.contentQualityIssues.filter(item => item.service === serviceId)
    };
    
    const completeness = {};
    for (const locale of LOCALES) {
      const content = service.content[locale];
      completeness[locale] = {
        exists: !!content,
        sections: content ? Object.keys(content).length : 0,
        hasHero: !!(content?.hero),
        hasServiceDetails: !!(content?.serviceDetails),
        hasPricing: !!(content?.pricing),
        hasProcess: !!(content?.process)
      };
    }
    
    report.serviceBreakdown[serviceId] = {
      issues: serviceIssues,
      completeness,
      totalIssues: serviceIssues.missingTranslations.length + 
                   serviceIssues.inconsistencies.length + 
                   serviceIssues.qualityIssues.length
    };
  }
  
  return report;
}

/**
 * Save results to files
 */
async function saveResults(analysis, services, report) {
  console.log('💾 Saving results...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Save detailed analysis report
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'content-analysis-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Save human-readable summary
  const summary = `# Service Content Analysis Report
Generated: ${new Date().toLocaleString()}

## Summary
- **Total Services**: ${Object.keys(services).length}
- **Total Locales**: ${LOCALES.length}
- **Inconsistencies Found**: ${analysis.inconsistencies.length}
- **Missing Translations**: ${analysis.missingTranslations.length}
- **Content Quality Issues**: ${analysis.contentQualityIssues.length}

## Content Statistics

### Average Content Length by Locale
${LOCALES.map(locale => {
  const stats = analysis.statistics.averageContentLength[locale];
  if (stats) {
    return `- **${locale.toUpperCase()}**: ${stats.average} chars (min: ${stats.min}, max: ${stats.max})`;
  }
  return `- **${locale.toUpperCase()}**: No data`;
}).join('\n')}

## Issues by Service

${Object.entries(report.serviceBreakdown)
  .sort((a, b) => b[1].totalIssues - a[1].totalIssues)
  .map(([serviceId, breakdown]) => {
    const issues = breakdown.issues;
    let serviceReport = `### ${serviceId} (${breakdown.totalIssues} issues)\n`;
    
    if (issues.missingTranslations.length > 0) {
      serviceReport += `**Missing Translations (${issues.missingTranslations.length}):**\n`;
      serviceReport += issues.missingTranslations.map(item => 
        `- ${item.locale}: ${item.issue}`
      ).join('\n') + '\n\n';
    }
    
    if (issues.inconsistencies.length > 0) {
      serviceReport += `**Inconsistencies (${issues.inconsistencies.length}):**\n`;
      serviceReport += issues.inconsistencies.map(item => 
        `- ${item.locale} (${item.section}): ${item.issue}`
      ).join('\n') + '\n\n';
    }
    
    if (issues.qualityIssues.length > 0) {
      serviceReport += `**Quality Issues (${issues.qualityIssues.length}):**\n`;
      serviceReport += issues.qualityIssues.map(item => 
        `- ${item.locale}: ${item.issue}`
      ).join('\n') + '\n\n';
    }
    
    return serviceReport;
  }).join('\n')}

## Key Issues Found

### Missing Translations (${analysis.missingTranslations.length})
${analysis.missingTranslations.map(item => 
  `- **${item.service}** (${item.locale}): ${item.issue}`
).join('\n')}

### Content Inconsistencies (${analysis.inconsistencies.length})
${analysis.inconsistencies.map(item => 
  `- **${item.service}** (${item.locale}): ${item.issue}`
).join('\n')}

### Content Quality Issues (${analysis.contentQualityIssues.length})
${analysis.contentQualityIssues.map(item => 
  `- **${item.service}** (${item.locale}): ${item.issue}`
).join('\n')}

## Recommendations
${report.summary.totalServices > 0 ? analysis.recommendations.map(rec => `- ${rec}`).join('\n') : 'No recommendations available'}

## Next Steps
1. **Priority 1**: Fix missing translations for complete locale coverage
2. **Priority 2**: Resolve content structure inconsistencies
3. **Priority 3**: Address content quality issues
4. **Priority 4**: Implement internal linking strategy
5. **Priority 5**: Add AI-powered content improvements

## Files Generated
- \`content-analysis-report.json\` - Detailed technical analysis
- \`analysis-summary.md\` - This human-readable report

To run AI-powered content improvements after fixing these issues, use:
\`\`\`bash
DEEPINFRA_API_KEY=your-key node scripts/analyze-service-content.js
\`\`\`
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'analysis-summary.md'), summary);
  
  console.log(`✅ Results saved to ${OUTPUT_DIR}/`);
  console.log(`📄 Files created:`);
  console.log(`  - content-analysis-report.json (detailed technical data)`);
  console.log(`  - analysis-summary.md (human-readable report)`);
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Service Content Analysis (Simple Mode)\n');
  console.log('=' .repeat(60));
  
  try {
    // Load all services
    const services = await loadServices();
    
    // Analyze content consistency
    const analysis = await analyzeContentConsistency(services);
    
    // Generate detailed report
    const report = await generateContentReport(services, analysis);
    
    // Save all results
    await saveResults(analysis, services, report);
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Content analysis completed successfully!');
    console.log('\n📊 Quick Summary:');
    console.log(`   Services analyzed: ${Object.keys(services).length}`);
    console.log(`   Missing translations: ${analysis.missingTranslations.length}`);
    console.log(`   Inconsistencies: ${analysis.inconsistencies.length}`);
    console.log(`   Quality issues: ${analysis.contentQualityIssues.length}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the analysis-summary.md file');
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

export { main, loadServices, analyzeContentConsistency };
