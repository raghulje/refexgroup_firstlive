require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedRefexRenewablesPage() {
  try {
    console.log("Seeding Refex Renewables page sections...");

    // Get or create refex-renewables page
    const renewablesPage = await Page.findOrCreate({
      where: { slug: "refex-renewables" },
      defaults: {
        slug: "refex-renewables",
        title: "Refex Renewables",
        status: "published",
        templateType: "business-vertical"
      }
    });
    const page = renewablesPage[0];

    // Create or find media entries
    const mediaFiles = [
      { fileName: "renewables-hero.jpg", filePath: "/assets/heroes/renewables-hero.jpg", altText: "Renewables Hero" },
      { fileName: "bhilai-2.jpg", filePath: "/assets/business/renewables/bhilai-2.jpg", altText: "Commercial & Industrial" },
      { fileName: "diwana-2.jpeg", filePath: "/assets/business/renewables/diwana-2.jpeg", altText: "Utility Scale" },
      { fileName: "leh-ladak-3.jpg", filePath: "/assets/business/renewables/leh-ladak-3.jpg", altText: "Featured Projects Background" },
      { fileName: "diwana-3.jpeg", filePath: "/assets/business/renewables/diwana-3.jpeg", altText: "CTA Background" }
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

    const heroBackgroundMedia = mediaMap["renewables-hero.jpg"];
    const heroContent = [
      { sectionId: heroSection[0].id, contentKey: "tagline", contentValue: "Refex Renewables", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "Brightening the future with renewables", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Your trusted partner in renewable energy. With 10 years of experience in the solar PV industry, we specialize in designing, executing, installing, and maintaining efficient solar power systems.", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "buttonText", contentValue: "Explore", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "buttonLink", contentValue: "#explore", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "stat1Value", contentValue: "10", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "stat1Label", contentValue: "YEARS OF EXPERIENCE", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "stat2Value", contentValue: "41", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "stat2Label", contentValue: "LOCATIONS", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "stat3Value", contentValue: "12", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "stat3Label", contentValue: "ACROSS STATES", contentType: "text" }
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

    // Category Cards Section
    const categoryCardsSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "category-cards"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "category-cards",
        orderIndex: 1,
        isActive: true
      }
    });

    const categoryCardsContent = [
      { sectionId: categoryCardsSection[0].id, contentKey: "categories", contentValue: JSON.stringify([
        {
          title: "Commercial & Industrial",
          image: "/assets/business/renewables/bhilai-2.jpg"
        },
        {
          title: "Utility Scale",
          image: "/assets/business/renewables/diwana-2.jpeg"
        },
        {
          title: "Rooftop Solar",
          image: "/assets/heroes/renewables-hero.jpg"
        }
      ]), contentType: "json" }
    ];

    for (const content of categoryCardsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Benefits Section
    const benefitsSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "benefits"
      },
      defaults: {
        pageId: page.id,
        sectionType: "features",
        sectionKey: "benefits",
        orderIndex: 2,
        isActive: true
      }
    });

    const benefitsContent = [
      { sectionId: benefitsSection[0].id, contentKey: "title", contentValue: "Discover the numerous benefits that set us apart from the competition", contentType: "text" },
      { sectionId: benefitsSection[0].id, contentKey: "benefits", contentValue: JSON.stringify([
        {
          icon: "/svg/renewables/expertteam.svg",
          title: "Expert Team",
          description: "Our expert team excels in the solar industry, with proven success and unparalleled knowledge. We offer clients tailored, efficient solutions."
        },
        {
          icon: "/svg/renewables/holisticsolutions.svg",
          title: "Holistic Solutions",
          description: "We provide a holistic approach to our services, including design, installation, and maintenance, making the process simple and straightforward for our clients."
        },
        {
          icon: "/svg/renewables/sustainableenergy.svg",
          title: "Sustainable Energy",
          description: "Refex Renewables provides eco-friendly energy solutions for a better future. Our goal is to promote renewable sources of energy for a cleaner planet."
        },
        {
          icon: "/svg/renewables/extensivecoverage.svg",
          title: "Extensive Coverage",
          description: "Refex Renewables has successfully executed projects across multiple regions, showcasing our capacity to serve a diverse population."
        },
        {
          icon: "/svg/renewables/recordexcellence.svg",
          title: "Record of Excellence",
          description: "Our reputation precedes us, thanks to a portfolio that includes prestigious government agencies and top-notch private organizations"
        },
        {
          icon: "/svg/renewables/innovativestrategist.svg",
          title: "Innovative Strategies",
          description: "Refex Renewables is renowned for our groundbreaking methods in solar power systems, such as the canal top solar venture, making us stand out among the competition."
        }
      ]), contentType: "json" }
    ];

    for (const content of benefitsContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Featured Projects Section
    const projectsSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "featured-projects"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "featured-projects",
        orderIndex: 3,
        isActive: true
      }
    });

    const projectsBackgroundMedia = mediaMap["leh-ladak-3.jpg"];
    const projectsContent = [
      { sectionId: projectsSection[0].id, contentKey: "title", contentValue: "Featured Projects", contentType: "text" },
      { sectionId: projectsSection[0].id, contentKey: "description", contentValue: "Explore our featured projects and discover how Refex is leading the way in sustainable innovation and excellence.", contentType: "text" },
      { sectionId: projectsSection[0].id, contentKey: "projects", contentValue: JSON.stringify([
        {
          id: "bhilai",
          name: "Bhilai Project",
          location: "Bhilai, Chhattisgarh",
          capacity: "68MWp",
          description: "Ongoing Project.",
          details: "Off-taker – Indian Railways – AAA rated 1st solar project.",
          images: [
            "/assets/business/renewables/bhilai-1.jpg",
            "/assets/business/renewables/bhilai-2.jpg",
            "/assets/business/renewables/bhilai-3.jpg",
            "/assets/business/renewables/bhilai-4.jpg"
          ]
        },
        {
          id: "indian-army",
          name: "Indian Army 2 MW Project",
          location: "Leh, Ladakh (Partapur & Siachen Base Camps)",
          capacity: "2 MWp with 4 MWhr of BSES",
          description: "Solar project at the highest altitude in India",
          details: "Project Completed in July 2022.",
          extraDetails: "Name of off-taker – Indian Army",
          images: [
            "/assets/business/renewables/leh-ladak-1.jpg",
            "/assets/heroes/renewables-hero.jpg",
            "/assets/business/renewables/leh-ladak-3.jpg",
            "/assets/business/renewables/leh-ladak-6.jpg"
          ]
        },
        {
          id: "diwana",
          name: "Diwana Project",
          location: "Panipat, Haryana",
          capacity: "2.938 MWp",
          description: "1st solar project alongside the railway track",
          details: "Project Completed in September 2020.",
          extraDetails: "Name of off-taker – Indian Railways- AAA rated",
          images: [
            "/assets/business/renewables/diwana-1.jpeg",
            "/assets/business/renewables/diwana-2.jpeg",
            "/assets/business/renewables/diwana-3.jpeg",
            "/assets/business/renewables/diwana-4.jpeg"
          ]
        }
      ]), contentType: "json" }
    ];

    if (projectsBackgroundMedia) {
      projectsContent.push({
        sectionId: projectsSection[0].id,
        contentKey: "backgroundImage",
        contentValue: projectsBackgroundMedia.filePath,
        contentType: "text",
        mediaId: projectsBackgroundMedia.id
      });
    }

    for (const content of projectsContent) {
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
        orderIndex: 4,
        isActive: true
      }
    });

    const ctaBackgroundMedia = mediaMap["diwana-3.jpeg"];
    const ctaContent = [
      { sectionId: ctaSection[0].id, contentKey: "title", contentValue: "Refex Renewables & Infrastructure Limited", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "description", contentValue: "Building a better world with clean energy and sustainable infrastructure.", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "buttonText", contentValue: "Visit Website", contentType: "text" },
      { sectionId: ctaSection[0].id, contentKey: "buttonLink", contentValue: "https://www.refex.group/refex-renewables/", contentType: "text" }
    ];

    if (ctaBackgroundMedia) {
      ctaContent.push({
        sectionId: ctaSection[0].id,
        contentKey: "backgroundImage",
        contentValue: ctaBackgroundMedia.filePath,
        contentType: "text",
        mediaId: ctaBackgroundMedia.id
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

    console.log("✅ Refex Renewables page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Refex Renewables page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedRefexRenewablesPage();
}

module.exports = seedRefexRenewablesPage;

