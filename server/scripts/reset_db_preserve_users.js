const { sequelize } = require('../models');

async function resetDb() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connection established.');

        console.log('Disabling Foreign Key Checks...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

        const [tables] = await sequelize.query('SHOW TABLES');

        if (tables.length === 0) {
            console.log('No tables found in database.');
        } else {
            for (const tableObj of tables) {
                const tableName = Object.values(tableObj)[0];

                // Preservation List (Case insensitive check)
                // Users: Admin accounts
                // SequelizeMeta: Migrations (though we sync, good to keep)
                // Sessions: If used
                if (['users', 'sequelizemeta', 'sessions'].includes(tableName.toLowerCase())) {
                    console.log(`Skipping table: ${tableName}`);
                    continue;
                }

                console.log(`Truncating table: ${tableName}`);
                try {
                    await sequelize.query(`TRUNCATE TABLE \`${tableName}\``);
                } catch (err) {
                    console.error(`Failed to truncate ${tableName}: ${err.message}`);
                    // If truncate fails (e.g. view), try delete? No, views can't be truncated.
                }
            }
        }

        console.log('Re-enabling Foreign Key Checks...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

        console.log('Database reset complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
}

resetDb();
