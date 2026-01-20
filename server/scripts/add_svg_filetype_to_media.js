const { sequelize } = require('../models');

async function addSvgFileTypeToMedia() {
  try {
    console.log('Updating media.file_type enum to include "svg"...');

    // Adjust this SQL if your table/column names differ
    await sequelize.query(`
      ALTER TABLE media
      MODIFY COLUMN file_type ENUM('image', 'video', 'icon', 'logo', 'document', 'svg') NOT NULL DEFAULT 'image';
    `);

    console.log('✓ media.file_type enum updated successfully.');
  } catch (error) {
    console.error('Error updating media.file_type enum:', error.message || error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  addSvgFileTypeToMedia()
    .then(() => {
      console.log('Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal error running migration:', err);
      process.exit(1);
    });
}

module.exports = { addSvgFileTypeToMedia };


