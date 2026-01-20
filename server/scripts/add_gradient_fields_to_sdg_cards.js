/**
 * Migration script to add gradient fields to sdg_cards table
 * Run this script once to add the gradient columns to existing database
 */

require("dotenv").config();
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

async function addGradientFields() {
  try {
    console.log('Adding gradient fields to sdg_cards table...');
    
    // Check and add gradientColor column
    const [gradientColorCheck] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sdg_cards' 
      AND column_name = 'gradient_color'
    `);
    
    if (gradientColorCheck.length === 0) {
      await sequelize.query(`
        ALTER TABLE sdg_cards 
        ADD COLUMN gradient_color VARCHAR(255) NULL
      `);
      console.log('✓ Added gradient_color column');
    } else {
      console.log('Column gradient_color already exists. Skipping.');
    }

    // Check and add gradientStartPosition column
    const [gradientStartCheck] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sdg_cards' 
      AND column_name = 'gradient_start_position'
    `);
    
    if (gradientStartCheck.length === 0) {
      await sequelize.query(`
        ALTER TABLE sdg_cards 
        ADD COLUMN gradient_start_position FLOAT NULL
      `);
      console.log('✓ Added gradient_start_position column');
    } else {
      console.log('Column gradient_start_position already exists. Skipping.');
    }

    // Check and add gradientEndPosition column
    const [gradientEndCheck] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sdg_cards' 
      AND column_name = 'gradient_end_position'
    `);
    
    if (gradientEndCheck.length === 0) {
      await sequelize.query(`
        ALTER TABLE sdg_cards 
        ADD COLUMN gradient_end_position FLOAT NULL
      `);
      console.log('✓ Added gradient_end_position column');
    } else {
      console.log('Column gradient_end_position already exists. Skipping.');
    }

    // Check and add gradientDirection column
    const [gradientDirectionCheck] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sdg_cards' 
      AND column_name = 'gradient_direction'
    `);
    
    if (gradientDirectionCheck.length === 0) {
      await sequelize.query(`
        ALTER TABLE sdg_cards 
        ADD COLUMN gradient_direction FLOAT NULL
      `);
      console.log('✓ Added gradient_direction column');
    } else {
      console.log('Column gradient_direction already exists. Skipping.');
    }
    
    console.log('✅ Successfully added all gradient fields to sdg_cards table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding gradient fields:', error);
    process.exit(1);
  }
}

// Run the migration
addGradientFields();

