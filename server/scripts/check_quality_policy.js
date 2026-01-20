/**
 * Check quality policy content in database
 */

require("dotenv").config();
const db = require("../models");
const { Section, SectionContent, Page, Media } = db;

async function checkQualityPolicy() {
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
      where: { sectionId: policiesSection.id, contentKey: 'qualityPolicyUrl' },
      include: [{ model: Media, as: 'media', required: false }]
    });

    if (!qualityPolicyContent) {
      console.log('Quality policy content not found');
      process.exit(0);
    }

    console.log('\n=== Quality Policy Content ===');
    console.log('ID:', qualityPolicyContent.id);
    console.log('contentKey:', qualityPolicyContent.contentKey);
    console.log('contentValue:', qualityPolicyContent.contentValue);
    console.log('mediaId:', qualityPolicyContent.mediaId);
    
    if (qualityPolicyContent.media) {
      console.log('\n=== Media Record ===');
      console.log('Media ID:', qualityPolicyContent.media.id);
      console.log('filePath:', qualityPolicyContent.media.filePath);
      console.log('fileName:', qualityPolicyContent.media.fileName);
    }

    // Fix it
    console.log('\n=== Fixing ===');
    await qualityPolicyContent.update({
      contentValue: '/uploads/documents/Quality-Policy.pdf',
      mediaId: null  // Clear mediaId so it uses contentValue
    });

    console.log('✅ Updated to: /uploads/documents/Quality-Policy.pdf');
    console.log('✅ Cleared mediaId');

    // Reload to verify
    await qualityPolicyContent.reload();
    console.log('\n=== After Update ===');
    console.log('contentValue:', qualityPolicyContent.contentValue);
    console.log('mediaId:', qualityPolicyContent.mediaId);

    process.exit(0);
  } catch (error) {
    console.error('Error checking quality policy:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

checkQualityPolicy();

