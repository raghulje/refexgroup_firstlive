require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedGalleryPage() {
  try {
    console.log("Seeding Gallery page sections...");

    // Get or create Gallery page
    const galleryPage = await Page.findOrCreate({
      where: { slug: "gallery" },
      defaults: {
        slug: "gallery",
        title: "Gallery",
        metaTitle: "Gallery - Events & Milestones | Refex Group",
        metaDescription: "Explore our gallery of events, milestones, and moments that define Refex Group.",
        status: "published",
        templateType: "gallery"
      }
    });
    const page = galleryPage[0];

    // Create or find media entries for hero background and welcome image
    const mediaFiles = [
      { fileName: "Gallery-Hero-Bg.jpg", filePath: "/wp-content/uploads/2023/02/Gallery-REFEX-Awards-7.jpg", altText: "Gallery Hero Background" },
      { fileName: "Gallery-Welcome-Image.jpg", filePath: "/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-1.jpg", altText: "Gallery Welcome Image" }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: "image",
          altText: mediaFile.altText,
          pageName: 'gallery',
          sectionName: mediaFile.fileName.includes('Hero') ? 'hero' : 'welcome'
        }
      });
      mediaMap[mediaFile.fileName] = media;
    }

    // Hero Section
    const heroSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "hero"
      },
      defaults: {
        pageId: page.id,
        sectionType: "hero",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBackgroundMedia = mediaMap["Gallery-Hero-Bg.jpg"];
    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Gallery", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Stay informed about the latest developments and news from Refex Industries Limited.", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "overlayOpacity", contentValue: "40", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "blurOverlay", contentValue: "0", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "overlayColor", contentValue: "#000000", contentType: "text" }
    ];

    if (heroBackgroundMedia) {
      heroContent.push({
        sectionId: heroSection[0].id,
        contentKey: "backgroundImage",
        contentValue: heroBackgroundMedia.filePath,
        contentType: "text",
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

    // Welcome Section
    const welcomeSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "welcome"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "welcome",
        orderIndex: 1,
        isActive: true
      }
    });

    const welcomeImageMedia = mediaMap["Gallery-Welcome-Image.jpg"];
    const welcomeContent = [
      { sectionId: welcomeSection[0].id, contentKey: "title", contentValue: "Welcome to Refex Group's gallery!", contentType: "text" },
      { sectionId: welcomeSection[0].id, contentKey: "description", contentValue: "We take pride in showcasing our achievements, milestones, and notable events. Our state-of-the-art facilities, involvement in social and community initiatives, and collaborations with businesses and governments highlight our commitment to sustainability and innovation. Explore our gallery to learn more about our journey towards building a better future for ourselves and the planet.", contentType: "text" }
    ];

    if (welcomeImageMedia) {
      welcomeContent.push({
        sectionId: welcomeSection[0].id,
        contentKey: "image",
        contentValue: welcomeImageMedia.filePath,
        contentType: "text",
        mediaId: welcomeImageMedia.id
      });
    }

    for (const content of welcomeContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // CTA Section
    const ctaSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "cta"
      },
      defaults: {
        pageId: page.id,
        sectionType: "cta",
        sectionKey: "cta",
        orderIndex: 2,
        isActive: true
      }
    });

    const ctaCards = [
      {
        title: "Got a question?",
        buttonText: "Get in touch",
        buttonLink: "/contact"
      },
      {
        title: "See our latest news",
        buttonText: "Refex Newsroom",
        buttonLink: "/newsroom"
      },
      {
        title: "Work at Refex",
        buttonText: "Careers",
        buttonLink: "/careers"
      }
    ];

    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "bgGradientFrom", contentValue: "#3b9dd6", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "bgGradientTo", contentValue: "#4db3e8", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "cards", contentValue: JSON.stringify(ctaCards), contentType: "json" }
    ];

    for (const content of ctaContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    console.log("✅ Gallery page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Gallery page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  seedGalleryPage();
}

module.exports = seedGalleryPage;

