#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const IMAGES_DIR = './public/images';
const BACKUP_DIR = './public/images/webp-backup';
const WEBP_QUALITY = 75; // More aggressive compression (was 85)
const WEBP_EFFORT = 6; // Higher effort for better compression (0-6, default 4)
const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP_ORIGINALS = !process.argv.includes('--no-backup');
const QUALITY = parseInt(process.argv.find(arg => arg.startsWith('--quality='))?.split('=')[1]) || WEBP_QUALITY;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get all WebP files recursively
function getAllWebPFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip backup directories to avoid infinite loops
      if (file !== 'backup' && file !== 'webp-backup') {
        getAllWebPFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.webp') {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Create backup directory if needed
function createBackupDir() {
  if (BACKUP_ORIGINALS && !fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    log(`Created backup directory: ${BACKUP_DIR}`, 'blue');
  }
}

// Compress single WebP image
async function compressWebP(inputPath) {
  const parsedPath = path.parse(inputPath);
  const tempPath = path.join(parsedPath.dir, `${parsedPath.name}_temp.webp`);
  const backupPath = BACKUP_ORIGINALS ? path.join(BACKUP_DIR, path.basename(inputPath)) : null;
  
  try {
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    
    if (DRY_RUN) {
      log(`[DRY RUN] Would compress: ${inputPath} (${(originalSize / 1024).toFixed(1)}KB)`, 'yellow');
      return { success: true, originalSize, newSize: 0, saved: 0 };
    }
    
    // Compress WebP with higher compression
    await sharp(inputPath)
      .webp({ 
        quality: QUALITY,
        effort: WEBP_EFFORT,
        lossless: false
      })
      .toFile(tempPath);
    
    // Get new file size
    const newStats = fs.statSync(tempPath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    // Only replace if we achieved meaningful compression (at least 5% reduction)
    if (saved > originalSize * 0.05) {
      // Backup original if requested
      if (BACKUP_ORIGINALS) {
        fs.copyFileSync(inputPath, backupPath);
      }
      
      // Replace original with compressed version
      fs.renameSync(tempPath, inputPath);
      
      log(`✓ Compressed: ${path.basename(inputPath)}`, 'green');
      log(`  Size: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savedPercent}% smaller)`, 'cyan');
      
      return { success: true, originalSize, newSize, saved };
    } else {
      // Remove temp file if compression wasn't worthwhile
      fs.unlinkSync(tempPath);
      log(`⚪ Skipped: ${path.basename(inputPath)} (minimal compression gain: ${savedPercent}%)`, 'yellow');
      return { success: true, originalSize, newSize: originalSize, saved: 0 };
    }
    
  } catch (error) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    log(`✗ Failed to compress ${inputPath}: ${error.message}`, 'red');
    return { success: false, originalSize: 0, newSize: 0, saved: 0 };
  }
}

// Analyze compression potential
async function analyzeCompressionPotential(filePath) {
  try {
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    
    // Test compression at different quality levels
    const testPath = path.join(path.dirname(filePath), '_test_compression.webp');
    
    await sharp(filePath)
      .webp({ quality: QUALITY, effort: WEBP_EFFORT })
      .toFile(testPath);
    
    const testStats = fs.statSync(testPath);
    const testSize = testStats.size;
    const potentialSaving = originalSize - testSize;
    const potentialPercent = ((potentialSaving / originalSize) * 100).toFixed(1);
    
    // Clean up test file
    fs.unlinkSync(testPath);
    
    return { originalSize, testSize, potentialSaving, potentialPercent };
  } catch (error) {
    return null;
  }
}

// Main compression function
async function compressAllWebP() {
  log('🗜️  WebP Image Compressor', 'magenta');
  log('=========================', 'magenta');
  
  if (DRY_RUN) {
    log('🔍 Running in DRY RUN mode - no files will be modified', 'yellow');
  }
  
  if (BACKUP_ORIGINALS && !DRY_RUN) {
    log('💾 Backup mode enabled - original WebP files will be saved to backup folder', 'blue');
  }
  
  log(`🎚️  Compression quality: ${QUALITY}% (effort level: ${WEBP_EFFORT})`, 'blue');
  
  // Create backup directory
  if (!DRY_RUN) {
    createBackupDir();
  }
  
  // Get all WebP files
  const webpFiles = getAllWebPFiles(IMAGES_DIR);
  
  if (webpFiles.length === 0) {
    log('No WebP images found to compress', 'yellow');
    return;
  }
  
  log(`Found ${webpFiles.length} WebP images to analyze:`, 'blue');
  webpFiles.forEach(file => log(`  • ${file}`, 'cyan'));
  log('');
  
  // Analyze compression potential first
  if (!DRY_RUN) {
    log('📊 Analyzing compression potential...', 'blue');
    let totalPotentialSaving = 0;
    let analyzedCount = 0;
    
    for (const filePath of webpFiles) {
      const analysis = await analyzeCompressionPotential(filePath);
      if (analysis && analysis.potentialSaving > 0) {
        totalPotentialSaving += analysis.potentialSaving;
        analyzedCount++;
        if (parseFloat(analysis.potentialPercent) > 5) {
          log(`  ${path.basename(filePath)}: ${(analysis.originalSize / 1024).toFixed(1)}KB → ${(analysis.testSize / 1024).toFixed(1)}KB (${analysis.potentialPercent}% reduction)`, 'cyan');
        }
      }
    }
    
    if (totalPotentialSaving > 0) {
      log(`💡 Total potential saving: ${(totalPotentialSaving / 1024).toFixed(1)}KB across ${analyzedCount} files`, 'green');
      log('');
    }
  }
  
  // Compress all images
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  for (const imagePath of webpFiles) {
    const result = await compressWebP(imagePath);
    
    if (result.success) {
      successCount++;
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      
      if (result.saved === 0) {
        skippedCount++;
      }
    } else {
      failCount++;
    }
  }
  
  // Summary
  log('', 'reset');
  log('📊 Compression Summary:', 'magenta');
  log('======================', 'magenta');
  log(`✓ Successfully processed: ${successCount}`, 'green');
  if (skippedCount > 0) {
    log(`⚪ Skipped (minimal gain): ${skippedCount}`, 'yellow');
  }
  if (failCount > 0) {
    log(`✗ Failed compressions: ${failCount}`, 'red');
  }
  
  if (successCount > 0 && !DRY_RUN) {
    const totalSaved = totalOriginalSize - totalNewSize;
    const savedPercent = totalOriginalSize > 0 ? ((totalSaved / totalOriginalSize) * 100).toFixed(1) : '0.0';
    
    if (totalSaved > 0) {
      log(`💾 Total size reduction: ${(totalSaved / 1024).toFixed(1)}KB (${savedPercent}%)`, 'cyan');
      log(`📁 Original total: ${(totalOriginalSize / 1024).toFixed(1)}KB`, 'blue');
      log(`📁 Compressed total: ${(totalNewSize / 1024).toFixed(1)}KB`, 'blue');
    } else {
      log(`📁 No significant compression achieved (files already well optimized)`, 'yellow');
    }
    
    if (BACKUP_ORIGINALS) {
      log(`🗂️  Original WebP files backed up to: ${BACKUP_DIR}`, 'yellow');
    }
  }
  
  log('✨ Compression complete!', 'green');
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('WebP Image Compressor', 'magenta');
  log('Usage: node compress-webp.js [options]', 'blue');
  log('');
  log('Options:', 'yellow');
  log('  --dry-run           Preview what would be compressed without making changes', 'cyan');
  log('  --no-backup         Skip creating backup copies of original WebP files', 'cyan');
  log('  --quality=N         Set compression quality (1-100, default: 75)', 'cyan');
  log('  --help, -h          Show this help message', 'cyan');
  log('');
  log('Examples:', 'yellow');
  log('  node compress-webp.js                     # Compress with quality 75 and backup', 'cyan');
  log('  node compress-webp.js --dry-run           # Preview compression', 'cyan');
  log('  node compress-webp.js --quality=60        # More aggressive compression', 'cyan');
  log('  node compress-webp.js --no-backup         # Compress without backup', 'cyan');
  log('');
  log('Quality Guidelines:', 'yellow');
  log('  90-100: Highest quality, larger files', 'cyan');
  log('  75-89:  High quality, good balance (recommended)', 'cyan');
  log('  60-74:  Medium quality, smaller files', 'cyan');
  log('  40-59:  Lower quality, much smaller files', 'cyan');
  process.exit(0);
}

// Validate quality parameter
if (QUALITY < 1 || QUALITY > 100) {
  log('❌ Quality must be between 1 and 100', 'red');
  process.exit(1);
}

// Run the compression
compressAllWebP().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
