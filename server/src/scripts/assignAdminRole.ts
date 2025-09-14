import db from '../models';
import { userService } from '../services';

export const assignAdminRole = async (): Promise<void> => {
  try {
    console.log('🔍 Looking for admin user...');
    
    // Find admin user
    const adminUser = await db.User.findOne({
      where: { email: 'admin@admin.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Please create admin user first.');
      return;
    }

    // Find or create admin role
    let adminRole = await db.Role.findOne({
      where: { name: 'admin' }
    });

    if (!adminRole) {
      console.log('📝 Creating admin role...');
      adminRole = await db.Role.create({ name: 'admin' });
      console.log('✅ Admin role created');
    }

    // Check if admin user already has admin role
    const existingRoleUser = await db.RoleUser.findOne({
      where: { 
        userId: adminUser.id,
        roleId: adminRole.id 
      }
    });

    if (existingRoleUser) {
      console.log('✅ Admin user already has admin role');
      return;
    }

    // Assign admin role to admin user
    await db.RoleUser.create({
      userId: adminUser.id,
      roleId: adminRole.id
    });

    console.log('✅ Admin role assigned to admin user successfully');
    
  } catch (error) {
    console.error('❌ Error assigning admin role:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  assignAdminRole()
    .then(() => {
      console.log('🎉 Admin role assignment completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin role assignment failed:', error);
      process.exit(1);
    });
}
