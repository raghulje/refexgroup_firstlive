const { sequelize } = require('../models');

async function sync() {
    try {
        await sequelize.authenticate();
        console.log('Syncing...');
        await sequelize.sync({ alter: true });
        console.log('Synced.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
sync();
