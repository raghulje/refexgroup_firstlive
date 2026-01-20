const { Media } = require('../models');
const fs = require('fs');
const path = require('path');

// Base directory for assets
const ASSETS_DIR = path.join(__dirname, '../../new_client/public/assets');

// Direct mapping for known files
const DIRECT_MAPPING = {
  // Awards
  '/uploads/images/mid-size-award-300x226.png': '/assets/awards/mid-size-award-300x226.png',
  '/uploads/images/fleet-managemnet-award-300x226.png': '/assets/awards/fleet-managemnet-award-300x226.png',
  '/uploads/images/BEST-ORGANISATIONS-FOR-WOMEN-2024-With-Work-force-1-300x281.png': '/assets/awards/BEST-ORGANISATIONS-FOR-WOMEN-2024-With-Work-force-1-300x281.png',
  '/uploads/images/green-apple-award01.png': '/assets/awards/green-apple-award01.png',
  '/uploads/images/esg-excellence-award01.png': '/assets/awards/esg-excellence-award01.png',
  '/uploads/images/Solar-award-300x226.png': '/assets/awards/Solar-award-300x226.png',
  '/uploads/images/ESG_CSR_Award_01-Medium-300x295.png': '/assets/awards/ESG_CSR_Award_01-Medium-300x295.png',
  '/uploads/images/Sustainability-report-award-Medium-300x225.png': '/assets/awards/Sustainability-report-award-Medium-300x225.png',
  '/uploads/images/Gold-Stieve-Refex.png': '/assets/awards/Gold-Stieve-Refex.png',
  '/uploads/images/Bronze-Stieve-Refex.png': '/assets/awards/Bronze-Stieve-Refex.png',
  '/uploads/images/Best-Company-Refex.png': '/assets/awards/Best-Company-Refex.png',
  '/uploads/images/Refex_Group_IN_English_2025_Certification_Badge.png': '/assets/awards/Refex_Group_IN_English_2025_Certification_Badge.png',
  '/uploads/images/Times-of-India-Trailblazers-of-Tamil-Nadu-awarded-by-Times-Group.png': '/assets/awards/Times-of-India-Trailblazers-of-Tamil-Nadu-awarded-by-Times-Group.png',
  '/uploads/images/The-Standard-chartered-DUN-_-BRADSTREET-Top-100-SMEs-Award.png': '/assets/awards/The-Standard-chartered-DUN-_-BRADSTREET-Top-100-SMEs-Award.png',
  '/uploads/images/2009-Award.png': '/assets/awards/2009-Award.png',
  '/uploads/images/Rajasthan-Yuva-Ratna-Award-by-Rajasthan-Association-TN..png': '/assets/awards/Rajasthan-Yuva-Ratna-Award-by-Rajasthan-Association-TN.png',
  '/uploads/images/workplace-awards-768x844.png': '/assets/awards/workplace-awards-768x844.png',
  
  // Newsroom
  '/uploads/images/newsroom-thumbnail-video.jpg': '/assets/newsroom/newsroom-thumbnail-video.jpg',
  '/uploads/images/f083fd9c51a4b154ca0967ca2ad3b996.jpeg': '/assets/newsroom/readdy-1.jpeg',
  '/uploads/images/2675d7edc8e086e4c4be378eba93a660.jpeg': '/assets/newsroom/readdy-2.jpeg',
  '/uploads/images/d674bfc0dcb4ffb4355d91b67e0eb3b3.jpeg': '/assets/newsroom/readdy-3.jpeg',
  '/uploads/images/press-release02.jpg': '/assets/newsroom/press-release02.jpg',
  '/uploads/images/press-release04.jpg': '/assets/newsroom/press-release04.jpg',
  '/uploads/images/Refex-Mobility-expands.jpg': '/assets/newsroom/Refex-Mobility-expands.jpg',
  '/uploads/images/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg': '/assets/newsroom/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg',
  '/uploads/images/Refex-Group-Road-Safety-Awareness-event.jpg': '/assets/newsroom/Refex-Group-Road-Safety-Awareness-event.jpg',
  
  // Careers
  '/uploads/images/REFEX_home_career-BG.jpg': '/assets/careers/REFEX_home_career-BG.jpg',
  
  // Heroes
  '/uploads/images/about-anniversary.jpg': '/assets/heroes/about-anniversary.jpg',
  '/uploads/images/business-bg.jpg': '/assets/heroes/business-bg.jpg',
  '/uploads/images/Slider-1.jpg': '/assets/heroes/business-bg.jpg', // Assuming this is business-bg
  '/uploads/images/Renwables-Hero-Option.jpg': '/assets/heroes/renewables-hero.jpg',
  '/uploads/images/Business-page-banner-Large.jpeg': '/assets/heroes/business-bg.jpg',
  '/uploads/images/Heap-Making.jpeg': '/assets/business/ash-coal/heap-making.jpeg',
  '/uploads/images/Medtech-Slider.jpg': '/assets/business/Medtech-Hero-Banner.jpg',
  '/uploads/images/About-BG-Curve.png': '/assets/heroes/about-anniversary.jpg', // Fallback
  '/uploads/images/REFEX-Logo@2x-8-1.png': '/assets/logos/REFEX-Logo@2x-8-1.png',
  '/uploads/images/Diversity-Inclusion-v2.jpg': '/assets/heroes/business-bg.jpg', // Fallback
};

// Function to find file in assets directory
function findFileInAssets(fileName) {
  const categories = ['awards', 'business', 'newsroom', 'careers', 'heroes', 'logos', 'leadership', 'gallery'];
  
  for (const category of categories) {
    const categoryDir = path.join(ASSETS_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;
    
    // Check root of category
    const rootFile = path.join(categoryDir, fileName);
    if (fs.existsSync(rootFile)) {
      return `/assets/${category}/${fileName}`;
    }
    
    // Check subdirectories
    const subdirs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const subdir of subdirs) {
      const subdirFile = path.join(categoryDir, subdir, fileName);
      if (fs.existsSync(subdirFile)) {
        return `/assets/${category}/${subdir}/${fileName}`;
      }
    }
  }
  
  return null;
}

async function updateAllMediaPaths() {
  try {
    console.log('Updating all Media records from /uploads/images/ to /assets/...\n');

    const { Op } = require('sequelize');
    const mediaRecords = await Media.findAll({
      where: {
        filePath: {
          [Op.like]: '/uploads/images/%'
        }
      }
    });

    let updated = 0;
    let notFound = 0;
    let skipped = 0;

    for (const media of mediaRecords) {
      const oldPath = media.filePath;
      
      // Check direct mapping first
      let newPath = DIRECT_MAPPING[oldPath];
      
      // If no direct mapping, try to find file by name
      if (!newPath) {
        const fileName = oldPath.split('/').pop();
        newPath = findFileInAssets(fileName);
      }
      
      if (!newPath) {
        console.log(`  ⚠️  Not found: ${oldPath}`);
        notFound++;
        continue;
      }
      
      // Check if new path already exists in Media table
      const existing = await Media.findOne({
        where: { filePath: newPath }
      });
      
      if (existing && existing.id !== media.id) {
        console.log(`  ⏭️  Skipped (duplicate): ${oldPath}`);
        console.log(`     → Already exists as Media ID ${existing.id}`);
        skipped++;
        continue;
      }
      
      // Update the media record
      await media.update({
        filePath: newPath,
        fileName: newPath.split('/').pop() || media.fileName
      });
      
      console.log(`  ✅ Updated: ${media.id}`);
      console.log(`     ${oldPath}`);
      console.log(`     → ${newPath}\n`);
      updated++;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Update Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped (duplicate): ${skipped}`);
    console.log(`⚠️  Not found: ${notFound}`);
    console.log(`📊 Total records: ${mediaRecords.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating media paths:', error);
    process.exit(1);
  }
}

// Run the script
updateAllMediaPaths();

