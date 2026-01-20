/* eslint-disable no-console */
const { sequelize, Media, SectionContent, GalleryImage, GalleryDocument, HeroSlide, BusinessCard, Award, NewsroomItem, Leader, SdgCard, CoreValue, Testimonial, CareersPageContent, AboutPageContent, ContactPageContent, DiversityPageContent, EsgPageContent, GalleryAlbum, GalleryEvent, GalleryPageContent, HomeAboutSection, HomeCareersSection, HomeVideoSection, InvestmentsPageContent, NewsroomPageContent, RefrigerantsContent, RefrigerantsProduct, RenewablesContent, NavigationMenu } = require('../models');
const { Op } = require('sequelize');

/**
 * Clean up old media paths from database
 * Removes all media records that reference:
 * - /assets/ paths (static assets)
 * - /wp-content/ paths (legacy WordPress)
 * - Any other non-/uploads/ paths
 * 
 * This script prepares the database for CMS-only image management
 * where all images will be uploaded through the CMS and stored in /uploads/
 */
async function cleanOldMediaPaths() {
  try {
    console.log('🧹 Starting cleanup of old media paths...\n');

    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Find all media records with old paths
    const oldMedia = await Media.findAll({
      where: {
        [Op.or]: [
          { filePath: { [Op.like]: '/assets/%' } },
          { filePath: { [Op.like]: '/wp-content/%' } },
          { filePath: { [Op.notLike]: '/uploads/%' } }
        ]
      },
      attributes: ['id', 'filePath']
    });

    console.log(`📊 Found ${oldMedia.length} media records with old paths\n`);

    if (oldMedia.length === 0) {
      console.log('✅ No old media paths found. Database is clean!\n');
      return;
    }

    // Show summary
    const pathsByType = {
      '/assets/': 0,
      '/wp-content/': 0,
      'other': 0
    };

    oldMedia.forEach(media => {
      if (media.filePath.startsWith('/assets/')) {
        pathsByType['/assets/']++;
      } else if (media.filePath.startsWith('/wp-content/')) {
        pathsByType['/wp-content/']++;
      } else {
        pathsByType['other']++;
      }
    });

    console.log('📋 Summary of old paths:');
    console.log(`   /assets/: ${pathsByType['/assets/']}`);
    console.log(`   /wp-content/: ${pathsByType['/wp-content/']}`);
    console.log(`   Other: ${pathsByType['other']}\n`);

    // Collect IDs of old media records
    const oldMediaIds = oldMedia.map(media => media.id);

    // Update foreign key references to NULL in dependent tables
    console.log('🔄 Updating foreign key references in dependent tables...');

    // List of models and their foreign keys referencing Media
    const modelsToUpdate = [
      { model: SectionContent, fk: 'mediaId' },
      { model: GalleryImage, fk: 'imageId' },
      { model: GalleryDocument, fk: 'documentId' },
      { model: HeroSlide, fk: 'backgroundImageId' },
      { model: BusinessCard, fk: 'imageId' },
      { model: Award, fk: 'imageId' },
      { model: NewsroomItem, fk: 'featuredImageId' },
      { model: Leader, fk: 'imageId' },
      { model: SdgCard, fk: 'iconId' },
      { model: SdgCard, fk: 'bannerId' },
      { model: CoreValue, fk: 'iconId' },
      { model: Testimonial, fk: 'authorImageId' },
      { model: CareersPageContent, fk: 'hero_image_id' },
      { model: CareersPageContent, fk: 'life_at_refex_image_id' },
      { model: AboutPageContent, fk: 'hero_image_id' },
      { model: AboutPageContent, fk: 'intro_logo_id' },
      { model: AboutPageContent, fk: 'group_photo_id' },
      { model: ContactPageContent, fk: 'hero_image_id' },
      { model: DiversityPageContent, fk: 'hero_bg_id' },
      { model: DiversityPageContent, fk: 'beyou_image_id' },
      { model: DiversityPageContent, fk: 'believe_image_id' },
      { model: EsgPageContent, fk: 'hero_image_id' },
      { model: EsgPageContent, fk: 'intro_image_id' },
      { model: EsgPageContent, fk: 'sdg_hero_image_id' },
      { model: GalleryAlbum, fk: 'coverImageId' },
      { model: GalleryEvent, fk: 'coverImageId' },
      { model: GalleryPageContent, fk: 'hero_bg_id' },
      { model: GalleryPageContent, fk: 'welcome_image_id' },
      { model: HomeAboutSection, fk: 'main_image_id' },
      { model: HomeAboutSection, fk: 'logo_image_id' },
      { model: HomeCareersSection, fk: 'imageId' },
      { model: HomeVideoSection, fk: 'thumbnailImageId' },
      { model: InvestmentsPageContent, fk: 'hero_bg_id' },
      { model: InvestmentsPageContent, fk: 'cmd_image_id' },
      { model: NewsroomPageContent, fk: 'hero_image_id' },
      { model: RefrigerantsContent, fk: 'hero_bg_id' },
      { model: RefrigerantsProduct, fk: 'image_id' },
      { model: RenewablesContent, fk: 'hero_bg_id' },
      { model: NavigationMenu, fk: 'iconId' },
      { model: NavigationMenu, fk: 'megaMenuMediaId' },
    ];

    for (const { model, fk } of modelsToUpdate) {
      try {
        // Skip if model is undefined
        if (!model) {
          console.warn(`   ⚠ Skipping undefined model for foreign key ${fk}`);
          continue;
        }

        // For GalleryImage and GalleryDocument, delete records instead of setting to NULL
        // because their foreign keys have allowNull: false
        if ((model === GalleryImage && fk === 'imageId') || 
            (model === GalleryDocument && fk === 'documentId')) {
          const deletedCount = await model.destroy({
            where: { [fk]: { [Op.in]: oldMediaIds } }
          });
          if (deletedCount > 0) {
            console.log(`   ✓ Deleted ${deletedCount} records from ${model.tableName} (foreign key ${fk} is NOT NULL)`);
          }
        } else {
          // For other models, set foreign key to NULL
          const updatedRows = await model.update(
            { [fk]: null },
            { where: { [fk]: { [Op.in]: oldMediaIds } } }
          );
          if (updatedRows[0] > 0) {
            console.log(`   ✓ Updated ${updatedRows[0]} references in ${model.tableName} for foreign key ${fk}`);
          }
        }
      } catch (updateError) {
        // Some models might not have the foreign key column, skip silently
        if (updateError.name !== 'SequelizeDatabaseError' || !updateError.message.includes('Unknown column')) {
          const modelName = model && model.tableName ? model.tableName : 'unknown';
          console.warn(`   ⚠ Warning updating ${modelName}.${fk}:`, updateError.message);
        }
      }
    }
    console.log('✅ Foreign key references updated to NULL.\n');

    // Delete old media records
    const deletedCount = await Media.destroy({
      where: {
        id: {
          [Op.in]: oldMediaIds
        }
      }
    });

    console.log(`🗑️  Deleted ${deletedCount} old media records\n`);
    console.log('✅ Cleanup completed successfully!\n');
    console.log('📝 Note: All images should now be uploaded through CMS');
    console.log('   and will be stored in /uploads/images/[page]/[section]/\n');

  } catch (error) {
    console.error('❌ Error cleaning old media paths:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  cleanOldMediaPaths()
    .then(() => {
      console.log('✨ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = cleanOldMediaPaths;

