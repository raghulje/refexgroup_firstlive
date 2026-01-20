const db = require('../models');
const { GalleryAlbum, GalleryEvent, GalleryImage, Media } = db;

async function createTestGallery2027() {
    try {
        console.log('🚀 Creating complete test gallery for 2027...\n');

        // Step 1: Create the 2027 album
        console.log('📁 Step 1: Creating album...');
        const album2027 = await GalleryAlbum.create({
            name: '2027',
            slug: '2027',
            description: 'Test gallery for year 2027 - Complete dynamic page generation test',
            albumType: 'year',
            orderIndex: 5,
            isActive: true
        });
        console.log('   ✅ Album created:', album2027.name, '(ID:', album2027.id, ')');

        // Step 2: Create test events
        console.log('\n📅 Step 2: Creating events...');
        const events = [
            {
                name: 'Annual Company Meeting 2027',
                slug: 'annual-meeting-2027',
                description: 'Our annual company-wide meeting with presentations and team updates',
                eventDate: new Date('2027-01-20'),
                location: 'Chennai Office, India'
            },
            {
                name: 'Team Building Event',
                slug: 'team-building-2027',
                description: 'Fun outdoor activities and team bonding exercises',
                eventDate: new Date('2027-03-15'),
                location: 'Mahabalipuram Resort'
            },
            {
                name: 'Product Launch Celebration',
                slug: 'product-launch-2027',
                description: 'Celebrating the launch of our new product line',
                eventDate: new Date('2027-06-10'),
                location: 'Mumbai Convention Center'
            }
        ];

        const createdEvents = [];
        for (let i = 0; i < events.length; i++) {
            const event = await GalleryEvent.create({
                albumId: album2027.id,
                ...events[i],
                orderIndex: i,
                isActive: true
            });
            createdEvents.push(event);
            console.log(`   ✅ Event ${i + 1}:`, event.name, '(ID:', event.id, ')');
        }

        // Step 3: Find existing media to use as dummy images
        console.log('\n🖼️  Step 3: Finding existing media for dummy images...');
        const existingMedia = await Media.findAll({
            limit: 15,
            order: [['id', 'DESC']]
        });

        if (existingMedia.length === 0) {
            console.log('   ⚠️  No existing media found in database.');
            console.log('   ℹ️  You can add images through the CMS later.');
        } else {
            console.log(`   ✅ Found ${existingMedia.length} media items to use as dummy images`);

            // Step 4: Add images to events (5 images per event)
            console.log('\n📸 Step 4: Adding images to events...');
            let imageCounter = 0;
            const imagesPerEvent = Math.min(5, Math.floor(existingMedia.length / createdEvents.length));

            for (let eventIndex = 0; eventIndex < createdEvents.length; eventIndex++) {
                const event = createdEvents[eventIndex];
                console.log(`\n   Event: ${event.name}`);

                for (let i = 0; i < imagesPerEvent; i++) {
                    if (imageCounter >= existingMedia.length) break;

                    const media = existingMedia[imageCounter];
                    await GalleryImage.create({
                        eventId: event.id,
                        title: `${event.name} - Photo ${i + 1}`,
                        imageId: media.id,
                        orderIndex: i,
                        isActive: true
                    });
                    console.log(`      ✅ Image ${i + 1}: ${media.fileName || media.filePath}`);
                    imageCounter++;
                }
            }

            console.log(`\n   📊 Total images added: ${imageCounter}`);
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ TEST GALLERY 2027 CREATED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log('   • Album: 2027');
        console.log('   • Events:', createdEvents.length);
        console.log('   • Images:', existingMedia.length > 0 ? Math.min(existingMedia.length, createdEvents.length * 5) : 0);
        console.log('\n🌐 Test the page at:');
        console.log('   👉 http://localhost:3000/gallery-2027');
        console.log('\n📝 Album Details:');
        console.log('   • ID:', album2027.id);
        console.log('   • Name:', album2027.name);
        console.log('   • Slug:', album2027.slug);
        console.log('   • Album Type:', album2027.albumType);
        console.log('   • Is Active:', album2027.isActive);
        console.log('\n📅 Events Created:');
        createdEvents.forEach((event, index) => {
            console.log(`   ${index + 1}. ${event.name}`);
            console.log(`      - Slug: ${event.slug}`);
            console.log(`      - Date: ${event.eventDate.toISOString().split('T')[0]}`);
            console.log(`      - Location: ${event.location}`);
        });

        return {
            album: album2027,
            events: createdEvents,
            success: true
        };

    } catch (error) {
        console.error('\n❌ Error creating test gallery:', error);
        console.error('\nError details:', error.message);
        if (error.sql) {
            console.error('SQL:', error.sql);
        }
        throw error;
    } finally {
        await db.sequelize.close();
    }
}

// Run the script
createTestGallery2027()
    .then((result) => {
        console.log('\n✅ Script completed successfully!');
        console.log('\n🧪 NEXT STEP: Open http://localhost:3000/gallery-2027 in your browser');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed!');
        process.exit(1);
    });
