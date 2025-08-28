#!/usr/bin/env node

/**
 * Apply Enhanced Natural Translations Script
 * Applies culturally-appropriate translations to replace existing content
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_DIRS = {
  services: path.join(__dirname, '../content/collections/services'),
  news: path.join(__dirname, '../content/collections/news')
};
const INPUT_DIR = path.join(__dirname, '../content-translation-output');
const BACKUP_DIR = path.join(__dirname, '../content-backup');

/**
 * Create backup of existing files
 */
async function createBackup(contentType) {
  console.log(`📦 Creating backup of existing ${contentType} files...`);
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `${contentType}-backup-${timestamp}`);
    await fs.mkdir(backupPath, { recursive: true });
    
    const sourceDir = CONTENT_DIRS[contentType];
    const files = await fs.readdir(sourceDir);
    let backupCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const sourcePath = path.join(sourceDir, file);
        const backupFilePath = path.join(backupPath, file);
        await fs.copyFile(sourcePath, backupFilePath);
        backupCount++;
        console.log(`  ✓ Backed up ${file}`);
      }
    }
    
    console.log(`📊 Backup completed: ${backupCount} files saved to ${backupPath}\n`);
    return backupPath;
  } catch (error) {
    console.error(`❌ Backup failed for ${contentType}:`, error.message);
    throw error;
  }
}

/**
 * Find enhanced translation files
 */
async function findEnhancedFiles(contentType) {
  console.log(`🔍 Finding enhanced ${contentType} files...`);
  
  try {
    const files = await fs.readdir(INPUT_DIR);
    const enhancedFiles = files.filter(file => 
      file.startsWith(`${contentType}-`) && file.endsWith('-enhanced.json')
    );
    
    console.log(`📊 Found ${enhancedFiles.length} enhanced ${contentType} files:`);
    enhancedFiles.forEach(file => {
      const itemId = file.replace(`${contentType}-`, '').replace('-enhanced.json', '');
      console.log(`  ✓ ${itemId}`);
    });
    
    console.log('');
    return enhancedFiles;
  } catch (error) {
    console.error(`❌ Error finding enhanced ${contentType} files:`, error.message);
    throw error;
  }
}

/**
 * Validate enhanced file structure
 */
async function validateEnhancedFile(filePath, itemId, contentType) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const checks = {
      hasContent: !!data.content,
      hasLocales: data.content && Object.keys(data.content).length > 0,
      hasEnglish: data.content && !!data.content.en,
      hasTranslations: data.content && ['lt', 'pl', 'uk'].some(locale => !!data.content[locale]),
      hasMetadata: !!data.itemId || !!data.publishDate,
      hasSlugs: !!data.slugs
    };
    
    const isValid = Object.values(checks).every(check => check);
    
    if (!isValid) {
      console.log(`  ⚠️  ${itemId} validation issues:`);
      Object.entries(checks).forEach(([check, passed]) => {
        if (!passed) {
          console.log(`    - Missing: ${check}`);
        }
      });
    }
    
    return isValid;
  } catch (error) {
    console.log(`  ❌ ${itemId} validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Apply enhanced files to content directory
 */
async function applyEnhancedFiles(enhancedFiles, contentType) {
  console.log(`🚀 Applying enhanced ${contentType} files...\n`);
  
  const results = {
    applied: [],
    skipped: [],
    failed: []
  };
  
  for (const enhancedFile of enhancedFiles) {
    const itemId = enhancedFile.replace(`${contentType}-`, '').replace('-enhanced.json', '');
    const sourcePath = path.join(INPUT_DIR, enhancedFile);
    const targetPath = path.join(CONTENT_DIRS[contentType], `${itemId}.json`);
    
    console.log(`Processing ${itemId}...`);
    
    try {
      // Validate the enhanced file
      const isValid = await validateEnhancedFile(sourcePath, itemId, contentType);
      
      if (!isValid) {
        console.log(`  ⚠️  Skipping ${itemId} due to validation issues\n`);
        results.skipped.push(itemId);
        continue;
      }
      
      // Check if target file exists
      try {
        await fs.access(targetPath);
        console.log(`  📝 Replacing existing ${itemId}.json`);
      } catch {
        console.log(`  📄 Creating new ${itemId}.json`);
      }
      
      // Copy enhanced file to content directory
      await fs.copyFile(sourcePath, targetPath);
      
      console.log(`  ✅ Successfully applied ${itemId}\n`);
      results.applied.push(itemId);
      
    } catch (error) {
      console.log(`  ❌ Failed to apply ${itemId}: ${error.message}\n`);
      results.failed.push({ itemId, error: error.message });
    }
  }
  
  return results;
}

/**
 * Generate application report
 */
async function generateReport(results, contentType, backupPath) {
  const report = `# Enhanced Translation Application Report - ${contentType.toUpperCase()}
Generated: ${new Date().toLocaleString()}

## Translation Enhancement Summary
This report covers the application of **natural, culturally-appropriate translations** that prioritize:
- Native language patterns over direct translations
- Cultural adaptation for local markets
- Conversational yet professional tone
- Local terminology and expressions

## Application Results
- **Applied**: ${results.applied.length} ${contentType} items
- **Skipped**: ${results.skipped.length} ${contentType} items  
- **Failed**: ${results.failed.length} ${contentType} items
- **Backup Location**: ${backupPath}

## Applied ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}
${results.applied.length > 0 ? results.applied.map(id => `- ${id} (natural translations applied)`).join('\n') : 'None'}

## Skipped ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}
${results.skipped.length > 0 ? results.skipped.map(id => `- ${id} (validation issues)`).join('\n') : 'None'}

## Failed ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}
${results.failed.length > 0 ? results.failed.map(item => `- ${item.itemId}: ${item.error}`).join('\n') : 'None'}

## Translation Quality Improvements
The enhanced translations include:

### Lithuanian (LT)
- Natural sentence structures following Lithuanian grammar
- Warm, direct communication style typical in Baltic business culture
- Professional terminology without bureaucratic formality
- Cultural context relevant to Lithuanian market

### Polish (PL)
- Proper Polish syntax with correct declensions
- Detailed explanations Polish customers expect
- Central European business communication norms
- Technical details in accessible language

### Ukrainian (UK)
- Natural Ukrainian grammar and word order
- Practical, value-focused messaging
- Warm, trustworthy service industry tone
- Ukrainian cultural context for home improvement

## Next Steps
1. **Review Applied Changes**: Test the enhanced content in development environment
2. **Quality Assurance**: Have native speakers review translations for naturalness
3. **User Testing**: Monitor engagement metrics and user feedback
4. **Rollback if Needed**: Use backup files if issues are discovered
5. **Commit Changes**: Add to version control after thorough testing

## Rollback Instructions
To restore original files if needed:
\`\`\`bash
cp ${backupPath}/*.json ${CONTENT_DIRS[contentType]}/
\`\`\`

## Performance Monitoring
After applying enhanced translations, monitor:
- User engagement metrics (time on page, bounce rate)
- Conversion rates by locale
- User feedback and support inquiries
- SEO performance in local markets
`;

  const reportPath = path.join(INPUT_DIR, `${contentType}-application-report.md`);
  await fs.writeFile(reportPath, report);
  
  return reportPath;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Enhanced Translation Application Process\n');
  console.log('=' .repeat(70));
  console.log('APPLYING: Natural, culturally-appropriate translations');
  console.log('REPLACING: Direct word-for-word translations');
  console.log('GOAL: Native-sounding content for each language market');
  console.log('=' .repeat(70) + '\n');
  
  try {
    // Check if input directory exists
    try {
      await fs.access(INPUT_DIR);
    } catch {
      console.error('❌ Translation output directory not found. Run enhanced-content-translator.js first.');
      process.exit(1);
    }
    
    const allResults = {};
    const allBackups = {};
    
    // Process services content
    console.log('📋 APPLYING ENHANCED SERVICES TRANSLATIONS\n');
    const servicesBackup = await createBackup('services');
    const enhancedServicesFiles = await findEnhancedFiles('services');
    
    if (enhancedServicesFiles.length > 0) {
      const servicesResults = await applyEnhancedFiles(enhancedServicesFiles, 'services');
      const servicesReportPath = await generateReport(servicesResults, 'services', servicesBackup);
      allResults.services = servicesResults;
      allBackups.services = servicesBackup;
      console.log(`📄 Services report: ${servicesReportPath}\n`);
    } else {
      console.log('⚠️  No enhanced services files found.\n');
    }
    
    console.log('=' .repeat(70) + '\n');
    
    // Process news content
    console.log('📰 APPLYING ENHANCED NEWS TRANSLATIONS\n');
    const newsBackup = await createBackup('news');
    const enhancedNewsFiles = await findEnhancedFiles('news');
    
    if (enhancedNewsFiles.length > 0) {
      const newsResults = await applyEnhancedFiles(enhancedNewsFiles, 'news');
      const newsReportPath = await generateReport(newsResults, 'news', newsBackup);
      allResults.news = newsResults;
      allBackups.news = newsBackup;
      console.log(`📄 News report: ${newsReportPath}\n`);
    } else {
      console.log('⚠️  No enhanced news files found.\n');
    }
    
    // Final summary
    console.log('=' .repeat(70));
    console.log('🎉 Enhanced Translation Application Completed!');
    console.log('\n📊 Final Summary:');
    
    Object.entries(allResults).forEach(([type, results]) => {
      console.log(`\n${type.toUpperCase()}:`);
      console.log(`   ✅ Applied: ${results.applied.length}`);
      console.log(`   ⚠️  Skipped: ${results.skipped.length}`);
      console.log(`   ❌ Failed: ${results.failed.length}`);
      console.log(`   📦 Backup: ${allBackups[type]}`);
    });
    
    console.log('\n🌍 Translation Quality Improvements:');
    console.log('   • Natural language patterns instead of direct translations');
    console.log('   • Cultural adaptation for local markets');
    console.log('   • Conversational yet professional tone');
    console.log('   • Local terminology and expressions');
    
    console.log('\n📋 Next steps:');
    console.log('1. Test enhanced content in development environment');
    console.log('2. Have native speakers review translations');
    console.log('3. Monitor user engagement and conversion metrics');
    console.log('4. Commit changes after thorough testing');
    
    const hasFailures = Object.values(allResults).some(results => results.failed.length > 0);
    if (hasFailures) {
      console.log('\n⚠️  Some files failed to apply. Check the reports for details.');
    }
    
  } catch (error) {
    console.error('❌ Enhanced translation application failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, createBackup, findEnhancedFiles, applyEnhancedFiles };
