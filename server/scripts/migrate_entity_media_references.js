const { 
  Media, 
  Award, 
  HeroSlide, 
  NewsroomItem, 
  HomeCareersSection,
  BusinessCard,
  Leader,
  HomeAboutSection,
  HomeVideoSection
} = require('../models');
const { Op } = require('sequelize');

async function migrateEntityMediaReferences() {
  try {
    console.log('Migrating entity media references from old to new Media IDs...\n');

    // Get all old Media records (with /uploads/images/ paths)
    const oldMedia = await Media.findAll({
      where: {
        filePath: {
          [Op.like]: '/uploads/images/%'
        }
      }
    });

    let totalUpdated = 0;
    let totalSkipped = 0;

    for (const oldMediaRecord of oldMedia) {
      // Find the corresponding new Media record by matching file names
      const fileName = oldMediaRecord.filePath.split('/').pop();
      
      // Try to find new Media record with same filename but in /assets/
      const newMediaRecords = await Media.findAll({
        where: {
          fileName: fileName,
          filePath: {
            [Op.like]: '/assets/%'
          }
        }
      });

      if (newMediaRecords.length === 0) {
        console.log(`  ⚠️  No new Media found for: ${fileName}`);
        continue;
      }

      const newMediaId = newMediaRecords[0].id;

      if (newMediaId === oldMediaRecord.id) {
        continue; // Same record, no migration needed
      }

      console.log(`\n📦 Migrating references from Media ID ${oldMediaRecord.id} → ${newMediaId} (${fileName})`);

      // Update Awards
      const awardsUpdated = await Award.update(
        { imageId: newMediaId },
        { where: { imageId: oldMediaRecord.id } }
      );
      if (awardsUpdated[0] > 0) {
        console.log(`  ✅ Updated ${awardsUpdated[0]} Award(s)`);
        totalUpdated += awardsUpdated[0];
      }

      // Update HeroSlides
      const heroSlidesUpdated = await HeroSlide.update(
        { backgroundImageId: newMediaId },
        { where: { backgroundImageId: oldMediaRecord.id } }
      );
      if (heroSlidesUpdated[0] > 0) {
        console.log(`  ✅ Updated ${heroSlidesUpdated[0]} HeroSlide(s)`);
        totalUpdated += heroSlidesUpdated[0];
      }

      // Update NewsroomItems
      const newsroomUpdated = await NewsroomItem.update(
        { featuredImageId: newMediaId },
        { where: { featuredImageId: oldMediaRecord.id } }
      );
      if (newsroomUpdated[0] > 0) {
        console.log(`  ✅ Updated ${newsroomUpdated[0]} NewsroomItem(s)`);
        totalUpdated += newsroomUpdated[0];
      }

      // Update HomeCareersSection
      const careersUpdated = await HomeCareersSection.update(
        { imageId: newMediaId },
        { where: { imageId: oldMediaRecord.id } }
      );
      if (careersUpdated[0] > 0) {
        console.log(`  ✅ Updated ${careersUpdated[0]} HomeCareersSection(s)`);
        totalUpdated += careersUpdated[0];
      }

      // Update BusinessCard (already done, but check anyway)
      const businessCardsUpdated = await BusinessCard.update(
        { imageId: newMediaId },
        { where: { imageId: oldMediaRecord.id } }
      );
      if (businessCardsUpdated[0] > 0) {
        console.log(`  ✅ Updated ${businessCardsUpdated[0]} BusinessCard(s)`);
        totalUpdated += businessCardsUpdated[0];
      }

      // Update Leader
      const leadersUpdated = await Leader.update(
        { imageId: newMediaId },
        { where: { imageId: oldMediaRecord.id } }
      );
      if (leadersUpdated[0] > 0) {
        console.log(`  ✅ Updated ${leadersUpdated[0]} Leader(s)`);
        totalUpdated += leadersUpdated[0];
      }

      // Update HomeAboutSection
      const aboutMainUpdated = await HomeAboutSection.update(
        { mainImageId: newMediaId },
        { where: { mainImageId: oldMediaRecord.id } }
      );
      if (aboutMainUpdated[0] > 0) {
        console.log(`  ✅ Updated ${aboutMainUpdated[0]} HomeAboutSection mainImage(s)`);
        totalUpdated += aboutMainUpdated[0];
      }

      const aboutLogoUpdated = await HomeAboutSection.update(
        { logoImageId: newMediaId },
        { where: { logoImageId: oldMediaRecord.id } }
      );
      if (aboutLogoUpdated[0] > 0) {
        console.log(`  ✅ Updated ${aboutLogoUpdated[0]} HomeAboutSection logoImage(s)`);
        totalUpdated += aboutLogoUpdated[0];
      }

      // Update HomeVideoSection
      const videoThumbUpdated = await HomeVideoSection.update(
        { thumbnailImageId: newMediaId },
        { where: { thumbnailImageId: oldMediaRecord.id } }
      );
      if (videoThumbUpdated[0] > 0) {
        console.log(`  ✅ Updated ${videoThumbUpdated[0]} HomeVideoSection(s)`);
        totalUpdated += videoThumbUpdated[0];
      }

      totalSkipped++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Migration Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Total entity references updated: ${totalUpdated}`);
    console.log(`📦 Media records processed: ${totalSkipped}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating entity media references:', error);
    process.exit(1);
  }
}

// Run the script
migrateEntityMediaReferences();

