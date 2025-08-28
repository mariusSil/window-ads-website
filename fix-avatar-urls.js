#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const avatarMappings = {
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg': '/images/winter-window-care.webp',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg': '/images/professional-window-installation-og.webp',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg': '/images/smart-window-technology.webp',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg': '/images/window-maintenance-schedule.webp',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg': '/images/energy-efficient-windows-og.webp',
  'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg': '/images/adjustment-tools.webp'
};

function replaceAvatarUrls(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    Object.entries(avatarMappings).forEach(([oldUrl, newUrl]) => {
      if (content.includes(oldUrl)) {
        content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${path.relative('.', filePath)}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

function scanDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  items.forEach(item => {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.name.endsWith('.json')) {
      replaceAvatarUrls(fullPath);
    }
  });
}

console.log('🔧 Fixing Avatar URLs...');
scanDirectory('./content');
console.log('✅ Avatar URL replacement completed!');
