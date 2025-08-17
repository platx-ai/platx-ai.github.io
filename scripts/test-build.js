const fs = require('fs');
const path = require('path');

console.log('🔍 Testing build script...');

// Check if content directory exists
const contentDir = path.join(__dirname, '../content');
console.log('Content directory:', contentDir);
console.log('Exists:', fs.existsSync(contentDir));

if (fs.existsSync(contentDir)) {
  const items = fs.readdirSync(contentDir);
  console.log('Content items:', items);
  
  items.forEach(item => {
    const itemPath = path.join(contentDir, item);
    const isDir = fs.statSync(itemPath).isDirectory();
    console.log(`  ${item}: ${isDir ? 'directory' : 'file'}`);
    
    if (isDir && !item.startsWith('_')) {
      const mdPath = path.join(itemPath, 'index.md');
      console.log(`    index.md exists: ${fs.existsSync(mdPath)}`);
    }
  });
}