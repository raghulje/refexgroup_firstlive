/**
 * Migration script to add careersEmail and contactEmail columns to email_settings table
 * Run this once to add the new email fields for separate form submissions
 */

const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

async function addEmailSettingsColumns() {
  try {
    console.log('Adding careersEmail and contactEmail columns to email_settings table...');

    const tableName = 'email_settings';

    // Check if careersEmail column exists (check both camelCase and snake_case)
    const [careersColumns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tableName}' 
      AND (COLUMN_NAME = 'careersEmail' OR COLUMN_NAME = 'careers_email')
    `);

    if (careersColumns.length === 0) {
      // Add careersEmail column (using snake_case to match database convention)
      await sequelize.query(`
        ALTER TABLE \`${tableName}\` 
        ADD COLUMN \`careers_email\` VARCHAR(255) NULL 
        COMMENT 'Email address to receive careers form submissions' 
        AFTER \`receiving_email\`
      `);
      console.log(`✓ Added careers_email column to ${tableName}`);
    } else {
      console.log(`- careers_email column already exists in ${tableName}`);
    }

    // Check if contactEmail column exists (check both camelCase and snake_case)
    const [contactColumns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tableName}' 
      AND (COLUMN_NAME = 'contactEmail' OR COLUMN_NAME = 'contact_email')
    `);

    if (contactColumns.length === 0) {
      // Add contactEmail column (using snake_case to match database convention)
      await sequelize.query(`
        ALTER TABLE \`${tableName}\` 
        ADD COLUMN \`contact_email\` VARCHAR(255) NULL 
        COMMENT 'Email address to receive contact form submissions' 
        AFTER \`careers_email\`
      `);
      console.log(`✓ Added contact_email column to ${tableName}`);
    } else {
      console.log(`- contact_email column already exists in ${tableName}`);
    }

    console.log('\n✅ Email settings columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addEmailSettingsColumns();

