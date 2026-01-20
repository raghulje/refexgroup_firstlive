require("dotenv").config();
const db = require("../models");
const { SdgCard, Media } = require("../models");

async function seedSdgCards() {
  try {
    console.log("Seeding SDG cards...");

    const sdgCards = [
      {
        sdgNumber: 3,
        title: "GOOD HEALTH AND WELL-BEING",
        description: "3i MedTech, a Refex group company, revolutionizes India's medical diagnostic industry with sustainable and affordable products. Our portable Dual-energy X-ray detector ensures accurate screening.",
        contribution: "Our Action",
        iconId: null,
        color: "#4c9f38",
        orderIndex: 0,
        isActive: true
      },
      {
        sdgNumber: 4,
        title: "QUALITY EDUCATION",
        description: "Empowering young minds! We collaborate with local government schools to provide computer literacy programs for high school students, preparing them for a brighter future. #EducationForAll #Empowerment",
        contribution: "Our Action",
        iconId: null,
        color: "#39965E",
        orderIndex: 1,
        isActive: true
      },
      {
        sdgNumber: 6,
        title: "CLEAN WATER & SANITATION",
        description: "#NirmalJal mission is bringing safe drinking water to the Chengalpattu community in Tamil Nadu. Join us in promoting clean water and sanitation for all. #CleanWaterForAll #SanitationForAll",
        contribution: "Our Action",
        iconId: null,
        color: "#2C496F",
        orderIndex: 2,
        isActive: true
      },
      {
        sdgNumber: 13,
        title: "CLIMATE ACTION",
        description: "We take pride in being eco-warriors! at Refex, By offering top-notch coal and ash handling services to thermal power plants, we are actively reducing the impact of climate change. We've established a robust business network that maximizes the utilization and recycling of fly ash in an environment-friendly way. This is our way of contributing towards a more sustainable future, and we are committed to continuing this work.",
        contribution: "Our Action",
        iconId: null,
        color: "#3f7e44",
        orderIndex: 3,
        isActive: true
      },
      {
        sdgNumber: 7,
        title: "AFFORDABLE & CLEAN ENERGY",
        description: "At RRIL, our renewable energy business is revolutionizing the industry with affordable solar power solutions for private and government agencies. We're proud to be a trusted partner of the Indian Railways in their energy transition mission and even have our solar footprint at the highest peak of the Himalayas. #ClimateAction #CleanEnergy",
        contribution: "Our Action",
        iconId: null,
        color: "#fcc30b",
        orderIndex: 4,
        isActive: true
      },
      {
        sdgNumber: 12,
        title: "RESPONSIBLE CONSUMPTION & PRODUCTION",
        description: "Refex's coal and ash handling business embodies responsible consumption and production. By promoting eco-friendly disposal and management, we ensure circularity and reduce emissions. Through partnerships in the cement, brick, and block industries and with local governments.",
        contribution: "Our Action",
        iconId: null,
        color: "#bf8b2e",
        orderIndex: 5,
        isActive: true
      },
      {
        sdgNumber: 15,
        title: "LIFE ON LAND",
        description: "Refex's initiatives create a better life on land! 'Plant for Future' will see 1,00,000 trees planted, while our coal and ash handling business rehabilitates abandoned mines. And we are supporting sustainable agriculture by offering land to local farmers for free. Let's make a better world together!",
        contribution: "Our Action",
        iconId: null,
        color: "#56c02b",
        orderIndex: 6,
        isActive: true
      },
      {
        sdgNumber: 17,
        title: "PARTNERSHIPS FOR THE GOALS",
        description: "Refex is proud to be part of the United Nations Global Compact (UNGC)! By joining forces with other partners, we're committed to ethical business practices and addressing the most pressing social and environmental issues. We've built a strong network of partners in the cement, brick, and block industries, as well as with abandoned mine owners, local governments, concrete producers, and road contractors, to promote the eco-friendly utilization and recycling of fly ash. Let's make a difference together!",
        contribution: "Our Action",
        iconId: null,
        color: "#19486a",
        orderIndex: 7,
        isActive: true
      }
    ];

    for (const cardData of sdgCards) {
      await SdgCard.findOrCreate({
        where: {
          sdgNumber: cardData.sdgNumber
        },
        defaults: cardData
      });
    }

    console.log("✅ SDG cards seeded successfully");
    await db.sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding SDG cards:", error);
    await db.sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedSdgCards();
}

module.exports = seedSdgCards;

