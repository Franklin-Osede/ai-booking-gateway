const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', '(admin)');

const replacements = [
  { regex: /\btext-neutral-300\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-neutral-600\b/g, replacement: 'text-muted-foreground' },
  { regex: /\bbg-black\b/g, replacement: 'bg-background' },
  { regex: /\bbg-white\b/g, replacement: 'bg-foreground' },
  { regex: /\btext-white\b/g, replacement: 'text-background' },
  { regex: /\btext-black\b/g, replacement: 'text-background' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      processFile(fullPath);
    }
  });
}

console.log('Starting second string replacement...');
processDirectory(directoryPath);
console.log('Done.');
