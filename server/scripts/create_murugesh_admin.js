const { User } = require('../models');
const { hashPassword } = require('../utils/password');

async function createSuperAdmin() {
    try {
        console.log('Creating super admin user...\n');

        const email = 'murugesh.k@refex.co.in';
        const username = 'murugesh.k';
        const password = 'RefexAdmin@123';

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            console.log('❌ User with this email already exists!');
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Username: ${existingUser.username}`);
            console.log(`   Role: ${existingUser.role}`);
            console.log('\nIf you want to update this user, delete it first or use a different email.');
            process.exit(1);
        }

        // Hash the password
        const passwordHash = await hashPassword(password);

        // Create the super admin user
        const newUser = await User.create({
            username: username,
            email: email,
            passwordHash: passwordHash,
            role: 'Super Admin',
            isActive: true,
            failedLoginAttempts: 0,
            accountLockedUntil: null
        });

        console.log('✅ Super Admin user created successfully!\n');
        console.log('═'.repeat(60));
        console.log('📋 User Details:');
        console.log('═'.repeat(60));
        console.log(`   ID: ${newUser.id}`);
        console.log(`   Username: ${newUser.username}`);
        console.log(`   Email: ${newUser.email}`);
        console.log(`   Role: ${newUser.role}`);
        console.log(`   Status: ${newUser.isActive ? 'Active' : 'Inactive'}`);
        console.log('═'.repeat(60));
        console.log('\n🔐 Login Credentials:');
        console.log('═'.repeat(60));
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('═'.repeat(60));
        console.log('\n⚠️  IMPORTANT:');
        console.log('   - This user has Super Admin privileges');
        console.log('   - Full access to all CMS features');
        console.log('   - Can manage other users and permissions');
        console.log('   - Keep credentials secure!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin user:', error);
        console.error('\nDetails:', error.message);
        if (error.errors) {
            console.error('Validation errors:');
            error.errors.forEach(err => {
                console.error(`  - ${err.path}: ${err.message}`);
            });
        }
        process.exit(1);
    }
}

createSuperAdmin();
