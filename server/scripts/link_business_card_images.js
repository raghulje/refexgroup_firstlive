const { BusinessCard, Media } = require('../models');

// Map of business card titles to their corresponding image file paths
const BUSINESS_CARD_IMAGE_MAP = {
  'Refex Refrigerants': '/assets/business/Quality-Refilling.jpeg',
  'Refex Renewables': '/assets/business/Renewables-Projects-Bhilai-1.jpg',
  'Refex Ash & Coal Handling': '/assets/business/coal-heap-at-yard-7-2-Large.jpeg',
  'Refex MedTech': '/assets/business/Medtech-Hero-Banner.jpg',
  'Refex Capital': '/assets/business/Refex-Capital-slider.jpg',
  'Refex Airports and Transportation': '/assets/business/Srinagar-Airport-1.jpg',
  'Refex Mobility': '/assets/business/Integrated-Electric-Fleet-Solutions-03.jpg',
  'Pharma | RL Fine Chem': '/assets/business/Hero-section-BG.jpg',
  'Venwind Refex': '/assets/business/venwind-homepage.jpg'
};

async function linkBusinessCardImages() {
  try {
    console.log('Linking business card images to Media table...\n');

    const cards = await BusinessCard.findAll({
      include: [{ model: Media, as: 'image', required: false }]
    });

    let linked = 0;
    let notFound = 0;
    let alreadyLinked = 0;

    for (const card of cards) {
      // Skip if already linked
      if (card.imageId && card.image) {
        console.log(`  ⏭️  Already linked: ${card.title}`);
        alreadyLinked++;
        continue;
      }

      // Find the image path for this card
      const imagePath = BUSINESS_CARD_IMAGE_MAP[card.title];

      if (!imagePath) {
        console.log(`  ⚠️  No image mapping found for: ${card.title}`);
        notFound++;
        continue;
      }

      // Find or create Media record
      let media = await Media.findOne({
        where: { filePath: imagePath }
      });

      if (!media) {
        // Extract filename from path
        const fileName = imagePath.split('/').pop() || card.title.replace(/\s+/g, '-') + '.jpg';
        const altText = card.title + ' - Business Card Image';

        // Create media record
        media = await Media.create({
          fileName: fileName,
          filePath: imagePath,
          fileType: 'image',
          altText: altText
        });
        console.log(`  ✅ Created media record: ${fileName}`);
      }

      // Link the business card to the media
      await card.update({ imageId: media.id });
      console.log(`  ✅ Linked: ${card.title} -> ${media.fileName}`);
      linked++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Linking Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Linked: ${linked}`);
    console.log(`⏭️  Already linked: ${alreadyLinked}`);
    console.log(`⚠️  Not found: ${notFound}`);
    console.log(`📊 Total cards: ${cards.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error linking business card images:', error);
    process.exit(1);
  }
}

// Run the script
linkBusinessCardImages();

