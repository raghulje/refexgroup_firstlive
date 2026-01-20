const { sequelize } = require('../models');

async function addPageSectionToMedia() {
  try {
    console.log('Adding page_name and section_name columns to media table...');

    // Check if columns already exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'media' 
      AND COLUMN_NAME IN ('page_name', 'section_name')
    `);

    const existingColumns = results.map(r => r.COLUMN_NAME);

    // Add page_name column if it doesn't exist
    if (!existingColumns.includes('page_name')) {
      await sequelize.query(`
        ALTER TABLE media 
        ADD COLUMN page_name VARCHAR(255) NULL COMMENT 'Page name for organization (e.g., home, about, business)' AFTER alt_text
      `);
      console.log('✓ Added page_name column');
    } else {
      console.log('⊘ page_name column already exists');
    }

    // Add section_name column if it doesn't exist
    if (!existingColumns.includes('section_name')) {
      await sequelize.query(`
        ALTER TABLE media 
        ADD COLUMN section_name VARCHAR(255) NULL COMMENT 'Section name for organization (e.g., hero, about, awards)' AFTER page_name
      `);
      console.log('✓ Added section_name column');
    } else {
      console.log('⊘ section_name column already exists');
    }

    // Add indexes for better query performance
    try {
      await sequelize.query(`
        CREATE INDEX idx_media_page_section ON media(page_name, section_name)
      `);
      console.log('✓ Added index on page_name and section_name');
    } catch (e) {
      if (e.message.includes('Duplicate key')) {
        console.log('⊘ Index already exists');
      } else {
        throw e;
      }
    }

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('Error adding page/section columns:', error.message || error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  addPageSectionToMedia()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addPageSectionToMedia;

