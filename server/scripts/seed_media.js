const { Media } = require("../models");

module.exports = async function seedMedia() {
  try {
    console.log("Seeding media...");

    // Note: Media records will be created as needed when images are uploaded
    // This is a placeholder for any initial media that needs to be seeded
    // For now, we'll create media records for commonly used images

    const mediaItems = [
      {
        fileName: "refex-logo.png",
        filePath: "https://www.refex.group/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png",
        fileType: "logo",
        altText: "Refex Group Logo"
      }
    ];

    for (const mediaData of mediaItems) {
      await Media.findOrCreate({
        where: { fileName: mediaData.fileName },
        defaults: mediaData
      });
    }

    console.log("✅ Media seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding media:", error);
    throw error;
  }
};

