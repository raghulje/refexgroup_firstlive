/* eslint-disable no-console */
const { sequelize, HeroSlide, Media, Page } = require('../models');

async function checkHeroSlides() {
  try {
    console.log('🔍 Checking hero slides...\n');

    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Get home page
    const homePage = await Page.findOne({ where: { slug: 'home' } });
    if (!homePage) {
      console.log('❌ Home page not found');
      return;
    }
    console.log(`📄 Home page found: ID ${homePage.id}\n`);

    // Get all hero slides for home page
    const slides = await HeroSlide.findAll({
      where: { pageId: homePage.id },
      include: [
        {
          model: Media,
          as: 'backgroundImage',
          required: false
        }
      ],
      order: [['orderIndex', 'ASC']]
    });

    console.log(`📊 Found ${slides.length} hero slide(s)\n`);

    if (slides.length === 0) {
      console.log('⚠️  No hero slides found for home page');
      console.log('   You need to create at least one hero slide in the CMS\n');
      return;
    }

    slides.forEach((slide, index) => {
      console.log(`\n--- Slide ${index + 1} (ID: ${slide.id}) ---`);
      console.log(`Title: ${slide.title || '(empty)'}`);
      console.log(`Subtitle: ${slide.subtitle || '(empty)'}`);
      console.log(`Is Active: ${slide.isActive}`);
      console.log(`Order Index: ${slide.orderIndex}`);
      console.log(`Background Image ID: ${slide.backgroundImageId || '(not set)'}`);

      if (slide.backgroundImage) {
        console.log(`✅ Background Image Found:`);
        console.log(`   - Media ID: ${slide.backgroundImage.id}`);
        console.log(`   - File Name: ${slide.backgroundImage.fileName}`);
        console.log(`   - File Path: ${slide.backgroundImage.filePath}`);
        console.log(`   - File Type: ${slide.backgroundImage.fileType}`);
        console.log(`   - Page Name: ${slide.backgroundImage.pageName || '(not set)'}`);
        console.log(`   - Section Name: ${slide.backgroundImage.sectionName || '(not set)'}`);
      } else {
        console.log(`❌ Background Image NOT FOUND`);
        if (slide.backgroundImageId) {
          console.log(`   ⚠️  backgroundImageId is set (${slide.backgroundImageId}) but Media record not found!`);
        } else {
          console.log(`   ⚠️  backgroundImageId is not set - image needs to be uploaded in CMS`);
        }
      }
    });

    console.log('\n\n📝 Summary:');
    const activeSlides = slides.filter(s => s.isActive !== false);
    const slidesWithImages = slides.filter(s => s.backgroundImage !== null);
    console.log(`   - Total slides: ${slides.length}`);
    console.log(`   - Active slides: ${activeSlides.length}`);
    console.log(`   - Slides with images: ${slidesWithImages.length}`);

    if (activeSlides.length === 0) {
      console.log('\n⚠️  WARNING: No active slides found!');
      console.log('   Make sure at least one slide has isActive = true\n');
    }

    if (slidesWithImages.length === 0) {
      console.log('\n⚠️  WARNING: No slides have background images!');
      console.log('   You need to upload images for the slides in the CMS\n');
    }

  } catch (error) {
    console.error('❌ Error checking hero slides:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  checkHeroSlides()
    .then(() => {
      console.log('\n✨ Check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Check failed:', error);
      process.exit(1);
    });
}

module.exports = checkHeroSlides;

