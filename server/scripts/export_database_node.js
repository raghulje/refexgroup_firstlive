const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('../config/config.json');

/**
 * Export MySQL database using Node.js (no mysqldump required)
 * Usage: node server/scripts/export_database_node.js
 */
async function exportDatabase() {
  const env = process.env.NODE_ENV || 'development';
  const dbConfig = config[env];
  
  const {
    database,
    username,
    password,
    host,
    port = 3306
  } = dbConfig;

  if (!database || !username || !password) {
    console.error('❌ Database configuration not found or incomplete');
    process.exit(1);
  }

  // Create exports directory if it doesn't exist
  const exportsDir = path.join(__dirname, '../../database_exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                    new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  const filename = `refex_db_${timestamp}.sql`;
  const filepath = path.join(exportsDir, filename);

  console.log('📦 Exporting database using Node.js...');
  console.log(`   Database: ${database}`);
  console.log(`   Host: ${host}:${port}`);
  console.log(`   Output: ${filepath}`);

  let connection;
  let sqlContent = '';

  try {
    // Connect to database
    connection = await mysql.createConnection({
      host,
      port,
      user: username,
      password,
      database,
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Get all tables
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [database]);

    console.log(`   Found ${tables.length} tables`);

    // Add header
    sqlContent += `-- MySQL dump for ${database}\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
    sqlContent += `-- Database: ${database}\n\n`;
    sqlContent += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
    sqlContent += `SET time_zone = "+00:00";\n\n`;
    sqlContent += `/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n`;
    sqlContent += `/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\n`;
    sqlContent += `/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\n`;
    sqlContent += `/*!40101 SET NAMES utf8mb4 */;\n\n`;

    // Disable foreign key checks
    sqlContent += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // Export each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`   Exporting table: ${tableName}`);

      // Get table structure
      const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      sqlContent += `-- Table structure for ${tableName}\n`;
      sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      sqlContent += createTable[0]['Create Table'] + ';\n\n';

      // Get table data
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      
      if (rows.length > 0) {
        sqlContent += `-- Data for table ${tableName}\n`;
        sqlContent += `LOCK TABLES \`${tableName}\` WRITE;\n`;
        sqlContent += `/*!40000 ALTER TABLE \`${tableName}\` DISABLE KEYS */;\n`;

        // Insert statements
        for (const row of rows) {
          const columns = Object.keys(row).map(col => `\`${col}\``).join(', ');
          const values = Object.values(row).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'string') {
              return `'${val.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
            }
            return val;
          }).join(', ');
          
          sqlContent += `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});\n`;
        }

        sqlContent += `/*!40000 ALTER TABLE \`${tableName}\` ENABLE KEYS */;\n`;
        sqlContent += `UNLOCK TABLES;\n\n`;
      }
    }

    // Re-enable foreign key checks
    sqlContent += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;

    // Add footer
    sqlContent += `/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n`;
    sqlContent += `/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n`;
    sqlContent += `/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n`;

    // Write to file
    fs.writeFileSync(filepath, sqlContent, 'utf8');

    const stats = fs.statSync(filepath);
    console.log('✅ Database exported successfully!');
    console.log(`   File: ${filepath}`);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Also create a latest.sql copy
    const latestPath = path.join(exportsDir, 'refex_db_latest.sql');
    fs.copyFileSync(filepath, latestPath);
    console.log(`   Latest copy: ${latestPath}`);

  } catch (error) {
    console.error('❌ Error exporting database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run export
exportDatabase().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

