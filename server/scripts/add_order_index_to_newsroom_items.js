const { sequelize } = require('../models');

async function addOrderIndexToNewsroomItems() {
  try {
    console.log('Adding order_index column to newsroom_items table...');

    // Check if column already exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'newsroom_items' 
      AND COLUMN_NAME = 'order_index'
    `);

    if (results.length === 0) {
      await sequelize.query(`
        ALTER TABLE newsroom_items
        ADD COLUMN order_index INT NOT NULL DEFAULT 0 AFTER logo;
      `);
      console.log('✓ Added order_index column to newsroom_items');
    } else {
      console.log('⊘ order_index column already exists on newsroom_items');
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error adding order_index to newsroom_items:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  addOrderIndexToNewsroomItems()
    .then(() => {
      console.log('add_order_index_to_newsroom_items completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}


