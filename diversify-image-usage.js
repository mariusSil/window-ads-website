#!/usr/bin/env node

/**
 * Image Diversification Script
 * 
 * Intelligently redistributes local WebP images across content files
 * to create more visual variety while maintaining logical context matching.
 * Replaces duplicate image usage with contextually appropriate alternatives.
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  contentDir: './content',
  imagesDir: './public/images',
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  backupDir: './content-backup-diversification-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-')
};

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  verbose: (msg) => CONFIG.verbose && console.log(`🔍 ${msg}`)
};

/**
 * Contextual image categories for intelligent matching
 */
const imageCategories = {
  // Technical/Professional images
  technical: [
    '/images/adjustment-tools.webp',
    '/images/professional-tools.webp',
    '/images/professional-installation-og.webp',
    '/images/professional-window-installation-og.webp'
  ],
  
  // Smart/Modern technology
  smart: [
    '/images/smart-technology.webp',
    '/images/smart-technology-og.webp',
    '/images/smart-window-technology.webp',
    '/images/smart-window-technology-og.webp',
    '/images/smart-windows-og.webp'
  ],
  
  // Maintenance/Care related
  maintenance: [
    '/images/maintenance-calendar.webp',
    '/images/maintenance-schedule-calendar.webp',
    '/images/maintenance-schedule-og.webp',
    '/images/window-maintenance-schedule.webp',
    '/images/window-maintenance-schedule-og.webp'
  ],
  
  // Winter/Weather protection
  winter: [
    '/images/winter-care-og.webp',
    '/images/winter-maintenance-og.webp',
    '/images/winter-window-care.webp',
    '/images/winter-window-care-og.webp',
    '/images/weather-seals.webp'
  ],
  
  // Window operations/adjustment
  adjustment: [
    '/images/window-adjustment-frequency-og.webp',
    '/images/window-adjustment-guide-og.webp',
    '/images/adjustment-tools.webp'
  ],
  
  // Glass/Replacement services
  glass: [
    '/images/glass-unit-replacement.webp',
    '/images/window-replacement-comparison.webp',
    '/images/window-replacement-comparison-og.webp'
  ],
  
  // Sealing/Energy efficiency
  sealing: [
    '/images/window-sealing.webp',
    '/images/energy-efficient-windows-og.webp',
    '/images/weather-seals.webp'
  ],
  
  // Security/Safety
  security: [
    '/images/window-security-safety-og.webp'
  ]
};

/**
 * Context keywords for intelligent image selection
 */
const contextKeywords = {
  // Service types
  'window-adjustment': 'adjustment',
  'gasket-replacement': 'sealing',
  'mechanism-replacement': 'technical',
  'window-sealing': 'sealing',
  'cleaning-lubrication': 'maintenance',
  'glass-replacement': 'glass',
  'geometry-restoration': 'technical',
  'emergency-opening': 'technical',
  
  // Content types
  'hero': 'smart',
  'testimonials': 'maintenance',
  'team': 'technical',
  'about': 'smart',
  'business': 'technical',
  'news': 'smart',
  'accessories': 'technical',
  'contact': 'maintenance',
  'privacy': 'security',
  'services': 'technical',
  
  // Seasonal/weather
  'winter': 'winter',
  'maintenance': 'maintenance',
  'smart': 'smart',
  'professional': 'technical',
  'security': 'security',
  'energy': 'sealing',
  'glass': 'glass',
  'adjustment': 'adjustment'
};

/**
 * Get all available local WebP images
 */
function getLocalImages() {
  const localFiles = fs.readdirSync(CONFIG.imagesDir)
    .filter(file => file.endsWith('.webp'))
    .map(file => `/images/${file}`);
  
  log.info(`Found ${localFiles.length} local WebP images`);
  return localFiles;
}

/**
 * Analyze current image usage across all content files
 */
function analyzeImageUsage() {
  log.info('Analyzing current image usage patterns...');
  
  const imageUsage = new Map();
  const fileImageMap = new Map();
  
  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const imagePattern = /\/images\/[a-zA-Z0-9-]+\.webp/g;
      const matches = content.match(imagePattern);
      
      if (matches) {
        const uniqueImages = [...new Set(matches)];
        fileImageMap.set(filePath, uniqueImages);
        
        uniqueImages.forEach(image => {
          if (!imageUsage.has(image)) {
            imageUsage.set(image, []);
          }
          imageUsage.get(image).push(filePath);
        });
      }
    } catch (error) {
      log.warning(`Could not read ${filePath}: ${error.message}`);
    }
  }
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.name.endsWith('.json')) {
        scanFile(fullPath);
      }
    });
  }
  
  scanDirectory(CONFIG.contentDir);
  
  return { imageUsage, fileImageMap };
}

/**
 * Determine appropriate image category based on file context
 */
function determineImageCategory(filePath, currentImage) {
  const relativePath = path.relative('.', filePath).toLowerCase();
  
  // Check for direct keyword matches
  for (const [keyword, category] of Object.entries(contextKeywords)) {
    if (relativePath.includes(keyword)) {
      log.verbose(`Context match: ${keyword} → ${category} for ${relativePath}`);
      return category;
    }
  }
  
  // Fallback based on directory structure
  if (relativePath.includes('services')) return 'technical';
  if (relativePath.includes('news')) return 'smart';
  if (relativePath.includes('shared/components')) return 'maintenance';
  if (relativePath.includes('pages')) return 'smart';
  
  return 'technical'; // Default fallback
}

/**
 * Select best alternative image for diversification
 */
function selectAlternativeImage(filePath, currentImage, usedImages, availableImages) {
  const category = determineImageCategory(filePath, currentImage);
  const categoryImages = imageCategories[category] || [];
  
  // Filter available images in the same category that haven't been used much
  const suitableImages = categoryImages.filter(img => 
    availableImages.includes(img) && 
    img !== currentImage &&
    (!usedImages.has(img) || usedImages.get(img).length < 3)
  );
  
  if (suitableImages.length > 0) {
    // Prefer less used images
    suitableImages.sort((a, b) => {
      const aUsage = usedImages.get(a)?.length || 0;
      const bUsage = usedImages.get(b)?.length || 0;
      return aUsage - bUsage;
    });
    
    log.verbose(`Selected ${suitableImages[0]} for ${category} context in ${path.relative('.', filePath)}`);
    return suitableImages[0];
  }
  
  // If no suitable category images, pick any less-used image
  const lessUsedImages = availableImages.filter(img => 
    img !== currentImage &&
    (!usedImages.has(img) || usedImages.get(img).length < 5)
  );
  
  if (lessUsedImages.length > 0) {
    const randomImage = lessUsedImages[Math.floor(Math.random() * lessUsedImages.length)];
    log.verbose(`Random selection: ${randomImage} for ${path.relative('.', filePath)}`);
    return randomImage;
  }
  
  return currentImage; // Keep original if no alternatives
}

/**
 * Create backup of content files
 */
function createBackup() {
  if (CONFIG.dryRun) {
    log.info('DRY RUN: Would create backup directory');
    return;
  }
  
  log.info(`Creating backup in ${CONFIG.backupDir}...`);
  
  try {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    
    function copyDirectory(src, dest) {
      const items = fs.readdirSync(src, { withFileTypes: true });
      
      items.forEach(item => {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        
        if (item.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyDirectory(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
    
    copyDirectory(CONFIG.contentDir, path.join(CONFIG.backupDir, 'content'));
    log.success('Backup created successfully');
  } catch (error) {
    log.error(`Failed to create backup: ${error.message}`);
    throw error;
  }
}

/**
 * Diversify image usage in a single file
 */
function diversifyFileImages(filePath, fileImages, imageUsage, availableImages) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacements = 0;
    
    fileImages.forEach(currentImage => {
      const usage = imageUsage.get(currentImage) || [];
      
      // Only replace if image is overused (appears in 4+ files)
      if (usage.length >= 4) {
        const alternativeImage = selectAlternativeImage(filePath, currentImage, imageUsage, availableImages);
        
        if (alternativeImage !== currentImage) {
          // Replace all instances of the current image in this file
          const regex = new RegExp(currentImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          const matches = (content.match(regex) || []).length;
          
          if (matches > 0) {
            content = content.replace(regex, alternativeImage);
            replacements += matches;
            
            // Update usage tracking
            imageUsage.get(currentImage).splice(imageUsage.get(currentImage).indexOf(filePath), 1);
            if (!imageUsage.has(alternativeImage)) {
              imageUsage.set(alternativeImage, []);
            }
            imageUsage.get(alternativeImage).push(filePath);
            
            log.verbose(`Replaced ${currentImage} → ${alternativeImage} (${matches} instances) in ${path.relative('.', filePath)}`);
          }
        }
      }
    });
    
    if (replacements > 0) {
      if (!CONFIG.dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
      log.success(`${CONFIG.dryRun ? 'DRY RUN: Would update' : 'Updated'} ${path.relative('.', filePath)}: ${replacements} image replacements`);
    }
    
    return replacements;
  } catch (error) {
    log.error(`Failed to process ${filePath}: ${error.message}`);
    return 0;
  }
}

/**
 * Main diversification process
 */
function diversifyImages() {
  log.info('Starting image diversification process...');
  
  const availableImages = getLocalImages();
  const { imageUsage, fileImageMap } = analyzeImageUsage();
  
  // Show current usage statistics
  log.info('Current image usage statistics:');
  const sortedUsage = Array.from(imageUsage.entries())
    .sort((a, b) => b[1].length - a[1].length);
  
  sortedUsage.forEach(([image, files]) => {
    if (files.length > 1) {
      log.info(`  ${path.basename(image)}: used in ${files.length} files`);
    }
  });
  
  let totalReplacements = 0;
  let filesProcessed = 0;
  
  // Process each file for diversification
  fileImageMap.forEach((images, filePath) => {
    const replacements = diversifyFileImages(filePath, images, imageUsage, availableImages);
    if (replacements > 0) {
      totalReplacements += replacements;
      filesProcessed++;
    }
  });
  
  return { totalReplacements, filesProcessed, finalUsage: imageUsage };
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Image Usage Diversification');
  console.log('==============================');
  
  if (CONFIG.dryRun) {
    log.info('DRY RUN MODE - No files will be modified');
  }
  
  try {
    // Create backup
    createBackup();
    
    // Diversify images
    const results = diversifyImages();
    
    // Show final statistics
    log.info('\nFinal image usage distribution:');
    const sortedFinalUsage = Array.from(results.finalUsage.entries())
      .sort((a, b) => b[1].length - a[1].length);
    
    sortedFinalUsage.forEach(([image, files]) => {
      if (files.length > 0) {
        log.info(`  ${path.basename(image)}: ${files.length} files`);
      }
    });
    
    // Summary
    console.log('\n📊 DIVERSIFICATION SUMMARY');
    console.log('==========================');
    log.success(`Image replacements: ${results.totalReplacements}`);
    log.success(`Files processed: ${results.filesProcessed}`);
    log.success(`Images redistributed for better variety`);
    
    if (!CONFIG.dryRun) {
      log.success(`Backup created: ${CONFIG.backupDir}`);
      log.info('\n🎉 Image diversification completed successfully!');
      log.info('Visual variety improved while maintaining contextual relevance.');
    } else {
      log.info('\n🔍 DRY RUN COMPLETED - Run without --dry-run to execute changes');
    }
    
  } catch (error) {
    log.error(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    log.error(`Unhandled error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main };
