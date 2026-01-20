const { BusinessCard, Media } = require('../models');

// Map of old upload paths to new asset paths
const PATH_MAPPING = {
  '/uploads/images/Quality-Refilling.jpeg': '/assets/business/Quality-Refilling.jpeg',
  '/uploads/images/Renewables-Projects-Bhilai-1.jpg': '/assets/business/Renewables-Projects-Bhilai-1.jpg',
  '/uploads/images/coal-heap-at-yard-7-2-Large.jpeg': '/assets/business/coal-heap-at-yard-7-2-Large.jpeg',
  '/uploads/images/Medtech-Hero-Banner.jpg': '/assets/business/Medtech-Hero-Banner.jpg',
  '/uploads/images/Refex-Capital-slider.jpg': '/assets/business/Refex-Capital-slider.jpg',
  '/uploads/images/Srinagar-Airport-1.jpg': '/assets/business/Srinagar-Airport-1.jpg',
  '/uploads/images/Integrated-Electric-Fleet-Solutions-03.jpg': '/assets/business/Integrated-Electric-Fleet-Solutions-03.jpg',
  '/uploads/images/Hero-section-BG.jpg': '/assets/business/Hero-section-BG.jpg',
  '/uploads/images/venwind-homepage.jpg': '/assets/business/venwind-homepage.jpg'
};

async function updateBusinessCardMediaPaths() {
  try {
    console.log('Updating business card media paths to localized assets...\n');

    const cards = await BusinessCard.findAll({
      include: [{ model: Media, as: 'image', required: false }]
    });

    let updated = 0;
    let notFound = 0;
    let noImage = 0;

    for (const card of cards) {
      if (!card.image) {
        console.log(`  ⚠️  No image linked: ${card.title}`);
        noImage++;
        continue;
      }

      const oldPath = card.image.filePath;
      const newPath = PATH_MAPPING[oldPath];

      if (!newPath) {
        console.log(`  ⚠️  No mapping found for: ${oldPath} (${card.title})`);
        notFound++;
        continue;
      }

      // Update the media record
      await card.image.update({
        filePath: newPath,
        fileName: newPath.split('/').pop() || card.image.fileName
      });

      console.log(`  ✅ Updated: ${card.title}`);
      console.log(`     ${oldPath}`);
      console.log(`     → ${newPath}\n`);
      updated++;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Update Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⚠️  Not found: ${notFound}`);
    console.log(`⚠️  No image: ${noImage}`);
    console.log(`📊 Total cards: ${cards.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating business card media paths:', error);
    process.exit(1);
  }
}

// Run the script
updateBusinessCardMediaPaths();

