/**
 * Fix quality policy path to use correct filename
 */

require("dotenv").config();
const db = require("../models");
const { Section, SectionContent, Page } = db;

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

    // Update to correct filename
    const newPath = '/uploads/documents/Quality-Policy.pdf';
    await qualityPolicyContent.update({
      contentValue: newPath
    });

    console.log(`✅ Updated qualityPolicyUrl to: ${newPath}`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing quality policy:', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

fixQualityPolicy();

