const fs = require('fs');
const path = require('path');

// Read all JPG files from the anniversary folder
const anniversaryFolder = path.join(__dirname, '../public/assets/gallery/2022/anniversary');
const files = fs.readdirSync(anniversaryFolder)
  .filter(file => file.toUpperCase().endsWith('.JPG'))
  .sort();

// Read the current config file
const configPath = path.join(__dirname, '../src/data/gallery/config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');

// Generate the array string with proper formatting
const arrayString = files.map(file => `'${file}'`).join(',\n      ');

// Replace the anniversary array in the config
const regex = /anniversary:\s*\[[^\]]*\]/s;
const replacement = `anniversary: [\n      ${arrayString}\n    ]`;

configContent = configContent.replace(regex, replacement);

// Write back to file
fs.writeFileSync(configPath, configContent, 'utf8');

console.log(`Updated config with ${files.length} anniversary images`);

