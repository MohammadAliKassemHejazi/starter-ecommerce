import { seedData } from './seedData';
import db from '../models';

const runScripts = async () => {
  try {
    console.log('Starting database scripts...');

    // Sync database: creates missing tables. Intentionally NOT using
    // { alter: true } / { force: true } — those mutate/drop existing
    // schema and are unsafe to run unattended against a shared DB.
    await db.sequelize.sync();

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
