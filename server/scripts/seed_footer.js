const { FooterSection } = require("../models");

module.exports = async function seedFooter() {
  try {
    console.log("Seeding footer sections...");

    const footerSections = [
      {
        sectionType: "business",
        sectionTitle: "BUSINESS",
        links: [
          { label: "Refex Refrigerants", url: "/refex-refrigerants" },
          { label: "Refex Renewables", url: "/refex-renewables" },
          { label: "Refex Ash & Coal Handling", url: "/refex-ash-coal-handling" },
          { label: "Refex Medtech", url: "/refex-medtech" },
          { label: "Refex Capital", url: "/refex-capital" },
          { label: "Refex Airports and Transportation", url: "/refex-airports" },
          { label: "Refex Mobility", url: "/refex-mobility" },
          { label: "Refex Life Sciences", url: "/pharma-rl-fine-chem" },
          { label: "Venwind Refex", url: "/venwind-refex" }
        ],
        orderIndex: 0,
        isActive: true
      },
      {
        sectionType: "quick-links",
        sectionTitle: "QUICK LINKS",
        links: [
          { label: "About Refex", url: "/about-refex" },
          { label: "Leadership Team", url: "/about-refex#leadership" },
          { label: "Gallery", url: "/gallery" },
          { label: "ESG", url: "/esg" },
          { label: "Diversity & Inclusion", url: "/diversity-inclusion" }
        ],
        orderIndex: 1,
        isActive: true
      }
    ];

    for (const sectionData of footerSections) {
      await FooterSection.findOrCreate({
        where: {
          sectionType: sectionData.sectionType
        },
        defaults: sectionData
      });
    }

    console.log("✅ Footer sections seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding footer:", error);
    throw error;
  }
};

