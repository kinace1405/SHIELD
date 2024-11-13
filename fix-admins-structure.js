// fix-admins-structure.js
const Database = require("@replit/database");
const bcrypt = require('bcryptjs');
const db = new Database();

async function fixAdminStructure() {
  try {
    console.log('Starting admin users fix...');

    // First, let's see what we have
    const keys = await db.list();
    console.log('\nCurrent keys:', keys);

    // Create admin (Dean)
    const adminPassword = await bcrypt.hash('DGS-Admin24', 10);
    const admin = {
      username: 'admin',
      email: 'dean@senatorsafety.co.uk',
      password: adminPassword,
      subscriptionTier: 'emperor',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };

    // Create admin1
    const admin1Password = await bcrypt.hash('Admin123!', 10);
    const admin1 = {
      username: 'admin1',
      email: 'admin@senatorsafety.co.uk',
      password: admin1Password,
      subscriptionTier: 'emperor',
      isAdmin: true,
      createdAt: '2024-10-29T12:24:44.366Z' // Keeping original creation date
    };

    // Store with correct keys
    await db.set('senator:user:admin', admin);
    await db.set('senator:user:admin1', admin1);

    // Clean up old keys
    for (const key of keys) {
      if (key !== 'senator:user:admin' && key !== 'senator:user:admin1') {
        await db.delete(key);
        console.log(`Deleted old key: ${key}`);
      }
    }

    // Verify the fix
    const verifyAdmin = await db.get('senator:user:admin');
    const verifyAdmin1 = await db.get('senator:user:admin1');

    console.log('\nVerifying admin users:');
    console.log('\nAdmin user:', {
      ...verifyAdmin,
      password: '[HIDDEN]'
    });
    console.log('\nAdmin1 user:', {
      ...verifyAdmin1,
      password: '[HIDDEN]'
    });

    console.log('\nFix completed successfully!');
    console.log('\nYou can now log in with either:');
    console.log('1. Username: admin, Password: DGS-Admin24');
    console.log('2. Username: admin1, Password: Admin123!');

  } catch (error) {
    console.error('Error fixing admin structure:', error);
  }
}

// Run the fix
fixAdminStructure()
  .then(() => console.log('\nScript completed'))
  .catch(error => console.error('\nScript failed:', error));