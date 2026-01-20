const { Media } = require('../models');
const fs = require('fs');
const path = require('path');

// Source directory for SVGs (in src/pages/svg)
const SVG_SOURCE_DIR = path.join(__dirname, '../../new_client/src/pages/svg');
// Destination directory for SVGs (in public/svg) - for serving via URL
const SVG_PUBLIC_DIR = path.join(__dirname, '../../new_client/public/svg');

// Ensure public/svg directory exists
if (!fs.existsSync(SVG_PUBLIC_DIR)) {
  fs.mkdirSync(SVG_PUBLIC_DIR, { recursive: true });
}

// Recursively get all SVG files from a directory
function getAllSVGFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);

    if (item.isDirectory()) {
      // Recursively get files from subdirectories
      files.push(...getAllSVGFiles(fullPath, relativePath));
    } else if (item.isFile() && item.name.toLowerCase().endsWith('.svg')) {
      files.push({
        fullPath,
        relativePath,
        fileName: item.name,
        category: basePath || 'root'
      });
    }
  }

  return files;
}

// Copy SVG file to public directory
function copySVGToPublic(sourcePath, destPath) {
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(sourcePath, destPath);
}

async function seedSVGFiles() {
  try {
    console.log('Seeding SVG files to Media table...\n');

    if (!fs.existsSync(SVG_SOURCE_DIR)) {
      console.error(`SVG source directory not found: ${SVG_SOURCE_DIR}`);
      return;
    }

    // Get all SVG files
    const svgFiles = getAllSVGFiles(SVG_SOURCE_DIR);
    console.log(`Found ${svgFiles.length} SVG files\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const svgFile of svgFiles) {
      try {
        // Create public path: /svg/category/filename.svg
        const publicPath = `/svg/${svgFile.relativePath.replace(/\\/g, '/')}`;
        const publicFilePath = path.join(SVG_PUBLIC_DIR, svgFile.relativePath);

        // Copy SVG to public directory if it doesn't exist
        if (!fs.existsSync(publicFilePath)) {
          copySVGToPublic(svgFile.fullPath, publicFilePath);
          console.log(`✓ Copied: ${svgFile.relativePath}`);
        }

        // Check if already exists in database
        const existing = await Media.findOne({
          where: { filePath: publicPath }
        });

        if (existing) {
          console.log(`⊘ Skipped (exists): ${svgFile.fileName}`);
          skipped++;
          continue;
        }

        // Create Media record - store SVGs with fileType 'svg'
        await Media.create({
          fileName: svgFile.fileName,
          filePath: publicPath,
          fileType: 'svg',
          altText: svgFile.fileName.replace('.svg', '').replace(/[-_]/g, ' ')
        });

        console.log(`✓ Created: ${svgFile.fileName} -> ${publicPath}`);
        created++;
      } catch (error) {
        console.error(`✗ Error processing ${svgFile.fileName}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Total SVGs found: ${svgFiles.length}`);
    console.log(`Created: ${created}`);
    console.log(`Skipped (already exists): ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('\n✓ SVG seeding completed!');
  } catch (error) {
    console.error('Error seeding SVG files:', error);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  seedSVGFiles()
    .then(() => {
      console.log('\nDone!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedSVGFiles };

