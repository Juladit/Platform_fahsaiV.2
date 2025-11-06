const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const publicSrcDir = path.join(__dirname, '..', 'public', 'src');

console.log('Checking source files...');

// Check if src directory exists
if (fs.existsSync(srcDir)) {
  console.log('Copying source files to public directory...');
  // Copy src to public/src
  fs.copySync(srcDir, publicSrcDir, { overwrite: true });
  console.log('✓ Source files copied successfully!');
} else {
  console.log('✓ Source files already in public/src directory - skipping copy');
}
