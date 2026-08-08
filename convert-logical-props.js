const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define replacements
const replacements = [
  { regex: /\bml-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'ms-$1' },
  { regex: /\bmr-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'me-$1' },
  { regex: /\bpl-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'ps-$1' },
  { regex: /\bpr-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'pe-$1' },
  { regex: /\btext-left\b/g, replace: 'text-start' },
  { regex: /\btext-right\b/g, replace: 'text-end' },
  { regex: /\bleft-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'start-$1' },
  { regex: /\bright-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'end-$1' },
  { regex: /\bborder-l-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'border-s-$1' },
  { regex: /\bborder-r-([0-9a-zA-Z\-\[\]\.]+)\b/g, replace: 'border-e-$1' },
];

let updatedCount = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
        updatedCount++;
      }
    }
  }
}

walkDir('src');
console.log(`Updated ${updatedCount} files.`);
