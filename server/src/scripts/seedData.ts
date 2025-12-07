import db from '../models';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PERMISSIONS, ROLES } from './permissions';

/**
 * ROBUST DATA SEEDING SCRIPT
 * 
 * Objectives:
 * 1. Create all necessary Permissions for the frontend sidebar/features to work.
 * 2. Create Roles (Super Admin, Admin, Customer).
 * 3. Create Users with known credentials.
 * 4. Create Catalog (Categories, Subcategories, Store, Products).
 * 5. Create Inventory (Sizes, SizeItems) - CRITICAL for "Add to Cart".
 * 6. Create Sales Data (Orders, Cart) for testing history.
 * 7. Ensure all relationships (Foreign Keys) are valid.
 */

export const seedData = async (): Promise<void> => {
  const transaction = await db.sequelize.transaction();

  try {
    console.log('🚀 Starting Robust Data Seeding...');

    // =========================================================================
    // 1. PERMISSIONS & ROLES
    // =========================================================================
    console.log('🔐 1. Setting up Permissions & Roles...');

    // Combine all permissions from the constants file
    const allPermissions = Object.values(PERMISSIONS);
    const extraPermissions = ['my-store', 'orders-admin', 'analytics']; // Keys used in sidebar but maybe not in PERMISSIONS constant

    const permissionsList = [...new Set([...allPermissions, ...extraPermissions])];

    const permissionMap: Record<string, any> = {};

    for (const name of permissionsList) {
      const [perm] = await db.Permission.findOrCreate({
        where: { name },
        defaults: { id: uuidv4(), name },
        transaction
      });
      // SAFE ACCESS: Use dataValues or fallback to object
      permissionMap[name] = perm;
    }

    // Create Roles
    const rolesConfig = [
      { name: ROLES.SUPER_ADMIN },
      { name: ROLES.ADMIN },
      { name: ROLES.CUSTOMER }
    ];

    const roleMap: Record<string, any> = {};

    for (const config of rolesConfig) {
      const [role] = await db.Role.findOrCreate({
        where: { name: config.name },
        defaults: { id: uuidv4(), name: config.name },
        transaction
      });
      roleMap[config.name] = role;
      console.log(`✅ Role checked/created: ${config.name}, ID: ${role.dataValues?.id || role.id}`);
    }

    // Assign Permissions to Roles
    // Super Admin -> ALL
    const superAdminRole = roleMap[ROLES.SUPER_ADMIN];
    const superAdminId = superAdminRole.dataValues?.id || superAdminRole.id;

    if (!superAdminId) throw new Error('Super Admin Role ID is undefined');

    for (const permName in permissionMap) {
      const perm = permissionMap[permName];
      const permId = perm.dataValues?.id || perm.id;

      await db.RolePermission.findOrCreate({
        where: { roleId: superAdminId, permissionId: permId },
        defaults: { id: uuidv4(), roleId: superAdminId, permissionId: permId },
        transaction
      });
    }

    // Admin -> Everything except system level stuff
    const adminRole = roleMap[ROLES.ADMIN];
    const adminId = adminRole.dataValues?.id || adminRole.id;
    if (!adminId) throw new Error('Admin Role ID is undefined');

    const adminExclude: string[] = [
        PERMISSIONS.MANAGE_PACKAGES,
        PERMISSIONS.MANAGE_TRANSLATIONS,
        'manage_packages',
        'manage_translations'
    ];

    for (const permName in permissionMap) {
      if (!adminExclude.includes(permName)) {
        const perm = permissionMap[permName];
        const permId = perm.dataValues?.id || perm.id;

        await db.RolePermission.findOrCreate({
          where: { roleId: adminId, permissionId: permId },
          defaults: { id: uuidv4(), roleId: adminId, permissionId: permId },
          transaction
        });
      }
    }

    // Customer -> Read/Create basic stuff
    const customerRole = roleMap[ROLES.CUSTOMER];
    const customerId = customerRole.dataValues?.id || customerRole.id;
    if (!customerId) throw new Error('Customer Role ID is undefined');

    const customerPerms = [
      PERMISSIONS.READ_PRODUCTS, PERMISSIONS.READ_CATEGORIES, PERMISSIONS.READ_SUBCATEGORIES,
      PERMISSIONS.CREATE_ORDERS, PERMISSIONS.READ_ORDERS,
      PERMISSIONS.CREATE_CARTS, PERMISSIONS.READ_CARTS, PERMISSIONS.UPDATE_CARTS,
      PERMISSIONS.CREATE_FAVORITES, PERMISSIONS.READ_FAVORITES, PERMISSIONS.DELETE_FAVORITES,
      PERMISSIONS.CREATE_COMMENTS, PERMISSIONS.READ_COMMENTS,
      PERMISSIONS.CREATE_RETURNS, PERMISSIONS.READ_RETURNS
    ];
    for (const permName of customerPerms) {
      if (permissionMap[permName]) {
        const perm = permissionMap[permName];
        const permId = perm.dataValues?.id || perm.id;

        await db.RolePermission.findOrCreate({
          where: { roleId: customerId, permissionId: permId },
          defaults: { id: uuidv4(), roleId: customerId, permissionId: permId },
          transaction
        });
      }
    }

    // =========================================================================
    // 2. USERS
    // =========================================================================
    console.log('👤 2. Creating Users...');

    const passwordHash = await bcrypt.hash('123456', 10); // Simple password for all

    const usersConfig = [
      {
        email: 'admin@admin.com',
        name: 'Super Admin',
        role: ROLES.SUPER_ADMIN,
        password: passwordHash
      },
      {
        email: 'admin@store.com',
        name: 'Store Admin',
        role: ROLES.ADMIN,
        password: passwordHash
      },
      {
        email: 'customer@example.com',
        name: 'John Customer',
        role: ROLES.CUSTOMER,
        password: passwordHash
      }
    ];

    const userMap: Record<string, any> = {};

    for (const conf of usersConfig) {
      const [user] = await db.User.findOrCreate({
        where: { email: conf.email },
        defaults: {
          id: uuidv4(),
          email: conf.email,
          name: conf.name,
          password: conf.password,
          phone: '1234567890',
          address: '123 Seed Street'
        },
        transaction
      });
      userMap[conf.role] = user;

      // Assign Role
      const role = roleMap[conf.role];
      const roleId = role.dataValues?.id || role.id;
      const userId = user.dataValues?.id || user.id;

      await db.RoleUser.findOrCreate({
        where: { userId: userId, roleId: roleId },
        defaults: { id: uuidv4(), userId: userId, roleId: roleId },
        transaction
      });
    }

    // =========================================================================
    // 3. CATALOG (Categories, SubCategories)
    // =========================================================================
    console.log('📂 3. Creating Catalog Structure...');

    const adminUser = userMap[ROLES.ADMIN];
    const adminUserId = adminUser.dataValues?.id || adminUser.id;

    // Categories
    const electronicsCat = await db.Category.create({
      id: uuidv4(),
      name: 'Electronics',
      description: 'Gadgets and devices',
      userId: adminUserId // Owner
    }, { transaction });

    const clothingCat = await db.Category.create({
      id: uuidv4(),
      name: 'Clothing',
      description: 'Apparel for all',
      userId: adminUserId
    }, { transaction });

    // SubCategories
    const phonesSub = await db.SubCategory.create({
      id: uuidv4(),
      name: 'Smartphones',
      categoryId: electronicsCat.id || electronicsCat.dataValues.id
    }, { transaction });

    const laptopsSub = await db.SubCategory.create({
      id: uuidv4(),
      name: 'Laptops',
      categoryId: electronicsCat.id || electronicsCat.dataValues.id
    }, { transaction });

    const menSub = await db.SubCategory.create({
      id: uuidv4(),
      name: "Men's Clothing",
      categoryId: clothingCat.id || clothingCat.dataValues.id
    }, { transaction });

    // =========================================================================
    // 4. STORE
    // =========================================================================
    console.log('🏪 4. Creating Store...');

    const store = await db.Store.create({
      id: uuidv4(),
      name: 'Tech & Style Hub',
      description: 'The best place for tech and fashion.',
      imgUrl: '/fakeimages/shoes.jpg', // Use a valid placeholder path from public folder
      userId: adminUserId,
      categoryId: electronicsCat.id || electronicsCat.dataValues.id
    }, { transaction });

    const storeId = store.id || store.dataValues.id;

    // =========================================================================
    // 5. PRODUCTS & INVENTORY
    // =========================================================================
    console.log('📦 5. Creating Products & Inventory...');

    // Sizes
    const sizeM = await db.Size.create({ id: uuidv4(), size: 'M' }, { transaction });
    const sizeL = await db.Size.create({ id: uuidv4(), size: 'L' }, { transaction });
    const sizeDefault = await db.Size.create({ id: uuidv4(), size: 'Standard' }, { transaction });

    const productsData = [
      {
        name: 'iPhone 15 Pro',
        description: 'The ultimate iPhone.',
        price: 999.99,
        category: electronicsCat,
        subcategory: phonesSub,
        sizes: [sizeDefault],
        image: '/products/f1.png'
      },
      {
        name: 'MacBook Air M2',
        description: 'Supercharged by M2.',
        price: 1199.99,
        category: electronicsCat,
        subcategory: laptopsSub,
        sizes: [sizeDefault],
        image: '/products/f2.png'
      },
      {
        name: 'Classic T-Shirt',
        description: '100% Cotton, very comfortable.',
        price: 29.99,
        category: clothingCat,
        subcategory: menSub,
        sizes: [sizeM, sizeL],
        image: '/products/f3.png'
      }
    ];

    const productMap: Record<string, any> = {};

    for (const pData of productsData) {
      const catId = pData.category.id || pData.category.dataValues.id;
      const subId = pData.subcategory.id || pData.subcategory.dataValues.id;

      // Create Product
      const product = await db.Product.create({
        id: uuidv4(),
        name: pData.name,
        description: pData.description,
        price: pData.price,
        isActive: true,
        discount: 0,
        ownerId: adminUserId,
        storeId: storeId,
        categoryId: catId,
        subcategoryId: subId
      }, { transaction });

      productMap[pData.name] = product;
      const prodId = product.id || product.dataValues.id;

      // Create Image
      await db.ProductImage.create({
        id: uuidv4(),
        productId: prodId,
        imageUrl: pData.image
      }, { transaction });

      // Create SizeItems (Inventory)
      for (const size of pData.sizes) {
        const sizeId = size.id || size.dataValues.id;
        await db.SizeItem.create({
          id: uuidv4(),
          productId: prodId,
          sizeId: sizeId,
          quantity: 100 // Plenty of stock
        }, { transaction });
      }
    }

    // =========================================================================
    // 6. SALES (Cart, Orders)
    // =========================================================================
    console.log('🛒 6. Creating Sales Data...');

    const customerUser = userMap[ROLES.CUSTOMER];
    const customerUserId = customerUser.dataValues?.id || customerUser.id;

    // Cart for Customer
    const cart = await db.Cart.create({
      id: uuidv4(),
      userId: customerUserId
    }, { transaction });

    // Add item to cart (iPhone)
    const iphone = productMap['iPhone 15 Pro'];
    const iphoneId = iphone.id || iphone.dataValues.id;

    const iphoneSizeItem = await db.SizeItem.findOne({
      where: { productId: iphoneId },
      transaction
    });

    if (iphoneSizeItem) {
      const sizeItemId = iphoneSizeItem.id || iphoneSizeItem.dataValues.id;
      const sizeId = iphoneSizeItem.sizeId || iphoneSizeItem.dataValues.sizeId;

      await db.CartItem.create({
        id: uuidv4(),
        cartId: cart.id || cart.dataValues.id,
        productId: iphoneId,
        sizeItemId: sizeItemId,
        quantity: 1,
        sizeId: sizeId // Explicitly set if model supports it
      }, { transaction });
    }

    // Create a Past Order
    const payment = await db.Payment.create({
      id: uuidv4(),
      paymentIntentId: `pi_${Date.now()}`,
      amount: 1229.98,
      currency: 'USD',
      status: 'succeeded'
    }, { transaction });

    const order = await db.Order.create({
      id: uuidv4(),
      userId: customerUserId,
      paymentId: payment.id || payment.dataValues.id,
      currency: 'USD'
    }, { transaction });

    // Order Items
    await db.OrderItem.create({
      id: uuidv4(),
      orderId: order.id || order.dataValues.id,
      productId: iphoneId,
      quantity: 1,
      price: iphone.price
    }, { transaction });

    // =========================================================================
    // 7. EXTRAS (Promotions, Returns, Analytics)
    // =========================================================================
    console.log('✨ 7. Creating Extras...');

    // Promotion
    await db.Promotion.create({
      id: uuidv4(),
      code: 'SAVE10',
      type: 'PERCENTAGE',
      value: 10,
      minCartValue: 50,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 10000000)
    }, { transaction });

    // Analytics (for Dashboard)
    await db.Analytics.create({
      id: uuidv4(),
      eventType: 'purchase',
      eventData: { amount: 1229.98 },
      userId: customerUserId
    }, { transaction });

    // Return Request (Test Return)
    await db.ReturnRequest.create({
      id: uuidv4(),
      orderId: order.id || order.dataValues.id,
      userId: customerUserId,
      reason: 'Defective',
      status: 'PENDING',
      refundAmount: 999.99
    }, { transaction });

    await transaction.commit();
    console.log('✅✅✅ Data Seeding Completed Successfully! No Errors.');

    console.log('\n---------------------------------------------------');
    console.log('Login Credentials:');
    console.log(`Super Admin: admin@admin.com / 123456`);
    console.log(`Store Admin: admin@store.com / 123456`);
    console.log(`Customer:    customer@example.com / 123456`);
    console.log('---------------------------------------------------\n');

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Data Seeding Failed:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  seedData();
}
