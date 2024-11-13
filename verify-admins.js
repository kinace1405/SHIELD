// verify-admins.js
const Database = require("@replit/database");
const db = new Database();

async function verifyAdminUsers() {
  try {
    // List all keys
    console.log('\n=== Database Keys ===');
    const keys = await db.list();
    console.log(keys);

    // Check for both admin users
    const adminKeys = ['senator:user:admin', 'senator:user:admin1'];

    for (const key of adminKeys) {
      const userData = await db.get(key);
      console.log(`\n=== Checking ${key} ===`);
      if (userData) {
        console.log('User found:', {
          username: userData.username,
          email: userData.email,
          subscriptionTier: userData.subscriptionTier,
          isAdmin: userData.isAdmin,
          hasPassword: !!userData.password,
          createdAt: userData.createdAt
        });
      } else {
        console.log('User not found');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

verifyAdminUsers();