#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// Configuration
const TEMP_DIR = './temp-downloads';
const IMAGES_DIR = './public/images';
const WEBP_QUALITY = 65; // Aggressive compression for optimal file size
const WEBP_EFFORT = 6; // Maximum effort for best compression
const DRY_RUN = process.argv.includes('--dry-run');

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

// Read the images.json file
const imagesJsonPath = path.join(__dirname, 'public', 'images', 'images.json');
let imageData;

try {
  imageData = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf8'));
} catch (error) {
  log('❌ Failed to read images.json', 'red');
  process.exit(1);
}

// Create directories
function createDirectories() {
  if (!DRY_RUN) {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
      log(`Created temp directory: ${TEMP_DIR}`, 'blue');
    }
    
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
      log(`Created images directory: ${IMAGES_DIR}`, 'blue');
    }
  }
}

// Function to download a file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to get file extension from URL
function getFileExtension(localPath, googleUrl) {
  // First try to get extension from local path
  const localExt = path.extname(localPath);
  if (localExt && localExt !== '.webp') {
    return localExt;
  }
  
  // If Google URL ends with .png, use .png, otherwise default to .jpg
  if (googleUrl.includes('.png')) {
    return '.png';
  }
  
  return '.jpg';
}

// Convert image to WebP
async function convertToWebP(inputPath, outputPath) {
  try {
    const inputStats = fs.statSync(inputPath);
    const inputSize = inputStats.size;
    
    await sharp(inputPath)
      .webp({ 
        quality: WEBP_QUALITY,
        effort: WEBP_EFFORT,
        lossless: false
      })
      .toFile(outputPath);
    
    const outputStats = fs.statSync(outputPath);
    const outputSize = outputStats.size;
    const saved = inputSize - outputSize;
    const savedPercent = ((saved / inputSize) * 100).toFixed(1);
    
    return { inputSize, outputSize, saved, savedPercent };
  } catch (error) {
    throw new Error(`WebP conversion failed: ${error.message}`);
  }
}

// Update images.json to mark as processed
function updateImagesJson(processedMappings) {
  if (DRY_RUN) return;
  
  try {
    // Mark processed mappings as replaced
    processedMappings.forEach(processedMapping => {
      const mapping = imageData.mappings.find(m => m.googleUrl === processedMapping.googleUrl);
      if (mapping) {
        mapping.replaced = true;
        mapping.processedAt = new Date().toISOString();
        mapping.finalSize = processedMapping.finalSize;
        mapping.compressionRatio = processedMapping.compressionRatio;
      }
    });
    
    // Update metadata
    imageData.lastProcessed = new Date().toISOString();
    imageData.processedCount = imageData.mappings.filter(m => m.replaced).length;
    
    fs.writeFileSync(imagesJsonPath, JSON.stringify(imageData, null, 2));
    log('✓ Updated images.json with processing results', 'green');
  } catch (error) {
    log(`⚠️  Failed to update images.json: ${error.message}`, 'yellow');
  }
}

// Clean up temp directory
function cleanupTempDir() {
  if (DRY_RUN) return;
  
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      log('🗑️  Cleaned up temp directory', 'blue');
    }
  } catch (error) {
    log(`⚠️  Failed to cleanup temp directory: ${error.message}`, 'yellow');
  }
}

// Main processing function
async function processAllImages() {
  log('🚀 Google Storage Image Processor', 'magenta');
  log('=================================', 'magenta');
  log('📋 Pipeline: Download → Convert to WebP → Compress → Deploy', 'blue');
  log('');
  
  if (DRY_RUN) {
    log('🔍 Running in DRY RUN mode - no files will be modified', 'yellow');
  }
  
  // Check if sharp is installed
  try {
    require('sharp');
  } catch (error) {
    log('❌ Sharp library not found. Please install it first:', 'red');
    log('npm install sharp', 'yellow');
    process.exit(1);
  }
  
  // Extract all mappings from the nested structure
  let allMappings = [];
  
  if (imageData.googleStorageReplacements) {
    const { originalMappings, intelligentMappings, avatarMappings } = imageData.googleStorageReplacements;
    
    if (originalMappings && originalMappings.mappings) {
      allMappings = allMappings.concat(originalMappings.mappings);
    }
    if (intelligentMappings && intelligentMappings.mappings) {
      allMappings = allMappings.concat(intelligentMappings.mappings);
    }
    if (avatarMappings && avatarMappings.mappings) {
      allMappings = allMappings.concat(avatarMappings.mappings);
    }
  } else if (imageData.mappings && Array.isArray(imageData.mappings)) {
    // Fallback to old structure
    allMappings = imageData.mappings;
  }
  
  if (allMappings.length === 0) {
    log('❌ No image mappings found in images.json', 'red');
    process.exit(1);
  }
  
  // Filter unprocessed mappings (those marked as not replaced or missing the replaced flag)
  const unprocessedMappings = allMappings.filter(mapping => 
    mapping.googleUrl && (!mapping.replaced || mapping.replaced === false)
  );
  
  if (unprocessedMappings.length === 0) {
    log('✅ All images already processed!', 'green');
    return;
  }
  
  log(`Found ${unprocessedMappings.length} images to process:`, 'blue');
  unprocessedMappings.forEach(mapping => {
    log(`  • ${path.basename(mapping.localPath)} ← ${mapping.googleUrl.substring(0, 60)}...`, 'cyan');
  });
  log('');
  
  // Create directories
  createDirectories();
  
  let successCount = 0;
  let errorCount = 0;
  let totalOriginalSize = 0;
  let totalFinalSize = 0;
  const processedMappings = [];
  
  // Process each image
  for (const mapping of unprocessedMappings) {
    const fileName = path.basename(mapping.localPath, path.extname(mapping.localPath));
    
    try {
      if (DRY_RUN) {
        log(`[DRY RUN] Would process: ${fileName}`, 'yellow');
        successCount++;
        continue;
      }
      
      // Step 1: Download
      const extension = getFileExtension(mapping.localPath, mapping.googleUrl);
      const tempFileName = `${fileName}${extension}`;
      const tempPath = path.join(TEMP_DIR, tempFileName);
      
      log(`📥 Downloading: ${fileName}${extension}`, 'blue');
      await downloadFile(mapping.googleUrl, tempPath);
      
      // Step 2: Convert to WebP
      const webpFileName = `${fileName}.webp`;
      const finalPath = path.join(IMAGES_DIR, webpFileName);
      
      log(`🔄 Converting to WebP: ${webpFileName}`, 'blue');
      const conversionResult = await convertToWebP(tempPath, finalPath);
      
      // Step 3: Track results
      totalOriginalSize += conversionResult.inputSize;
      totalFinalSize += conversionResult.outputSize;
      
      processedMappings.push({
        googleUrl: mapping.googleUrl,
        localPath: mapping.localPath,
        finalSize: conversionResult.outputSize,
        compressionRatio: conversionResult.savedPercent
      });
      
      log(`✓ Processed: ${webpFileName}`, 'green');
      log(`  Size: ${(conversionResult.inputSize / 1024).toFixed(1)}KB → ${(conversionResult.outputSize / 1024).toFixed(1)}KB (${conversionResult.savedPercent}% smaller)`, 'cyan');
      
      // Clean up temp file
      fs.unlinkSync(tempPath);
      
      successCount++;
      
    } catch (error) {
      log(`✗ Failed to process ${fileName}: ${error.message}`, 'red');
      errorCount++;
    }
  }
  
  // Update images.json
  if (!DRY_RUN && successCount > 0) {
    updateImagesJson(processedMappings);
  }
  
  // Clean up temp directory
  cleanupTempDir();
  
  // Summary
  log('', 'reset');
  log('📊 Processing Summary:', 'magenta');
  log('====================', 'magenta');
  log(`✓ Successfully processed: ${successCount}`, 'green');
  if (errorCount > 0) {
    log(`✗ Failed processing: ${errorCount}`, 'red');
  }
  
  if (successCount > 0 && !DRY_RUN) {
    const totalSaved = totalOriginalSize - totalFinalSize;
    const savedPercent = totalOriginalSize > 0 ? ((totalSaved / totalOriginalSize) * 100).toFixed(1) : '0.0';
    
    log(`💾 Total size reduction: ${(totalSaved / 1024 / 1024).toFixed(2)}MB (${savedPercent}%)`, 'cyan');
    log(`📁 Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`, 'blue');
    log(`📁 WebP total: ${(totalFinalSize / 1024 / 1024).toFixed(2)}MB`, 'blue');
    log(`🎯 Quality setting: ${WEBP_QUALITY}% with effort level ${WEBP_EFFORT}`, 'blue');
    log(`📂 Images saved to: ${IMAGES_DIR}`, 'blue');
  }
  
  log('✨ Processing complete!', 'green');
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('Google Storage Image Processor', 'magenta');
  log('Usage: node process-google-images.js [options]', 'blue');
  log('');
  log('Options:', 'yellow');
  log('  --dry-run      Preview what would be processed without making changes', 'cyan');
  log('  --help, -h     Show this help message', 'cyan');
  log('');
  log('Pipeline:', 'yellow');
  log('  1. Download images from Google Storage URLs', 'cyan');
  log('  2. Convert to WebP format (quality 65%)', 'cyan');
  log('  3. Compress with maximum effort', 'cyan');
  log('  4. Save to /public/images/ directory', 'cyan');
  log('  5. Update images.json with results', 'cyan');
  process.exit(0);
}

// Run the processing
processAllImages().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
