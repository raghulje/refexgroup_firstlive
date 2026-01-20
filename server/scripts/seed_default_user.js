const { User } = require('../models');
const { hashPassword } = require('../utils/password');

async function seedDefaultUser() {
  try {
    console.log('Seeding default admin user...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seed.');
      return;
    }

    // Create default admin user
    const passwordHash = await hashPassword('admin123');
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@refex.com',
      passwordHash: passwordHash,
      role: 'Super Admin',
      isActive: true,
    });

    console.log('Default admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding default user:', error);
    process.exit(1);
  }
}

seedDefaultUser();

