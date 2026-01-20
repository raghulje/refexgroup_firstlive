/**
 * Fix quality policy that's stored as media ID instead of file path
 */

require("dotenv").config();
const db = require("../models");
const { Section, SectionContent, Page, Media } = db;
const path = require('path');
const fs = require('fs');

async function fixQualityPolicy() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    // Find ESG page
    const esgPage = await Page.findOne({ where: { slug: 'esg' } });
    if (!esgPage) {
      console.error('ESG page not found');
      process.exit(1);
    }

    // Find policies section
    const policiesSection = await Section.findOne({
      where: { pageId: esgPage.id, sectionKey: 'policies' }
    });

    if (!policiesSection) {
      console.error('Policies section not found');
      process.exit(1);
    }

    // Get qualityPolicyUrl content
    const qualityPolicyContent = await SectionContent.findOne({
      where: { sectionId: policiesSection.id, contentKey: 'qualityPolicyUrl' }
    });

    if (!qualityPolicyContent) {
      console.log('Quality policy content not found');
      process.exit(0);
    }

    const currentValue = qualityPolicyContent.contentValue || '';
    console.log(`Current qualityPolicyUrl value: ${currentValue}`);

    // Check if it's a media ID (numeric)
    if (/^\d+$/.test(currentValue)) {
      const mediaId = parseInt(currentValue);
      console.log(`Resolving media ID: ${mediaId}`);
      
      const media = await Media.findByPk(mediaId);
      if (media && media.filePath) {
        console.log(`Found media record with filePath: ${media.filePath}`);
        
        // Extract filename
        let filename = path.basename(media.filePath);
        
        // Check if file exists in /uploads/documents/
        const documentsDir = path.join(__dirname, '../uploads/documents');
        if (fs.existsSync(documentsDir)) {
          const availableFiles = fs.readdirSync(documentsDir);
          const matchingFile = availableFiles.find(file => 
            file.toLowerCase() === filename.toLowerCase() ||
            file.toLowerCase().replace(/\s+/g, '_').toLowerCase() === filename.toLowerCase().replace(/\s+/g, '_')
          );

          if (matchingFile) {
            const newPath = `/uploads/documents/${matchingFile}`;
            await qualityPolicyContent.update({
              contentValue: newPath
            });
            console.log(`✅ Updated qualityPolicyUrl to: ${newPath}`);
          } else {
            // Try to update the path from media.filePath
            if (media.filePath.includes('/general/general/')) {
              const newPath = media.filePath.replace('/general/general/', '/').replace('/uploads/documents/', '/uploads/documents/');
              await qualityPolicyContent.update({
                contentValue: newPath
              });
              console.log(`✅ Updated qualityPolicyUrl to: ${newPath}`);
            } else {
              console.log(`⚠️  File not found in /uploads/documents/. Keeping media ID.`);
            }
          }
        }
      } else {
        console.log(`Media record not found for ID: ${mediaId}`);
      }
    } else {
      console.log('Quality policy is not a media ID, skipping...');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing quality policy:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

fixQualityPolicy();

