#!/usr/bin/env node

/**
 * Apply Improved Content Script
 * Moves AI-improved service files to replace existing ones
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SERVICES_DIR = path.join(__dirname, '../content/collections/services');
const OUTPUT_DIR = path.join(__dirname, '../content-analysis-output');
const BACKUP_DIR = path.join(__dirname, '../content-backup');

/**
 * Create backup of existing files
 */
async function createBackup() {
  console.log('📦 Creating backup of existing service files...');
  
  try {
    // Create backup directory with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `services-backup-${timestamp}`);
    await fs.mkdir(backupPath, { recursive: true });
    
    // Copy all existing service files to backup
    const files = await fs.readdir(SERVICES_DIR);
    let backupCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const sourcePath = path.join(SERVICES_DIR, file);
        const backupFilePath = path.join(backupPath, file);
        await fs.copyFile(sourcePath, backupFilePath);
        backupCount++;
        console.log(`  ✓ Backed up ${file}`);
      }
    }
    
    console.log(`📊 Backup completed: ${backupCount} files saved to ${backupPath}\n`);
    return backupPath;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

/**
 * Find all improved files
 */
async function findImprovedFiles() {
  console.log('🔍 Finding improved service files...');
  
  try {
    const files = await fs.readdir(OUTPUT_DIR);
    const improvedFiles = files.filter(file => file.endsWith('-improved.json'));
    
    console.log(`📊 Found ${improvedFiles.length} improved files:`);
    improvedFiles.forEach(file => {
      const serviceId = file.replace('-improved.json', '');
      console.log(`  ✓ ${serviceId}`);
    });
    
    console.log('');
    return improvedFiles;
  } catch (error) {
    console.error('❌ Error finding improved files:', error.message);
    throw error;
  }
}

/**
 * Validate improved file structure
 */
async function validateImprovedFile(filePath, serviceId) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Basic validation checks
    const checks = {
      hasContent: !!data.content,
      hasLocales: data.content && Object.keys(data.content).length > 0,
      hasEnglish: data.content && !!data.content.en,
      hasMetadata: !!data.metadata,
      hasSlug: !!data.slug
    };
    
    const isValid = Object.values(checks).every(check => check);
    
    if (!isValid) {
      console.log(`  ⚠️  ${serviceId} validation issues:`);
      Object.entries(checks).forEach(([check, passed]) => {
        if (!passed) {
          console.log(`    - Missing: ${check}`);
        }
      });
    }
    
    return isValid;
  } catch (error) {
    console.log(`  ❌ ${serviceId} validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Apply improved files to services directory
 */
async function applyImprovedFiles(improvedFiles) {
  console.log('🚀 Applying improved files...\n');
  
  const results = {
    applied: [],
    skipped: [],
    failed: []
  };
  
  for (const improvedFile of improvedFiles) {
    const serviceId = improvedFile.replace('-improved.json', '');
    const sourcePath = path.join(OUTPUT_DIR, improvedFile);
    const targetPath = path.join(SERVICES_DIR, `${serviceId}.json`);
    
    console.log(`Processing ${serviceId}...`);
    
    try {
      // Validate the improved file
      const isValid = await validateImprovedFile(sourcePath, serviceId);
      
      if (!isValid) {
        console.log(`  ⚠️  Skipping ${serviceId} due to validation issues\n`);
        results.skipped.push(serviceId);
        continue;
      }
      
      // Check if target file exists
      try {
        await fs.access(targetPath);
        console.log(`  📝 Replacing existing ${serviceId}.json`);
      } catch {
        console.log(`  📄 Creating new ${serviceId}.json`);
      }
      
      // Copy improved file to services directory
      await fs.copyFile(sourcePath, targetPath);
      
      console.log(`  ✅ Successfully applied ${serviceId}\n`);
      results.applied.push(serviceId);
      
    } catch (error) {
      console.log(`  ❌ Failed to apply ${serviceId}: ${error.message}\n`);
      results.failed.push({ serviceId, error: error.message });
    }
  }
  
  return results;
}

/**
 * Generate application report
 */
async function generateReport(results, backupPath) {
  const report = `# Content Application Report
Generated: ${new Date().toLocaleString()}

## Summary
- **Applied**: ${results.applied.length} services
- **Skipped**: ${results.skipped.length} services  
- **Failed**: ${results.failed.length} services
- **Backup Location**: ${backupPath}

## Applied Services
${results.applied.length > 0 ? results.applied.map(id => `- ${id}`).join('\n') : 'None'}

## Skipped Services
${results.skipped.length > 0 ? results.skipped.map(id => `- ${id} (validation issues)`).join('\n') : 'None'}

## Failed Services
${results.failed.length > 0 ? results.failed.map(item => `- ${item.serviceId}: ${item.error}`).join('\n') : 'None'}

## Next Steps
1. Review applied changes in your development environment
2. Test the updated content thoroughly
3. If issues are found, restore from backup: ${backupPath}
4. Commit changes to version control after testing

## Rollback Instructions
To restore original files if needed:
\`\`\`bash
cp ${backupPath}/*.json ${SERVICES_DIR}/
\`\`\`
`;

  const reportPath = path.join(OUTPUT_DIR, 'application-report.md');
  await fs.writeFile(reportPath, report);
  
  return reportPath;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Content Application Process\n');
  console.log('=' .repeat(50));
  
  try {
    // Check if output directory exists
    try {
      await fs.access(OUTPUT_DIR);
    } catch {
      console.error('❌ Output directory not found. Run content analysis first.');
      process.exit(1);
    }
    
    // Create backup of existing files
    const backupPath = await createBackup();
    
    // Find all improved files
    const improvedFiles = await findImprovedFiles();
    
    if (improvedFiles.length === 0) {
      console.log('⚠️  No improved files found. Run AI content analysis first.');
      process.exit(0);
    }
    
    // Confirm before proceeding
    console.log('⚠️  This will replace existing service files with improved versions.');
    console.log(`📦 Backup created at: ${backupPath}`);
    console.log('\nProceed with applying improved content? (This script will continue automatically)\n');
    
    // Apply improved files
    const results = await applyImprovedFiles(improvedFiles);
    
    // Generate report
    const reportPath = await generateReport(results, backupPath);
    
    console.log('=' .repeat(50));
    console.log('🎉 Content application completed!');
    console.log('\n📊 Results Summary:');
    console.log(`   ✅ Applied: ${results.applied.length}`);
    console.log(`   ⚠️  Skipped: ${results.skipped.length}`);
    console.log(`   ❌ Failed: ${results.failed.length}`);
    console.log(`\n📄 Report saved: ${reportPath}`);
    console.log(`📦 Backup location: ${backupPath}`);
    
    if (results.failed.length > 0) {
      console.log('\n⚠️  Some files failed to apply. Check the report for details.');
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Review the changes in your development environment');
    console.log('2. Test the updated content thoroughly');
    console.log('3. Commit to version control after testing');
    
  } catch (error) {
    console.error('❌ Application process failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, createBackup, findImprovedFiles, applyImprovedFiles };
