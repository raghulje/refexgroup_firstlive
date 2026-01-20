const fs = require('fs');
const path = require('path');

// Read the image mapping
const mappingPath = path.join(__dirname, '../uploads/image_mapping.json');
let imageMapping = {};

if (fs.existsSync(mappingPath)) {
  imageMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
}

function replaceUrlsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace each URL with local path
  Object.entries(imageMapping).forEach(([url, localPath]) => {
    // Escape special regex characters in URL
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    
    if (content.includes(url)) {
      content = content.replace(regex, localPath);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
    return true;
  }

  return false;
}

async function updateAllSeeders() {
  console.log('🔄 Updating all seed files with local image paths...\n');

  if (Object.keys(imageMapping).length === 0) {
    console.log('⚠️  No image mapping found. Please run "npm run download-images" first.');
    return;
  }

  const seedFiles = [
    'seed_home_page.js',
    'seed_about_page.js',
    'seed_careers_page.js',
    'seed_contact_page.js',
    'seed_investments_page.js',
    'seed_diversity_inclusion_page.js',
    'seed_gallery.js',
    'seed_business_pages.js',
    'seed_business_pages_2.js',
    'seed_business_pages_3.js',
    'seed_business_pages_4.js',
    'seed_awards.js',
    'seed_leaders.js',
    'seed_newsroom.js',
    'seed_business_cards.js',
    'seed_core_values.js',
    'seed_sdg_cards.js'
  ];

  let updatedCount = 0;

  for (const seedFile of seedFiles) {
    const filePath = path.join(__dirname, seedFile);
    if (replaceUrlsInFile(filePath)) {
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} seed files`);
}

if (require.main === module) {
  updateAllSeeders().catch(console.error);
}

module.exports = { updateAllSeeders, replaceUrlsInFile };

