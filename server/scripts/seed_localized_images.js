const { Media } = require('../models');
const fs = require('fs');
const path = require('path');

// Base directory for assets
const ASSETS_DIR = path.join(__dirname, '../../new_client/public/assets');

// Image categories and their directories
const IMAGE_CATEGORIES = {
  awards: {
    directory: 'awards',
    fileType: 'image',
    description: 'Awards and certifications'
  },
  leadership: {
    directory: 'leadership',
    fileType: 'image',
    description: 'Leadership team photos'
  },
  business: {
    directory: 'business',
    fileType: 'image',
    description: 'Business vertical images'
  },
  newsroom: {
    directory: 'newsroom',
    fileType: 'image',
    description: 'Newsroom and press release images'
  },
  careers: {
    directory: 'careers',
    fileType: 'image',
    description: 'Careers section images'
  },
  gallery: {
    directory: 'gallery',
    fileType: 'image',
    description: 'Gallery hero images'
  },
  logos: {
    directory: 'logos',
    fileType: 'logo',
    description: 'Company logos'
  }
};

async function seedLocalizedImages() {
  try {
    console.log('Seeding localized images to Media table...\n');

    let totalSeeded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const [category, config] of Object.entries(IMAGE_CATEGORIES)) {
      const categoryDir = path.join(ASSETS_DIR, config.directory);
      
      if (!fs.existsSync(categoryDir)) {
        console.log(`⚠️  Directory not found: ${categoryDir}`);
        continue;
      }

      console.log(`\n📁 Processing ${category} images...`);
      
      // Get all files in the directory
      const files = fs.readdirSync(categoryDir).filter(file => {
        const filePath = path.join(categoryDir, file);
        return fs.statSync(filePath).isFile() && 
               /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(file);
      });

      for (const file of files) {
        const filePath = path.join(categoryDir, file);
        const relativePath = `/assets/${config.directory}/${file}`;
        
        // Generate alt text from filename
        const altText = file
          .replace(/[-_]/g, ' ')
          .replace(/\.[^/.]+$/, '')
          .replace(/\b\w/g, l => l.toUpperCase());

        try {
          // Check if media already exists
          const existing = await Media.findOne({
            where: { filePath: relativePath }
          });

          if (existing) {
            console.log(`  ⏭️  Skipped (exists): ${file}`);
            totalSkipped++;
            continue;
          }

          // Create media record
          await Media.create({
            fileName: file,
            filePath: relativePath,
            fileType: config.fileType,
            altText: altText
          });

          console.log(`  ✅ Seeded: ${file}`);
          totalSeeded++;
        } catch (error) {
          console.error(`  ❌ Error seeding ${file}:`, error.message);
          totalErrors++;
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Seeding Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Seeded: ${totalSeeded}`);
    console.log(`⏭️  Skipped (already exists): ${totalSkipped}`);
    console.log(`❌ Errors: ${totalErrors}`);
    console.log(`📊 Total: ${totalSeeded + totalSkipped + totalErrors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding images:', error);
    process.exit(1);
  }
}

// Run the script
seedLocalizedImages();

