const { Media } = require("../models");
const fs = require('fs');
const path = require('path');

module.exports = async function createMediaFromDownloads() {
  try {
    console.log("Creating Media records from downloaded images...");

    const uploadsDir = path.join(__dirname, '../uploads');
    const imageMappingPath = path.join(uploadsDir, 'image_mapping.json');

    if (!fs.existsSync(imageMappingPath)) {
      console.log("⚠️  Image mapping not found. Please run 'npm run download-images' first.");
      return;
    }

    const imageMapping = JSON.parse(fs.readFileSync(imageMappingPath, 'utf8'));
    let createdCount = 0;
    let skippedCount = 0;

    for (const [url, localPath] of Object.entries(imageMapping)) {
      // Check if file actually exists
      const fullPath = path.join(__dirname, '..', localPath);
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${localPath}`);
        continue;
      }

      const fileName = path.basename(localPath);
      const ext = path.extname(fileName).toLowerCase();
      
      // Determine file type
      let fileType = 'image';
      if (ext === '.svg' || localPath.includes('icon')) {
        fileType = 'icon';
      } else if (localPath.includes('logo') || localPath.includes('Logo')) {
        fileType = 'logo';
      } else if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
        fileType = 'document';
      } else if (ext === '.mp4' || ext === '.avi' || ext === '.mov') {
        fileType = 'video';
      }

      // Generate alt text from filename
      const altText = fileName
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      try {
        const [media, created] = await Media.findOrCreate({
          where: { filePath: localPath },
          defaults: {
            fileName: fileName,
            filePath: localPath,
            fileType: fileType,
            altText: altText
          }
        });

        if (created) {
          createdCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error creating media for ${fileName}:`, error.message);
      }
    }

    console.log(`✅ Created ${createdCount} new Media records`);
    console.log(`⏭️  Skipped ${skippedCount} existing Media records`);
  } catch (error) {
    console.error("❌ Error creating Media records:", error);
    throw error;
  }
};

