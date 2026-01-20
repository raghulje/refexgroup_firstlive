require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent } = require("../models");

async function seedInvestmentsPage() {
  try {
    console.log("Seeding Investments page sections...");

    // Get or create investments page
    const investmentsPage = await Page.findOrCreate({
      where: { slug: "investments" },
      defaults: {
        slug: "investments",
        title: "Investments",
        status: "published",
        templateType: "investments"
      }
    });
    const page = investmentsPage[0];

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
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Investments", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Unlock Your Financial Potential: Explore Our Diverse Range of Investment Opportunities and Discover a World of Possibilities", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "backgroundImage", contentValue: "/uploads/investments/Investments-e1677567598400.jpg", contentType: "text" }
    ];

    for (const content of heroContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Intro Section
    const introSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "intro"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "intro",
        orderIndex: 1,
        isActive: true
      }
    });

    const introContent = [
      { sectionId: introSection[0].id, contentKey: "title", contentValue: "Grow your finances into success by investing in Refex Group through multiple stakeholder options", contentType: "text" },
      { sectionId: introSection[0].id, contentKey: "logo", contentValue: "/uploads/logos/REFEX-Logo@2x-8-1.png", contentType: "text" }
    ];

    for (const content of introContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Message from Anil Jain Section
    const messageSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "message-anil-jain"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "message-anil-jain",
        orderIndex: 2,
        isActive: true
      }
    });

    const messageContent = [
      { sectionId: messageSection[0].id, contentKey: "title", contentValue: "Message from Anil Jain", contentType: "text" },
      { sectionId: messageSection[0].id, contentKey: "position", contentValue: "Chairman & Managing Director", contentType: "text" },
      { sectionId: messageSection[0].id, contentKey: "content", contentValue: JSON.stringify([
        "Proud to say that our success is a result of our strong risk-taking ability and our dedicated team who follow best practices in risk mitigation. We are committed to continuously adapting to the changing business environment and staying ahead of the curve through our focus on macro-trends and innovation.",
        "Our commitment to being environmentally, socially, and governance (ESG) compliant is at the forefront of all our business decisions and will continue to drive our success in the future."
      ]), contentType: "json" },
      { sectionId: messageSection[0].id, contentKey: "image", contentValue: "/uploads/investments/message/Anil.png", contentType: "text" }
    ];

    for (const content of messageContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Listed Companies Section
    const listedCompaniesSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "listed-companies"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "listed-companies",
        orderIndex: 3,
        isActive: true
      }
    });

    const listedCompaniesContent = [
      { sectionId: listedCompaniesSection[0].id, contentKey: "title", contentValue: "Our Listed Companies", contentType: "text" },
      { sectionId: listedCompaniesSection[0].id, contentKey: "description", contentValue: "Stay on top of the game with the up-to-date listings of our leading companies listed on India's renowned BSE and NSE stock exchanges.", contentType: "text" },
      { sectionId: listedCompaniesSection[0].id, contentKey: "companies", contentValue: JSON.stringify([
        {
          name: "REFEX",
          bse: { price: "₹ 324.45", change: "-0.23%", trend: "down" },
          nse: { price: "₹ 323.35", change: "-0.51%", trend: "down" }
        },
        {
          name: "REFEXRENEW",
          bse: { price: "₹ 390.85", change: "-5.0%", trend: "down" },
          nse: null
        }
      ]), contentType: "json" },
      { sectionId: listedCompaniesSection[0].id, contentKey: "disclaimer", contentValue: "The live stock price information on this website is provided by a third-party vendor, and we are not responsible for any delays or inaccuracies in the data provided. Please use this information at your own risk", contentType: "text" }
    ];

    for (const content of listedCompaniesContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Contact Info Section
    const contactInfoSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "contact-info"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "contact-info",
        orderIndex: 4,
        isActive: true
      }
    });

    const contactInfoContent = [
      { sectionId: contactInfoSection[0].id, contentKey: "text", contentValue: "For any other information related to investing, get in touch with us at", contentType: "text" },
      { sectionId: contactInfoSection[0].id, contentKey: "email", contentValue: "info@refex.co.in", contentType: "text" }
    ];

    for (const content of contactInfoContent) {
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
        orderIndex: 5,
        isActive: true
      }
    });

    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "backgroundColor", contentValue: "#3b9dd6", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "cards", contentValue: JSON.stringify([
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

    console.log("✅ Investments page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Investments page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedInvestmentsPage();
}

module.exports = seedInvestmentsPage;

