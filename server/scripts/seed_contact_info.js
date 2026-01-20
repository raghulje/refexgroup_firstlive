const { ContactInfo } = require("../models");

module.exports = async function seedContactInfo() {
  try {
    console.log("Seeding contact info...");

    const contactInfo = [
      {
        infoType: "email",
        label: "Email",
        value: "info@refex.group",
        iconClass: "ri-mail-line",
        displayLocation: "footer",
        orderIndex: 0,
        isActive: true
      },
      {
        infoType: "phone",
        label: "Phone",
        value: "+91-44-4294 1000",
        iconClass: "ri-phone-line",
        displayLocation: "footer",
        orderIndex: 1,
        isActive: true
      },
      {
        infoType: "address",
        label: "Address",
        value: "Chennai, Tamil Nadu, India",
        iconClass: "ri-map-pin-line",
        displayLocation: "footer",
        orderIndex: 2,
        isActive: true
      }
    ];

    for (const infoData of contactInfo) {
      await ContactInfo.findOrCreate({
        where: {
          infoType: infoData.infoType,
          displayLocation: infoData.displayLocation
        },
        defaults: infoData
      });
    }

    console.log("✅ Contact info seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding contact info:", error);
    throw error;
  }
};

