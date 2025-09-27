// server/src/scripts/seedAll.ts
import db from '../models';
import bcrypt from 'bcrypt';
import { PERMISSIONS, ROLES } from './permissions'; // ✅ CORRECT PATH

const SALT_ROUNDS = 10;

export const seedAll = async () => {
  try {
    // 🔒 Safety check: ensure constants are loaded
    if (!ROLES || !PERMISSIONS) {
      throw new Error('❌ ROLES or PERMISSIONS is undefined. Check import path.');
    }

    console.log('🌱 Starting comprehensive seed...');

    // ========================
    // 1. Create Permissions
    // ========================
    const allPermNames = Object.values(PERMISSIONS);
    console.log(`🔐 Creating ${allPermNames.length} permissions...`);
    for (const name of allPermNames) {
      await db.Permission.findOrCreate({ where: { name }, defaults: { name } });
    }
    console.log(`✅ ${allPermNames.length} permissions created`);

    // ========================
    // 2. Create Roles
    // ========================
    const roleNames = Object.values(ROLES);
    console.log(`👑 Creating ${roleNames.length} roles...`);
    const roleMap: Record<string, any> = {};
    for (const name of roleNames) {
      const [role] = await db.Role.findOrCreate({ where: { name }, defaults: { name } });
      console.log(`  → Role: ${name} | ID: ${role.id}`);
      roleMap[name] = role;
    }
    console.log('✅ Roles created');

    // ========================
    // 3. Assign Permissions to Roles
    // ========================
    const allPerms = await db.Permission.findAll();
    console.log(`🔗 Assigning permissions to roles...`);

    // Super Admin: ALL permissions
    for (const p of allPerms) {
      await db.RolePermission.findOrCreate({
        where: { roleId: roleMap[ROLES.SUPER_ADMIN].dataValues.id, permissionId: p.dataValues.id },
        defaults: { roleId: roleMap[ROLES.SUPER_ADMIN].dataValues.id, permissionId: p.dataValues.id }
      });
    }
    console.log(`✅ Assigned ${allPerms.length} permissions to Super Admin`);

    // Admin: Most permissions (exclude super-only)
    const adminPerms = allPerms.filter((p: any) =>
      !p.dataValues.name.includes('manage_packages') &&
      !p.dataValues.name.includes('manage_translations')
    );
    for (const p of adminPerms) {
      await db.RolePermission.findOrCreate({
        where: { roleId: roleMap[ROLES.ADMIN].dataValues.id, permissionId: p.dataValues.id },
        defaults: { roleId: roleMap[ROLES.ADMIN].dataValues.id, permissionId: p.dataValues.id }
      });
    }
    console.log(`✅ Assigned ${adminPerms.length} permissions to Admin`);

    // Customer: Basic read/create on products, cart, orders, favorites, comments
    const customerPerms = allPerms.filter((p: any) =>
      (p.dataValues.name.startsWith('read_') || p.dataValues.name.startsWith('view_') || p.dataValues.name.startsWith('create_')) &&
      (p.dataValues.name.includes('product') || p.dataValues.name.includes('cart') || p.dataValues.name.includes('order') || p.dataValues.name.includes('favorite') || p.dataValues.name.includes('comment'))
    );
    for (const p of customerPerms) {
      await db.RolePermission.findOrCreate({
        where: { roleId: roleMap[ROLES.CUSTOMER].dataValues.id, permissionId: p.dataValues.id },
        defaults: { roleId: roleMap[ROLES.CUSTOMER].dataValues.id, permissionId: p.dataValues.id }
      });
    }
    console.log(`✅ Assigned ${customerPerms.length} permissions to Customer`);

    // ========================
    // 4. Create Users
    // ========================
    const hash = (pwd: string) => bcrypt.hash(pwd, SALT_ROUNDS);

    const [superAdmin] = await db.User.findOrCreate({
      where: { email: 'super@admin.com' },
      defaults: {
        name: 'Super Admin',
        email: 'super@admin.com',
        password: await hash('superpass123'),
        phone: '1111111111',
        address: 'Super HQ'
      }
    });

    const [admin] = await db.User.findOrCreate({
      where: { email: 'admin@store.com' },
      defaults: {
        name: 'Store Admin',
        email: 'admin@store.com',
        password: await hash('admin123'),
        phone: '2222222222',
        address: 'Admin St',
        createdById: superAdmin.id
      }
    });

    const [customer] = await db.User.findOrCreate({
      where: { email: 'customer@test.com' },
      defaults: {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: await hash('customer123'),
        phone: '3333333333',
        address: 'Customer Ave',
        createdById: admin.id
      }
    });
    console.log('✅ Users created');

    // ========================
    // 4. Assign Roles to Users
    // ========================
    // Assign roles
    await db.RoleUser.findOrCreate({
      where: { userId: superAdmin.id, roleId: roleMap[ROLES.SUPER_ADMIN].dataValues.id },
      defaults: { userId: superAdmin.id, roleId: roleMap[ROLES.SUPER_ADMIN].dataValues.id }
    });
    await db.RoleUser.findOrCreate({
      where: { userId: admin.id, roleId: roleMap[ROLES.ADMIN].dataValues.id },
      defaults: { userId: admin.id, roleId: roleMap[ROLES.ADMIN].dataValues.id }
    });
    await db.RoleUser.findOrCreate({
      where: { userId: customer.id, roleId: roleMap[ROLES.CUSTOMER].dataValues.id },
      defaults: { userId: customer.id, roleId: roleMap[ROLES.CUSTOMER].dataValues.id }
    });
    console.log('✅ Users and roles assigned');

    // ========================
    // 5. Categories & SubCategories
    // ========================
    const [cat] = await db.Category.findOrCreate({
      where: { name: 'Electronics' },
      defaults: { name: 'Electronics', description: 'Gadgets' }
    });

    const [subCat] = await db.SubCategory.findOrCreate({
      where: { name: 'Phones' },
      defaults: { name: 'Phones', categoryId: cat.id }
    });

    // ========================
    // 6. Store
    // ========================
    
    const [store] = await db.Store.findOrCreate({
      where: { name: 'Tech Store' },
      defaults: {
        name: 'Tech Store',
        userId: admin.id,
        categoryId: cat.dataValues.id
      }
    });

    // ========================
    // 7. Product
    // ========================
    const [product] = await db.Product.findOrCreate({
      where: { name: 'iPhone 15' },
      defaults: {
        name: 'iPhone 15',
        description: 'Latest smartphone',
        price: 999.99,
        ownerId: admin.id,
        categoryId: cat.dataValues.id,
        subcategoryId: subCat.dataValues.id,
        storeId: store.dataValues.id
      }
    });

    // ========================
    // 8. Size → SizeItem
    // ========================
    const [size] = await db.Size.findOrCreate({
      where: { size: '128GB' },
      defaults: { size: '128GB' }
    });

    const [sizeItem] = await db.SizeItem.findOrCreate({
      where: { productId: product.dataValues.id, sizeId: size.dataValues.id },
      defaults: {
        productId: product.dataValues.id,
        sizeId: size.dataValues.id,
        quantity: 10
      }
    });

    // ========================
    // 9. Cart → CartItem
    // ========================
    const [cart] = await db.Cart.findOrCreate({
      where: { userId: customer.id },
      defaults: { userId: customer.id }
    });

    await db.CartItem.findOrCreate({
      where: { cartId: cart.dataValues.id, productId: product.dataValues.id },
      defaults: {
        cartId: cart.dataValues.id,
        productId: product.dataValues.id,
        sizeItemId: sizeItem.dataValues.id,
        quantity: 1
      }
    });

    // ========================
    // 10. Payment → Order → OrderItem
    // ========================
    const [payment] = await db.Payment.findOrCreate({
      where: { paymentIntentId: 'pi_123456789' },
      defaults: {
        paymentIntentId: 'pi_123456789',
        amount: 999.99,
        currency: 'USD',
        status: 'succeeded'
      }
    });

    const [order] = await db.Order.findOrCreate({
      where: { paymentId: payment.dataValues.id },
      defaults: { paymentId: payment.dataValues.id, currency: 'USD' }
    });

    await db.OrderItem.findOrCreate({
      where: { orderId: order.dataValues.id, productId: product.dataValues.id },
      defaults: {
        orderId: order.dataValues.id,
        productId: product.dataValues.id,
        quantity: 1,
        price: 999.99
      }
    });

    // ========================
    // 11. Other Models (1 record each)
    // ========================
    await db.Promotion.findOrCreate({
      where: { code: 'WELCOME10' },
      defaults: {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minCartValue: 0,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 86400000)
      }
    });

    await db.Article.findOrCreate({
      where: { title: 'Welcome' },
      defaults: { title: 'Welcome', text: 'Hello world', userId: admin.id }
    });

    const [pkg] = await db.Package.findOrCreate({
      where: { name: 'Pro Plan' },
      defaults: {
        name: 'Pro Plan',
        storeLimit: 1,
        categoryLimit: 10,
        productLimit: 100,
        userLimit: 0,
        price: 29.99,
        isActive: true
      }
    });

    await db.UserPackage.findOrCreate({
      where: { userId: admin.id, packageId: pkg.dataValues.id },
      defaults: {
        userId: admin.id,
        packageId: pkg.dataValues.id,
        startDate: new Date(),
        isActive: true
      }
    });

    await db.ShippingMethod.findOrCreate({
      where: { name: 'Express' },
      defaults: { name: 'Express', cost: 9.99, deliveryEstimate: '2 days' }
    });

    await db.OrderShipping.findOrCreate({
      where: { orderId: order.dataValues.id },
      defaults: {
        orderId: order.dataValues.id,
        trackingNumber: 'TRK123456',
        carrier: 'FedEx',
        status: 'SHIPPED'
      }
    });

    await db.TaxRule.findOrCreate({
      where: { region: 'US' },
      defaults: { region: 'US', rate: 0.085, taxType: 'SALES_TAX' }
    });

    await db.UserSession.findOrCreate({
      where: { userId: customer.dataValues.id, deviceType: 'web' },
      defaults: {
        userId: customer.dataValues.id,
        ipAddress: '127.0.0.1',
        deviceType: 'web',
        loginAt: new Date()
      }
    });

    await db.Analytics.findOrCreate({
      where: { eventType: 'page_view', userId: customer.dataValues.id },
      defaults: {
        eventType: 'page_view',
        eventData: { page: '/' },
        userId: customer.dataValues.id
      }
    });

    await db.Translation.findOrCreate({
      where: { model: 'Product', recordId: product.dataValues.id, language: 'es', field: 'name' },
      defaults: {
        model: 'Product',
        recordId: product.dataValues.id,
        language: 'es',
        field: 'name',
        translation: 'iPhone 15'
      }
    });

    await db.AuditLog.findOrCreate({
      where: { action: 'user_login', entityId: customer.dataValues.id },
      defaults: {
        action: 'user_login',
        entity: 'User',
        entityId: customer.dataValues.id,
        performedById: customer.dataValues.id
      }
    });

    const [fav] = await db.Favorite.findOrCreate({
      where: { userId: customer.dataValues.id },
      defaults: { userId: customer.dataValues.id }
    });

    await db.FavoriteItem.findOrCreate({
      where: { favoriteId: fav.dataValues.id, productId: product.dataValues.id },
      defaults: { favoriteId: fav.dataValues.id, productId: product.dataValues.id }
    });

    await db.Comment.findOrCreate({
      where: { userId: customer.dataValues.id, productId: product.dataValues.id },
      defaults: {
        userId: customer.dataValues.id,
        productId: product.dataValues.id,
        text: 'Great phone!',
        rating: 5
      }
    });

    await db.ProductImage.findOrCreate({
      where: { productId: product.dataValues.id },
      defaults: {
        productId: product.dataValues.id,
        imageUrl: '/uploads/iphone.jpg'
      }
    });

    await db.ReturnRequest.findOrCreate({
      where: { orderId: order.dataValues.id, userId: customer.dataValues.id },
      defaults: {
        orderId: order.dataValues.id,
        userId: customer.dataValues.id,
        reason: 'Changed mind',
        status: 'PENDING',
        refundAmount: 999.99
      }
    });

    console.log('✅✅✅ All models seeded successfully!');
    console.log('🔑 Logins:');
    console.log('  Super Admin: super@admin.com / superpass123');
    console.log('  Admin: admin@store.com / admin123');
    console.log('  Customer: customer@test.com / customer123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}

export default seedAll;