#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the images.json file to get team photo mappings
const imagesJsonPath = path.join(__dirname, '../public/images/images.json');
const imagesData = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf8'));

// Team photo mapping from old paths to new paths
const teamPhotoMappings = {
  '/images/team/team-arkadiusz-kowalczyk-senior-technician.webp': '/images/team/arek-kowalczyk.webp',
  '/images/team/team-katarzyna-nowak-installation-specialist.webp': '/images/team/katarzyna-nowak.webp',
  '/images/team/team-tomasz-wisniewski-security-expert.webp': '/images/team/tomasz-wisniewski.webp',
  '/images/team/team-jakub-zielinski-maintenance-specialist.webp': '/images/team/jakub-zielinski.webp',
  '/images/team/team-stanislaw-dabrowski-restoration-expert.webp': '/images/team/stanislaw-dabrowski.webp',
  '/images/team/team-pawel-lewandowski-emergency-technician.webp': '/images/team/pawel-lewandowski.webp',
  '/images/team/team-michal-wojcik-insulation-specialist.webp': '/images/team/michal-wojcik.webp',
  '/images/team/team-grzegorz-szymanski-quality-inspector.webp': '/images/team/grzegorz-szymanski.webp'
};

// Function to recursively find all JSON files
function findJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to replace team photo paths in content
function replaceTeamPhotosInContent(content) {
  let updatedContent = content;
  let replacementCount = 0;
  
  Object.entries(teamPhotoMappings).forEach(([oldPath, newPath]) => {
    const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = updatedContent.match(regex);
    if (matches) {
      updatedContent = updatedContent.replace(regex, newPath);
      replacementCount += matches.length;
    }
  });
  
  return { content: updatedContent, replacements: replacementCount };
}

// Function to create backup
function createBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, `../content-backup-team-photos-${timestamp}`);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const relativePath = path.relative(path.join(__dirname, '../content'), filePath);
  const backupPath = path.join(backupDir, relativePath);
  const backupDirPath = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDirPath)) {
    fs.mkdirSync(backupDirPath, { recursive: true });
  }
  
  fs.copyFileSync(filePath, backupPath);
  return backupDir;
}

// Main replacement function
async function replaceAllTeamPhotos() {
  console.log('🚀 Starting team photo replacement process...\n');
  
  const contentDir = path.join(__dirname, '../content');
  const jsonFiles = findJsonFiles(contentDir);
  
  let totalReplacements = 0;
  let filesModified = 0;
  let backupCreated = false;
  let backupDir = '';
  
  const results = [];
  
  for (const filePath of jsonFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { content: updatedContent, replacements } = replaceTeamPhotosInContent(content);
      
      if (replacements > 0) {
        // Create backup on first modification
        if (!backupCreated) {
          backupDir = createBackup(filePath);
          backupCreated = true;
          console.log(`📁 Created backup directory: ${backupDir}`);
        } else {
          createBackup(filePath);
        }
        
        // Write updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        
        const relativePath = path.relative(contentDir, filePath);
        console.log(`✅ Updated ${relativePath} - ${replacements} replacements`);
        
        totalReplacements += replacements;
        filesModified++;
        
        results.push({
          file: relativePath,
          replacements: replacements,
          status: 'success'
        });
      }
    } catch (error) {
      const relativePath = path.relative(contentDir, filePath);
      console.error(`❌ Failed to process ${relativePath}: ${error.message}`);
      
      results.push({
        file: relativePath,
        replacements: 0,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  // Update images.json with replacement info
  if (!imagesData.teamPhotoReplacements) {
    imagesData.teamPhotoReplacements = {};
  }
  
  imagesData.teamPhotoReplacements = {
    description: "Team photo replacement process documentation",
    lastUpdated: new Date().toISOString(),
    totalReplacements: totalReplacements,
    filesModified: filesModified,
    backupDirectory: backupDir,
    mappings: teamPhotoMappings,
    processedFiles: results
  };
  
  fs.writeFileSync(imagesJsonPath, JSON.stringify(imagesData, null, 2));
  
  // Print summary
  console.log('\n📊 Replacement Summary:');
  console.log('======================');
  console.log(`✅ Files modified: ${filesModified}`);
  console.log(`🔄 Total replacements: ${totalReplacements}`);
  console.log(`📁 Backup created: ${backupDir}`);
  
  if (results.length > 0) {
    console.log('\n📝 Detailed Results:');
    results.forEach(result => {
      if (result.status === 'success') {
        console.log(`   ✅ ${result.file}: ${result.replacements} replacements`);
      } else {
        console.log(`   ❌ ${result.file}: ${result.error}`);
      }
    });
  }
  
  console.log('\n🎯 Team Photo Mappings Applied:');
  Object.entries(teamPhotoMappings).forEach(([oldPath, newPath]) => {
    console.log(`   ${oldPath} → ${newPath}`);
  });
  
  return {
    totalReplacements,
    filesModified,
    backupDir,
    results
  };
}

// Run the replacement process
if (require.main === module) {
  replaceAllTeamPhotos()
    .then((summary) => {
      console.log('\n🎉 Team photo replacement process completed!');
      console.log(`📈 Summary: ${summary.totalReplacements} replacements in ${summary.filesModified} files`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Replacement process failed:', error.message);
      process.exit(1);
    });
}

module.exports = { replaceAllTeamPhotos };
