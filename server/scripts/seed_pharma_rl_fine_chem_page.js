require('dotenv').config();
const db = require('../models');
const { Page, Section, SectionContent, Media } = require('../models');

async function seedPharmaRLFineChemPage() {
  try {
    console.log('Seeding Pharma RL Fine Chem (Refex Life Sciences) page sections...');

    const [page] = await Page.findOrCreate({
      where: { slug: 'pharma-rl-fine-chem' },
      defaults: {
        slug: 'pharma-rl-fine-chem',
        title: 'Refex Life Sciences',
        status: 'published',
        templateType: 'business-vertical'
      }
    });

    const mediaFiles = [
      {
        fileName: 'Hero-section-BG.jpg',
        filePath: '/wp-content/uploads/2024/01/Hero-section-BG.jpg',
        altText: 'Refex Life Sciences Hero Background'
      },
      {
        fileName: 'modepro-logo.png',
        filePath: '/assets/business/pharma/modepro-logo.png',
        altText: 'Modepro Logo'
      },
      {
        fileName: 'rlfc-logo.png',
        filePath: '/assets/business/pharma/rlfc-logo.png',
        altText: 'RLFC Logo'
      },
      {
        fileName: 'extrovis-logo.png',
        filePath: '/assets/business/pharma/extrovis-logo.png',
        altText: 'Extrovis Logo'
      },
      {
        fileName: 'Hindupur-Plant.jpg',
        filePath: '/wp-content/uploads/2024/01/Hindupur-Plant.jpg',
        altText: 'Hindupur Plant'
      },
      {
        fileName: 'Gauribidnaur-Plant.jpg',
        filePath: '/wp-content/uploads/2024/01/Gauribidnaur-Plant.jpg',
        altText: 'Gauribidnaur Plant'
      },
      {
        fileName: 'sermoneta-plant.jpg',
        filePath: '/assets/business/pharma/sermoneta-plant.jpg',
        altText: 'Sermoneta Facility'
      },
      {
        fileName: 'sugarland-plant.jpg',
        filePath: '/assets/business/pharma/sugarland-plant.jpg',
        altText: 'Sugar Land Facility'
      },
      {
        fileName: 'hungary-plant.jpg',
        filePath: '/assets/business/pharma/hungary-plant.jpg',
        altText: 'Hungary Packaging Facility'
      },
      {
        fileName: 'kurkumbh-plant.jpeg',
        filePath: '/assets/business/pharma/kurkumbh-plant.jpeg',
        altText: 'Kurkumbh Plant'
      },
      {
        fileName: 'ambernath-plant.jpeg',
        filePath: '/assets/business/pharma/ambernath-plant.jpeg',
        altText: 'Ambernath Facility'
      },
      {
        fileName: 'CTA-BG.jpg',
        filePath: '/wp-content/uploads/2024/01/CTA-BG.jpg',
        altText: 'CTA Background'
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

    const heroBg = mediaMap['Hero-section-BG.jpg'];

    const heroContent = [
      {
        sectionId: heroSection.id,
        contentKey: 'title',
        contentValue: 'A Global API Partner from Refex',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'description',
        contentValue:
          'A leading pharmaceutical platform with 40+ years of API excellence, global partnerships in advanced intermediates, and CRDMO expertise in speciality formulations and antibiotics.',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'stats',
        contentValue: JSON.stringify([
          { value: 550, suffix: '+', label: 'Customers' },
          { value: 100, suffix: '+', label: 'Innovative Products' },
          { value: 80, suffix: '+', label: 'Countries' }
        ]),
        contentType: 'json'
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
    // LOGO CARDS SECTION
    //
    console.log('Seeding Logo Cards section...');
    const [logosSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'logo-cards'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'logo-cards',
        orderIndex: 1,
        isActive: true
      }
    });

    const modeproLogo = mediaMap['modepro-logo.png'];
    const rlfcLogo = mediaMap['rlfc-logo.png'];
    const extrovisLogo = mediaMap['extrovis-logo.png'];

    const logosContent = [
      {
        sectionId: logosSection.id,
        contentKey: 'logos',
        contentValue: JSON.stringify([
          {
            name: 'Modérro',
            image: modeproLogo ? modeproLogo.filePath : '/assets/business/pharma/modepro-logo.png'
          },
          {
            name: 'RLFC',
            image: rlfcLogo ? rlfcLogo.filePath : '/assets/business/pharma/rlfc-logo.png'
          },
          {
            name: 'Extrovis',
            image: extrovisLogo ? extrovisLogo.filePath : '/assets/business/pharma/extrovis-logo.png'
          }
        ]),
        contentType: 'json'
      }
    ];

    for (const content of logosContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Logo Cards section seeded');

    //
    // ABOUT SECTION
    //
    console.log('Seeding About section...');
    const [aboutSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'about'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'about',
        orderIndex: 2,
        isActive: true
      }
    });

    const aboutContent = [
      {
        sectionId: aboutSection.id,
        contentKey: 'heading',
        contentValue: 'About Refex Life Sciences',
        contentType: 'text'
      },
      {
        sectionId: aboutSection.id,
        contentKey: 'paragraphs',
        contentValue: JSON.stringify([
          'At Refex Life Sciences, innovation defines who we are. As the pharmaceutical platform of the Refex Group, we combine cutting-edge science with customer-focused excellence to advance healthcare globally.',
          'Our journey began with the acquisition of RLFC, a 40-year-old API company whose legacy we infused with the Refex spirit of innovation. We expanded further with Modepro, strengthening our advanced intermediate capabilities, and with Extrovis, establishing a global footprint in speciality formulations and antibiotics.'
        ]),
        contentType: 'json'
      }
    ];

    for (const content of aboutContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ About section seeded');

    //
    // R&D CAPABILITY SECTION
    //
    console.log('Seeding R&D Capability section...');
    const [rdSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'rd-capability'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'rd-capability',
        orderIndex: 3,
        isActive: true
      }
    });

    const rdContent = [
      {
        sectionId: rdSection.id,
        contentKey: 'heading',
        contentValue: 'Research & Development Excellence',
        contentType: 'text'
      },
      {
        sectionId: rdSection.id,
        contentKey: 'description',
        contentValue:
          'At Refex Life Sciences, innovation is our engine of growth. With world-class R&D centres and a team of over 200 scientists, we are advancing the frontiers of both API development and complex finished dosage formulations (FDFs). Our research is focused on creating differentiated, sustainable, and patient-centric solutions that address unmet needs across global healthcare.',
        contentType: 'text'
      },
      {
        sectionId: rdSection.id,
        contentKey: 'capabilities',
        contentValue: JSON.stringify([
          { title: 'Sustainable Process Development', icon: 'ri-recycle-line' },
          { title: 'Chiral Chemistry Expertise', icon: 'ri-contrast-2-line' },
          { title: 'Complex Chemistry Capabilities', icon: 'ri-flask-line' },
          { title: 'Impurity & Genotoxic Control', icon: 'ri-shield-check-line' },
          { title: 'Technology Transfer', icon: 'ri-exchange-line' },
          { title: 'Green Chemistry Principles', icon: 'ri-leaf-line' },
          { title: 'Regulatory Support', icon: 'ri-file-shield-line' },
          { title: 'Over 200 scientists', icon: 'ri-team-line' },
          { title: 'Collaboration + Specialization', icon: 'ri-group-line' },
          { title: 'Cross-functional Approach', icon: 'ri-links-line' },
          { title: 'Passion and Professionalism', icon: 'ri-star-line' }
        ]),
        contentType: 'json'
      }
    ];

    for (const content of rdContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ R&D Capability section seeded');

    //
    // PLANT CAPABILITY SECTION
    //
    console.log('Seeding Plant Capability section...');
    const [plantSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: 'plant-capability'
      },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'plant-capability',
        orderIndex: 4,
        isActive: true
      }
    });

    const hindupur = mediaMap['Hindupur-Plant.jpg'];
    const gauribidnaur = mediaMap['Gauribidnaur-Plant.jpg'];
    const sermoneta = mediaMap['sermoneta-plant.jpg'];
    const sugarland = mediaMap['sugarland-plant.jpg'];
    const hungary = mediaMap['hungary-plant.jpg'];
    const kurkumbh = mediaMap['kurkumbh-plant.jpeg'];
    const ambernath = mediaMap['ambernath-plant.jpeg'];

    const plantContent = [
      {
        sectionId: plantSection.id,
        contentKey: 'heading',
        contentValue: 'Manufacturing Excellence',
        contentType: 'text'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'description',
        contentValue:
          'Our global manufacturing footprint spans APIs, intermediates, and finished formulations, supported by stringent regulatory approvals and world-class infrastructure. Together, these facilities enable us to deliver quality, scale, and reliability to partners across 80+ countries.',
        contentType: 'text'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'formulationsFacilities',
        contentValue: JSON.stringify([
          {
            title: 'Sermoneta Facility',
            location: 'Sermoneta, Italy',
            image: sermoneta ? sermoneta.filePath : '/assets/business/pharma/sermoneta-plant.jpg'
          },
          {
            title: 'Sugar Land Facility',
            location: 'Sugar Land, Texas, US',
            image: sugarland ? sugarland.filePath : '/assets/business/pharma/sugarland-plant.jpg'
          },
          {
            title: 'Hungary Packaging Facility',
            location: 'Hungary',
            image: hungary ? hungary.filePath : '/assets/business/pharma/hungary-plant.jpg'
          }
        ]),
        contentType: 'json'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'rlfcCapabilities',
        contentValue: JSON.stringify([
          {
            title: 'Hindupur Plant',
            location: 'Hindupur, India',
            image: hindupur ? hindupur.filePath : '/wp-content/uploads/2024/01/Hindupur-Plant.jpg'
          },
          {
            title: 'Gauribidnaur Plant',
            location: 'Gauribidnaur, India',
            image: gauribidnaur ? gauribidnaur.filePath : '/wp-content/uploads/2024/01/Gauribidnaur-Plant.jpg'
          }
        ]),
        contentType: 'json'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'expansionNote',
        contentValue:
          'Expansion: Hyderabad plant set for a new manufacturing block in 2025, reflecting our growing scale.',
        contentType: 'text'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'oncologyFacilities',
        contentValue: JSON.stringify([
          {
            title: 'Kurkumbh Plant',
            location: 'Kurkumbh, India',
            image: kurkumbh ? kurkumbh.filePath : '/assets/business/pharma/kurkumbh-plant.jpeg'
          },
          {
            title: 'Ambernath Facility',
            location: 'Ambernath, India',
            image: ambernath ? ambernath.filePath : '/assets/business/pharma/ambernath-plant.jpeg'
          }
        ]),
        contentType: 'json'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'approvalsHeading',
        contentValue: 'Regulatory Approvals',
        contentType: 'text'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'approvalsDescription',
        contentValue:
          'Refex Life Sciences operates a worldwide network of state-of-the-art manufacturing facilities seamlessly integrated into the group. These facilities comply with the highest international quality standards with accreditations from:',
        contentType: 'text'
      },
      {
        sectionId: plantSection.id,
        contentKey: 'approvals',
        contentValue: JSON.stringify([
          { name: 'US FDA', icon: 'ri-government-line', color: '#7DC244' },
          { name: 'EU GMP', icon: 'ri-shield-check-line', color: '#EE6A31' },
          { name: 'EDQM', icon: 'ri-file-shield-line', color: '#7DC244' },
          { name: 'Health Canada', icon: 'ri-hospital-line', color: '#EE6A31' },
          { name: 'ANVISA', icon: 'ri-shield-star-line', color: '#7DC244' },
          { name: 'PMDA', icon: 'ri-medal-line', color: '#EE6A31' },
          { name: 'WHO-GMP', icon: 'ri-global-line', color: '#7DC244' }
        ]),
        contentType: 'json'
      }
    ];

    for (const content of plantContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log('✅ Plant Capability section seeded');

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
        orderIndex: 5,
        isActive: true
      }
    });

    const ctaBg = mediaMap['CTA-BG.jpg'];

    const ctaContent = [
      {
        sectionId: ctaSection.id,
        contentKey: 'title',
        contentValue: 'Redefining Excellence in API Development',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'description',
        contentValue:
          'Experience a new era at RLFC, redefining API development with unwavering commitment to cutting-edge solutions. Setting pioneering standards, we drive transformative advancements in global healthcare.',
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
        contentValue: 'https://refexlifesciences.com/',
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

    console.log('✅ Pharma RL Fine Chem page seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Pharma RL Fine Chem page:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  db.sequelize
    .sync()
    .then(() => {
      seedPharmaRLFineChemPage();
    })
    .catch(err => {
      console.error('Error syncing database:', err);
      process.exit(1);
    });
}

module.exports = seedPharmaRLFineChemPage;


