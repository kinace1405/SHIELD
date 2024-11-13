// create-admin.js
const Database = require("@replit/database");
const bcrypt = require('bcryptjs');

const db = new Database();

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.get('senator:user:admin');

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const adminUser = {
      username: 'admin1',
      email: 'admin@senatorsafety.co.uk',
      password: hashedPassword,
      subscriptionTier: 'emperor',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };

    await db.set('senator:user:admin', adminUser);
    console.log('Admin user created successfully');

    // Verify the user was created
    const verifyAdmin = await db.get('senator:user:admin');
    console.log('Created admin user:', {
      ...verifyAdmin,
      password: '[HIDDEN]'
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();