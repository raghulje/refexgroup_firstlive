const { Page, Section, SectionContent } = require("../models");

module.exports = async function seedAboutPage() {
  try {
    console.log("Seeding About page sections...");

    // Get or create about page
    const aboutPage = await Page.findOrCreate({
      where: { slug: "about-refex" },
      defaults: {
        slug: "about-refex",
        title: "About Refex",
        status: "published",
        templateType: "about"
      }
    });
    const page = aboutPage[0];

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
      { sectionId: heroSection[0].id, contentKey: "title", contentValue: "About REFEX", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "description", contentValue: "Refex Group, founded in 2002, diversified into ash and coal handling, power trading, refrigerant gas, medTech etc.", contentType: "text" },
      { sectionId: heroSection[0].id, contentKey: "backgroundImage", contentValue: "/uploads/about/Gallery-20-th.-Anniversary-3.jpg", contentType: "text" }
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

    // Overview Section
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

    const overviewContent = [
      { sectionId: overviewSection[0].id, contentKey: "logo", contentValue: "/uploads/logos/REFEX-Logo@2x-8-1.png", contentType: "text" },
      { sectionId: overviewSection[0].id, contentKey: "tagline", contentValue: "We thrive on RESILIENCE", contentType: "text" },
      { sectionId: overviewSection[0].id, contentKey: "yearsInBusiness", contentValue: "23", contentType: "text" },
      { sectionId: overviewSection[0].id, contentKey: "peopleImpacted", contentValue: "2M", contentType: "text" },
      { sectionId: overviewSection[0].id, contentKey: "content", contentValue: JSON.stringify([
        "Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals. At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited. The company's excellent reputation and trust in the industry is due to its commitment to core values such as integrity, diversity, dedication, commitment, and competitiveness.",
        "Sherisha Technologies Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.",
        "Refex Group's growth mindset is its biggest strength, which has allowed it to stay ahead of the competition by seizing emerging opportunities. By prioritizing customer satisfaction and continuous improvement, Refex Group has been able to provide superior value to all its stakeholders.",
        "The company's culture of excellence has helped us to attract the best talent, and its focus on growth, learning, and adaptability will continue to drive our success in the future. Refex Group's commitment to leading by example and continuously improving while staying true to its values is a recipe for long-term success."
      ]), contentType: "json" },
      { sectionId: overviewSection[0].id, contentKey: "image", contentValue: "/uploads/home/Office-Group-Photo-comp-1-1024x576.jpg", contentType: "text" }
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

    // Mission & Vision Section
    const missionVisionSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "missionvision"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "missionvision",
        orderIndex: 2,
        isActive: true
      }
    });

    const missionVisionContent = [
      { sectionId: missionVisionSection[0].id, contentKey: "backgroundImage", contentValue: "/uploads/about/mission-vision/Vision-Mission-BG.jpg", contentType: "text" },
      { sectionId: missionVisionSection[0].id, contentKey: "mission", contentValue: "Refex shall create enduring value across industries through innovation, operational excellence, and sustainable practices, thereby empowering our customers, enriching our communities, and delivering responsible growth for all stakeholders.", contentType: "text" },
      { sectionId: missionVisionSection[0].id, contentKey: "vision", contentValue: "Refex aims to be a globally admired conglomerate, driving long-term sustainable growth through innovation, purposeful collaborations and partnerships, and an unwavering commitment to excellence, while contributing meaningfully to societal progress.", contentType: "text" }
    ];

    for (const content of missionVisionContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Our Story Section
    const ourStorySection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "ourstory"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "ourstory",
        orderIndex: 3,
        isActive: true
      }
    });

    const ourStoryContent = [
      { sectionId: ourStorySection[0].id, contentKey: "title", contentValue: "Discover Our Journey", contentType: "text" },
      { sectionId: ourStorySection[0].id, contentKey: "subtitle", contentValue: "A Story of Passion, Determination, and Growth", contentType: "text" },
      { sectionId: ourStorySection[0].id, contentKey: "timelineImage", contentValue: "/uploads/about/our-story/Milestone-Only-Year-1.png", contentType: "text" }
    ];

    for (const content of ourStoryContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Careers CTA Section
    const careersCTASection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "careers-cta"
      },
      defaults: {
        pageId: page.id,
        sectionType: "cta",
        sectionKey: "careers-cta",
        orderIndex: 4,
        isActive: true
      }
    });

    const careersCTAContent = [
      { sectionId: careersCTASection[0].id, contentKey: "label", contentValue: "Careers", contentType: "text" },
      { sectionId: careersCTASection[0].id, contentKey: "title", contentValue: "Join Refex Group and grow, learn, and thrive in your career.", contentType: "text" },
      { sectionId: careersCTASection[0].id, contentKey: "description", contentValue: "Join our dynamic and driven team at Refex, where passion, self-motivation and a desire for growth are valued!", contentType: "text" },
      { sectionId: careersCTASection[0].id, contentKey: "buttonText", contentValue: "Apply Now", contentType: "text" },
      { sectionId: careersCTASection[0].id, contentKey: "buttonLink", contentValue: "/careers", contentType: "text" },
      { sectionId: careersCTASection[0].id, contentKey: "backgroundImage", contentValue: "/uploads/home/REFEX_home_career-BG.jpg", contentType: "text" }
    ];

    for (const content of careersCTAContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    console.log("✅ About page seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding About page:", error);
    throw error;
  }
};

