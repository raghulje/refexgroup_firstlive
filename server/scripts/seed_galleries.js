const { GalleryAlbum, GalleryEvent, GalleryImage, Media } = require('../models');
const { Op } = require('sequelize');

// Gallery configuration based on config.ts
const GALLERY_CONFIG = {
  '2022': {
    name: '2022',
    slug: '2022',
    description: 'Gallery for the year 2022',
    albumType: 'year',
    heroImage: '/assets/gallery/Gallery-REFEX-Awards-7.jpg',
    events: [
      { id: 'anniversary', name: '20th Company Anniversary', slug: 'anniversary' },
      { id: 'awards', name: 'Awards', slug: 'awards' },
      { id: 'esop', name: 'ESOP', slug: 'esop' },
      { id: 'blood-donation', name: 'Blood Donation', slug: 'blood-donation' },
      { id: 'we-love-to-give', name: 'We Love to Give', slug: 'we-love-to-give' },
      { id: 'festival', name: 'Festival Celebrations', slug: 'festival' },
      { id: 'birthday', name: 'Birthday Bashes', slug: 'birthday' },
      { id: 'medtech', name: '3i MedTech IRIA 2022', slug: 'medtech' }
    ]
  },
  '2023': {
    name: '2023',
    slug: '2023',
    description: 'Gallery for the year 2023',
    albumType: 'year',
    heroImage: '/assets/gallery/Gallery-REFEX-Awards-7.jpg',
    events: [
      { id: 'tree-plantation', name: 'Tree Plantation', slug: 'tree-plantation' },
      { id: 'anniversary', name: '21st Company Anniversary', slug: 'anniversary' },
      { id: 'acrex', name: 'ACREX', slug: 'acrex' },
      { id: 'blood-donation-camp-2023', name: 'Blood Donation Camp 2023', slug: 'blood-donation-camp-2023' },
      { id: 'iosh-managing-safely-training', name: 'IOSH Managing Safely Training', slug: 'iosh-managing-safely-training' },
      { id: 'refex-eveelz', name: 'Refex eVeelz', slug: 'refex-eveelz' },
      { id: 'world-environment-day-2023', name: 'World Environment Day 2023', slug: 'world-environment-day-2023' },
      { id: 'womens-day', name: "Women's Day", slug: 'womens-day' },
      { id: 'national-road-safety-week', name: 'National Road Safety Week', slug: 'national-road-safety-week' },
      { id: 'solar-trade-show', name: 'Solar Trade Show', slug: 'solar-trade-show' },
      { id: 'eye-camp', name: 'Eye Camp', slug: 'eye-camp' },
      { id: 'freshworks-marathon', name: 'Freshworks Marathon', slug: 'freshworks-marathon' },
      { id: 'sports-events', name: 'Sports Events', slug: 'sports-events' }
    ]
  },
  '2024': {
    name: '2024',
    slug: '2024',
    description: 'Gallery for the year 2024',
    albumType: 'year',
    heroImage: 'https://refex.group/wp-content/uploads/2024/12/IMG_0001-scaled.jpg',
    events: [
      { id: 'airport-taxi-launch-bial', name: 'Airport Taxi Launch - BIAL', slug: 'airport-taxi-launch-bial' },
      { id: 'hcl-cyclothon-2024', name: 'HCL Cyclothon 2024', slug: 'hcl-cyclothon-2024' },
      { id: 'anamaya-launch-pune', name: 'Anamaya Launch - Pune', slug: 'anamaya-launch-pune' },
      { id: 'anniversary', name: '22nd Company Anniversary Celebration', slug: 'anniversary' },
      { id: 'pongal-function-2024', name: 'Pongal Function 2024', slug: 'pongal-function-2024' },
      { id: 'tamilnadu-largest-ev-hub-opening', name: 'Tamilnadu Largest EV HUB opening', slug: 'tamilnadu-largest-ev-hub-opening' },
      { id: 'blood-donation-camp-2024', name: 'Blood donation camp 2024', slug: 'blood-donation-camp-2024' },
      { id: 'park-inauguration', name: 'Park Inauguration', slug: 'park-inauguration' },
      { id: 'pond-restoration-2024', name: 'Pond Restoration 2024', slug: 'pond-restoration-2024' },
      { id: 'rahane-at-refex', name: 'Rahane at Refex', slug: 'rahane-at-refex' },
      { id: 'rooftop-solar-plant-inauguration', name: 'Rooftop Solar Plant Inauguration', slug: 'rooftop-solar-plant-inauguration' },
      { id: 'refex-eveelz-at-bial', name: 'Refex eVeelz at BIAL', slug: 'refex-eveelz-at-bial' },
      { id: 'international-womens-day-2024', name: "International Women's Day 2024", slug: 'international-womens-day-2024' },
      { id: 'freshworks-marathon-2024', name: 'Freshworks Marathon 2024', slug: 'freshworks-marathon-2024' },
      { id: 'mumbai-ultimate-league', name: 'Mumbai Ultimate League', slug: 'mumbai-ultimate-league' },
      { id: 'national-road-safety-month-2024', name: 'National Road Safety Month 2024', slug: 'national-road-safety-month-2024' }
    ]
  },
  '2025': {
    name: '2025',
    slug: '2025',
    description: 'Gallery for the year 2025',
    albumType: 'year',
    heroImage: '/assets/gallery/Gallery-20-th.-Anniversary-10.jpg',
    events: [
      { id: 'business-integrity-ungcni', name: '1st Business Integrity Conclave and 19th National Convention by UNGCNI', slug: 'business-integrity-ungcni' },
      { id: 'ganesh-chaturti', name: 'Ganesh Chaturti', slug: 'ganesh-chaturti' },
      { id: 'meet-greet-with-csk', name: 'Meet & Greet with CSK', slug: 'meet-greet-with-csk' },
      { id: 'blood-donation-camp', name: 'Blood Donation Camp', slug: 'blood-donation-camp' },
      { id: 'krav-maga-session', name: 'Krav Maga Session', slug: 'krav-maga-session' },
      { id: 'mangrove-plantation-drive', name: 'Mangrove Plantation Drive', slug: 'mangrove-plantation-drive' },
      { id: 'tamil-nadu-round-table', name: 'Tamil Nadu Round Table', slug: 'tamil-nadu-round-table' },
      { id: 'ayutha-puja-celebration', name: 'Ayutha Puja Celebration', slug: 'ayutha-puja-celebration' },
      { id: 'company-anniversary', name: 'Company Anniversary', slug: 'company-anniversary' },
      { id: 'gptw-celebration', name: 'GPTW Celebration', slug: 'gptw-celebration' },
      { id: 'independence-day', name: 'Independence Day', slug: 'independence-day' },
      { id: 'international-womens-day', name: "International Women's Day", slug: 'international-womens-day' },
      { id: 'national-road-safety-week', name: 'National Road Safety Week', slug: 'national-road-safety-week' },
      { id: 'republic-day', name: 'Republic Day', slug: 'republic-day' },
      { id: 'vamika-oncology-session', name: 'Vamika Oncology Session', slug: 'vamika-oncology-session' },
      { id: 'world-environment-day', name: 'World Environment Day', slug: 'world-environment-day' }
    ]
  }
};

async function seedGalleries() {
  try {
    console.log('Seeding galleries, events, and images...\n');

    let albumsCreated = 0;
    let albumsUpdated = 0;
    let eventsCreated = 0;
    let eventsUpdated = 0;
    let imagesLinked = 0;

    for (const [year, config] of Object.entries(GALLERY_CONFIG)) {
      console.log(`\n📁 Processing Gallery: ${year}`);

      // Find or create cover image Media record
      let coverImageId = null;
      if (config.heroImage && !config.heroImage.startsWith('http')) {
        const coverMedia = await Media.findOne({
          where: { filePath: config.heroImage }
        });
        if (coverMedia) {
          coverImageId = coverMedia.id;
        } else {
          // Create media record if it doesn't exist
          const fileName = config.heroImage.split('/').pop();
          const newMedia = await Media.create({
            fileName: fileName,
            filePath: config.heroImage,
            fileType: 'image',
            altText: `${year} Gallery Cover`
          });
          coverImageId = newMedia.id;
        }
      }

      // Find or create album
      const [album, albumCreated] = await GalleryAlbum.findOrCreate({
        where: { slug: config.slug },
        defaults: {
          name: config.name,
          slug: config.slug,
          description: config.description,
          albumType: config.albumType,
          coverImageId: coverImageId,
          orderIndex: parseInt(year) - 2020, // Order by year
          isActive: true
        }
      });

      if (albumCreated) {
        console.log(`  ✅ Created album: ${config.name}`);
        albumsCreated++;
      } else {
        // Update existing album
        await album.update({
          name: config.name,
          description: config.description,
          albumType: config.albumType,
          coverImageId: coverImageId || album.coverImageId,
          orderIndex: parseInt(year) - 2020
        });
        console.log(`  ⏭️  Updated album: ${config.name}`);
        albumsUpdated++;
      }

      // Process events
      for (let i = 0; i < config.events.length; i++) {
        const eventConfig = config.events[i];
        console.log(`    📅 Processing Event: ${eventConfig.name}`);

        // Try to find cover image for event from gallery folder
        let eventCoverImageId = null;
        const eventImagePath = `/assets/gallery/${year}/${eventConfig.id}/`;
        const eventCoverMedia = await Media.findOne({
          where: {
            filePath: {
              [Op.like]: `${eventImagePath}%`
            }
          },
          order: [['id', 'ASC']] // Get first image as cover
        });
        if (eventCoverMedia) {
          eventCoverImageId = eventCoverMedia.id;
        }

        // Find or create event
        const [event, eventCreated] = await GalleryEvent.findOrCreate({
          where: {
            albumId: album.id,
            slug: eventConfig.slug
          },
          defaults: {
            albumId: album.id,
            name: eventConfig.name,
            slug: eventConfig.slug,
            description: `Images from ${eventConfig.name}`,
            coverImageId: eventCoverImageId,
            orderIndex: i,
            isActive: true
          }
        });

        if (eventCreated) {
          console.log(`      ✅ Created event: ${eventConfig.name}`);
          eventsCreated++;
        } else {
          // Update existing event
          await event.update({
            name: eventConfig.name,
            description: eventConfig.description || `Images from ${eventConfig.name}`,
            coverImageId: eventCoverImageId || event.coverImageId,
            orderIndex: i
          });
          console.log(`      ⏭️  Updated event: ${eventConfig.name}`);
          eventsUpdated++;
        }

        // Link existing images to this event
        // Find images in the gallery folder for this event
        const eventImages = await Media.findAll({
          where: {
            filePath: {
              [Op.like]: `${eventImagePath}%`
            }
          },
          order: [['fileName', 'ASC']]
        });

        if (eventImages.length > 0) {
          console.log(`      📸 Found ${eventImages.length} images to link`);
          
          for (let j = 0; j < eventImages.length; j++) {
            const media = eventImages[j];
            
            // Check if gallery image already exists
            const existingImage = await GalleryImage.findOne({
              where: {
                eventId: event.id,
                imageId: media.id
              }
            });

            if (!existingImage) {
              // Extract title from filename
              const title = media.fileName
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

              await GalleryImage.create({
                eventId: event.id,
                title: title,
                imageId: media.id,
                orderIndex: j,
                isActive: true
              });
              imagesLinked++;
            }
          }
          console.log(`      ✅ Linked ${eventImages.length} images to event`);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Seeding Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Albums created: ${albumsCreated}`);
    console.log(`⏭️  Albums updated: ${albumsUpdated}`);
    console.log(`✅ Events created: ${eventsCreated}`);
    console.log(`⏭️  Events updated: ${eventsUpdated}`);
    console.log(`📸 Images linked: ${imagesLinked}`);
    console.log(`📊 Total galleries: ${Object.keys(GALLERY_CONFIG).length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding galleries:', error);
    process.exit(1);
  }
}

// Run the script
seedGalleries();

