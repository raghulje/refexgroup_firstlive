const { GalleryAlbum, GalleryEvent, GalleryImage } = require('../models');

async function verifyGallerySeeding() {
  try {
    console.log('Verifying gallery seeding...\n');

    const albums = await GalleryAlbum.findAll({
      include: [{ model: GalleryEvent, as: 'events', required: false }],
      order: [['orderIndex', 'ASC']]
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Gallery Albums:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let totalEvents = 0;
    let totalImages = 0;

    for (const album of albums) {
      const eventCount = album.events?.length || 0;
      totalEvents += eventCount;
      
      console.log(`\n📁 ${album.name} (ID: ${album.id})`);
      console.log(`   Status: ${album.isActive ? '✅ Published' : '⏸️  Draft'}`);
      console.log(`   Events: ${eventCount}`);

      if (album.events && album.events.length > 0) {
        for (const event of album.events) {
          const imageCount = await GalleryImage.count({
            where: { eventId: event.id }
          });
          totalImages += imageCount;
          console.log(`     📅 ${event.name} (${imageCount} images)`);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 Total Albums: ${albums.length}`);
    console.log(`📅 Total Events: ${totalEvents}`);
    console.log(`📸 Total Images: ${totalImages}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check a specific event with images
    const anniversaryEvent = await GalleryEvent.findOne({
      where: { name: '20th Company Anniversary' },
      include: [{ model: GalleryImage, as: 'images', required: false }]
    });

    if (anniversaryEvent) {
      console.log(`\n📅 Sample Event: ${anniversaryEvent.name}`);
      console.log(`   Images: ${anniversaryEvent.images?.length || 0}`);
      if (anniversaryEvent.images && anniversaryEvent.images.length > 0) {
        console.log(`   Sample image titles:`);
        anniversaryEvent.images.slice(0, 5).forEach(img => {
          console.log(`     - ${img.title || 'Untitled'} (Image ID: ${img.imageId})`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying gallery seeding:', error);
    process.exit(1);
  }
}

verifyGallerySeeding();

