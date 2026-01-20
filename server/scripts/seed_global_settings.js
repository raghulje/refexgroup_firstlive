const { GlobalSetting } = require("../models");

module.exports = async function seedGlobalSettings() {
  try {
    console.log("Seeding global settings...");

    const settings = [
      {
        key: "site_name",
        value: "Refex Group",
        valueType: "string"
      },
      {
        key: "site_tagline",
        value: "Leading Business Conglomerate",
        valueType: "string"
      },
      {
        key: "company_founded_year",
        value: "2002",
        valueType: "string"
      },
      {
        key: "people_impacted",
        value: "2000000",
        valueType: "number"
      }
    ];

    for (const settingData of settings) {
      await GlobalSetting.findOrCreate({
        where: {
          key: settingData.key
        },
        defaults: settingData
      });
    }

    console.log("✅ Global settings seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding global settings:", error);
    throw error;
  }
};

