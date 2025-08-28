#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// Read the images.json file to get team photo URLs
const imagesJsonPath = path.join(__dirname, '../public/images/images.json');
const imagesData = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf8'));

// Create team directory if it doesn't exist
const teamDir = path.join(__dirname, '../public/images/team');
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
  console.log('✅ Created team directory:', teamDir);
}

// Function to download and convert image to WebP
async function downloadAndConvertImage(url, outputPath, altText) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading: ${url}`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          
          // Convert to WebP with optimization
          await sharp(buffer)
            .webp({ 
              quality: 85, 
              effort: 6,
              lossless: false 
            })
            .resize(400, 400, { 
              fit: 'cover', 
              position: 'center' 
            })
            .toFile(outputPath);
          
          console.log(`✅ Converted and saved: ${outputPath}`);
          resolve();
        } catch (error) {
          reject(new Error(`Failed to convert image: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Main download function
async function downloadAllTeamPhotos() {
  console.log('🚀 Starting team photo download process...\n');
  
  const teamPhotos = imagesData.teamPhotos.photos;
  const results = [];
  
  for (const photo of teamPhotos) {
    try {
      const outputPath = path.join(__dirname, '../public', photo.localPath);
      await downloadAndConvertImage(photo.googleUrl, outputPath, photo.alt);
      
      // Mark as downloaded in the data
      photo.downloaded = true;
      results.push({
        name: photo.name,
        role: photo.role,
        status: 'success',
        localPath: photo.localPath
      });
      
    } catch (error) {
      console.error(`❌ Failed to download ${photo.name}: ${error.message}`);
      results.push({
        name: photo.name,
        role: photo.role,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  // Update images.json with download status
  imagesData.teamPhotos.lastUpdated = new Date().toISOString();
  fs.writeFileSync(imagesJsonPath, JSON.stringify(imagesData, null, 2));
  
  // Print summary
  console.log('\n📊 Download Summary:');
  console.log('==================');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`✅ Successfully downloaded: ${successful.length} photos`);
  successful.forEach(photo => {
    console.log(`   - ${photo.name} (${photo.role})`);
  });
  
  if (failed.length > 0) {
    console.log(`❌ Failed downloads: ${failed.length} photos`);
    failed.forEach(photo => {
      console.log(`   - ${photo.name}: ${photo.error}`);
    });
  }
  
  console.log(`\n🎯 Team photos saved to: ${teamDir}`);
  console.log('📝 Updated images.json with download status');
  
  return results;
}

// Run the download process
if (require.main === module) {
  downloadAllTeamPhotos()
    .then(() => {
      console.log('\n🎉 Team photo download process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Download process failed:', error.message);
      process.exit(1);
    });
}

module.exports = { downloadAllTeamPhotos };
