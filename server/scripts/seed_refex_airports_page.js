require('dotenv').config();
const db = require('../models');
const { Page, Section, SectionContent, Media } = require('../models');

async function seedRefexAirportsPage() {
  try {
    console.log('Seeding Refex Airports page sections...');

    // Get or create refex-airports page
    const [page] = await Page.findOrCreate({
      where: { slug: 'refex-airports' },
      defaults: {
        slug: 'refex-airports',
        title: 'Refex Airports and Transportation',
        status: 'published',
        templateType: 'business-vertical'
      }
    });

    // Create or find media entries
    const mediaFiles = [
      {
        fileName: 'airports-hero.png',
        filePath: '/assets/heroes/airports-hero.png',
        altText: 'Refex Airports Hero'
      },
      {
        fileName: 'airports-logo-white.png',
        filePath: '/assets/logos/business/airports-logo-white.png',
        altText: 'Refex Airports Logo'
      },
      {
        fileName: 'terminal.jpeg',
        filePath: '/assets/business/airports/terminal.jpeg',
        altText: 'Airport Terminal'
      },
      {
        fileName: 'retail.png',
        filePath: '/assets/business/airports/retail.png',
        altText: 'Refex Airport Retail'
      },
      {
        fileName: 'advantage.jpg',
        filePath: '/assets/business/airports/advantage.jpg',
        altText: 'Refex Retail Advantage'
      },
      {
        fileName: 'landing-hero-1.png',
        filePath: '/assets/business/airports/landing-hero-1.png',
        altText: 'Transportation Enhancement'
      },
      {
        fileName: 'landing-hero-2.png',
        filePath: '/assets/business/airports/landing-hero-2.png',
        altText: 'Tech Integration'
      },
      {
        fileName: 'Refex-Difference-02-1.png',
        filePath: '/wp-content/uploads/2024/01/Refex-Difference-02-1.png',
        altText: 'Refex Difference Background'
      }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: 'image',
          altText: mediaFile.altText
        }
      });
      mediaMap[mediaFile.fileName] = media;
    }

    //
    // HERO SECTION
    //
    console.log('Seeding Hero section...');
    const [heroSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'hero'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'hero',
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBgMedia = mediaMap['airports-hero.png'];
    const heroLogoMedia = mediaMap['airports-logo-white.png'];

    const heroContent = [
      {
        sectionId: heroSection.id,
        contentKey: 'tagline',
        contentValue: 'Airports and Transportation',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'title',
        contentValue: 'Transforming Travel with Superior Retail Experiences.',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'description',
        contentValue:
          'Elevate your travel with our retail revolution. Refex Airports brings you the best in shopping, from global brands to unique finds, making every trip more than just a journey.',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'buttonText',
        contentValue: 'Explore More',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'buttonLink',
        contentValue: '#explore',
        contentType: 'text'
      }
    ];

    if (heroBgMedia) {
      heroContent.push({
        sectionId: heroSection.id,
        contentKey: 'backgroundImage',
        contentValue: heroBgMedia.filePath,
        contentType: 'text',
        mediaId: heroBgMedia.id
      });
    }

    if (heroLogoMedia) {
      heroContent.push({
        sectionId: heroSection.id,
        contentKey: 'logoImage',
        contentValue: heroLogoMedia.filePath,
        contentType: 'text',
        mediaId: heroLogoMedia.id
      });
    }

    for (const content of heroContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Hero section seeded');

    //
    // ABOUT US SECTION
    //
    console.log('Seeding About Us section...');
    const [aboutSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'about-us'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'about-us',
        orderIndex: 1,
        isActive: true
      }
    });

    const aboutImageMedia = mediaMap['terminal.jpeg'];

    const aboutContent = [
      {
        sectionId: aboutSection.id,
        contentKey: 'badge',
        contentValue: 'About Us',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'heading',
        contentValue:
          'Revolutionizing retail experiences in air travel, Refex Airports brings a new dimension to your journey.',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'description',
        contentValue:
          'Refex Airports, at the forefront of transport innovation, is dedicated to revolutionizing the consumer journey across airports, railways, and more. We champion delightful travel experiences, operational excellence, and robust partnerships, underpinned by our core values: initiative, progress, unity, and transparency. Join us in redefining global travel.',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'imageCaption',
        contentValue: 'Premier Retail Concessions at Pune and Srinagar Airports',
        contentType: 'text'
      }
    ];

    if (aboutImageMedia) {
      aboutContent.push({
        sectionId: aboutSection.id,
        contentKey: 'image',
        contentValue: aboutImageMedia.filePath,
        contentType: 'text',
        mediaId: aboutImageMedia.id
      });
    }

    for (const content of aboutContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ About Us section seeded');

    //
    // FOR RETAIL PARTNERS SECTION
    //
    console.log('Seeding For Retail Partners section...');
    const [retailPartnersSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'for-retail-partners'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'for-retail-partners',
        orderIndex: 2,
        isActive: true
      }
    });

    const retailImageMedia = mediaMap['retail.png'];

    const retailPartnersContent = [
      {
        sectionId: retailPartnersSection.id,
        contentKey: 'title',
        contentValue: 'FOR RETAIL PARTNERS',
        contentType: 'text'
      },
      {
        sectionId: retailPartnersSection.id,
        contentKey: 'gradientTitle',
        contentValue: 'The Refex Difference in Travel Retail',
        contentType: 'text'
      },
      {
        sectionId: retailPartnersSection.id,
        contentKey: 'description',
        contentValue:
          'Experience a new era of airport retail with Refex Airports. Our unique approach combines the latest in retail innovation with a deep understanding of traveler needs, setting new standards in your journey\'s retail experience.',
        contentType: 'text'
      },
      {
        sectionId: retailPartnersSection.id,
        contentKey: 'features',
        contentValue: JSON.stringify([
          {
            title: 'Dedicated Onsite Management',
            description:
              'Experience seamless operations with our dedicated Refex staff, prioritizing your success and bringing expertise to every detail of your retail venture.'
          },
          {
            title: 'Exclusive Elegance in Retail',
            description:
              'Elevate your brand with an exclusive collection, making your offerings an integral part of passengers\' premium journey.'
          },
          {
            title: 'Optimal Investment Returns',
            description:
              'Maximize returns with our strategically placed, high-traffic retail spaces designed for optimal profitability and investment efficiency.'
          },
          {
            title: 'Brand Brilliance on Display',
            description:
              'Illuminate your brand globally, enjoying unparalleled visibility that captivates diverse travelers. Join us, and let your brand shine.'
          }
        ]),
        contentType: 'json'
      }
    ];

    if (retailImageMedia) {
      retailPartnersContent.push({
        sectionId: retailPartnersSection.id,
        contentKey: 'image',
        contentValue: retailImageMedia.filePath,
        contentType: 'text',
        mediaId: retailImageMedia.id
      });
    }

    for (const content of retailPartnersContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ For Retail Partners section seeded');

    //
    // REFEX RETAIL ADVANTAGE SECTION
    //
    console.log('Seeding Refex Retail Advantage section...');
    const [advantageSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'refex-retail-advantage'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'refex-retail-advantage',
        orderIndex: 3,
        isActive: true
      }
    });

    const advantageImageMedia = mediaMap['advantage.jpg'];

    const advantageContent = [
      {
        sectionId: advantageSection.id,
        contentKey: 'title',
        contentValue: 'Discover the Refex Retail Advantage',
        contentType: 'text'
      },
      {
        sectionId: advantageSection.id,
        contentKey: 'description',
        contentValue:
          'Redefine retail excellence with streamlined operations, a rich variety of stores, and a customer-centric approach for an unmatched shopping journey.',
        contentType: 'text'
      },
      {
        sectionId: advantageSection.id,
        contentKey: 'bullets',
        contentValue: JSON.stringify([
          'Diverse Store Options',
          'Seamless Business Operations',
          'Strategic Layout for Visibility',
          'Exciting Shopping Experience'
        ]),
        contentType: 'json'
      }
    ];

    if (advantageImageMedia) {
      advantageContent.push({
        sectionId: advantageSection.id,
        contentKey: 'image',
        contentValue: advantageImageMedia.filePath,
        contentType: 'text',
        mediaId: advantageImageMedia.id
      });
    }

    for (const content of advantageContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Refex Retail Advantage section seeded');

    //
    // TRANSPORTATION ENHANCEMENT SECTION
    //
    console.log('Seeding Transportation Enhancement section...');
    const [transportSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'transportation-enhancement'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'transportation-enhancement',
        orderIndex: 4,
        isActive: true
      }
    });

    const transportImageMedia = mediaMap['landing-hero-1.png'];

    const transportContent = [
      {
        sectionId: transportSection.id,
        contentKey: 'title',
        contentValue: 'Comprehensive Transportation Enhancement Initiatives',
        contentType: 'text'
      },
      {
        sectionId: transportSection.id,
        contentKey: 'description',
        contentValue:
          'Enhance consumer journeys across transportation platforms (airports, railways, metro systems, bus stations, heliports). Currently managing end-to-end design, finance, operation, and maintenance of Pune Airport outlets (May 2023) and Srinagar Airport (Oct 2023).',
        contentType: 'text'
      },
      {
        sectionId: transportSection.id,
        contentKey: 'cards',
        contentValue: JSON.stringify([
          {
            title: 'Holistic Transportation Solutions'
          },
          {
            title: 'Airport Retail Management Expertise'
          }
        ]),
        contentType: 'json'
      }
    ];

    if (transportImageMedia) {
      transportContent.push({
        sectionId: transportSection.id,
        contentKey: 'image',
        contentValue: transportImageMedia.filePath,
        contentType: 'text',
        mediaId: transportImageMedia.id
      });
    }

    for (const content of transportContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Transportation Enhancement section seeded');

    //
    // TECH INTEGRATION SECTION
    //
    console.log('Seeding Tech Integration section...');
    const [techSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'tech-integration'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'tech-integration',
        orderIndex: 5,
        isActive: true
      }
    });

    const techImageMedia = mediaMap['landing-hero-2.png'];

    const techContent = [
      {
        sectionId: techSection.id,
        contentKey: 'title',
        contentValue: 'Elevating Airport Retail Experience with Seamless Tech Integration',
        contentType: 'text'
      },
      {
        sectionId: techSection.id,
        contentKey: 'description',
        contentValue:
          'Our commitment to enhancing customer experiences at airports extends to providing a future-forward, seamless retail and shopping journey for air travelers. Leveraging advanced technology, including the convenient pick-up of gifts and shopping items directly from our outlets, we ensure a modern and efficient shopping experience.',
        contentType: 'text'
      },
      {
        sectionId: techSection.id,
        contentKey: 'cards',
        contentValue: JSON.stringify([
          {
            title: 'Customer-Centric Retail Enhancement'
          },
          {
            title: 'Seamless Tech-Driven Shopping Experience'
          }
        ]),
        contentType: 'json'
      }
    ];

    if (techImageMedia) {
      techContent.push({
        sectionId: techSection.id,
        contentKey: 'image',
        contentValue: techImageMedia.filePath,
        contentType: 'text',
        mediaId: techImageMedia.id
      });
    }

    for (const content of techContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Tech Integration section seeded');

    //
    // CTA SECTION
    //
    console.log('Seeding CTA section...');
    const [ctaSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'cta'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'cta',
        orderIndex: 6,
        isActive: true
      }
    });

    const ctaBgMedia = mediaMap['Refex-Difference-02-1.png'];

    const ctaContent = [
      {
        sectionId: ctaSection.id,
        contentKey: 'title',
        contentValue: 'Revolutionizing Airport Retail',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'description',
        contentValue:
          'Discover how Refex Airports is pioneering a new era of retail in the airport environment, blending convenience with luxury.',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'buttonText',
        contentValue: 'Visit Website',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'buttonLink',
        contentValue: 'https://refexairports.com/',
        contentType: 'text'
      }
    ];

    if (ctaBgMedia) {
      ctaContent.push({
        sectionId: ctaSection.id,
        contentKey: 'backgroundImage',
        contentValue: ctaBgMedia.filePath,
        contentType: 'text',
        mediaId: ctaBgMedia.id
      });
    }

    for (const content of ctaContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ CTA section seeded');

    console.log('✅ Refex Airports page seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Refex Airports page:', error);
    process.exit(1);
  }
}

// Run the seed function if called directly
if (require.main === module) {
  db.sequelize
    .sync()
    .then(() => {
      seedRefexAirportsPage();
    })
    .catch((err) => {
      console.error('Error syncing database:', err);
      process.exit(1);
    });
}

module.exports = seedRefexAirportsPage;


