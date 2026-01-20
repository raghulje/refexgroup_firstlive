require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedNewsroomPage() {
  try {
    console.log("Seeding Newsroom page sections...");

    // Get or create newsroom page
    const newsroomPage = await Page.findOrCreate({
      where: { slug: "newsroom" },
      defaults: {
        slug: "newsroom",
        title: "Newsroom",
        metaTitle: "Newsroom - Latest News & Updates | Refex Group",
        metaDescription: "Stay updated with the latest news, press releases, and events from Refex Group.",
        status: "published",
        templateType: "newsroom"
      }
    });
    const page = newsroomPage[0];

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

    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Newsroom", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Get hyped for the latest buzz on our businesses and community initiatives, as well as inspiring stories about the amazing people behind them!", contentType: "text" }
    ];

    // Try to find and add background image if it exists
    const heroBgMedia = await Media.findOne({
      where: { fileName: "Gallery-3i-MedTech-IRIA-2022-5.jpg" }
    });

    if (heroBgMedia) {
      heroContent.push({
        sectionId: heroSection[0].id,
        contentKey: "backgroundImage",
        contentValue: heroBgMedia.filePath,
        contentType: "text",
        mediaId: heroBgMedia.id
      });
    } else {
      // Use the path directly if media doesn't exist
      heroContent.push({
        sectionId: heroSection[0].id,
        contentKey: "backgroundImage",
        contentValue: "/wp-content/uploads/2023/02/Gallery-3i-MedTech-IRIA-2022-5.jpg",
        contentType: "text"
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

    // CTA Section
    const ctaSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "cta"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "cta",
        orderIndex: 1,
        isActive: true
      }
    });

    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "card1Title", contentValue: "Got a question?", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "card1ButtonText", contentValue: "Get in touch", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "card1ButtonLink", contentValue: "/contact", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "card2Title", contentValue: "Work at Refex", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "card2ButtonText", contentValue: "Careers", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "card2ButtonLink", contentValue: "/careers", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "bgGradientFrom", contentValue: "#3b9dd6", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "bgGradientTo", contentValue: "#4db3e8", contentType: "text" }
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

    console.log("✅ Newsroom page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Newsroom page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedNewsroomPage();
}

module.exports = seedNewsroomPage;

