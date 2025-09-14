import createAdminUser from './createAdminUser';
import { assignAdminRole } from './assignAdminRole';
import db from '../models';

const runScripts = async () => {
  try {
    console.log('Starting database scripts...');
    
    // Sync database
    await db.sequelize.sync({ force: false });
    console.log('Database synced successfully');

    // Create admin user
    await createAdminUser();

    // Assign admin role to admin user
    await assignAdminRole();

    console.log('All scripts completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running scripts:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  runScripts();
}

export default runScripts;
