require("dotenv").config();
const db = require("../models");
const { Page, Section, SectionContent, Media } = require("../models");

async function seedRefexAshCoalPage() {
  try {
    console.log("Seeding Refex Ash & Coal Handling page sections...");

    // Get or create refex-ash-coal-handling page
    const ashCoalPage = await Page.findOrCreate({
      where: { slug: "refex-ash-coal-handling" },
      defaults: {
        slug: "refex-ash-coal-handling",
        title: "Refex Ash & Coal Handling",
        status: "published",
        templateType: "business-vertical"
      }
    });
    const page = ashCoalPage[0];

    // Create or find media entries
    const mediaFiles = [
      {
        fileName: "coal-heap-at-yard-7-2-Large.jpeg",
        filePath: "/wp-content/uploads/2023/03/coal-heap-at-yard-7-2-Large.jpeg",
        altText: "Ash & Coal Hero"
      },
      {
        fileName: "Heap-Making.jpeg",
        filePath: "/wp-content/uploads/2023/03/Heap-Making.jpeg",
        altText: "Ash & Coal CTA Background"
      },
      {
        fileName: "pushing.jpeg",
        filePath: "/assets/business/ash-coal/pushing.jpeg",
        altText: "Why us operations image"
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

    // Hero Section
    const heroSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "hero-section"
      },
      defaults: {
        pageId: page.id,
        sectionType: "hero",
        sectionKey: "hero-section",
        orderIndex: 0,
        isActive: true
      }
    });

    const heroBackgroundMedia = mediaMap["coal-heap-at-yard-7-2-Large.jpeg"];
    const heroContent = [
      {
        sectionId: heroSection[0].id,
        contentKey: "tagline",
        contentValue: "Refex Ash & Coal Handling",
        contentType: "text"
      },
      {
        sectionId: heroSection[0].id,
        contentKey: "title",
        contentValue: "Refex – One-stop solution for all your Ash and Coal Requirements",
        contentType: "text"
      },
      {
        sectionId: heroSection[0].id,
        contentKey: "description",
        contentValue:
          "Refex is the leading provider of specialized solutions for the seamless supply and transportation of coal, management of the coal yard, efficient transportation and disposal of ash generated from the incineration of coal in thermal power plants. Operational since 2018, we have built a reputation for providing out of the box and reliable solutions and high-quality services to our clients. We have come to known as the most dependable and competent service provider for a multitude of services in the thermal business spectrum.",
        contentType: "text"
      },
      {
        sectionId: heroSection[0].id,
        contentKey: "buttonText",
        contentValue: "Explore",
        contentType: "text"
      },
      {
        sectionId: heroSection[0].id,
        contentKey: "buttonLink",
        contentValue: "#explore",
        contentType: "text"
      }
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

    // Overview Section (Why us)
    const overviewSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "overview"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "overview",
        orderIndex: 1,
        isActive: true
      }
    });

    const overviewImageMedia = mediaMap["pushing.jpeg"];

    const overviewContent = [
      {
        sectionId: overviewSection[0].id,
        contentKey: "heading",
        contentValue: "Why us",
        contentType: "text"
      },
      {
        sectionId: overviewSection[0].id,
        contentKey: "description",
        contentValue:
          "At Refex, we take immense pride in our commitment to excellence, sustainability and environmental responsibility. We work closely with each individual client to understand their specific needs and deliver customized solutions. Whether you're looking for a reliable source of high-quality coal or need a partner to handle your ash transportation and disposal needs, we have the expertise and experience to deliver results as per the standards set by MoEF (Ministry of Environment, Forest and Climate Change of India) and the pollution control boards.",
        contentType: "text"
      },
      // Optional image for the left column
      ...(overviewImageMedia
        ? [{
          sectionId: overviewSection[0].id,
          contentKey: "image",
          contentValue: overviewImageMedia.filePath,
          contentType: "text",
          mediaId: overviewImageMedia.id
        }]
        : []),
      // Features on the right column – stored as JSON, edited via CMS form fields
      {
        sectionId: overviewSection[0].id,
        contentKey: "features",
        contentValue: JSON.stringify([
          {
            title: "Innovative Solutions",
            description:
              "Refex is at the forefront in adopting innovative technologies in the utilization of ash in various environmental-friendly and new generation methods of ash usage / disposal. Constantly on the lookout for opportunities for recycling and reuse to minimize waste and reduce our clients' environmental footprint."
          },
          {
            title: "Synergy with Cement Companies",
            description:
              "Cordial relationships with all leading cement plants across the country, catering fly ash to them via multiple modes of transport, namely bulkers, rakes etc."
          },
          {
            title: "100% Compliance to environmental norms",
            description:
              "Refex adheres to statutory guidelines from all relevant organizations MoEF (Ministry of Environment, Forest & Climate Change), CPCB, and SPCB, with a commitment to create sustainable and compliant utilization or disposal methods."
          },
          {
            title: "Experienced and Agile team",
            description:
              "Refex's team of experienced engineers, project managers, and technicians work closely with clients to understand their specific needs and develop customized solutions that meet their requirements. Highly focused on data-driven decision making and adoption of immediate corrective actions."
          },
          {
            title: "Large Scale Operations",
            description:
              "Refex handles all aspects of the ash dyke, right from loading at the pond to the appropriate disposal and closure at landfills with complete documentation and compliance to statutory norms, while prioritizing safety on all accounts. Expertise in handling large scale MW projects and high ash volumes on a daily basis, with the extensive fleet of hyvas and trailers owned by Refex."
          }
        ]),
        contentType: "json"
      }
    ];

    for (const content of overviewContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Services Section (What We Do)
    const servicesSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "services"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "services",
        orderIndex: 2,
        isActive: true
      }
    });

    const servicesContent = [
      {
        sectionId: servicesSection[0].id,
        contentKey: "heading",
        contentValue: "What We do",
        contentType: "text"
      },
      {
        sectionId: servicesSection[0].id,
        contentKey: "flyAshDescription",
        contentValue:
          "We specialize in ash handling services, including ash collection, transportation, and disposal, as well as recycling and reuse options. Our experienced team uses state-of-the-art equipment and techniques to ensure that ash is handled safely and responsibly, in compliance with all relevant regulations. Our team of experts are highly trained in complete gamut of operations and our equipment is outfitted with latest trends in technology to carry out all our processes effectively, thereby ensuring high quality services provided to all our clients – thermal plants, cement companies, brick manufacturers, mine owners etc.",
        contentType: "text"
      },
      {
        sectionId: servicesSection[0].id,
        contentKey: "coalYardDescription",
        contentValue:
          "We provide round the clock, cost effective and sustainable services for management of coal yards in thermal power plants, that includes CHP room operations, Housekeeping, Segregation of coal & stone, management of heavy machineries, Rake unloading, shifting and crushing of coal etc., thereby offering comprehensive support from procurement of coal to feeding it into boilers.",
        contentType: "text"
      },
      {
        sectionId: servicesSection[0].id,
        contentKey: "coalTradingDescription",
        contentValue:
          "Our coal trading services includes sourcing, procurement, and transportation of various types of coal. We work with a network of trusted suppliers to ensure that our clients receive only the highest quality coal products, delivered on time and within budget. Our strategic partnerships, efficient supply chain management, and ability to navigate market fluctuations play a significant role in our success.",
        contentType: "text"
      }
    ];

    for (const content of servicesContent) {
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
        sectionKey: "cta-section"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "cta-section",
        orderIndex: 3,
        isActive: true
      }
    });

    const ctaBackgroundMedia = mediaMap["Heap-Making.jpeg"];
    const ctaContent = [
      {
        sectionId: ctaSection[0].id,
        contentKey: "title",
        contentValue: "Refex Industries Limited",
        contentType: "text"
      },
      {
        sectionId: ctaSection[0].id,
        contentKey: "description",
        contentValue: "Reliable and Trusted partner for Ash & Coal handling",
        contentType: "text"
      },
      {
        sectionId: ctaSection[0].id,
        contentKey: "buttonText",
        contentValue: "Visit Website",
        contentType: "text"
      },
      {
        sectionId: ctaSection[0].id,
        contentKey: "buttonLink",
        contentValue: "https://www.refex.co.in/",
        contentType: "text"
      }
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

    console.log("✅ Refex Ash & Coal Handling page seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Refex Ash & Coal Handling page:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedRefexAshCoalPage();
}

module.exports = seedRefexAshCoalPage;


