const db = require('../models');
const { GalleryAlbum, GalleryEvent, GalleryImage, Media } = db;

async function createTestGallery2026() {
    try {
        console.log('🚀 Creating test gallery for 2026...\n');

        // Create the 2026 album
        const album2026 = await GalleryAlbum.create({
            name: '2026',
            slug: '2026',
            description: 'Gallery for year 2026 - Test Album',
            albumType: 'year',
            orderIndex: 4,
            isActive: true
        });

        console.log('✅ Created album:', album2026.name, '(ID:', album2026.id, ')');

        // Create a test event
        const testEvent = await GalleryEvent.create({
            albumId: album2026.id,
            name: 'Test Event 2026',
            slug: 'test-event-2026',
            description: 'This is a test event for the 2026 gallery',
            eventDate: new Date('2026-01-15'),
            location: 'Test Location',
            orderIndex: 0,
            isActive: true
        });

        console.log('✅ Created event:', testEvent.name, '(ID:', testEvent.id, ')');

        // Find some existing media to use as test images
        const existingMedia = await Media.findAll({
            limit: 5,
            where: {
                fileType: 'image'
            }
        });

        if (existingMedia.length > 0) {
            console.log(`\n📸 Adding ${existingMedia.length} test images...`);

            for (let i = 0; i < existingMedia.length; i++) {
                const media = existingMedia[i];
                await GalleryImage.create({
                    eventId: testEvent.id,
                    title: `Test Image ${i + 1}`,
                    imageId: media.id,
                    orderIndex: i,
                    isActive: true
                });
                console.log(`   ✅ Added image ${i + 1}: ${media.fileName}`);
            }
        } else {
            console.log('\n⚠️  No existing media found. You can add images through the CMS.');
        }

        console.log('\n✅ Test gallery created successfully!');
        console.log('\n🌐 Visit: http://localhost:3000/gallery-2026');
        console.log('\n📝 Album details:');
        console.log('   - Name:', album2026.name);
        console.log('   - Slug:', album2026.slug);
        console.log('   - Album Type:', album2026.albumType);
        console.log('   - Is Active:', album2026.isActive);
        console.log('\n📝 Event details:');
        console.log('   - Name:', testEvent.name);
        console.log('   - Slug:', testEvent.slug);
        console.log('   - Date:', testEvent.eventDate.toISOString().split('T')[0]);
        console.log('   - Location:', testEvent.location);

    } catch (error) {
        console.error('❌ Error creating test gallery:', error);
        throw error;
    } finally {
        await db.sequelize.close();
    }
}

// Run the script
createTestGallery2026()
    .then(() => {
        console.log('\n✅ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
