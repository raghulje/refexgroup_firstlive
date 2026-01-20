/**
 * Migration script to add draft/publish workflow fields to content models
 * Run this once to add status, publishedAt, and scheduledPublishAt fields
 */

const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

async function addDraftPublishFields() {
  try {
    console.log('Adding draft/publish workflow fields...');

    // List of tables that need draft/publish fields
    const tables = [
      'section_contents',
      'hero_slides',
      'business_cards',
      'awards',
      'newsroom_items',
      'gallery_albums',
      'gallery_events',
      'gallery_images',
      'leaders',
      'testimonials',
      'jobs',
      'home_video_sections',
      'home_about_sections',
      'home_careers_sections',
      'home_cta_sections',
      'core_values',
      'sdg_cards',
    ];

    for (const table of tables) {
      try {
        // Check if status column exists
        const [columns] = await sequelize.query(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = '${table}' 
          AND COLUMN_NAME = 'status'
        `);

        if (columns.length === 0) {
          // Add status column
          await sequelize.query(`
            ALTER TABLE \`${table}\` 
            ADD COLUMN \`status\` ENUM('draft', 'published', 'scheduled') 
            DEFAULT 'draft' AFTER \`is_active\`
          `);
          console.log(`✓ Added status column to ${table}`);
        } else {
          console.log(`- status column already exists in ${table}`);
        }

        // Check if published_at column exists
        const [publishedColumns] = await sequelize.query(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = '${table}' 
          AND COLUMN_NAME = 'published_at'
        `);

        if (publishedColumns.length === 0) {
          // Add published_at column
          await sequelize.query(`
            ALTER TABLE \`${table}\` 
            ADD COLUMN \`published_at\` DATETIME NULL AFTER \`status\`
          `);
          console.log(`✓ Added published_at column to ${table}`);
        } else {
          console.log(`- published_at column already exists in ${table}`);
        }

        // Check if scheduled_publish_at column exists
        const [scheduledColumns] = await sequelize.query(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = '${table}' 
          AND COLUMN_NAME = 'scheduled_publish_at'
        `);

        if (scheduledColumns.length === 0) {
          // Add scheduled_publish_at column
          await sequelize.query(`
            ALTER TABLE \`${table}\` 
            ADD COLUMN \`scheduled_publish_at\` DATETIME NULL AFTER \`published_at\`
          `);
          console.log(`✓ Added scheduled_publish_at column to ${table}`);
        } else {
          console.log(`- scheduled_publish_at column already exists in ${table}`);
        }

        // Update existing records: if isActive is true, set status to 'published'
        await sequelize.query(`
          UPDATE \`${table}\` 
          SET \`status\` = 'published', \`published_at\` = NOW() 
          WHERE \`is_active\` = 1 AND \`status\` = 'draft'
        `);
        console.log(`✓ Updated existing records in ${table}`);

      } catch (error) {
        console.error(`Error processing ${table}:`, error.message);
      }
    }

    console.log('\n✅ Draft/publish fields added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addDraftPublishFields();

