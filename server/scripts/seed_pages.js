const { Page } = require("../models");

module.exports = async function seedPages() {
  try {
    console.log("Seeding pages...");

    const pages = [
      {
        slug: "home",
        title: "Home",
        metaTitle: "Refex Group - Leading Business Conglomerate",
        metaDescription: "Refex Group is among the leading business conglomerates of India, expanding across multiple business verticals including Renewables, Chemicals, Medical Technologies, Pharma, Green Mobility, and more.",
        status: "published",
        templateType: "home"
      },
      {
        slug: "about-refex",
        title: "About Refex",
        metaTitle: "About Refex Group - Our Story, Values & Leadership",
        metaDescription: "Learn about Refex Group's journey, core values, leadership team, and our commitment to excellence across multiple business verticals.",
        status: "published",
        templateType: "about"
      },
      {
        slug: "business",
        title: "Business",
        metaTitle: "Our Businesses - Refex Group",
        metaDescription: "Explore Refex Group's diverse business verticals including Refrigerants, Renewables, MedTech, Mobility, and more.",
        status: "published",
        templateType: "business"
      },
      {
        slug: "esg",
        title: "ESG",
        metaTitle: "ESG - Environmental, Social & Governance | Refex Group",
        metaDescription: "Refex Group's commitment to Environmental, Social, and Governance practices. Learn about our sustainability initiatives and ESG policies.",
        status: "published",
        templateType: "esg"
      },
      {
        slug: "careers",
        title: "Careers",
        metaTitle: "Careers at Refex Group - Join Our Team",
        metaDescription: "Join Refex Group and grow, learn, and thrive in your career. Explore opportunities across our diverse business verticals.",
        status: "published",
        templateType: "careers"
      },
      {
        slug: "contact",
        title: "Contact",
        metaTitle: "Contact Refex Group",
        metaDescription: "Get in touch with Refex Group. Contact us for business inquiries, partnerships, or general information.",
        status: "published",
        templateType: "contact"
      },
      {
        slug: "newsroom",
        title: "Newsroom",
        metaTitle: "Newsroom - Latest News & Updates | Refex Group",
        metaDescription: "Stay updated with the latest news, press releases, and events from Refex Group.",
        status: "published",
        templateType: "newsroom"
      },
      {
        slug: "investments",
        title: "Investments",
        metaTitle: "Investments - Refex Group",
        metaDescription: "Learn about investment opportunities with Refex Group.",
        status: "published",
        templateType: "investments"
      },
      {
        slug: "gallery",
        title: "Gallery",
        metaTitle: "Gallery - Refex Group",
        metaDescription: "Browse through our gallery of events, achievements, and milestones.",
        status: "published",
        templateType: "gallery"
      },
      {
        slug: "diversity-inclusion",
        title: "Diversity & Inclusion",
        metaTitle: "Diversity & Inclusion - Refex Group",
        metaDescription: "Refex Group's commitment to diversity, inclusion, and creating an inclusive workplace.",
        status: "published",
        templateType: "diversity"
      }
    ];

    for (const pageData of pages) {
      const [page, created] = await Page.findOrCreate({
        where: { slug: pageData.slug },
        defaults: pageData
      });
      if (!created) {
        await page.update(pageData);
      }
    }

    console.log("✅ Pages seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding pages:", error);
    throw error;
  }
};

