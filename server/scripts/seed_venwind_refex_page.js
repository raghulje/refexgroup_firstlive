require('dotenv').config();
const db = require('../models');
const { Page, Section, SectionContent, Media } = require('../models');

async function seedVenwindRefexPage() {
  try {
    console.log('Seeding Venwind Refex page sections...');

    const [page] = await Page.findOrCreate({
      where: { slug: 'venwind-refex' },
      defaults: {
        slug: 'venwind-refex',
        title: 'Venwind Refex',
        status: 'published',
        templateType: 'business-vertical'
      }
    });

    const mediaFiles = [
      {
        fileName: 'venwind-banner.jpg',
        filePath: '/wp-content/uploads/2025/03/venwind-banner.jpg',
        altText: 'Venwind Hero Background'
      },
      {
        fileName: 'about-usbg-630x630-1.jpg',
        filePath: '/wp-content/uploads/2025/03/about-usbg-630x630-1.jpg',
        altText: 'Venwind Stats Image'
      },
      {
        fileName: 'home-image-840x968-1.jpg',
        filePath: '/wp-content/uploads/2025/03/home-image-840x968-1.jpg',
        altText: 'Venwind Unique Image'
      },
      {
        fileName: 'gallery-img03.jpg',
        filePath: '/wp-content/uploads/2025/03/gallery-img03.jpg',
        altText: 'Venwind Technical Specs Image'
      },
      {
        fileName: 'sustainability-banner.jpg',
        filePath: '/wp-content/uploads/2025/03/sustainability-banner.jpg',
        altText: 'Venwind CTA Background'
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

    const heroBg = mediaMap['venwind-banner.jpg'];

    const heroContent = [
      {
        sectionId: heroSection.id,
        contentKey: 'subtitle',
        contentValue: 'Venwind Refex',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'title',
        contentValue: 'Harnessing and Powering the Future with Sustainable Wind Technology',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'description',
        contentValue:
          'Venwind Refex has an exclusive license from Vensys Energy AG, Germany, to manufacture 5.3 MW wind turbines featuring a permanent magnet generator and hybrid drivetrain technology. More than 120 GW of wind turbine generators using Vensys technology are in operation across five continents and multiple countries. Currently, we have been licensed to manufacture the state-of-the-art wind turbine technology in India.',
        contentType: 'text'
      }
    ];

    if (heroBg) {
      heroContent.push({
        sectionId: heroSection.id,
        contentKey: 'backgroundImage',
        contentValue: heroBg.filePath,
        contentType: 'text',
        mediaId: heroBg.id
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
    // STATS SECTION
    //
    console.log('Seeding Stats section...');
    const [statsSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'stats'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'stats',
        orderIndex: 1,
        isActive: true
      }
    });

    const statsImage = mediaMap['about-usbg-630x630-1.jpg'];

    const statsContent = [
      {
        sectionId: statsSection.id,
        contentKey: 'stats',
        contentValue: JSON.stringify([
          {
            value: '128',
            suffix: '+ GW',
            description: 'Operational Worldwide based on Vensys technology'
          },
          {
            value: '38',
            suffix: '+',
            description: 'Countries Operating globally utilizing wind turbine technology by Vensys'
          },
          {
            value: '5.3',
            suffix: ' MW',
            description: 'Permanent Magnet Generator with Medium-Speed Gearbox Hybrid Technology – Best in Class'
          },
          {
            value: '183.4',
            suffix: 'm',
            description: 'Rotor Diameter and 130m Tower Height – Capturing Optimal Wind Energy'
          }
        ]),
        contentType: 'json'
      }
    ];

    if (statsImage) {
      statsContent.push({
        sectionId: statsSection.id,
        contentKey: 'image',
        contentValue: statsImage.filePath,
        contentType: 'text',
        mediaId: statsImage.id
      });
    }

    for (const content of statsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Stats section seeded');

    //
    // UNIQUE SECTION
    //
    console.log('Seeding Unique section...');
    const [uniqueSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'unique'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'unique',
        orderIndex: 2,
        isActive: true
      }
    });

    const uniqueImage = mediaMap['home-image-840x968-1.jpg'];

    const uniqueContent = [
      {
        sectionId: uniqueSection.id,
        contentKey: 'heading',
        contentValue: 'What makes us unique?',
        contentType: 'text'
      },
      {
        sectionId: uniqueSection.id,
        contentKey: 'description',
        contentValue:
          'We offer wind turbines with advanced German technology from Vensys Energy AG at competitive prices.',
        contentType: 'text'
      },
      {
        sectionId: uniqueSection.id,
        contentKey: 'features',
        contentValue: JSON.stringify([
          'Hybrid drive-train (gearbox + medium speed PMG) for superior performance',
          'Proven technology with global installations in Australia, South Africa, Brazil and the Middle East',
          'Rapid delivery',
          'Reduced Opex costs due to PMG and hybrid drive-train',
          'Lower BOP costs with larger WTG sizes, achieving 20-25% savings',
          'Decreased LCOE through technological efficiency and BOP savings'
        ]),
        contentType: 'json'
      }
    ];

    if (uniqueImage) {
      uniqueContent.push({
        sectionId: uniqueSection.id,
        contentKey: 'image',
        contentValue: uniqueImage.filePath,
        contentType: 'text',
        mediaId: uniqueImage.id
      });
    }

    for (const content of uniqueContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Unique section seeded');

    //
    // TECHNICAL SPECS SECTION
    //
    console.log('Seeding Technical Specs section...');
    const [specsSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'technical-specs'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'technical-specs',
        orderIndex: 3,
        isActive: true
      }
    });

    const specsImage = mediaMap['gallery-img03.jpg'];

    const specsContent = [
      {
        sectionId: specsSection.id,
        contentKey: 'heading',
        contentValue: 'Our Technical Specifications',
        contentType: 'text'
      },
      {
        sectionId: specsSection.id,
        contentKey: 'specs',
        contentValue: JSON.stringify([
          { value: '26417 m²', label: 'Swept Area' },
          { value: '130m', label: 'Hub Height' },
          { value: '2.5 m/s', label: 'Cut-in Wind Speed' },
          { value: 'IEC S', label: 'Class' }
        ]),
        contentType: 'json'
      }
    ];

    if (specsImage) {
      specsContent.push({
        sectionId: specsSection.id,
        contentKey: 'image',
        contentValue: specsImage.filePath,
        contentType: 'text',
        mediaId: specsImage.id
      });
    }

    for (const content of specsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Technical Specs section seeded');

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
        orderIndex: 4,
        isActive: true
      }
    });

    const ctaBg = mediaMap['sustainability-banner.jpg'];

    const ctaContent = [
      {
        sectionId: ctaSection.id,
        contentKey: 'title',
        contentValue: 'Venwind Refex',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'description',
        contentValue:
          'Curious to know more about sustainable wind energy manufacturing technology?',
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
        contentValue: 'https://venwind.in/',
        contentType: 'text'
      }
    ];

    if (ctaBg) {
      ctaContent.push({
        sectionId: ctaSection.id,
        contentKey: 'backgroundImage',
        contentValue: ctaBg.filePath,
        contentType: 'text',
        mediaId: ctaBg.id
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

    console.log('✅ Venwind Refex page seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Venwind Refex page:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  db.sequelize
    .sync()
    .then(() => {
      seedVenwindRefexPage();
    })
    .catch(err => {
      console.error('Error syncing database:', err);
      process.exit(1);
    });
}

module.exports = seedVenwindRefexPage;


