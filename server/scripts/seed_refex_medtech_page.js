require('dotenv').config();

const db = require('../models');
const { Page, Section, SectionContent, Media } = require('../models');

async function upsertContent(items) {
  for (const item of items) {
    await SectionContent.findOrCreate({
      where: {
        sectionId: item.sectionId,
        contentKey: item.contentKey
      },
      defaults: item
    });
  }
}

async function seedRefexMedtechPage() {
  try {
    console.log('Seeding Refex MedTech page (business‑grade CMS)...');

    // Page
    const [page] = await Page.findOrCreate({
      where: { slug: 'refex-medtech' },
      defaults: {
        slug: 'refex-medtech',
        title: 'Refex MedTech',
        status: 'published',
        templateType: 'business-vertical'
      }
    });

    // ---------- HERO (hero-section) ----------
    const [heroBgMedia] = await Media.findOrCreate({
      where: { fileName: 'refex-medtech-hero-main.jpg' },
      defaults: {
        fileName: 'refex-medtech-hero-main.jpg',
        filePath: '/uploads/business/refex-medtech/hero/medtech-images-new.png',
        fileType: 'image',
        altText: 'Refex MedTech hero banner'
      }
    });

    const [heroSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'hero-section' },
      defaults: {
        pageId: page.id,
        sectionType: 'hero',
        sectionKey: 'hero-section',
        orderIndex: 0,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: heroSection.id,
        contentKey: 'title',
        contentValue: 'Refex MedTech',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'subtitle',
        contentValue:
          'We are an esteemed player in the medical devices industry with a core competency in the manufacturing of sophisticated diagnostic imaging equipment solutions, such as the first “Made in India” MRI: Anamaya & Flat Panel Detector (FPD), ultra portable X-ray system: MINI 90, Digital Radiography and C‑arms. We pledge to bring “Affordable Luxury” to our products & solutions to serve our customers with advanced technology with lower life cycle costs without compromising on performance, quality, reliability & patient safety.',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'backgroundImage',
        contentValue: heroBgMedia.filePath,
        contentType: 'text',
        mediaId: heroBgMedia.id
      }
    ]);

    // ---------- ASSOCIATE COMPANIES ----------
    const [associatesSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'associate-companies' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'associate-companies',
        orderIndex: 1,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: associatesSection.id,
        contentKey: 'title',
        contentValue:
          'Exploring Innovative Healthcare Solutions with Our Associate Companies.',
        contentType: 'text'
      },
      {
        sectionId: associatesSection.id,
        contentKey: 'companies',
        contentValue: JSON.stringify([
          {
            name: '3i MedTech',
            logo: '/uploads/logos/3i-MedTech-new-Logo-e1679395253850-858x1024.png',
            description:
              '3i MedTech offers affordable diagnostic imaging solutions including X-rays, C-Arms, Mammography, pre-owned MRI and more, with a focus on reliability and global standards.'
          },
          {
            name: 'Adonis',
            logo: '/uploads/logos/Adonis-logo-1024x666.png',
            description:
              'ADONIS provides quality medical imaging solutions with ergonomically designed machines utilizing the latest image processing techniques to the medical fraternity at affordable costs.'
          }
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- STATS ----------
    const [statsSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'stats' },
      defaults: {
        pageId: page.id,
        sectionType: 'stats',
        sectionKey: 'stats',
        orderIndex: 2,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: statsSection.id,
        contentKey: 'stats',
        contentValue: JSON.stringify([
          { value: '30', suffix: '+', label: 'Years of experience' },
          { value: '3', label: 'Manufacturing and R&D facilities' },
          { value: '8000', suffix: '+', label: 'Installations' }
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- COMMITMENT ----------
    const [commitmentSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'commitment' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'commitment',
        orderIndex: 3,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: commitmentSection.id,
        contentKey: 'label',
        contentValue: 'our commitment',
        contentType: 'text'
      },
      {
        sectionId: commitmentSection.id,
        contentKey: 'title',
        contentValue: 'Redefining Healthcare Through Innovation',
        contentType: 'text'
      },
      {
        sectionId: commitmentSection.id,
        contentKey: 'commitments',
        contentValue: JSON.stringify([
          {
            icon: '💎',
            title: 'Affordable Diagnostic Excellence',
            description: 'Delivering world-class medical technology at accessible prices'
          },
          {
            icon: '🔬',
            title: 'Comprehensive Imaging Solutions',
            description: 'Providing end-to-end solutions for optimal patient care'
          },
          {
            icon: '🤝',
            title: 'Unwavering Service Support',
            description: 'Committed to customer satisfaction through exceptional service'
          }
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- SPECIALITIES ----------
    const [specialitiesImage] = await Media.findOrCreate({
      where: { fileName: 'medtech-specialities.jpg' },
      defaults: {
        fileName: 'medtech-specialities.jpg',
        filePath: '/uploads/general/our-specialities.avif',
        fileType: 'image',
        altText: 'Our specialities'
      }
    });

    const [specialitiesSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'specialities' },
      defaults: {
        pageId: page.id,
        sectionType: 'features',
        sectionKey: 'specialities',
        orderIndex: 4,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: specialitiesSection.id,
        contentKey: 'label',
        contentValue: 'our specialities',
        contentType: 'text'
      },
      {
        sectionId: specialitiesSection.id,
        contentKey: 'description',
        contentValue:
          'Our expertise spans across various healthcare consulting services, providing medical professionals with innovative solutions for precision, efficiency, and reliability.',
        contentType: 'text'
      },
      {
        sectionId: specialitiesSection.id,
        contentKey: 'image',
        contentValue: specialitiesImage.filePath,
        contentType: 'text',
        mediaId: specialitiesImage.id
      },
      {
        sectionId: specialitiesSection.id,
        contentKey: 'specialities',
        contentValue: JSON.stringify([
          { icon: 'ri-heart-pulse-line', name: 'Radiology' },
          { icon: 'ri-capsule-line', name: 'Urology' },
          { icon: 'ri-brain-line', name: 'Neurology' },
          { icon: 'ri-bone-line', name: 'Orthopedic' },
          { icon: 'ri-stethoscope-line', name: 'Gastroenterology' }
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- PRODUCTS ----------
    const [productsSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'products' },
      defaults: {
        pageId: page.id,
        sectionType: 'products',
        sectionKey: 'products',
        orderIndex: 5,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: productsSection.id,
        contentKey: 'title',
        contentValue: 'Extensive product portfolio',
        contentType: 'text'
      },
      {
        sectionId: productsSection.id,
        contentKey: 'description',
        contentValue:
          'Our product range encompasses X-ray systems, digital radiography solutions, C-Arms, dedicated to improving healthcare accessibility and quality. Our strategic focus on Tier 2 and Tier 3 markets ensures that healthcare facilities in every corner of the country benefit from our advanced technology.',
        contentType: 'text'
      },
      {
        sectionId: productsSection.id,
        contentKey: 'products',
        contentValue: JSON.stringify([
          {
            title: 'MINI 90',
            subtitle: 'Ultra-portable hand-held digital X-ray system',
            features: [
              'Lightweight and compact design: Weighing<4 kg',
              'Best in class: up to 90 kV ,10 mA for precise and high resolution',
              'SID tracker',
              '7 inch LED smart screen',
              'Dose display',
              'Leak proof adjustable collimator',
              'Skin guard leaves',
              'Temperature and shock sensor',
              'Versatile uses in clinical settings',
              'Cutting-edge AI powered diagnostics'
            ]
          },
          {
            title: 'Flat Panel Detector',
            subtitle: 'Applications for X-ray and Fluoroscopy',
            features: [
              'New generation Flat Panel Detector',
              '17 x 17 and 14 x 17 inches',
              'Wired and wireless CSI Technology',
              'High DQE for excellent image quality',
              'Durable and robust-handle up to 150 kg of distributed load',
              'Unprecedented weight of 3 kg',
              'Advanced software technology for easy Deployment'
            ]
          },
          {
            title: 'Anamaya 1.5T MRI',
            subtitle: 'The country’s first completely Made-in-India MRI, 1.5T superconductive MRI',
            features: [
              '96% acoustic noise reduction',
              '50% power savings and energy efficiency',
              'Radar technology and Smart analytics',
              'High-Precision Signal Correction technology',
              'Superior magnet technology'
            ]
          },
          {
            title: 'Floor mounted DR',
            subtitle: 'Digital Display for switching ON/OFF and Selection of kV/ mA/ mAs',
            features: [
              'Advanced Display for Bucky selection, Focal point selection, Exposure.',
              'APR Based Control for all body parts',
              'Microprocessor control tube for overload protection',
              'Automatic voltage compensation',
              'Self-Diagnostic program with Error code.'
            ]
          },
          {
            title: 'Ceiling mounted DR',
            subtitle: 'Digital Display for switching ON/OFF and Selection of kV/ mA/ mAs',
            features: [
              'Advanced Display for Bucky selection, Focal point selection, Exposure.',
              'APR Based Control for all body parts',
              'Microprocessor control tube for overload protection',
              'Automatic voltage compensation',
              'Self-Diagnostic program with Error code.'
            ]
          }
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- CERTIFICATIONS ----------
    const [certSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'certifications' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'certifications',
        orderIndex: 6,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: certSection.id,
        contentKey: 'title',
        contentValue: 'Certifications & Compliance',
        contentType: 'text'
      },
      {
        sectionId: certSection.id,
        contentKey: 'certifications',
        contentValue: JSON.stringify([
          { image: '/uploads/general/images.jpg', title: 'AERB' },
          { image: '/uploads/general/1536257006-9131.jpg-removebg-preview.png', title: 'CDSCO' },
          { image: '/uploads/general/bis-certification-services.jpg', title: 'BIS' },
          { image: '/uploads/general/b136d1c0df779785_400x400ar.jpg', title: 'ISO 13485' }
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- CLIENTELE ----------
    const [clienteleSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'clientele' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'clientele',
        orderIndex: 7,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: clienteleSection.id,
        contentKey: 'title',
        contentValue: 'Clientele',
        contentType: 'text'
      },
      {
        sectionId: clienteleSection.id,
        contentKey: 'clientLogos',
        contentValue: JSON.stringify([
          '/uploads/logos/logo01.jpg',
          '/uploads/logos/logo02.jpg',
          '/uploads/logos/logo03.jpg',
          '/uploads/logos/logo04.jpg',
          '/uploads/logos/logo05.jpg',
          '/uploads/logos/logo06.jpg',
          '/uploads/logos/logo07.jpg',
          '/uploads/logos/logo08.jpg',
          '/uploads/logos/logo09.jpg',
          '/uploads/logos/logo10.jpg',
          '/uploads/logos/logo11.jpg',
          '/uploads/logos/logo12.jpg',
          '/uploads/logos/logo13.jpg',
          '/uploads/logos/logo14.jpg',
          '/uploads/logos/logo15.jpg',
          '/uploads/logos/logo16.jpg',
          '/uploads/logos/logo17.jpg',
          '/uploads/logos/logo18.jpg',
          '/uploads/logos/logo19.jpg',
          '/uploads/logos/logo20.jpg',
          '/uploads/logos/logo21.jpg',
          '/uploads/logos/logo22.jpg',
          '/uploads/logos/logo23.jpg',
          '/uploads/logos/logo24.jpg'
        ]),
        contentType: 'json'
      }
    ]);

    // ---------- CTA SECTION ----------
    const [ctaSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'cta-section' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'cta-section',
        orderIndex: 8,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: ctaSection.id,
        contentKey: 'card1Title',
        contentValue: 'Explore Refex MedTech',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'card1ButtonText',
        contentValue: 'Visit Website',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'card1ButtonLink',
        contentValue: 'https://www.refexmedtech.com/',
        contentType: 'text'
      }
    ]);

    console.log('✅ Refex MedTech page seeded successfully');
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Refex MedTech page:', error);
    await db.sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  seedRefexMedtechPage();
}

module.exports = seedRefexMedtechPage;

