#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const IMAGES_DIR = './public/images';
const BACKUP_DIR = './public/images/backup';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const WEBP_QUALITY = 85; // High quality WebP conversion
const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP_ORIGINALS = !process.argv.includes('--no-backup');

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

// Get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip backup directory to avoid infinite loops
      if (file !== 'backup') {
        getAllImageFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
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

// Convert single image to WebP
async function convertToWebP(inputPath) {
  const parsedPath = path.parse(inputPath);
  const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
  const backupPath = BACKUP_ORIGINALS ? path.join(BACKUP_DIR, path.basename(inputPath)) : null;
  
  try {
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;
    
    if (DRY_RUN) {
      log(`[DRY RUN] Would convert: ${inputPath} → ${outputPath}`, 'yellow');
      return { success: true, originalSize, newSize: 0, saved: 0 };
    }
    
    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    
    // Get new file size
    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    // Backup original if requested
    if (BACKUP_ORIGINALS) {
      fs.copyFileSync(inputPath, backupPath);
    }
    
    // Remove original file
    fs.unlinkSync(inputPath);
    
    log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`, 'green');
    log(`  Size: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savedPercent}% smaller)`, 'cyan');
    
    return { success: true, originalSize, newSize, saved };
    
  } catch (error) {
    log(`✗ Failed to convert ${inputPath}: ${error.message}`, 'red');
    return { success: false, originalSize: 0, newSize: 0, saved: 0 };
  }
}

// Update images.json file
function updateImagesJson() {
  const imagesJsonPath = path.join(IMAGES_DIR, 'images.json');
  
  if (!fs.existsSync(imagesJsonPath)) {
    log('images.json not found, skipping update', 'yellow');
    return;
  }
  
  try {
    const content = fs.readFileSync(imagesJsonPath, 'utf8');
    const data = JSON.parse(content);
    
    if (data.mappings && Array.isArray(data.mappings)) {
      let updatedCount = 0;
      
      data.mappings.forEach(mapping => {
        if (mapping.old) {
          const originalPath = mapping.old;
          // Replace .jpg, .jpeg, .png with .webp
          const webpPath = originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          if (webpPath !== originalPath) {
            mapping.old = webpPath;
            updatedCount++;
          }
        }
      });
      
      if (updatedCount > 0) {
        if (!DRY_RUN) {
          fs.writeFileSync(imagesJsonPath, JSON.stringify(data, null, 2));
          log(`✓ Updated ${updatedCount} paths in images.json`, 'green');
        } else {
          log(`[DRY RUN] Would update ${updatedCount} paths in images.json`, 'yellow');
        }
      }
    }
  } catch (error) {
    log(`✗ Failed to update images.json: ${error.message}`, 'red');
  }
}

// Main conversion function
async function convertAllImages() {
  log('🖼️  WebP Image Converter', 'magenta');
  log('========================', 'magenta');
  
  if (DRY_RUN) {
    log('🔍 Running in DRY RUN mode - no files will be modified', 'yellow');
  }
  
  if (BACKUP_ORIGINALS && !DRY_RUN) {
    log('💾 Backup mode enabled - originals will be saved to backup folder', 'blue');
  }
  
  // Check if sharp is installed
  try {
    require('sharp');
  } catch (error) {
    log('❌ Sharp library not found. Please install it first:', 'red');
    log('npm install sharp', 'yellow');
    process.exit(1);
  }
  
  // Create backup directory
  if (!DRY_RUN) {
    createBackupDir();
  }
  
  // Get all image files
  const imageFiles = getAllImageFiles(IMAGES_DIR);
  
  if (imageFiles.length === 0) {
    log('No JPG/PNG images found to convert', 'yellow');
    return;
  }
  
  log(`Found ${imageFiles.length} images to convert:`, 'blue');
  imageFiles.forEach(file => log(`  • ${file}`, 'cyan'));
  log('');
  
  // Convert all images
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let failCount = 0;
  
  for (const imagePath of imageFiles) {
    const result = await convertToWebP(imagePath);
    
    if (result.success) {
      successCount++;
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
    } else {
      failCount++;
    }
  }
  
  // Update images.json
  if (!DRY_RUN && successCount > 0) {
    updateImagesJson();
  }
  
  // Summary
  log('', 'reset');
  log('📊 Conversion Summary:', 'magenta');
  log('===================', 'magenta');
  log(`✓ Successfully converted: ${successCount}`, 'green');
  if (failCount > 0) {
    log(`✗ Failed conversions: ${failCount}`, 'red');
  }
  
  if (successCount > 0 && !DRY_RUN) {
    const totalSaved = totalOriginalSize - totalNewSize;
    const savedPercent = ((totalSaved / totalOriginalSize) * 100).toFixed(1);
    
    log(`💾 Total size reduction: ${(totalSaved / 1024 / 1024).toFixed(2)}MB (${savedPercent}%)`, 'cyan');
    log(`📁 Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`, 'blue');
    log(`📁 WebP total: ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`, 'blue');
    
    if (BACKUP_ORIGINALS) {
      log(`🗂️  Original files backed up to: ${BACKUP_DIR}`, 'yellow');
    }
  }
  
  log('✨ Conversion complete!', 'green');
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('WebP Image Converter', 'magenta');
  log('Usage: node convert-to-webp.js [options]', 'blue');
  log('');
  log('Options:', 'yellow');
  log('  --dry-run      Preview what would be converted without making changes', 'cyan');
  log('  --no-backup    Skip creating backup copies of original files', 'cyan');
  log('  --help, -h     Show this help message', 'cyan');
  log('');
  log('Examples:', 'yellow');
  log('  node convert-to-webp.js                    # Convert all images with backup', 'cyan');
  log('  node convert-to-webp.js --dry-run          # Preview conversion', 'cyan');
  log('  node convert-to-webp.js --no-backup        # Convert without backup', 'cyan');
  process.exit(0);
}

// Run the conversion
convertAllImages().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
