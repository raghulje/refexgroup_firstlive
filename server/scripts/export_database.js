const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('../config/config.json');

/**
 * Export MySQL database to SQL file
 * Usage: node server/scripts/export_database.js
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

  console.log('📦 Exporting database...');
  console.log(`   Database: ${database}`);
  console.log(`   Host: ${host}:${port}`);
  console.log(`   Output: ${filepath}`);

  // Build mysqldump command
  // Note: On Windows, you might need to use full path to mysqldump
  // or add MySQL bin directory to PATH
  const command = `mysqldump -h ${host} -P ${port} -u ${username} -p${password} ${database} > "${filepath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error exporting database:');
      console.error(error.message);
      
      // Try alternative method for Windows (using full path)
      if (process.platform === 'win32') {
        console.log('\n⚠️  Trying alternative method for Windows...');
        console.log('   Please ensure MySQL is installed and mysqldump is in your PATH');
        console.log('   Or use MySQL Workbench to export the database manually');
        console.log('\n   Manual export command:');
        console.log(`   mysqldump -h ${host} -P ${port} -u ${username} -p ${database} > "${filepath}"`);
      }
      process.exit(1);
    }

    if (stderr && !stderr.includes('Warning')) {
      console.error('⚠️  Warning:', stderr);
    }

    // Check if file was created and has content
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 0) {
        console.log('✅ Database exported successfully!');
        console.log(`   File: ${filepath}`);
        console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
        // Also create a latest.sql symlink/copy
        const latestPath = path.join(exportsDir, 'refex_db_latest.sql');
        fs.copyFileSync(filepath, latestPath);
        console.log(`   Latest copy: ${latestPath}`);
      } else {
        console.error('❌ Export file is empty. Check database connection and credentials.');
        process.exit(1);
      }
    } else {
      console.error('❌ Export file was not created. Check permissions and MySQL installation.');
      process.exit(1);
    }
  });
}

// Run export
exportDatabase().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

