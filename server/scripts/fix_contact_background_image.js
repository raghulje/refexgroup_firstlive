require("dotenv").config();
const db = require("../models");
const { Section, SectionContent, Media } = require("../models");

async function fixContactBackgroundImage() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    // Find the contact page hero section
    const heroSection = await Section.findOne({
      where: {
        sectionKey: 'hero',
        pageId: (await db.Page.findOne({ where: { slug: 'contact' } })).id
      }
    });

    if (!heroSection) {
      console.error('Hero section not found');
      return;
    }

    // Find the backgroundImage content item
    const bgContent = await SectionContent.findOne({
      where: {
        sectionId: heroSection.id,
        contentKey: 'backgroundImage'
      },
      include: [{ model: Media, as: 'media', required: false }]
    });

    if (!bgContent) {
      console.error('Background image content item not found');
      return;
    }

    console.log('Current backgroundImage content:', {
      id: bgContent.id,
      contentValue: bgContent.contentValue,
      mediaId: bgContent.mediaId,
      hasMedia: !!bgContent.media
    });

    // Find or get the media record
    let media = bgContent.media;
    if (!media && bgContent.mediaId) {
      media = await Media.findByPk(bgContent.mediaId);
    }

    // If we have media, use its filePath
    if (media && media.filePath) {
      await bgContent.update({
        contentValue: media.filePath
      });
      console.log(`✅ Updated backgroundImage contentValue to: ${media.filePath}`);
    } else {
      // Otherwise, set it to the expected path
      const expectedPath = '/wp-content/uploads/2023/02/Contact-Page-Bg.jpg';
      await bgContent.update({
        contentValue: expectedPath
      });
      console.log(`✅ Updated backgroundImage contentValue to: ${expectedPath}`);
    }

    console.log('✅ Background image content item updated successfully!');
  } catch (error) {
    console.error('❌ Error fixing background image:', error);
    throw error;
  } finally {
    await db.sequelize.close();
  }
}

if (require.main === module) {
  fixContactBackgroundImage();
}

module.exports = fixContactBackgroundImage;

