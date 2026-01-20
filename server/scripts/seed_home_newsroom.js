/* eslint-disable no-await-in-loop */
const { sequelize, NewsroomItem, Media } = require('../models');

async function seedHomeNewsroom() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.\n');

    console.log('Seeding Home Page Newsroom items...\n');

    // First, find or create media entries for images
    const mediaFiles = [
      { fileName: 'newsroom-thumbnail-video.jpg', filePath: '/assets/newsroom/newsroom-thumbnail-video.jpg', altText: 'Newsroom Thumbnail Video' },
      { fileName: 'Refex-Mobility-expands.jpg', filePath: '/assets/newsroom/Refex-Mobility-expands.jpg', altText: 'Refex Mobility Expands' },
      { fileName: 'Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg', filePath: '/assets/newsroom/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg', altText: 'Refex Gheun Tak Tournament' },
      { fileName: 'Refex-Group-Road-Safety-Awareness-event.jpg', filePath: '/assets/newsroom/Refex-Group-Road-Safety-Awareness-event.jpg', altText: 'Refex Group Road Safety Awareness Event' },
      { fileName: 'press-release02.jpg', filePath: '/assets/newsroom/press-release02.jpg', altText: 'Press Release 02' },
      { fileName: 'press-release04.jpg', filePath: '/assets/newsroom/press-release04.jpg', altText: 'Press Release 04' },
      { fileName: 'readdy-1.jpeg', filePath: '/assets/newsroom/readdy-1.jpeg', altText: 'Readdy 1' },
      { fileName: 'readdy-2.jpeg', filePath: '/assets/newsroom/readdy-2.jpeg', altText: 'Readdy 2' },
      { fileName: 'readdy-3.jpeg', filePath: '/assets/newsroom/readdy-3.jpeg', altText: 'Readdy 3' }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { filePath: mediaFile.filePath },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: 'image',
          altText: mediaFile.altText
        }
      });
      mediaMap[mediaFile.filePath] = media;
      console.log(`Media: ${mediaFile.fileName} (ID: ${media.id})`);
    }

    // Newsroom items based on the images shown - simplified for testing
    // Note: Logo paths are placeholders - you'll need to upload the actual logo images through CMS
    const newsItems = [
      {
        type: 'press',
        title: 'Dinesh Agarwal, CEO of Refex Group, on ET Now',
        excerpt: 'CEO Dinesh Agarwal discusses Refex Group\'s vision and growth on ET Now',
        link: 'https://www.youtube.com/watch?v=vyiEp-hzhqU&t=3s',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release02.jpg']?.id || null,
        publishedAt: new Date('2024-11-01'),
        orderIndex: 1,
        isFeatured: true,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Mobility expands operations to Delhi NCR',
        excerpt: 'Refex Mobility announces expansion of operations to Delhi NCR region',
        link: 'https://auto.economictimes.indiatimes.com/news/aftermarket/refex-mobility-expands-operations-to-delhi-ncr/124252061',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/Refex-Mobility-expands.jpg']?.id || null,
        publishedAt: new Date('2024-10-15'),
        orderIndex: 2,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex eVeelz rebrands as Refex Mobility; to consolidate focus on existing Tier-1 market',
        excerpt: 'Refex eVeelz rebrands to Refex Mobility with focus on Tier-1 markets',
        link: 'https://auto.economictimes.indiatimes.com/news/aftermarket/refex-eveelz-rebrands-as-refex-mobility-to-consolidate-focus-on-existing-tier-1-market/123237339',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release04.jpg']?.id || null,
        publishedAt: new Date('2024-09-20'),
        orderIndex: 3,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Group is the Official Sponsor of Chennai Super Kings',
        excerpt: 'Refex Group announces official sponsorship of Chennai Super Kings',
        link: 'https://www.aninews.in/news/business/refex-group-is-the-official-sponsor-of-chennai-super-kings20250327190124/',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/readdy-2.jpeg']?.id || null,
        publishedAt: new Date('2024-07-20'),
        orderIndex: 4,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Uber partners with Chennai-based Refex Green Mobility to deploy 1,000 EVs across cities',
        excerpt: 'Uber partners with Refex Green Mobility to deploy 1,000 electric vehicles',
        link: 'https://www.thehindu.com/sci-tech/technology/uber-partners-with-chennai-based-refex-green-mobility-to-deploy-1000-evs-across-cities/article69316319.ece',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/readdy-3.jpeg']?.id || null,
        publishedAt: new Date('2024-06-10'),
        orderIndex: 5,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Group Strengthens Leadership in Sustainability at UNGCNI Annual Convention 2025',
        excerpt: 'Refex Group showcases sustainability leadership at UNGCNI Annual Convention',
        link: 'https://www.aninews.in/news/business/refex-group-strengthens-leadership-in-sustainability-at-ungcni-annual-convention-202520250215101613/',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release02.jpg']?.id || null,
        publishedAt: new Date('2025-02-15'),
        orderIndex: 6,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex reports PBT at 30 crore in Q1 FY24',
        excerpt: 'Refex Industries reports Profit Before Tax of 30 crore in Q1 FY24',
        link: '#',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release04.jpg']?.id || null,
        publishedAt: new Date('2024-05-15'),
        orderIndex: 7,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Industries\' share price hits upper circuit on good FY23 results',
        excerpt: 'Refex Industries share price hits upper circuit following strong FY23 results',
        link: '#',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release02.jpg']?.id || null,
        publishedAt: new Date('2024-04-20'),
        orderIndex: 8,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Industries Revenue Rises From Rs 443 Cr To Rs 1629 Cr',
        excerpt: 'Refex Industries reports significant revenue growth from Rs 443 Cr to Rs 1629 Cr',
        link: '#',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release04.jpg']?.id || null,
        publishedAt: new Date('2024-03-10'),
        orderIndex: 9,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Industries Q4 standalone net more than doubles to ₹51 cr.',
        excerpt: 'Refex Industries Q4 standalone net profit more than doubles to ₹51 crore',
        link: '#',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release02.jpg']?.id || null,
        publishedAt: new Date('2024-02-25'),
        orderIndex: 10,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Industries Limited grants ESOPs',
        excerpt: 'Refex Industries Limited announces Employee Stock Option Plan (ESOP) grants',
        link: '#',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release04.jpg']?.id || null,
        publishedAt: new Date('2024-01-15'),
        orderIndex: 11,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'press',
        title: 'Refex Industries revenue grows over 4X in Dec quarter',
        excerpt: 'Refex Industries reports revenue growth of over 4X in December quarter',
        link: '#',
        badge: 'PRESS RELEASE',
        category: 'press',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/press-release02.jpg']?.id || null,
        publishedAt: new Date('2023-12-20'),
        orderIndex: 12,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'event',
        title: 'Refex Gheun Tak - A Women\'s Ultimate Frisbee Tournament',
        excerpt: 'Refex Group sponsors Women\'s Ultimate Frisbee Tournament',
        link: 'http://businessnewsthisweek.com/business/team-meraki-wins-refex-gheun-tak-a-womens-ultimate-frisbee-tournament/',
        badge: 'EVENT',
        category: 'event',
        logo: '', // Logo will be uploaded via CMS
        featuredImageId: mediaMap['/assets/newsroom/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg']?.id || null,
        publishedAt: new Date('2024-07-15'),
        orderIndex: 13,
        isFeatured: false,
        isActive: true
      },
      {
        type: 'event',
        title: 'Refex Group Road Safety Awareness event',
        excerpt: 'Refex Group organizes Road Safety Awareness campaign',
        link: 'https://navjeevanexpress.com/csr-initiative-refex-group-kick-starts-road-safety-campaign-on-anna-salai-in-chennai/',
        badge: 'EVENT',
        category: 'event',
        logo: '',
        featuredImageId: mediaMap['/assets/newsroom/Refex-Group-Road-Safety-Awareness-event.jpg']?.id || null,
        publishedAt: new Date('2024-08-10'),
        orderIndex: 14,
        isFeatured: false,
        isActive: true
      }
    ];

    let created = 0;
    let skipped = 0;

    for (const itemData of newsItems) {
      const [item, createdItem] = await NewsroomItem.findOrCreate({
        where: {
          title: itemData.title,
          type: itemData.type
        },
        defaults: itemData
      });

      if (createdItem) {
        console.log(`✓ Created: ${itemData.title}`);
        created++;
      } else {
        console.log(`⏭️  Skipped (exists): ${itemData.title}`);
        skipped++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`✓ Created: ${created}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`\n✅ Newsroom seeding complete!`);

  } catch (error) {
    console.error('❌ Error seeding newsroom:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedHomeNewsroom()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedHomeNewsroom };

