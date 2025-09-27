import { seedAll } from './scriptseedall';
import db from '../models';

const runScripts = async () => {
  try {
    console.log('Starting database scripts...');
    

    // Run main seed data script (contains all logic)
    await seedAll();

    console.log('All scripts completed successfully!');
  } catch (error) {
    console.error('Error running scripts:', error);
    throw error; // Re-throw error instead of exiting
  }
};

// Run if this file is executed directly
if (require.main === module) {
  runScripts();
}

export default runScripts;
