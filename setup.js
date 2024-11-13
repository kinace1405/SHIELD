const Database = require("@replit/database");
const bcrypt = require('bcryptjs');

const db = new Database();

async function createInitialUser() {
  try {
    // First, check if user already exists
    const existingUser = await db.get('user:admin');
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create the admin user
    const hashedPassword = await bcrypt.hash('DGS-Admin24', 10);

    const userData = {
      username: 'admin',
      email: 'dean@senatorsafety.co.uk',
      password: hashedPassword,
      subscriptionTier: 'emperor',
      createdAt: new Date().toISOString(),
      isAdmin: true
    };

    await db.set('user:admin', userData);
    console.log('Admin user created successfully');

    // Verify the user was created
    const verifyUser = await db.get('user:admin');
    console.log('Created user data:', {
      ...verifyUser,
      password: '[HIDDEN]' // Don't log the actual password
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createInitialUser()
  .then(() => console.log('Setup complete'))
  .catch(console.error);