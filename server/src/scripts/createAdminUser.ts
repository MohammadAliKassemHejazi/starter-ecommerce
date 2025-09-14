import bcrypt from 'bcrypt';
import db from '../models';

const createAdminUser = async () => {
  try {
    console.log('Creating default admin user...');

    // Check if admin user already exists
    const existingAdmin = await db.User.findOne({
      where: { email: 'admin@admin.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create admin user
    const adminUser = await db.User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    // Create default permissions
    const defaultPermissions = [
      'view_users', 'create_users', 'edit_users', 'delete_users',
      'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
      'view_permissions', 'create_permissions', 'edit_permissions', 'delete_permissions',
      'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
      'view_products', 'create_products', 'edit_products', 'delete_products',
      'view_orders', 'create_orders', 'edit_orders', 'delete_orders',
      'view_promotions', 'create_promotions', 'edit_promotions', 'delete_promotions',
      'view_analytics', 'view_audit_logs', 'manage_packages', 'manage_shipping',
      'manage_sizes', 'manage_taxes', 'manage_returns', 'manage_translations'
    ];

    // Create permissions
    for (const permissionName of defaultPermissions) {
      await db.Permission.findOrCreate({
        where: { name: permissionName },
        defaults: { name: permissionName, description: `Permission to ${permissionName.replace('_', ' ')}` }
      });
    }

    // Create admin role
    const adminRole = await db.Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { 
        name: 'admin', 
        description: 'Administrator role with full access',
        isActive: true
      }
    });

    // Assign all permissions to admin role
    const allPermissions = await db.Permission.findAll();
    await adminRole[0].setPermissions(allPermissions);

    // Assign admin role to admin user
    await adminUser.setRoles([adminRole[0]]);

    console.log('Default admin user setup completed successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

export default createAdminUser;
