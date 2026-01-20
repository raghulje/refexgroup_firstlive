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

async function seedRefexRefrigerantsPage() {
  try {
    console.log('Seeding Refex Refrigerants page sections...');

    // Get or create page
    const [page] = await Page.findOrCreate({
      where: { slug: 'refex-refrigerants' },
      defaults: {
        slug: 'refex-refrigerants',
        title: 'Refex Refrigerants',
        status: 'published',
        templateType: 'business-vertical'
      }
    });

    // ---------- HERO (hero-section) ----------
    // Reuse the business card image used on Home page for Refrigerants if available
    const [heroBgMedia] = await Media.findOrCreate({
      where: { fileName: 'Quality-Refilling.jpeg' },
      defaults: {
        fileName: 'Quality-Refilling.jpeg',
        filePath: '/uploads/images/Quality-Refilling.jpeg',
        fileType: 'image',
        altText: 'Refex Refrigerants hero background'
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
        contentValue: 'Refex Refrigerants',
        contentType: 'text'
      },
      {
        sectionId: heroSection.id,
        contentKey: 'subtitle',
        contentValue:
          'A market leader in refrigerant gas manufacturing, we are also conscious innovators. Discover our eco-friendly alternatives to make the step towards a greener tomorrow.',
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

    // ---------- OVERVIEW ----------
    const [overviewSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'overview' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'overview',
        orderIndex: 1,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: overviewSection.id,
        contentKey: 'heading',
        contentValue: 'Overview',
        contentType: 'text'
      },
      {
        sectionId: overviewSection.id,
        contentKey: 'description',
        contentValue:
          'For over two decades, Refex Refrigerants has been a trusted name in the refrigerant gas industry. We specialise in refilling and supplying high‑quality refrigerant gases while constantly innovating to introduce eco‑friendly alternatives that meet evolving environmental norms and customer expectations.',
        contentType: 'text'
      }
    ]);

    // ---------- PRODUCTS ----------
    const [productsSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'products' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'products',
        orderIndex: 2,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: productsSection.id,
        contentKey: 'heading',
        contentValue: 'Product Range',
        contentType: 'text'
      },
      {
        sectionId: productsSection.id,
        contentKey: 'description',
        contentValue:
          'Our portfolio covers a wide spectrum of refrigerant gases catering to residential, commercial and industrial applications. From legacy gases to next‑generation low‑GWP blends, Refex ensures reliable supply, consistent quality and regulatory compliance across the entire product range.',
        contentType: 'text'
      }
    ]);

    // ---------- QUALITY ASSURANCE ----------
    const [qualitySection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'quality-assurance' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'quality-assurance',
        orderIndex: 3,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: qualitySection.id,
        contentKey: 'heading',
        contentValue: 'Quality & Compliance',
        contentType: 'text'
      },
      {
        sectionId: qualitySection.id,
        contentKey: 'description',
        contentValue:
          'Every cylinder and bulk consignment goes through stringent quality checks and is handled by trained professionals. Our processes are aligned with national and international standards, ensuring safety, purity and performance in every delivery.',
        contentType: 'text'
      }
    ]);

    // ---------- APPLICATIONS ----------
    const [applicationsSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'applications' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'applications',
        orderIndex: 4,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: applicationsSection.id,
        contentKey: 'heading',
        contentValue: 'Applications',
        contentType: 'text'
      },
      {
        sectionId: applicationsSection.id,
        contentKey: 'description',
        contentValue:
          'Refex Refrigerants serves a diverse set of applications including residential air‑conditioning, commercial cold storage, industrial refrigeration and specialised process cooling. Our technical team supports customers in choosing the right refrigerant for performance, efficiency and regulatory needs.',
        contentType: 'text'
      }
    ]);

    // ---------- CTA SECTION ----------
    const [ctaSection] = await Section.findOrCreate({
      where: { pageId: page.id, sectionKey: 'cta-section' },
      defaults: {
        pageId: page.id,
        sectionType: 'content',
        sectionKey: 'cta-section',
        orderIndex: 5,
        isActive: true
      }
    });

    await upsertContent([
      {
        sectionId: ctaSection.id,
        contentKey: 'card1Title',
        contentValue: 'Talk to our refrigerant experts',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'card1ButtonText',
        contentValue: 'Contact Us',
        contentType: 'text'
      },
      {
        sectionId: ctaSection.id,
        contentKey: 'card1ButtonLink',
        contentValue: '/contact',
        contentType: 'text'
      }
    ]);

    console.log('✅ Refex Refrigerants page seeded successfully');
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Refex Refrigerants page:', error);
    await db.sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  seedRefexRefrigerantsPage();
}

module.exports = seedRefexRefrigerantsPage;


