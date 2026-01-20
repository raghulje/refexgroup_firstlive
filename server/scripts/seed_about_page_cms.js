/* eslint-disable no-await-in-loop */
const { sequelize, Page, Section, SectionContent, CoreValue, Media } = require('../models');

async function seedAboutPageCMS() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Get or create about page
    const [aboutPage] = await Page.findOrCreate({
      where: { slug: 'about-refex' },
      defaults: {
        slug: 'about-refex',
        title: 'About Refex',
        status: 'published',
        templateType: 'about'
      }
    });
    console.log('About page ID:', aboutPage.id);

    // Create or find media entries
    const mediaFiles = [
      { fileName: 'Gallery-20-th.-Anniversary-3.jpg', filePath: '/uploads/about/Gallery-20-th.-Anniversary-3.jpg', altText: 'Refex Group 20th Anniversary' },
      { fileName: 'REFEX-Logo@2x-8-1.png', filePath: '/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png', altText: 'Refex Logo' },
      { fileName: 'Office-Group-Photo-comp-1-1024x576.jpg', filePath: '/uploads/home/Office-Group-Photo-comp-1-1024x576.jpg', altText: 'Refex Group Office Photo' },
      { fileName: 'Vision-Mission-BG.jpg', filePath: '/uploads/about/mission-vision/Vision-Mission-BG.jpg', altText: 'Mission Vision Background' },
      { fileName: 'Milestone-Only-Year-1.png', filePath: '/uploads/about/our-story/Milestone-Only-Year-1.png', altText: 'Refex Milestones Timeline' },
      { fileName: 'REFEX_home_career-BG.jpg', filePath: '/uploads/home/REFEX_home_career-BG.jpg', altText: 'Careers Background' }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: 'image',
          altText: mediaFile.altText,
          url: mediaFile.filePath
        }
      });
      mediaMap[mediaFile.fileName] = media;
      console.log(`Media created/found: ${mediaFile.fileName} (ID: ${media.id})`);
    }

    // --- HERO SECTION ---
    console.log('Seeding Hero Section...');
    const [heroSection] = await Section.findOrCreate({
      where: {
        pageId: aboutPage.id,
        sectionKey: 'hero'
      },
      defaults: {
        pageId: aboutPage.id,
        sectionType: 'hero',
        sectionKey: 'hero',
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBackgroundMedia = mediaMap['Gallery-20-th.-Anniversary-3.jpg'];
    const heroContent = [
      { 
        sectionId: heroSection.id, 
        contentKey: 'title', 
        contentValue: 'About Refex Group', 
        contentType: 'text' 
      },
      { 
        sectionId: heroSection.id, 
        contentKey: 'subtitle', 
        contentValue: 'Refex Group is a leading diversified business group with over 23 years of experience, committed to excellence, innovation, and sustainable growth across all our business verticals.', 
        contentType: 'text' 
      }
    ];

    // Add background image if media exists
    if (heroBackgroundMedia) {
      heroContent.push({
        sectionId: heroSection.id,
        contentKey: 'backgroundImage',
        contentValue: heroBackgroundMedia.filePath,
        contentType: 'text',
        mediaId: heroBackgroundMedia.id
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
    console.log('✅ Hero Section seeded');

    // --- OVERVIEW SECTION ---
    console.log('Seeding Overview Section...');
    const [overviewSection] = await Section.findOrCreate({
      where: {
        pageId: aboutPage.id,
        sectionKey: 'overview'
      },
      defaults: {
        pageId: aboutPage.id,
        sectionType: 'content',
        sectionKey: 'overview',
        orderIndex: 1,
        isActive: true
      }
    });

    const overviewLogoMedia = mediaMap['REFEX-Logo@2x-8-1.png'];
    const overviewImageMedia = mediaMap['Office-Group-Photo-comp-1-1024x576.jpg'];

    const overviewContent = [
      { 
        sectionId: overviewSection.id, 
        contentKey: 'heading', 
        contentValue: 'About Refex Group', 
        contentType: 'text' 
      },
      { 
        sectionId: overviewSection.id, 
        contentKey: 'tagline', 
        contentValue: 'We thrive on RESILIENCE', 
        contentType: 'text' 
      },
      { 
        sectionId: overviewSection.id, 
        contentKey: 'yearsInBusiness', 
        contentValue: '23', 
        contentType: 'text' 
      },
      { 
        sectionId: overviewSection.id, 
        contentKey: 'peopleImpacted', 
        contentValue: '2', 
        contentType: 'text' 
      },
      { 
        sectionId: overviewSection.id, 
        contentKey: 'description', 
        contentValue: 'Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals. At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited. The company\'s excellent reputation and trust in the industry is due to its commitment to core values such as integrity, diversity, dedication, commitment, and competitiveness.\n\nSherisha Technologies Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.\n\nRefex Group\'s growth mindset is its biggest strength, which has allowed it to stay ahead of the competition by seizing emerging opportunities. By prioritizing customer satisfaction and continuous improvement, Refex Group has been able to provide superior value to all its stakeholders.\n\nThe company\'s culture of excellence has helped us to attract the best talent, and its focus on growth, learning, and adaptability will continue to drive our success in the future. Refex Group\'s commitment to leading by example and continuously improving while staying true to its values is a recipe for long-term success.', 
        contentType: 'text' 
      }
    ];

    if (overviewLogoMedia) {
      overviewContent.push({
        sectionId: overviewSection.id,
        contentKey: 'logo',
        contentValue: overviewLogoMedia.filePath,
        contentType: 'text',
        mediaId: overviewLogoMedia.id
      });
    }

    if (overviewImageMedia) {
      overviewContent.push({
        sectionId: overviewSection.id,
        contentKey: 'image',
        contentValue: overviewImageMedia.filePath,
        contentType: 'text',
        mediaId: overviewImageMedia.id
      });
    }

    for (const content of overviewContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Overview Section seeded');

    // --- MISSION & VISION SECTION ---
    console.log('Seeding Mission & Vision Section...');
    const [missionVisionSection] = await Section.findOrCreate({
      where: {
        pageId: aboutPage.id,
        sectionKey: 'mission-vision'
      },
      defaults: {
        pageId: aboutPage.id,
        sectionType: 'content',
        sectionKey: 'mission-vision',
        orderIndex: 2,
        isActive: true
      }
    });

    const missionVisionBgMedia = mediaMap['Vision-Mission-BG.jpg'];
    const missionVisionContent = [
      { 
        sectionId: missionVisionSection.id, 
        contentKey: 'missionTitle', 
        contentValue: 'Our Mission', 
        contentType: 'text' 
      },
      { 
        sectionId: missionVisionSection.id, 
        contentKey: 'missionText', 
        contentValue: 'Refex shall create enduring value across industries through innovation, operational excellence, and sustainable practices, thereby empowering our customers, enriching our communities, and delivering responsible growth for all stakeholders.', 
        contentType: 'text' 
      },
      { 
        sectionId: missionVisionSection.id, 
        contentKey: 'visionTitle', 
        contentValue: 'Our Vision', 
        contentType: 'text' 
      },
      { 
        sectionId: missionVisionSection.id, 
        contentKey: 'visionText', 
        contentValue: 'Refex aims to be a globally admired conglomerate, driving long-term sustainable growth through innovation, purposeful collaborations and partnerships, and an unwavering commitment to excellence, while contributing meaningfully to societal progress.', 
        contentType: 'text' 
      }
    ];

    if (missionVisionBgMedia) {
      missionVisionContent.push({
        sectionId: missionVisionSection.id,
        contentKey: 'backgroundImage',
        contentValue: missionVisionBgMedia.filePath,
        contentType: 'text',
        mediaId: missionVisionBgMedia.id
      });
    }

    for (const content of missionVisionContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Mission & Vision Section seeded');

    // --- STORY/TIMELINE SECTION ---
    console.log('Seeding Story/Timeline Section...');
    const [storySection] = await Section.findOrCreate({
      where: {
        pageId: aboutPage.id,
        sectionKey: 'story'
      },
      defaults: {
        pageId: aboutPage.id,
        sectionType: 'content',
        sectionKey: 'story',
        orderIndex: 3,
        isActive: true
      }
    });

    const timelineImageMedia = mediaMap['Milestone-Only-Year-1.png'];
    const timelineData = [
      { year: '2002', title: 'Foundation', description: 'Refex Group was founded, marking the beginning of our journey.' },
      { year: '2005', title: 'Expansion', description: 'Diversified into multiple business verticals including refrigerants and renewables.' },
      { year: '2010', title: 'Growth', description: 'Established strong presence in medical technologies and pharma sectors.' },
      { year: '2015', title: 'Innovation', description: 'Launched green mobility solutions and enhanced sustainability initiatives.' },
      { year: '2020', title: 'Milestone', description: 'Celebrated 20 years of excellence and continued expansion.' },
      { year: '2024', title: 'Future', description: 'Continuing to lead with innovation, sustainability, and growth mindset.' }
    ];

    const storyContent = [
      { 
        sectionId: storySection.id, 
        contentKey: 'heading', 
        contentValue: 'Discover Our Journey', 
        contentType: 'text' 
      },
      { 
        sectionId: storySection.id, 
        contentKey: 'description', 
        contentValue: 'A Story of Passion, Determination, and Growth', 
        contentType: 'text' 
      },
      { 
        sectionId: storySection.id, 
        contentKey: 'timeline', 
        contentValue: JSON.stringify(timelineData), 
        contentType: 'json' 
      }
    ];

    if (timelineImageMedia) {
      storyContent.push({
        sectionId: storySection.id,
        contentKey: 'timelineImage',
        contentValue: timelineImageMedia.filePath,
        contentType: 'text',
        mediaId: timelineImageMedia.id
      });
    }

    for (const content of storyContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Story/Timeline Section seeded');

    // --- CAREERS CTA SECTION ---
    console.log('Seeding Careers CTA Section...');
    const [careersCTASection] = await Section.findOrCreate({
      where: {
        pageId: aboutPage.id,
        sectionKey: 'careers-cta'
      },
      defaults: {
        pageId: aboutPage.id,
        sectionType: 'cta',
        sectionKey: 'careers-cta',
        orderIndex: 4,
        isActive: true
      }
    });

    const careersBgMedia = mediaMap['REFEX_home_career-BG.jpg'];
    const careersCTAContent = [
      { 
        sectionId: careersCTASection.id, 
        contentKey: 'title', 
        contentValue: 'Join Refex Group and grow, learn, and thrive in your career.', 
        contentType: 'text' 
      },
      { 
        sectionId: careersCTASection.id, 
        contentKey: 'description', 
        contentValue: 'Join our dynamic and driven team at Refex, where passion, self-motivation and a desire for growth are valued', 
        contentType: 'text' 
      },
      { 
        sectionId: careersCTASection.id, 
        contentKey: 'buttonText', 
        contentValue: 'Apply Now', 
        contentType: 'text' 
      },
      { 
        sectionId: careersCTASection.id, 
        contentKey: 'hashtag', 
        contentValue: '#iamarefexian', 
        contentType: 'text' 
      },
      { 
        sectionId: careersCTASection.id, 
        contentKey: 'buttonLink', 
        contentValue: '/careers', 
        contentType: 'text' 
      },
      { 
        sectionId: careersCTASection.id, 
        contentKey: 'hashtag', 
        contentValue: '#iamarefexian', 
        contentType: 'text' 
      }
    ];

    if (careersBgMedia) {
      careersCTAContent.push({
        sectionId: careersCTASection.id,
        contentKey: 'backgroundImage',
        contentValue: careersBgMedia.filePath,
        contentType: 'text',
        mediaId: careersBgMedia.id
      });
    }

    for (const content of careersCTAContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Careers CTA Section seeded');

    // --- CORE VALUES (PACE) ---
    console.log('Seeding Core Values...');
    const coreValues = [
      {
        letter: 'P',
        title: 'Principled Excellence',
        description: 'Doing what\'s right, with integrity and intention.',
        orderIndex: 0,
        isActive: true
      },
      {
        letter: 'A',
        title: 'Authenticity',
        description: 'Bringing your true self to work, and honouring that in others.',
        orderIndex: 1,
        isActive: true
      },
      {
        letter: 'C',
        title: 'Customer Value',
        description: 'Keeping our customers at the heart of everything we do.',
        orderIndex: 2,
        isActive: true
      },
      {
        letter: 'E',
        title: 'Esteem Culture',
        description: 'Fostering a workplace where respect, dignity, and belonging are everyday experiences.',
        orderIndex: 3,
        isActive: true
      }
    ];

    for (const valueData of coreValues) {
      await CoreValue.findOrCreate({
        where: {
          letter: valueData.letter
        },
        defaults: valueData
      });
    }
    console.log('✅ Core Values seeded');

    console.log('\n✅✅✅ About Page CMS data seeded successfully! ✅✅✅');
    console.log('\nSeeded sections:');
    console.log('  - Hero Section');
    console.log('  - Overview Section');
    console.log('  - Mission & Vision Section');
    console.log('  - Story/Timeline Section');
    console.log('  - Careers CTA Section');
    console.log('  - Core Values (PACE)');
    console.log('\nNote: Leaders data should be seeded separately using seed_leaders.js');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding About Page CMS:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAboutPageCMS();
}

module.exports = seedAboutPageCMS;

