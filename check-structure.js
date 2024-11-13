// check-structure.js
const fs = require('fs');
const path = require('path');

const requiredStructure = {
  'components': {
    'ui': ['alert.tsx', 'card.tsx']
  },
  'pages': ['shield.tsx', '_app.tsx', 'index.tsx']
};

function checkStructure(structure, dir = '.') {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(dir, name);

    if (!fs.existsSync(fullPath)) {
      console.error(`Missing: ${fullPath}`);
      continue;
    }

    if (Array.isArray(content)) {
      // Check files
      content.forEach(file => {
        const filePath = path.join(fullPath, file);
        if (!fs.existsSync(filePath)) {
          console.error(`Missing file: ${filePath}`);
        } else {
          console.log(`✓ Found: ${filePath}`);
        }
      });
    } else {
      // Recurse into directory
      checkStructure(content, fullPath);
    }
  }
}

console.log('Checking project structure...');
checkStructure(requiredStructure);