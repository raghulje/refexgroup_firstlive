const { Award, Media } = require("../models");

module.exports = async function seedAwards() {
  try {
    console.log("Seeding awards...");

    const awards = [
      // Standard Awards
      {
        awardType: "standard",
        title: "Mid-Size Fleet of the Year 2024 – 2025 by India Fleet Excellence Awards",
        description: "",
        imageId: null,
        year: 2024,
        orderIndex: 0,
        isActive: true
      },
      {
        awardType: "standard",
        title: "Fleet Management Service Provider of the Year 2024 – 2025 by India Fleet Excellence Awards",
        description: "",
        imageId: null,
        year: 2024,
        orderIndex: 1,
        isActive: true
      },
      {
        awardType: "standard",
        title: "Best Organisations for Women 2024 Award by ET Now",
        description: "",
        imageId: null,
        year: 2024,
        orderIndex: 2,
        isActive: true
      },
      {
        awardType: "standard",
        title: "International Green Apple Environment Award 2024",
        description: "",
        imageId: null,
        year: 2024,
        orderIndex: 3,
        isActive: true
      },
      {
        awardType: "standard",
        title: "ESG Excellence Award by ESG Grit Awards",
        description: "",
        imageId: null,
        year: 2024,
        orderIndex: 4,
        isActive: true
      },
      {
        awardType: "standard",
        title: "Solar Energy Company of the Year 2023 by MSMECCII",
        description: "",
        imageId: null,
        year: 2023,
        orderIndex: 5,
        isActive: true
      },
      {
        awardType: "standard",
        title: "Most Diversified Sustainable Company (India) by The Business Concept. UK",
        description: "",
        imageId: null,
        year: 2023,
        orderIndex: 6,
        isActive: true
      },
      {
        awardType: "standard",
        title: "Bronze Prize of Asia's Best Integrated Report for our First-ever Sustainability Report by AIRA",
        description: "",
        imageId: null,
        year: 2023,
        orderIndex: 7,
        isActive: true
      },
      {
        awardType: "standard",
        title: "GOLD STEVIE AWARD WINNER - Conglomerates Category (Medium Size)",
        description: "",
        imageId: null,
        year: 2022,
        orderIndex: 8,
        isActive: true
      },
      {
        awardType: "standard",
        title: "BRONZE STEVIE AWARD WINNER - Won by ANIL JAIN 'BEST ENTREPRENEUR OF THE YEAR'",
        description: "",
        imageId: null,
        year: 2022,
        orderIndex: 9,
        isActive: true
      },
      {
        awardType: "standard",
        title: "INDIA'S BEST COMPANY OF THE YEAR, 2022 - By BERKSHIRE MEDIA LLC, USA",
        description: "",
        imageId: null,
        year: 2022,
        orderIndex: 10,
        isActive: true
      },
      {
        awardType: "standard",
        title: "Great Place to Work Certified 2025",
        description: "",
        imageId: null,
        year: 2025,
        orderIndex: 11,
        isActive: true
      },
      // Laurel Awards
      {
        awardType: "laurel",
        title: "Transnational Trailblazers of Tamil Nadu awarded by Times Group",
        description: "",
        imageId: null,
        year: 2007,
        recipient: "To Anil Jain",
        orderIndex: 0,
        isActive: true
      },
      {
        awardType: "laurel",
        title: "The Standard chartered DnB & BRADSTREET Top 50 SMEs Award",
        description: "",
        imageId: null,
        year: 2008,
        recipient: "To Anil Jain",
        orderIndex: 1,
        isActive: true
      },
      {
        awardType: "laurel",
        title: "Young Entrepreneur by Times Group",
        description: "",
        imageId: null,
        year: 2009,
        recipient: "To Anil Jain",
        orderIndex: 2,
        isActive: true
      },
      {
        awardType: "laurel",
        title: "Fastest Growing Pharma Agent by Rajasthan Aushadhi Utpadak Sangh",
        description: "",
        imageId: null,
        year: 2018,
        recipient: "To Anil Jain",
        orderIndex: 3,
        isActive: true
      },
      // Certification Awards
      {
        awardType: "certification",
        title: "Most Preferred Workplace 2025-2026 by Marksmen Daily",
        description: "",
        imageId: null,
        year: 2025,
        orderIndex: 0,
        isActive: true
      }
    ];

    for (const awardData of awards) {
      await Award.findOrCreate({
        where: {
          title: awardData.title,
          year: awardData.year || null
        },
        defaults: awardData
      });
    }

    console.log("✅ Awards seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding awards:", error);
    throw error;
  }
};

