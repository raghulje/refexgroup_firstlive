require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedRefexCapitalPage() {
  try {
    console.log("Seeding Refex Capital page sections...");

    // Get or create refex-capital page
    const capitalPage = await Page.findOrCreate({
      where: { slug: "refex-capital" },
      defaults: {
        slug: "refex-capital",
        title: "Refex Capital",
        status: "published",
        templateType: "business-vertical"
      }
    });
    const page = capitalPage[0];

    // Create or find media entries
    const mediaFiles = [
      {
        fileName: "capital-hero.jpg",
        filePath: "/assets/heroes/capital-hero.jpg",
        altText: "Refex Capital Hero"
      },
      {
        fileName: "refex-logo.png",
        filePath: "/assets/logos/refex-logo.png",
        altText: "Refex Logo"
      },
      {
        fileName: "capital-about.jpg",
        filePath: "/assets/business/capital/about.jpg",
        altText: "Refex Capital About"
      },
      {
        fileName: "areas-bg.jpg",
        filePath: "/assets/business/capital/areas-bg.jpg",
        altText: "Areas of Interest Background"
      },
      {
        fileName: "Attractive.svg",
        filePath: "/wp-content/uploads/2023/02/Attractive.svg",
        altText: "Attractive Icon"
      },
      {
        fileName: "Team-Capital.svg",
        filePath: "/wp-content/uploads/2023/02/Team-Capital.svg",
        altText: "Team Capital Icon"
      },
      {
        fileName: "Use-of-Tech.svg",
        filePath: "/wp-content/uploads/2023/02/Use-of-Tech.svg",
        altText: "Use of Tech Icon"
      },
      {
        fileName: "capital-logo.png",
        filePath: "/assets/logos/business/capital-logo.png",
        altText: "Refex Capital Logo"
      }
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

    // Portfolio logo files (26 logos)
    const portfolioLogos = [
      "Artwally.png",
      "BLU.png",
      "chalo.png",
      "DR.png",
      "Easy-policy.png",
      "Fab-heads.png",
      "FIB-SOL.png",
      "Happy-EMI.png",
      "i-love-Diamonds.png",
      "Intugine.png",
      "Kyvor.png",
      "Mentis.png",
      "Munoth-industries-LTD.png",
      "N.png",
      "NanOlife.png",
      "ORBO.png",
      "Ovenfresh.png",
      "Race-coffee.png",
      "S3V.png",
      "Sun-telematics.png",
      "Toch.png",
      "Tomaganetics.png",
      "Trillbit.png",
      "Venrank.png",
      "Wassup.png",
      "Zenlth.png"
    ];

    const portfolioLogoPaths = portfolioLogos.map(
      (logo) => `/wp-content/uploads/2023/02/${logo}`
    );

    // --- HERO SECTION ---
    console.log("Seeding Hero Section...");
    const [heroSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "hero"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "hero",
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBackgroundMedia = mediaMap["capital-hero.jpg"];
    const heroContent = [
      {
        sectionId: heroSection.id,
        contentKey: "label",
        contentValue: "WE ADD",
        contentType: "text"
      },
      {
        sectionId: heroSection.id,
        contentKey: "title",
        contentValue: "GRIT AND GUMPTION TO YOUR GREAT IDEAS",
        contentType: "text"
      },
      {
        sectionId: heroSection.id,
        contentKey: "subtitle",
        contentValue: "Empowering Visionaries",
        contentType: "text"
      },
      {
        sectionId: heroSection.id,
        contentKey: "description",
        contentValue:
          "When dreamers and doers get together, clever ideas turn into revolutionary businesses.",
        contentType: "text"
      }
    ];

    if (heroBackgroundMedia) {
      heroContent.push({
        sectionId: heroSection.id,
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
    console.log("✅ Hero Section seeded");

    // --- STATS SECTION ---
    console.log("Seeding Stats Section...");
    const [statsSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "stats"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "stats",
        orderIndex: 1,
        isActive: true
      }
    });

    const statsContent = [
      {
        sectionId: statsSection.id,
        contentKey: "stats",
        contentValue: JSON.stringify([
          {
            value: "26",
            suffix: "",
            label: "Investee Companies"
          },
          {
            value: "3",
            suffix: "",
            label: "Exits"
          }
        ]),
        contentType: "json"
      }
    ];

    for (const content of statsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log("✅ Stats Section seeded");

    // --- ABOUT SECTION (Know About Us) ---
    console.log("Seeding About Section...");
    const [aboutSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "about"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "about",
        orderIndex: 2,
        isActive: true
      }
    });

    const logoMedia = mediaMap["refex-logo.png"];
    const aboutImageMedia = mediaMap["capital-about.jpg"];

    const aboutContent = [
      {
        sectionId: aboutSection.id,
        contentKey: "title",
        contentValue: "Know About Us",
        contentType: "text"
      },
      {
        sectionId: aboutSection.id,
        contentKey: "description",
        contentValue:
          "At Refex Capital Fund, we believe in the potential of India to become a leading technology powerhouse in the near future. This conviction drives us to search for visionary entrepreneurs who are harnessing technology to create innovative products and services, disrupt the status quo, and forge new markets. Join us in our mission to support the next tech giant in India.",
        contentType: "text"
      }
    ];

    if (logoMedia) {
      aboutContent.push({
        sectionId: aboutSection.id,
        contentKey: "logo",
        contentValue: logoMedia.filePath,
        contentType: "text",
        mediaId: logoMedia.id
      });
    }

    if (aboutImageMedia) {
      aboutContent.push({
        sectionId: aboutSection.id,
        contentKey: "image",
        contentValue: aboutImageMedia.filePath,
        contentType: "text",
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
    console.log("✅ About Section seeded");

    // --- AREAS OF INTEREST SECTION ---
    console.log("Seeding Areas of Interest Section...");
    const [areasSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "areas-of-interest"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "areas-of-interest",
        orderIndex: 3,
        isActive: true
      }
    });

    const areasBgMedia = mediaMap["areas-bg.jpg"];

    const areasContent = [
      {
        sectionId: areasSection.id,
        contentKey: "title",
        contentValue: "OUR AREAS OF INTEREST",
        contentType: "text"
      },
      {
        sectionId: areasSection.id,
        contentKey: "description",
        contentValue:
          "We focus on investing in disruptive start-ups in the fields of AI, HealthTech, CleanTech, and Consumer sectors with the aim of advancing technology and defining the future.",
        contentType: "text"
      },
      {
        sectionId: areasSection.id,
        contentKey: "areas",
        contentValue: JSON.stringify([
          {
            name: "HealthTech",
            icon: "ri-heart-pulse-line"
          },
          {
            name: "ConsumerTech",
            icon: "ri-shopping-cart-line"
          },
          {
            name: "CleanTech",
            icon: "ri-leaf-line"
          },
          {
            name: "EnterpriseTech",
            icon: "ri-building-line"
          },
          {
            name: "FinTech",
            icon: "ri-money-dollar-circle-line"
          },
          {
            name: "DeepTech",
            icon: "ri-cpu-line"
          }
        ]),
        contentType: "json"
      }
    ];

    if (areasBgMedia) {
      areasContent.push({
        sectionId: areasSection.id,
        contentKey: "backgroundImage",
        contentValue: areasBgMedia.filePath,
        contentType: "text",
        mediaId: areasBgMedia.id
      });
    }

    for (const content of areasContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log("✅ Areas of Interest Section seeded");

    // --- WHAT WE LOOK FOR SECTION ---
    console.log("Seeding What We Look For Section...");
    const [whatWeLookForSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "what-we-look-for"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "what-we-look-for",
        orderIndex: 4,
        isActive: true
      }
    });

    const attractiveIcon = mediaMap["Attractive.svg"];
    const teamCapitalIcon = mediaMap["Team-Capital.svg"];
    const useOfTechIcon = mediaMap["Use-of-Tech.svg"];

    const whatWeLookForContent = [
      {
        sectionId: whatWeLookForSection.id,
        contentKey: "title",
        contentValue: "What we look for?",
        contentType: "text"
      },
      {
        sectionId: whatWeLookForSection.id,
        contentKey: "description",
        contentValue:
          "Our mission is to provide funding for Indian startups that are developing innovative products or services for the domestic market and have the potential to expand globally. We are particularly interested in companies that have a sustainable competitive advantage over the long term and a clear path to profitability.",
        contentType: "text"
      },
      {
        sectionId: whatWeLookForSection.id,
        contentKey: "subtitle",
        contentValue:
          "When evaluating a startup, we look for the following key factors:",
        contentType: "text"
      },
      {
        sectionId: whatWeLookForSection.id,
        contentKey: "factors",
        contentValue: JSON.stringify([
          {
            icon: attractiveIcon
              ? attractiveIcon.filePath
              : "/wp-content/uploads/2023/02/Attractive.svg",
            title:
              "Attractiveness of opportunity & addressable market"
          },
          {
            icon: teamCapitalIcon
              ? teamCapitalIcon.filePath
              : "/wp-content/uploads/2023/02/Team-Capital.svg",
            title:
              "Team with passion, perseverance, relevant experience"
          },
          {
            icon: useOfTechIcon
              ? useOfTechIcon.filePath
              : "/wp-content/uploads/2023/02/Use-of-Tech.svg",
            title: "Use of technology to create an economic moat"
          }
        ]),
        contentType: "json"
      }
    ];

    for (const content of whatWeLookForContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log("✅ What We Look For Section seeded");

    // --- PORTFOLIO SECTION ---
    console.log("Seeding Portfolio Section...");
    const [portfolioSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "portfolio"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "portfolio",
        orderIndex: 5,
        isActive: true
      }
    });

    const portfolioContent = [
      {
        sectionId: portfolioSection.id,
        contentKey: "title",
        contentValue: "Our Portfolio",
        contentType: "text"
      },
      {
        sectionId: portfolioSection.id,
        contentKey: "subtitle",
        contentValue: "We give start-ups an unfair advantage",
        contentType: "text"
      },
      {
        sectionId: portfolioSection.id,
        contentKey: "portfolioLogos",
        contentValue: JSON.stringify(portfolioLogoPaths),
        contentType: "json"
      }
    ];

    for (const content of portfolioContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }
    console.log("✅ Portfolio Section seeded");

    // --- CTA SECTION ---
    console.log("Seeding CTA Section...");
    const [ctaSection] = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "cta"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "cta",
        orderIndex: 6,
        isActive: true
      }
    });

    const capitalLogoMedia = mediaMap["capital-logo.png"];

    const ctaContent = [
      {
        sectionId: ctaSection.id,
        contentKey: "title",
        contentValue:
          "Want to know more about how Refex Capital can help your business succeed?",
        contentType: "text"
      },
      {
        sectionId: ctaSection.id,
        contentKey: "buttonText",
        contentValue: "Visit Website",
        contentType: "text"
      },
      {
        sectionId: ctaSection.id,
        contentKey: "buttonLink",
        contentValue: "https://refexcapital.com/",
        contentType: "text"
      }
    ];

    if (capitalLogoMedia) {
      ctaContent.push({
        sectionId: ctaSection.id,
        contentKey: "image",
        contentValue: capitalLogoMedia.filePath,
        contentType: "text",
        mediaId: capitalLogoMedia.id
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
    console.log("✅ CTA Section seeded");

    console.log("✅ Refex Capital page seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Refex Capital page:", error);
    process.exit(1);
  }
}

// Run the seed function if called directly
if (require.main === module) {
  db.sequelize
    .sync()
    .then(() => {
      seedRefexCapitalPage();
    })
    .catch((err) => {
      console.error("Error syncing database:", err);
      process.exit(1);
    });
}

module.exports = seedRefexCapitalPage;

