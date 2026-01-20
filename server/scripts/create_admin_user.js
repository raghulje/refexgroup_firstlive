const { User } = require('../models');
const { hashPassword } = require('../utils/password');

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const username = 'admin';
    const email = 'admin@refex.com';
    const password = 'RefexAdmin2024!';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { username: username } });

    if (existingAdmin) {
      // Update the existing admin user with new password
      console.log('Admin user already exists. Updating password...');
      const passwordHash = await hashPassword(password);
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.email = email;
      existingAdmin.role = 'Super Admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      
      console.log('\n✅ Admin user password updated successfully!');
    } else {
      // Create new admin user with secure default password
      const passwordHash = await hashPassword(password);
      
      await User.create({
        username: username,
        email: email,
        passwordHash: passwordHash,
        role: 'Super Admin',
        isActive: true,
      });

      console.log('\n✅ Admin user created successfully!');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${email}`);
    console.log('Role: Super Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    console.log('You can update it in the User Management page.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.original) {
      console.error('Database error:', error.original.message);
    }
    process.exit(1);
  }
}

// Run the script
createAdminUser();

