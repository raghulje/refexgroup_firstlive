/**
 * Migration script to add bannerId column to sdg_cards table
 * Run this script once to add the bannerId column to existing database
 */

require("dotenv").config();
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

async function addBannerIdColumn() {
  try {
    console.log('Adding bannerId column to sdg_cards table...');
    
    // Check if column already exists
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sdg_cards' 
      AND column_name = 'banner_id'
    `);
    
    if (results.length > 0) {
      console.log('Column banner_id already exists. Skipping migration.');
      return;
    }
    
    // Add the bannerId column
    await sequelize.query(`
      ALTER TABLE sdg_cards 
      ADD COLUMN banner_id INTEGER,
      ADD CONSTRAINT fk_sdg_cards_banner 
      FOREIGN KEY (banner_id) 
      REFERENCES media(id) 
      ON DELETE SET NULL
    `);
    
    console.log('✅ Successfully added banner_id column to sdg_cards table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding banner_id column:', error);
    process.exit(1);
  }
}

// Run the migration
addBannerIdColumn();

