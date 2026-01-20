require("dotenv").config();
const db = require("../models");
const { sequelize } = db;

async function migrateGlobalSettings() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Check if key column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'global_settings' 
      AND COLUMN_NAME = 'key'
    `);

    if (results.length === 0) {
      console.log("Migrating global_settings table to key-value structure...");
      
      // Add new columns (without PRIMARY KEY since table may already have one)
      await sequelize.query(`
        ALTER TABLE global_settings 
        ADD COLUMN \`key\` VARCHAR(255) UNIQUE FIRST,
        ADD COLUMN \`value\` TEXT,
        ADD COLUMN \`value_type\` VARCHAR(50) DEFAULT 'string',
        ADD COLUMN \`description\` TEXT
      `);
      
      console.log("✅ Added key-value columns to global_settings table");
    } else {
      console.log("✅ Key column already exists, skipping migration");
    }

    // Note: We're not dropping old columns to preserve existing data
    // Old columns (phone_main, email_main, etc.) can coexist with new key-value structure

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 The global_settings table now supports key-value pairs.");
    console.log("   Old columns are preserved for backward compatibility.");

  } catch (error) {
    console.error("Error migrating global_settings:", error);
    
    // If column already exists or other error, provide helpful message
    if (error.message.includes('Duplicate column') || error.message.includes('already exists')) {
      console.log("\n⚠️  Some columns may already exist. Checking individual columns...");
      
      // Check and add columns individually
      const columnsToAdd = [
        { name: 'key', sql: 'ADD COLUMN `key` VARCHAR(255) UNIQUE FIRST' },
        { name: 'value', sql: 'ADD COLUMN `value` TEXT' },
        { name: 'value_type', sql: "ADD COLUMN `value_type` VARCHAR(50) DEFAULT 'string'" },
        { name: 'description', sql: 'ADD COLUMN `description` TEXT' }
      ];
      
      for (const col of columnsToAdd) {
        try {
          const [colCheck] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'global_settings' 
            AND COLUMN_NAME = '${col.name}'
          `);
          
          if (colCheck.length === 0) {
            await sequelize.query(`ALTER TABLE global_settings ${col.sql}`);
            console.log(`✅ Added column: ${col.name}`);
          } else {
            console.log(`⏭️  Column ${col.name} already exists, skipping`);
          }
        } catch (colError) {
          if (!colError.message.includes('Duplicate column')) {
            console.error(`Error adding column ${col.name}:`, colError.message);
          }
        }
      }
      
      console.log("\n✅ Migration completed (some columns may have already existed)");
    } else {
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

migrateGlobalSettings();

