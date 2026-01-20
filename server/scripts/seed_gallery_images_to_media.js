const { Media } = require('../models');
const fs = require('fs');
const path = require('path');

// Base directory for gallery assets
const GALLERY_DIR = path.join(__dirname, '../../new_client/public/assets/gallery');

async function seedGalleryImagesToMedia() {
  try {
    console.log('Seeding gallery images to Media table...\n');

    let totalSeeded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    const years = ['2022', '2023', '2024', '2025'];

    for (const year of years) {
      const yearDir = path.join(GALLERY_DIR, year);
      
      if (!fs.existsSync(yearDir)) {
        console.log(`⚠️  Directory not found: ${yearDir}`);
        continue;
      }

      console.log(`\n📁 Processing year: ${year}`);

      // Get all event directories
      const eventDirs = fs.readdirSync(yearDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const eventDir of eventDirs) {
        const eventPath = path.join(yearDir, eventDir);
        const files = fs.readdirSync(eventPath).filter(file => {
          const filePath = path.join(eventPath, file);
          return fs.statSync(filePath).isFile() && 
                 /\.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG)$/i.test(file);
        });

        if (files.length === 0) continue;

        console.log(`  📅 Event: ${eventDir} (${files.length} images)`);

        for (const file of files) {
          const relativePath = `/assets/gallery/${year}/${eventDir}/${file}`;
          
          try {
            // Check if media already exists
            const existing = await Media.findOne({
              where: { filePath: relativePath }
            });

            if (existing) {
              totalSkipped++;
              continue;
            }

            // Generate alt text from filename
            const altText = file
              .replace(/\.[^/.]+$/, '')
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());

            // Create media record
            await Media.create({
              fileName: file,
              filePath: relativePath,
              fileType: 'image',
              altText: altText
            });

            totalSeeded++;
            
            // Log progress for large batches
            if (totalSeeded % 100 === 0) {
              console.log(`    ✅ Seeded ${totalSeeded} images so far...`);
            }
          } catch (error) {
            console.error(`    ❌ Error seeding ${file}:`, error.message);
            totalErrors++;
          }
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
    console.error('❌ Error seeding gallery images:', error);
    process.exit(1);
  }
}

// Run the script
seedGalleryImagesToMedia();

