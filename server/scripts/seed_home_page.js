const { Page, Section, SectionContent, HeroSlide, Media } = require("../models");

module.exports = async function seedHomePage() {
  try {
    console.log("Seeding home page sections...");

    // Get or create home page
    const homePage = await Page.findOrCreate({
      where: { slug: "home" },
      defaults: {
        slug: "home",
        title: "Home",
        status: "published",
        templateType: "home"
      }
    });
    const page = homePage[0];

    // Create hero slides
    const heroSlides = [
      {
        pageId: page.id,
        title: "Breaking New Grounds in Sustainability",
        subtitle: "Forging a Path Towards a Brighter Tomorrow",
        description: "Refex promotes sustainability through innovative solutions, products, and services that create environmental, social, and financial value in a world where sustainability is the need of the hour for businesses",
        backgroundImageId: null, // Will be set when media is uploaded
        buttonText: "Know More",
        buttonLink: "/about-refex",
        videoId: "dQw4w9WgXcQ",
        orderIndex: 0,
        isActive: true
      },
      {
        pageId: page.id,
        title: "Reliable and Sustainable Refrigerant solutions.",
        subtitle: "REFRIGERANTS",
        description: "A market leader in refrigerant gas manufacturing, we are also conscious innovators. Discover our eco-friendly alternatives to make the step towards a greener tomorrow.",
        backgroundImageId: null,
        buttonText: "Know More",
        buttonLink: "/refex-refrigerants",
        orderIndex: 1,
        isActive: true
      },
      {
        pageId: page.id,
        title: "Powering the Future with Green Energy",
        subtitle: "REFEX Renewables",
        description: "Building a safe and healthy future with limitless clean and green energy by inculcating innovative methods to have a sustainable future.",
        backgroundImageId: null,
        buttonText: "Know More",
        buttonLink: "/refex-renewables",
        orderIndex: 2,
        isActive: true
      },
      {
        pageId: page.id,
        title: "Reliable and responsible coal handling solutions.",
        subtitle: "REFEX Coal & Ash handling",
        description: "Experience unprecedented efficiency and reliability in coal and ash handling by elevating it with Refex.",
        backgroundImageId: null,
        buttonText: "Know More",
        buttonLink: "/refex-ash-coal-handling",
        orderIndex: 3,
        isActive: true
      },
      {
        pageId: page.id,
        title: "Engineering Innovation for Good Health",
        subtitle: "REFEX MedTech",
        description: "Creating extraordinary diagnostic tools and providing expert technical guidance to make healthcare affordable and accessible to all.",
        backgroundImageId: null,
        buttonText: "Know More",
        buttonLink: "/refex-medtech",
        orderIndex: 4,
        isActive: true
      },
      {
        pageId: page.id,
        title: "Fuelling great ideas into new possibilities",
        subtitle: "REFEX Capital",
        description: "We focus on investing in disruptive start-ups with the aim of advancing technology and defining the future.",
        backgroundImageId: null,
        buttonText: "Know More",
        buttonLink: "/refex-capital",
        orderIndex: 5,
        isActive: true
      }
    ];

    for (const slideData of heroSlides) {
      await HeroSlide.findOrCreate({
        where: {
          pageId: slideData.pageId,
          orderIndex: slideData.orderIndex
        },
        defaults: slideData
      });
    }

    // Create About Section
    const aboutSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "about"
      },
      defaults: {
        pageId: page.id,
        sectionType: "content",
        sectionKey: "about",
        orderIndex: 0,
        isActive: true
      }
    });

    const aboutSectionData = aboutSection[0];
    const aboutContent = [
      { sectionId: aboutSectionData.id, contentKey: "label", contentValue: "About", contentType: "text" },
      { sectionId: aboutSectionData.id, contentKey: "logo", contentValue: "/uploads/logos/REFEX-Logo@2x-8-1.png", contentType: "text" },
      { sectionId: aboutSectionData.id, contentKey: "title", contentValue: "Choosing green,<br />Chasing growth", contentType: "html" },
      { sectionId: aboutSectionData.id, contentKey: "paragraphs", contentValue: JSON.stringify([
        "Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment-friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals.",
        "At present, there are 2 publicly listed entities (listed in the stock exchanges of India) under the umbrella of the Group – Refex Industries Limited and Refex Renewables & Infrastructure Limited.",
        "Sherisha Technologies Private Limited along with its associate companies, sister companies, and their subsidiaries form part of the Refex Group.",
        "Refex's values, including integrity, diversity, dedication, commitment, and competitiveness have been central to its success, allowing the company to respond to shifting market trends with a \"growth mindset.\" Refex is dedicated to improving the customer experience, constantly innovating, and upholding transparency and honesty. These values have positioned Refex as a key industry player, setting the standard for others to follow."
      ]), contentType: "json" },
      { sectionId: aboutSectionData.id, contentKey: "image", contentValue: "/uploads/home/Office-Group-Photo-comp-1-1024x576.jpg", contentType: "text" },
      { sectionId: aboutSectionData.id, contentKey: "buttonText", contentValue: "Know More", contentType: "text" },
      { sectionId: aboutSectionData.id, contentKey: "buttonLink", contentValue: "/about-refex", contentType: "text" }
    ];

    for (const content of aboutContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Create Careers Section
    const careersSection = await Section.findOrCreate({
      where: {
        pageId: page.id,
        sectionKey: "careers"
      },
      defaults: {
        pageId: page.id,
        sectionType: "cta",
        sectionKey: "careers",
        orderIndex: 1,
        isActive: true
      }
    });

    const careersSectionData = careersSection[0];
    const careersContent = [
      { sectionId: careersSectionData.id, contentKey: "label", contentValue: "Join Refex", contentType: "text" },
      { sectionId: careersSectionData.id, contentKey: "title", contentValue: "Resilient by <span className=\"text-[#7DC144]\">Nature.</span><br />Robust by <span className=\"text-[#EE6F4E]\">People.</span>", contentType: "html" },
      { sectionId: careersSectionData.id, contentKey: "description", contentValue: "Refex prioritizes inclusivity, encouraging employee growth and learning opportunities in a diverse and welcoming work environment.", contentType: "text" },
      { sectionId: careersSectionData.id, contentKey: "primaryButtonText", contentValue: "Explore careers at Refex", contentType: "text" },
      { sectionId: careersSectionData.id, contentKey: "primaryButtonLink", contentValue: "/careers", contentType: "text" },
      { sectionId: careersSectionData.id, contentKey: "secondaryButtonText", contentValue: "Diversity at Refex", contentType: "text" },
      { sectionId: careersSectionData.id, contentKey: "secondaryButtonLink", contentValue: "/about-refex", contentType: "text" },
      { sectionId: careersSectionData.id, contentKey: "image", contentValue: "/uploads/home/REFEX_home_career-BG.jpg", contentType: "text" }
    ];

    for (const content of careersContent) {
      await SectionContent.findOrCreate({
        where: {
          sectionId: content.sectionId,
          contentKey: content.contentKey
        },
        defaults: content
      });
    }

    // Create CTA Section
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

    const ctaSectionData = ctaSection[0];
    const ctaContent = [
      { sectionId: ctaSectionData.id, contentKey: "card1Title", contentValue: "Got a question?", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card1ButtonText", contentValue: "Get in touch", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card1ButtonLink", contentValue: "/contact", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card2Title", contentValue: "See our latest news", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card2ButtonText", contentValue: "Refex Newsroom", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card2ButtonLink", contentValue: "/newsroom", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card3Title", contentValue: "Work at Refex", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card3ButtonText", contentValue: "Careers", contentType: "text" },
      { sectionId: ctaSectionData.id, contentKey: "card3ButtonLink", contentValue: "/careers", contentType: "text" }
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

    console.log("✅ Home page seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding home page:", error);
    throw error;
  }
};

