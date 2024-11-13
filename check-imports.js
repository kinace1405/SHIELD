// check-imports.js
const fs = require('fs');
const path = require('path');

function checkImports(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      checkImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('/UI/')) {
        console.log(`Found uppercase UI import in: ${filePath}`);

        // Fix the imports
        const fixedContent = content.replace(/\/UI\//g, '/ui/');
        fs.writeFileSync(filePath, fixedContent);
        console.log(`Fixed imports in: ${filePath}`);
      }
    }
  });
}

console.log('Starting import check...');
checkImports('./pages');
checkImports('./components');
console.log('Import check complete!');