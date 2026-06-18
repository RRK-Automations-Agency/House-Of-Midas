const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, 'assets');
const SEQUENCE_DIR = path.resolve(__dirname, 'public/images/ring-sequence');

function removeDuplicateFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    if (err && (err.code === 'EBUSY' || err.code === 'EPERM')) {
      console.warn(`Skipped locked duplicate file during flattening: ${filePath}`);
      return;
    }
    throw err;
  }
}

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 1. Copy sequence images from public/images/ring-sequence to assets/
if (fs.existsSync(SEQUENCE_DIR)) {
  const files = fs.readdirSync(SEQUENCE_DIR);
  let count = 0;
  
  files.forEach(file => {
    if (file.endsWith('.jpg')) {
      const match = file.match(/(\d+)\.jpg/);
      if (match) {
        const num = match[1];
        const srcPath = path.join(SEQUENCE_DIR, file);
        const destPath = path.join(ASSETS_DIR, `ring-${num}.jpg`);
        fs.copyFileSync(srcPath, destPath);
        count++;
      }
    }
  });
  console.log(`Successfully flattened ${count} sequence images to assets/`);
}

// 2. Flatten other images from public/images (recursively) to assets/
const IMAGES_DIR = path.resolve(__dirname, 'public/images');
const visitPublic = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      if (file !== 'ring-sequence') { // Already handled
        visitPublic(fullPath);
      }
    } else {
      const destPath = path.join(ASSETS_DIR, file);
      try {
        fs.copyFileSync(fullPath, destPath);
      } catch (err) {
        if (err && (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'UNKNOWN' || err.errno === -4094)) {
          console.warn(`Skipped locked file during copy: ${file}. It likely already exists and is busy.`);
        } else {
          throw err;
        }
      }
    }
  });
};

if (fs.existsSync(IMAGES_DIR)) {
  visitPublic(IMAGES_DIR);
}

// 3. CRITICAL: Flatten any nested files that Vite might have put in assets/ subfolders
// Shopify does NOT support subfolders in the assets directory.
const flattenDirectory = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      flattenDirectory(fullPath); // Recurse
      try {
        fs.rmdirSync(fullPath); // Remove directory once empty
      } catch (e) {
        // Directory might not be empty yet if we didn't move everything
      }
    } else {
      const parentDir = path.dirname(fullPath);
      if (parentDir !== ASSETS_DIR) {
        const destPath = path.join(ASSETS_DIR, file);
        if (!fs.existsSync(destPath)) {
          fs.renameSync(fullPath, destPath);
        } else {
          removeDuplicateFile(fullPath); // Delete if duplicate (already in root)
        }
      }
    }
  });
};

// Run final flattening on the assets dir
flattenDirectory(ASSETS_DIR);
console.log('Final asset flattening complete for Shopify compatibility.');

// Copy landing-preloader.html to assets/ for deployment environments
const PRELOADER_SRC = path.resolve(__dirname, 'landing-preloader.html');
const PRELOADER_DEST = path.join(ASSETS_DIR, 'landing-preloader.html');
if (fs.existsSync(PRELOADER_SRC)) {
  fs.copyFileSync(PRELOADER_SRC, PRELOADER_DEST);
  console.log('Successfully copied landing-preloader.html to assets/');
}