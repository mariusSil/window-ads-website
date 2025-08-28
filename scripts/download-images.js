#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Read the images.json file
const imagesJsonPath = path.join(__dirname, 'public', 'images', 'images.json');
const imageData = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf8'));

// Create news directory if it doesn't exist
const newsDir = path.join(__dirname, 'public', 'images', 'news');
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir, { recursive: true });
  console.log('Created directory:', newsDir);
}

// Function to download a file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
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

// Function to get file extension from URL or default to .jpg
function getFileExtension(oldPath, newUrl) {
  // First try to get extension from original path
  const oldExt = path.extname(oldPath);
  if (oldExt) {
    return oldExt;
  }
  
  // If new URL ends with .png, use .png, otherwise default to .jpg
  if (newUrl.includes('.png')) {
    return '.png';
  }
  
  return '.jpg';
}

// Main download function
async function downloadAllImages() {
  console.log('Starting image download...');
  console.log(`Found ${imageData.mappings.length} images to download\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const mapping of imageData.mappings) {
    try {
      // Extract filename from old path and determine extension
      const oldPath = mapping.old;
      const fileName = path.basename(oldPath, path.extname(oldPath));
      const extension = getFileExtension(oldPath, mapping.new);
      
      // Create output path
      const outputPath = path.join(__dirname, 'public', oldPath.replace(/^\//, ''));
      
      // Ensure the directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Download the file
      await downloadFile(mapping.new, outputPath);
      successCount++;
      
    } catch (error) {
      console.error(`✗ Failed to download ${mapping.old}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n--- Download Summary ---');
  console.log(`✓ Successful downloads: ${successCount}`);
  console.log(`✗ Failed downloads: ${errorCount}`);
  console.log(`📁 Images saved to: ${path.join(__dirname, 'public', 'images', 'news')}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 All images downloaded successfully!');
  } else {
    console.log('\n⚠️  Some downloads failed. Check the error messages above.');
  }
}

// Run the download
downloadAllImages().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
