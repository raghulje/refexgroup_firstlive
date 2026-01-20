require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedContactPage() {
  try {
    console.log("Seeding Contact page sections...");

    // Get or create contact page
    const contactPage = await Page.findOrCreate({
      where: { slug: "contact" },
      defaults: {
        slug: "contact",
        title: "Contact",
        status: "published",
        templateType: "contact"
      }
    });
    const page = contactPage[0];

    // Create or find media entries
    const mediaFiles = [
      { fileName: "Contact-Page-Bg.jpg", filePath: "/wp-content/uploads/2023/02/Contact-Page-Bg.jpg", altText: "Contact Page Background" }
    ];

    const mediaMap = {};
    for (const mediaFile of mediaFiles) {
      const [media] = await Media.findOrCreate({
        where: { fileName: mediaFile.fileName },
        defaults: {
          fileName: mediaFile.fileName,
          filePath: mediaFile.filePath,
          fileType: "image",
          altText: mediaFile.altText
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

    const heroBackgroundMedia = mediaMap["Contact-Page-Bg.jpg"];
    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Get in touch with us for any questions, comments, or business inquiries.", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "officeTitle", contentValue: "CORPORATE OFFICE", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "companyName", contentValue: "Refex Group", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "address", contentValue: JSON.stringify([
        "Refex Building,",
        "67, Bazullah Road,",
        "Parthasarathy Puram, T Nagar",
        "Chennai – 600017"
      ]), contentType: "json" },
      { sectionId: heroSection[0].id, contentKey: "phone", contentValue: "044 – 4340 5900/950", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "email", contentValue: "info@refex.co.in", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "overlayOpacity", contentValue: "10", contentType: "text" }
    ];

    // Add background image with media relationship
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

    // Contact Form Section
    const formSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "contact-form"
      },
      defaults: {
        pageId: page.id,
        sectionType: "form",
        sectionKey: "contact-form",
        orderIndex: 1,
        isActive: true
      }
    });

    const formContent = [
      { sectionId: formSection[0].id, contentKey: "title", contentValue: "Get In Touch", contentType: "text" },
      { sectionId: formSection[0].id, contentKey: "description", contentValue: "We welcome your questions, comments, and business inquiries.", contentType: "text" },
      { sectionId: formSection[0].id, contentKey: "mapUrl", contentValue: "https://maps.google.com/maps?q=Refex%20Group%2C%20Chennai&t=m&z=10&output=embed&iwloc=near", contentType: "text" },
      { sectionId: formSection[0].id, contentKey: "contactEmail", contentValue: "info@refex.co.in", contentType: "text" }
    ];

    for (const content of formContent) {
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
        orderIndex: 2,
        isActive: true
      }
    });

    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "backgroundColor", contentValue: "linear-gradient(to right, #3b8ac6, #4a9fd8)", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "cards", contentValue: JSON.stringify([
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
      ]), contentType: "json" }
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

    console.log("✅ Contact page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Contact page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedContactPage();
}

module.exports = seedContactPage;

