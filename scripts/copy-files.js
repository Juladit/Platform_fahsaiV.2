const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const publicSrcDir = path.join(__dirname, '..', 'public', 'src');

console.log('Copying source files to public directory...');

// Copy src to public/src
fs.copySync(srcDir, publicSrcDir, { overwrite: true });

console.log('✓ Source files copied successfully!');
