const { CoreValue, Media } = require("../models");

module.exports = async function seedCoreValues() {
  try {
    console.log("Seeding core values...");

    const coreValues = [
      {
        letter: "P",
        title: "Principled Excellence",
        description: "Doing what's right, with integrity and intention.",
        iconId: null,
        orderIndex: 0,
        isActive: true
      },
      {
        letter: "A",
        title: "Authenticity",
        description: "Bringing your true self to work, and honouring that in others.",
        iconId: null,
        orderIndex: 1,
        isActive: true
      },
      {
        letter: "C",
        title: "Customer Value",
        description: "Keeping our customers at the heart of everything we do.",
        iconId: null,
        orderIndex: 2,
        isActive: true
      },
      {
        letter: "E",
        title: "Esteem Culture",
        description: "Fostering a workplace where respect, dignity, and belonging are everyday experiences.",
        iconId: null,
        orderIndex: 3,
        isActive: true
      }
    ];

    for (const valueData of coreValues) {
      await CoreValue.findOrCreate({
        where: {
          letter: valueData.letter
        },
        defaults: valueData
      });
    }

    console.log("✅ Core values seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding core values:", error);
    throw error;
  }
};

