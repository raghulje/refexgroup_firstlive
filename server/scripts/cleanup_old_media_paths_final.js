/* eslint-disable no-console */
const { sequelize, Media, SectionContent, GalleryImage, GalleryDocument, HeroSlide, BusinessCard, Award, NewsroomItem, Leader, SdgCard, CoreValue, Testimonial, CareersPageContent, AboutPageContent, ContactPageContent, DiversityPageContent, EsgPageContent, GalleryAlbum, GalleryEvent, GalleryPageContent, HomeAboutSection, HomeCareersSection, HomeVideoSection, InvestmentsPageContent, NewsroomPageContent, RefrigerantsContent, RefrigerantsProduct, RenewablesContent, NavigationMenu } = require('../models');
const { Op } = require('sequelize');

async function cleanupOldMediaPaths() {
  try {
    console.log('🧹 Starting final cleanup of old media paths...\n');
    console.log('📋 This will remove all media records NOT in /uploads/images/general/general/\n');

    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Find all media records NOT in /uploads/images/general/general/
    const oldMediaRecords = await Media.findAll({
      where: {
        filePath: {
          [Op.notLike]: '/uploads/images/general/general/%'
        }
      },
      attributes: ['id', 'filePath']
    });

    console.log(`📊 Found ${oldMediaRecords.length} media records outside /uploads/images/general/general/\n`);

    if (oldMediaRecords.length === 0) {
      console.log('✅ No old media paths found. Database is clean!\n');
      return;
    }

    // Show some examples
    console.log('📝 Examples of paths to be removed:');
    oldMediaRecords.slice(0, 5).forEach(media => {
      console.log(`   - ${media.filePath}`);
    });
    if (oldMediaRecords.length > 5) {
      console.log(`   ... and ${oldMediaRecords.length - 5} more\n`);
    } else {
      console.log('');
    }

    // Collect IDs of old media records
    const oldMediaIds = oldMediaRecords.map(media => media.id);

    // Update foreign key references to NULL in dependent tables
    console.log('🔄 Updating foreign key references in dependent tables...\n');

    const modelsToUpdate = [
      { model: SectionContent, fk: 'mediaId', allowNull: true },
      { model: GalleryImage, fk: 'imageId', allowNull: false },
      { model: GalleryDocument, fk: 'documentId', allowNull: false },
      { model: HeroSlide, fk: 'backgroundImageId', allowNull: true },
      { model: BusinessCard, fk: 'imageId', allowNull: true },
      { model: Award, fk: 'imageId', allowNull: true },
      { model: NewsroomItem, fk: 'featuredImageId', allowNull: true },
      { model: Leader, fk: 'imageId', allowNull: true },
      { model: SdgCard, fk: 'iconId', allowNull: true },
      { model: SdgCard, fk: 'bannerId', allowNull: true },
      { model: CoreValue, fk: 'iconId', allowNull: true },
      { model: Testimonial, fk: 'authorImageId', allowNull: true },
      { model: CareersPageContent, fk: 'hero_image_id', allowNull: true },
      { model: CareersPageContent, fk: 'life_at_refex_image_id', allowNull: true },
      { model: AboutPageContent, fk: 'hero_image_id', allowNull: true },
      { model: AboutPageContent, fk: 'intro_logo_id', allowNull: true },
      { model: AboutPageContent, fk: 'group_photo_id', allowNull: true },
      { model: ContactPageContent, fk: 'hero_image_id', allowNull: true },
      { model: DiversityPageContent, fk: 'hero_bg_id', allowNull: true },
      { model: DiversityPageContent, fk: 'beyou_image_id', allowNull: true },
      { model: DiversityPageContent, fk: 'believe_image_id', allowNull: true },
      { model: EsgPageContent, fk: 'hero_image_id', allowNull: true },
      { model: EsgPageContent, fk: 'intro_image_id', allowNull: true },
      { model: EsgPageContent, fk: 'sdg_hero_image_id', allowNull: true },
      { model: GalleryAlbum, fk: 'coverImageId', allowNull: true },
      { model: GalleryEvent, fk: 'coverImageId', allowNull: true },
      { model: GalleryPageContent, fk: 'hero_bg_id', allowNull: true },
      { model: GalleryPageContent, fk: 'welcome_image_id', allowNull: true },
      { model: HomeAboutSection, fk: 'main_image_id', allowNull: true },
      { model: HomeAboutSection, fk: 'logo_image_id', allowNull: true },
      { model: HomeCareersSection, fk: 'imageId', allowNull: true },
      { model: HomeVideoSection, fk: 'thumbnailImageId', allowNull: true },
      { model: InvestmentsPageContent, fk: 'hero_bg_id', allowNull: true },
      { model: InvestmentsPageContent, fk: 'cmd_image_id', allowNull: true },
      { model: NewsroomPageContent, fk: 'hero_image_id', allowNull: true },
      { model: RefrigerantsContent, fk: 'hero_bg_id', allowNull: true },
      { model: RefrigerantsProduct, fk: 'image_id', allowNull: true },
      { model: RenewablesContent, fk: 'hero_bg_id', allowNull: true },
      { model: NavigationMenu, fk: 'iconId', allowNull: true },
      { model: NavigationMenu, fk: 'megaMenuMediaId', allowNull: true },
    ];

    for (const { model, fk, allowNull } of modelsToUpdate) {
      if (!model) {
        console.warn(`   ⚠ Skipping undefined model for foreign key ${fk}`);
        continue;
      }
      try {
        if (allowNull) {
          const updatedRows = await model.update(
            { [fk]: null },
            { where: { [fk]: { [Op.in]: oldMediaIds } } }
          );
          if (updatedRows[0] > 0) {
            console.log(`   ✓ Updated ${updatedRows[0]} references in ${model.tableName} for foreign key ${fk}`);
          }
        } else {
          // If foreign key is NOT NULL, delete the dependent records
          const deletedDependentCount = await model.destroy({
            where: { [fk]: { [Op.in]: oldMediaIds } }
          });
          if (deletedDependentCount > 0) {
            console.log(`   ✓ Deleted ${deletedDependentCount} records from ${model.tableName} (foreign key ${fk} is NOT NULL)`);
          }
        }
      } catch (updateError) {
        if (updateError.name === 'SequelizeDatabaseError' && updateError.message.includes('Unknown column')) {
          console.warn(`   ⚠ Skipping ${model.tableName}.${fk}: Column does not exist.`);
        } else {
          console.warn(`   ⚠ Warning updating ${model.tableName}.${fk}:`, updateError.message);
        }
      }
    }
    console.log('✅ Foreign key references updated to NULL or dependent records deleted.\n');

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
    console.log('📝 Note: Media gallery now only shows images from /uploads/images/general/general/\n');

  } catch (error) {
    console.error('❌ Error cleaning old media paths:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  cleanupOldMediaPaths()
    .then(() => {
      console.log('✨ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = cleanupOldMediaPaths;

