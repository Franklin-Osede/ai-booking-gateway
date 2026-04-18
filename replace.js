const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', '(admin)');

const replacements = [
  { regex: /\bbg-neutral-900\b/g, replacement: 'bg-card' },
  { regex: /\bbg-neutral-950\b/g, replacement: 'bg-muted' },
  { regex: /\bbg-neutral-800\b/g, replacement: 'bg-muted' },
  { regex: /\bbg-black\b/g, replacement: 'bg-background' },
  { regex: /\bborder-neutral-800\b/g, replacement: 'border-border' },
  { regex: /\bborder-neutral-700\b/g, replacement: 'border-border' },
  { regex: /\btext-neutral-400\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-neutral-500\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-white\b/g, replacement: 'text-foreground' },
  { regex: /\bhover:text-white\b/g, replacement: 'hover:text-foreground' },
  { regex: /\bhover:bg-neutral-800\b/g, replacement: 'hover:bg-muted' },
  { regex: /\bhover:bg-neutral-700\b/g, replacement: 'hover:bg-muted' }
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

console.log('Starting string replacement...');
processDirectory(directoryPath);
console.log('Done.');
