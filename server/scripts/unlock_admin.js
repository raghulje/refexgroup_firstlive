const { User } = require('../models');

async function unlockAdminAccount() {
    try {
        console.log('Unlocking admin account...');

        // Find admin user
        const admin = await User.findOne({
            where: { email: 'admin@refex.com' }
        });

        if (!admin) {
            console.log('❌ Admin user not found!');
            console.log('Run: node scripts/seed_default_user.js to create admin user');
            process.exit(1);
        }

        // Reset failed login attempts and unlock
        await admin.update({
            failedLoginAttempts: 0,
            accountLockedUntil: null
        });

        console.log('✅ Admin account unlocked successfully!');
        console.log('');
        console.log('Login credentials:');
        console.log('  Email: admin@refex.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('⚠️  IMPORTANT: Change the default password after login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error unlocking admin account:', error);
        process.exit(1);
    }
}

unlockAdminAccount();
