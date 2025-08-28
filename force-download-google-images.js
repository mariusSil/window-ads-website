#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// Configuration
const TEMP_DIR = './temp-downloads';
const IMAGES_DIR = './public/images';
const WEBP_QUALITY = 65;
const WEBP_EFFORT = 6;
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

// Read images.json and extract all Google Storage URLs
function extractGoogleStorageUrls() {
  const imagesJsonPath = path.join(__dirname, 'public', 'images', 'images.json');
  
  try {
    const imageData = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf8'));
    const allMappings = [];
    
    if (imageData.googleStorageReplacements) {
      const { originalMappings, intelligentMappings, avatarMappings } = imageData.googleStorageReplacements;
      
      if (originalMappings && originalMappings.mappings) {
        allMappings.push(...originalMappings.mappings);
      }
      if (intelligentMappings && intelligentMappings.mappings) {
        allMappings.push(...intelligentMappings.mappings);
      }
      if (avatarMappings && avatarMappings.mappings) {
        allMappings.push(...avatarMappings.mappings);
      }
    }
    
    return allMappings;
  } catch (error) {
    log(`❌ Failed to read images.json: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Create directories
function createDirectories() {
  if (!DRY_RUN) {
    [TEMP_DIR, IMAGES_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`Created directory: ${dir}`, 'blue');
      }
    });
  }
}

// Download file
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
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Convert to WebP
async function convertToWebP(inputPath, outputPath) {
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
}

// Main processing function
async function forceDownloadAndProcess() {
  log('🚀 Force Download Google Storage Images', 'magenta');
  log('=====================================', 'magenta');
  log('📋 Pipeline: Extract URLs → Download → Convert → Compress', 'blue');
  log('');
  
  if (DRY_RUN) {
    log('🔍 Running in DRY RUN mode - no files will be modified', 'yellow');
  }
  
  // Check dependencies
  try {
    require('sharp');
  } catch (error) {
    log('❌ Sharp library not found. Please install it first:', 'red');
    log('npm install sharp', 'yellow');
    process.exit(1);
  }
  
  // Create directories
  createDirectories();
  
  // Extract Google Storage URLs from images.json
  log('🔍 Extracting Google Storage URLs from images.json...', 'blue');
  const mappings = extractGoogleStorageUrls();
  
  if (mappings.length === 0) {
    log('❌ No Google Storage URLs found in images.json', 'red');
    process.exit(1);
  }
  
  log(`Found ${mappings.length} Google Storage URLs to process:`, 'blue');
  mappings.forEach((mapping, index) => {
    const filename = path.basename(mapping.localPath);
    log(`  ${index + 1}. ${filename} ← ${mapping.googleUrl.substring(0, 60)}...`, 'cyan');
  });
  log('');
  
  // Process each mapping
  let successCount = 0;
  let errorCount = 0;
  let totalOriginalSize = 0;
  let totalFinalSize = 0;
  
  for (const mapping of mappings) {
    const filename = path.basename(mapping.localPath);
    const finalPath = path.join(IMAGES_DIR, filename);
    
    try {
      if (DRY_RUN) {
        log(`[DRY RUN] Would process: ${filename}`, 'yellow');
        successCount++;
        continue;
      }
      
      // Step 1: Download
      const extension = mapping.googleUrl.includes('.png') ? '.png' : '.jpg';
      const tempFilename = `temp_${Date.now()}_${filename.replace('.webp', extension)}`;
      const tempPath = path.join(TEMP_DIR, tempFilename);
      
      log(`📥 Downloading: ${filename}`, 'blue');
      await downloadFile(mapping.googleUrl, tempPath);
      
      // Step 2: Convert to WebP
      log(`🔄 Converting to WebP: ${filename}`, 'blue');
      const conversionResult = await convertToWebP(tempPath, finalPath);
      
      // Track results
      totalOriginalSize += conversionResult.inputSize;
      totalFinalSize += conversionResult.outputSize;
      
      log(`✓ Processed: ${filename}`, 'green');
      log(`  Size: ${(conversionResult.inputSize / 1024).toFixed(1)}KB → ${(conversionResult.outputSize / 1024).toFixed(1)}KB (${conversionResult.savedPercent}% smaller)`, 'cyan');
      
      // Clean up temp file
      fs.unlinkSync(tempPath);
      
      successCount++;
      
    } catch (error) {
      log(`✗ Failed to process ${filename}: ${error.message}`, 'red');
      errorCount++;
    }
  }
  
  // Clean up temp directory
  if (!DRY_RUN && fs.existsSync(TEMP_DIR)) {
    try {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      log('🗑️  Cleaned up temp directory', 'blue');
    } catch (error) {
      log(`⚠️  Failed to cleanup temp directory: ${error.message}`, 'yellow');
    }
  }
  
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
  log('Force Download Google Storage Images', 'magenta');
  log('Usage: node force-download-google-images.js [options]', 'blue');
  log('');
  log('Options:', 'yellow');
  log('  --dry-run      Preview what would be processed without making changes', 'cyan');
  log('  --help, -h     Show this help message', 'cyan');
  log('');
  log('Description:', 'yellow');
  log('  Downloads and processes all Google Storage URLs from images.json', 'cyan');
  log('  regardless of their "replaced" status. Converts to optimized WebP.', 'cyan');
  process.exit(0);
}

// Run the processing
forceDownloadAndProcess().catch(error => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
