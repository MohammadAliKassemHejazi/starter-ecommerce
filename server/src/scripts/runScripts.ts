import { seedData } from './seedData';
import db from '../models';

const runScripts = async () => {
  try {
    console.log('Starting database scripts...');
    
    // Sync database (optional: { force: true } will drop tables)
    // await db.sequelize.sync({ alter: true });

    // Run main seed data script (contains all logic)
    await seedData();

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
