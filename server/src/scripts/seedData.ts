import db from '../models';
import bcrypt from 'bcrypt';

/**
 * Data Seeding Script
 * 
 * This script follows the proper order for seeding data:
 * 1. Create Permissions FIRST (required for role assignments)
 * 2. Create Roles SECOND (required for user assignments)
 * 3. Create Users THIRD (after roles exist)
 * 4. Assign Roles to Users (after both exist)
 * 5. Create Categories and other data (after users exist)
 * 
 * Each step includes verification to ensure data was created successfully
 * before proceeding to the next step.
 */

export const seedData = async (): Promise<void> => {
  try {
    console.log('🌱 Starting data seeding...');

    // ========================
    // 1. Create Permissions FIRST
    // ========================
    const permissions = [
      // User permissions
      'read_users', 'create_users', 'update_users', 'delete_users', 'view_users', 'edit_users',
      // Role permissions
      'read_roles', 'create_roles', 'update_roles', 'delete_roles', 'view_roles', 'edit_roles',
      // Permission permissions
      'read_permissions', 'create_permissions', 'update_permissions', 'delete_permissions', 'view_permissions', 'edit_permissions',
      // Product permissions
      'read_products', 'create_products', 'update_products', 'delete_products', 'view_products', 'edit_products',
      // Order permissions
      'read_orders', 'create_orders', 'update_orders', 'delete_orders', 'view_orders', 'edit_orders',
      // Category permissions
      'read_categories', 'create_categories', 'update_categories', 'delete_categories', 'view_categories', 'edit_categories',
      // Subcategory permissions
      'read_subcategories', 'create_subcategories', 'update_subcategories', 'delete_subcategories', 'view_subcategories', 'edit_subcategories',
      // Store permissions
      'read_stores', 'create_stores', 'update_stores', 'delete_stores', 'view_stores', 'edit_stores',
      // Cart permissions
      'read_carts', 'create_carts', 'update_carts', 'delete_carts', 'view_carts', 'edit_carts',
      // Promotion permissions
      'read_promotions', 'create_promotions', 'update_promotions', 'delete_promotions', 'view_promotions', 'edit_promotions',
      // Analytics permissions
      'read_analytics', 'view_analytics', 'read_dashboard', 'view_dashboard',
      // Audit log permissions
      'read_audit_logs', 'view_audit_logs',
      // Package permissions
      'manage_packages', 'read_packages', 'create_packages', 'update_packages', 'delete_packages',
      // Shipping permissions
      'manage_shipping', 'read_shipping', 'create_shipping', 'update_shipping', 'delete_shipping',
      // Size permissions
      'manage_sizes', 'read_sizes', 'create_sizes', 'update_sizes', 'delete_sizes',
      // Tax permissions
      'manage_taxes', 'read_taxes', 'create_taxes', 'update_taxes', 'delete_taxes',
      // Return permissions
      'manage_returns', 'read_returns', 'create_returns', 'update_returns', 'delete_returns',
      // Translation permissions
      'manage_translations', 'read_translations', 'create_translations', 'update_translations', 'delete_translations',
      // Article permissions
      'read_articles', 'create_articles', 'update_articles', 'delete_articles', 'view_articles', 'edit_articles',
      // Comment permissions
      'read_comments', 'create_comments', 'update_comments', 'delete_comments', 'view_comments', 'edit_comments',
      // Favorite permissions
      'read_favorites', 'create_favorites', 'update_favorites', 'delete_favorites', 'view_favorites', 'edit_favorites',
      // Payment permissions
      'read_payments', 'create_payments', 'update_payments', 'delete_payments', 'view_payments', 'edit_payments'
    ];

    console.log(`🔐 Creating ${permissions.length} permissions...`);
    await Promise.all(
      permissions.map(permissionName =>
        db.Permission.findOrCreate({
          where: { name: permissionName },
          defaults: {
            name: permissionName,
            description: `Permission to ${permissionName.replace('_', ' ')}`
          }
        })
      )
    );
    console.log('✅ Permissions created');

    // Verify permissions were created
    const allPermissions = await db.Permission.findAll({raw: true});
    if (allPermissions.length === 0) {
      throw new Error('Failed to create permissions');
    }
    console.log(`✅ Verified ${allPermissions.length} permissions exist`);

    // ========================
    // 2. Create Roles SECOND
    // ========================
    const [superAdminRole, superAdminRoleCreated] = await db.Role.findOrCreate({
      where: { name: 'super_admin' },
      defaults: { name: 'super_admin' }
    });
    console.log(`👑 Super Admin Role ${superAdminRoleCreated ? 'created' : 'already exists'}`);

    const [adminRole, adminRoleCreated] = await db.Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { name: 'admin' }
    });
    console.log(`🧑‍💼 Admin Role ${adminRoleCreated ? 'created' : 'already exists'}`);

    const [customerRole, customerRoleCreated] = await db.Role.findOrCreate({
      where: { name: 'customer' },
      defaults: { name: 'customer' }
    });
    console.log(`🧑 Customer Role ${customerRoleCreated ? 'created' : 'already exists'}`);

    // Verify roles were created
    const allRoles = await db.Role.findAll();
    if (allRoles.length === 0) {
      throw new Error('Failed to create roles');
    }
    console.log(`✅ Verified ${allRoles.length} roles exist`);

    // Get fresh role instances from database to ensure they have proper IDs
    const superAdminRoleFresh = await db.Role.findOne({ where: { name: 'super_admin' } });
    const adminRoleFresh = await db.Role.findOne({ where: { name: 'admin' } });
    const customerRoleFresh = await db.Role.findOne({ where: { name: 'customer' } });

    if (!superAdminRoleFresh || !adminRoleFresh || !customerRoleFresh) {
      throw new Error('Failed to retrieve roles from database');
    }
    superAdminRoleFresh.id = superAdminRoleFresh.dataValues.id;
    adminRoleFresh.id = adminRoleFresh.dataValues.id;
    customerRoleFresh.id = customerRoleFresh.dataValues.id;
    console.log(`🔍 Debug - Super Admin Role ID: ${superAdminRoleFresh.dataValues.id}`);
    console.log(`🔍 Debug - Admin Role ID: ${adminRoleFresh.id}`);
    console.log(`🔍 Debug - Customer Role ID: ${customerRoleFresh.id}`);

    // ========================
    // 3. Assign Permissions to Roles
    // ========================
    console.log('🔗 Assigning permissions to roles...');

    try {
      // Super Admin gets ALL permissions
      for (const permission of allPermissions) {
        await db.RolePermission.findOrCreate({
          where: { 
            roleId: superAdminRoleFresh.id, 
            permissionId: permission.id 
          },
          defaults: { 
            roleId: superAdminRoleFresh.id, 
            permissionId: permission.id 
          }
        });
      }
      console.log('✅ All permissions assigned to super_admin role');

      // Admin gets most (filter out super-only)
      const adminPermissions = allPermissions.filter((p : any) =>
        !p.name.includes('super_admin') &&
        !p.name.includes('manage_packages') &&
        !p.name.includes('manage_translations')
      );
      
      for (const permission of adminPermissions) {
        await db.RolePermission.findOrCreate({
          where: { 
            roleId: adminRoleFresh.id, 
            permissionId: permission.id 
          },
          defaults: { 
            roleId: adminRoleFresh.id, 
            permissionId: permission.id 
          }
        });
      }
      console.log('✅ Admin permissions assigned to admin role');

      // Customer gets basic read/view/create/update on products, orders, cart, favorites, comments
      const customerPermissions = allPermissions.filter((p : any) =>
        (p.name.includes('read_') || p.name.includes('view_') || p.name.includes('create_') || p.name.includes('update_')) &&
        (p.name.includes('products') || p.name.includes('orders') || p.name.includes('cart') || p.name.includes('favorites') || p.name.includes('comments'))
      );
      
      for (const permission of customerPermissions) {
        await db.RolePermission.findOrCreate({
          where: { 
            roleId: customerRoleFresh.id, 
            permissionId: permission.id 
          },
          defaults: { 
            roleId: customerRoleFresh.id, 
            permissionId: permission.id 
          }
        });
      }
      console.log('✅ Customer permissions assigned to customer role');

      // Verify role-permission assignments
      const rolePermissions = await db.RolePermission.findAll();
      if (rolePermissions.length === 0) {
        throw new Error('Failed to assign permissions to roles');
      }
      console.log(`✅ Verified ${rolePermissions.length} role-permission assignments exist`);
    } catch (error) {
      console.error('❌ Error assigning permissions to roles:', error);
      throw error;
    }

    // ========================
    // 4. Create Users THIRD
    // ========================
    const superAdminPassword = await bcrypt.hash('admin', 10);
    const [superAdmin, superAdminCreated] = await db.User.findOrCreate({
      where: { email: 'admin@admin.com' },
      defaults: {
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: superAdminPassword,
        address: 'Admin Address',
        phone: '1234567890'
      }
    });
    console.log(`👤 Super Admin ${superAdminCreated ? 'created' : 'already exists'}`);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const [sampleAdmin, sampleAdminCreated] = await db.User.findOrCreate({
      where: { email: 'admin@store.com' },
      defaults: {
        name: 'Store Admin',
        email: 'admin@store.com',
        password: adminPassword,
        address: 'Store Address',
        phone: '0987654321',
        createdById: superAdmin.id
      }
    });
    console.log(`🧑‍💼 Sample Admin ${sampleAdminCreated ? 'created' : 'already exists'}`);

    const customerPassword = await bcrypt.hash('customer123', 10);
    const [sampleCustomer, sampleCustomerCreated] = await db.User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        name: 'John Customer',
        email: 'customer@example.com',
        password: customerPassword,
        address: 'Customer Address',
        phone: '5555555555',
        createdById: sampleAdmin.id
      }
    });
    console.log(`🧑 Sample Customer ${sampleCustomerCreated ? 'created' : 'already exists'}`);

    // Verify users were created
    const allUsers = await db.User.findAll();
    if (allUsers.length === 0) {
      throw new Error('Failed to create users');
    }
    console.log(`✅ Verified ${allUsers.length} users exist`);

    // Verify specific users exist
    if (!superAdmin || !sampleAdmin || !sampleCustomer) {
      throw new Error('Failed to create required users (superAdmin, sampleAdmin, or sampleCustomer)');
    }
    console.log('✅ Verified all required users exist');

    // ========================
    // 5. Assign Roles to Users
    // ========================
    try {
      await db.RoleUser.findOrCreate({
        where: { userId: superAdmin.id, roleId: superAdminRoleFresh.id },
        defaults: { userId: superAdmin.id, roleId: superAdminRoleFresh.id }
      });
      console.log('✅ Assigned super_admin role to Super Admin');

      await db.RoleUser.findOrCreate({
        where: { userId: sampleAdmin.id, roleId: adminRoleFresh.id },
        defaults: { userId: sampleAdmin.id, roleId: adminRoleFresh.id }
      });
      console.log('✅ Assigned admin role to Sample Admin');

      await db.RoleUser.findOrCreate({
        where: { userId: sampleCustomer.id, roleId: customerRoleFresh.id },
        defaults: { userId: sampleCustomer.id, roleId: customerRoleFresh.id }
      });
      console.log('✅ Assigned customer role to Sample Customer');

      // Verify role assignments
      const roleAssignments = await db.RoleUser.findAll();
      if (roleAssignments.length === 0) {
        throw new Error('Failed to assign roles to users');
      }
      console.log(`✅ Verified ${roleAssignments.length} role assignments exist`);
    } catch (error) {
      console.error('❌ Error assigning roles to users:', error);
      throw error;
    }

    // ========================
    // 6. Create Categories
    // ========================
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Books', description: 'Books and literature' },
      { name: 'Home & Garden', description: 'Home improvement and gardening' }
    ];

    console.log('📂 Creating categories...');
    const categoryRecords: Record<string, any> = {};
    try {
      for (const category of categories) {
        const [cat, created] = await db.Category.findOrCreate({
          where: { name: category.name },
          defaults: {
            ...category,
            createdById: sampleAdmin.id
          }
        });
        categoryRecords[category.name] = cat;
        console.log(`📁 ${category.name} ${created ? 'created' : 'exists'}`);
      }

      // Verify categories were created
      const allCategories = await db.Category.findAll({raw: true});
      if (allCategories.length === 0) {
        throw new Error('Failed to create categories');
      }
      console.log(`✅ Verified ${allCategories.length} categories exist`);
    } catch (error) {
      console.error('❌ Error creating categories:', error);
      throw error;
    }

    const electronicsCategory = categoryRecords['Electronics'];
    const clothingCategory = categoryRecords['Clothing'];

    if (!electronicsCategory || !clothingCategory) {
      console.warn('⚠️ Electronics or Clothing category missing — skipping subcategories and related products');
    } else {
      electronicsCategory.id = electronicsCategory.dataValues.id;
      clothingCategory.id = clothingCategory.dataValues.id;
      // ========================
      // 7. Create Subcategories
      // ========================
      const subcategories = [
        { name: 'Smartphones', categoryId: electronicsCategory.id },
        { name: 'Laptops', categoryId: electronicsCategory.id },
        { name: "Men's Clothing", categoryId: clothingCategory.id },
        { name: "Women's Clothing", categoryId: clothingCategory.id }
      ];
      console.log(`🗂️ Subcategories: ${subcategories}`);

      console.log('🗂️ Creating subcategories...');

      const subcategoryRecords: Record<string, any> = {};
      for (const sub of subcategories) {
        console.log(`🗂️ Creating subcategory "${sub.name}"...`);
        const [subcat, created] = await db.SubCategory.findOrCreate({
          where: { name: sub.name },
          defaults: {
            ...sub,
            createdById: sampleAdmin.id
          }
        });
        subcategoryRecords[sub.name] = subcat;
        console.log(`🗂️ ${sub.name} ${created ? 'created' : 'exists'}`);
      }

      const smartphoneSubcategory = subcategoryRecords['Smartphones'];
      const laptopSubcategory = subcategoryRecords['Laptops'];

      // ========================
      // 8. Create Store
      // ========================
      const [store, storeCreated] = await db.Store.findOrCreate({
        where: { name: 'Sample Store' },
        defaults: {
          name: 'Sample Store',
          description: 'A sample e-commerce store',
          imgUrl: '/images/store-logo.png',
          userId: sampleAdmin.id,
          categoryId: electronicsCategory.id
        }
      });
      console.log(`🏪 Store ${storeCreated ? 'created' : 'exists'}`);
      store.id = store.dataValues.id;
      // ========================
      // 9. Create Products
      // ========================
      const products = [
        {
          name: 'iPhone 15',
          description: 'Latest iPhone model',
          price: 999.99,
          categoryId: electronicsCategory.id,
          subcategoryId: smartphoneSubcategory.dataValues.id,
          storeId: store.id,
          ownerId: sampleAdmin.id
        },
        {
          name: 'MacBook Pro',
          description: 'Professional laptop',
          price: 1999.99,
          categoryId: electronicsCategory.id,
          subcategoryId: laptopSubcategory.dataValues.id,
          storeId: store.id,
          ownerId: sampleAdmin.id
        }
      ];

      console.log('📦 Creating initial products...');
      for (const product of products) {
        const [prod, created] = await db.Product.findOrCreate({
          where: { name: product.name },
          defaults: product
        });
        console.log(`📦 ${product.name} ${created ? 'created' : 'exists'}`);
      }

      // ========================
      // 10. Create Cart
      // ========================
      const [cart, cartCreated] = await db.Cart.findOrCreate({
        where: { userId: sampleCustomer.id },
        defaults: { userId: sampleCustomer.id }
      });
      console.log(`🛒 Cart ${cartCreated ? 'created' : 'exists'}`);

      // ========================
      // 11. Create Payment First
      // ========================
      const [payment, paymentCreated] = await db.Payment.findOrCreate({
        where: {
          paymentIntentId: 'pi_sample_' + Date.now()
        },
        defaults: {
          paymentIntentId: 'pi_sample_' + Date.now(),
          amount: 999.99,
          currency: 'USD',
          status: 'succeeded'
        }
      });
      console.log(`💳 Payment ${paymentCreated ? 'created' : 'exists'}`);
      payment.id = payment.dataValues.id;
      // ========================
      // 12. Create Order
      // ========================
      const [order, orderCreated] = await db.Order.findOrCreate({
        where: {
          paymentId: payment.id
        },
        defaults: {
          userId: sampleCustomer.id,
          paymentId: payment.id,
          currency: 'USD'
        }
      });
      console.log(`🧾 Order ${orderCreated ? 'created' : 'exists'}`);
      order.id = order.dataValues.id;
      // ========================
      // 13. Create Order Item
      // ========================
      const iphone = await db.Product.findOne({ where: { name: 'iPhone 15' } });
      iphone.id = iphone.dataValues.id;
      iphone.price = iphone.dataValues.price;
      if (iphone && order) {
        await db.OrderItem.findOrCreate({
          where: {
            orderId: order.id,
            productId: iphone.id
          },
          defaults: {
            orderId: order.id,
            productId: iphone.id,
            quantity: 1,
            price: iphone.price
          }
        });
        console.log('🧾 Order Item created for iPhone 15');
      } else {
        console.warn('⚠️ iPhone 15 or Order missing — skipping Order Item');
      }

      // ========================
      // 13. Create Promotion
      // ========================
await db.Promotion.findOrCreate({
  where: { code: 'SUMMER20' }, // ← Use 'code' (defined in model) instead of 'name'
  defaults: {
    code: 'SUMMER20',
    type: 'PERCENTAGE', // ← Must match ENUM exactly
    value: 20,          // ← Was 'discountValue'
    minCartValue: 0,    // ← Required? Add if needed
    validFrom: new Date(),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // Remove: description, isActive, discountType, startDate, endDate — not in model
    // createdById is also not in model — remove unless you added it later
  }
});
      console.log('🏷️ Promotion created');

      // ========================
      // 14. Create Article
      // ========================
      await db.Article.findOrCreate({
        where: { title: 'Welcome to Our Store' },
        defaults: {
          title: 'Welcome to Our Store',
          text: 'This is a sample article about our store.',
          type: 'blog',
          userId: sampleAdmin.id
        }
      });
      console.log('📰 Article created');

      // ========================
      // 15. Create Package
      // ========================
      const [pkg, pkgCreated] = await db.Package.findOrCreate({
        where: { name: 'Basic Package' },
        defaults: {
          name: 'Basic Package',
          description: 'Basic subscription package',
          storeLimit: 5,
          categoryLimit: 10
        }
      });
      console.log(`📦 Package ${pkgCreated ? 'created' : 'exists'}`);

      // ========================
      // 16. Create Shipping Method
      // ========================
      const [shippingMethod, shippingCreated] = await db.ShippingMethod.findOrCreate({
        where: { name: 'Standard Shipping' },
        defaults: {
          name: 'Standard Shipping',
          cost: 9.99,
          deliveryEstimate: '5-7 business days'
        }
      });
      console.log(`🚚 Shipping Method ${shippingCreated ? 'created' : 'exists'}`);
      shippingMethod.id = shippingMethod.dataValues.id;
      console.log(`🔍 Debug - ShippingMethod ID: ${shippingMethod.id}, type: ${typeof shippingMethod.id}`);

      // ========================
      // 17. Create Size
      // ========================
      const [size, sizeCreated] = await db.Size.findOrCreate({
        where: { size: 'Medium' },
        defaults: {
          size: 'Medium'
        }
      });
      console.log(`📏 Size ${sizeCreated ? 'created' : 'exists'}`);
      size.id = size.dataValues.id;

      // ========================
      // 18. Create Tax Rule
      // ========================
      await db.TaxRule.findOrCreate({
        where: { region: 'US' },
        defaults: {
          region: 'US',
          rate: 0.20,
          taxType: 'SALES_TAX'
        }
      });
      console.log('🧾 Tax Rule created');

      // ========================
      // 19. Create User Session
      // ========================
      await db.UserSession.findOrCreate({
        where: {
          userId: sampleCustomer.id,
          deviceType: 'web'
        },
        defaults: {
          userId: sampleCustomer.id,
          ipAddress: '127.0.0.1',
          deviceType: 'web',
          loginAt: new Date()
        }
      });
      console.log('📱 User Session created');

      // ========================
      // 20. Create Analytics
      // ========================
      await db.Analytics.findOrCreate({
        where: {
          eventType: 'page_view',
          userId: sampleCustomer.id
        },
        defaults: {
          eventType: 'page_view',
          eventData: { page: '/shop' },
          userId: sampleCustomer.id
        }
      });
      console.log('📊 Analytics event created');

      // ========================
      // 21. Create Translation
      // ========================
      await db.Translation.findOrCreate({
        where: {
          model: 'Product',
          recordId: '00000000-0000-0000-0000-000000000000',
          language: 'en',
          field: 'name'
        },
        defaults: {
          model: 'Product',
          recordId: '00000000-0000-0000-0000-000000000000',
          language: 'en',
          field: 'name',
          translation: 'Welcome to our store!'
        }
      });
      console.log('🌐 Translation created');

      // ========================
      // 22. Create Audit Log
      // ========================
      await db.AuditLog.findOrCreate({
        where: {
          action: 'user_created',
          performedById: sampleAdmin.id
        },
        defaults: {
          action: 'user_created',
          entity: 'User',
          entityId: sampleCustomer.id,
          performedById: sampleAdmin.id,
          snapshot: { name: 'John Customer', email: 'customer@example.com' }
        }
      });
      console.log('📋 Audit Log created');

      // ========================
      // 23. Create Additional Products
      // ========================
      const menClothingSub = subcategoryRecords["Men's Clothing"];
      const additionalProducts = [
        {
          name: 'Samsung Galaxy S24',
          description: 'Latest Samsung smartphone',
          price: 899.99,
          stock: 30,
          categoryId: electronicsCategory.id,
          subcategoryId: smartphoneSubcategory?.id,
          storeId: store.id,
          createdById: sampleAdmin.id
        },
        {
          name: 'Dell XPS 13',
          description: 'Premium ultrabook',
          price: 1299.99,
          stock: 15,
          categoryId: electronicsCategory.id,
          subcategoryId: laptopSubcategory?.id,
          storeId: store.id,
          createdById: sampleAdmin.id
        },
        {
          name: 'Nike Air Max',
          description: 'Comfortable running shoes',
          price: 129.99,
          stock: 50,
          categoryId: clothingCategory.id,
          subcategoryId: menClothingSub?.id,
          storeId: store.id,
          createdById: sampleAdmin.id
        }
      ];

      console.log('📦 Creating additional products...');
      for (const product of additionalProducts) {
        if (product.subcategoryId) {
          const [prod, created] = await db.Product.findOrCreate({
            where: { name: product.name },
            defaults: product
          });
          console.log(`📦 ${product.name} ${created ? 'created' : 'exists'}`);
        } else {
          console.warn(`⚠️ Skipping product "${product.name}" — missing subcategory`);
        }
      }

      // ========================
      // 24. Create Cart Items
      // ========================
      const samsungPhone = await db.Product.findOne({ where: { name: 'Samsung Galaxy S24' } });
      if (cart && samsungPhone) {
        await db.CartItem.findOrCreate({
          where: {
            cartId: cart.id,
            productId: samsungPhone.id
          },
          defaults: {
            cartId: cart.id,
            productId: samsungPhone.id,
            quantity: 2,
            price: samsungPhone.price
          }
        });
        console.log('🛒 Cart Item added for Samsung Galaxy S24');
      } else {
        console.warn('⚠️ Cart or Samsung Galaxy S24 missing — skipping Cart Item');
      }

      // ========================
      // 25. Create Favorites
      // ========================
      const [favorite, favoriteCreated] = await db.Favorite.findOrCreate({
        where: { userId: sampleCustomer.id },
        defaults: { userId: sampleCustomer.id }
      });
      console.log(`⭐ Favorite ${favoriteCreated ? 'created' : 'exists'}`);
      favorite.id = favorite.dataValues.id;
      const macbook = await db.Product.findOne({ where: { name: 'MacBook Pro' },raw: true });
      if (favorite && macbook) {
        await db.FavoriteItem.findOrCreate({
          where: {
            favoriteId: favorite.id,
            productId: macbook.id
          },
          defaults: {
            favoriteId: favorite.id,
            productId: macbook.id
          }
        });
        console.log('⭐ Favorite Item added for MacBook Pro');
      } else {
        console.warn('⚠️ Favorite or MacBook Pro missing — skipping Favorite Item');
      }

      // ========================
      // 26. Create Comments
      // ========================
      if (iphone && sampleCustomer) {
        await db.Comment.findOrCreate({
          where: {
            userId: sampleCustomer.id,
            productId: iphone.id
          },
          defaults: {
            userId: sampleCustomer.id,
            productId: iphone.id,
            text: 'Great phone! Love the camera quality.',
            rating: 5
          }
        });
        console.log('💬 Comment created for iPhone 15');
      } else {
        console.warn('⚠️ iPhone 15 or Customer missing — skipping Comment');
      }

      // ========================
      // 27. Create Product Images
      // ========================
      if (iphone) {
        const productImages = [
          {
            productId: iphone.id,
            imageUrl: '/uploads/iphone15-1.jpg',
            altText: 'iPhone 15 front view',
            isPrimary: true
          },
          {
            productId: iphone.id,
            imageUrl: '/uploads/iphone15-2.jpg',
            altText: 'iPhone 15 back view',
            isPrimary: false
          }
        ];

        for (const image of productImages) {
          await db.ProductImage.findOrCreate({
            where: {
              productId: image.productId,
              imageUrl: image.imageUrl
            },
            defaults: image
          });
        }
        console.log('🖼️ Product Images created for iPhone 15');
      } else {
        console.warn('⚠️ iPhone 15 missing — skipping Product Images');
      }

      // ========================
      // 28. Create Size Items
      // ========================
      const nikeShoes = await db.Product.findOne({ where: { name: 'Nike Air Max' } ,raw: true });
      if (size && nikeShoes) {
        await db.SizeItem.findOrCreate({
          where: {
            productId: nikeShoes.id,
            sizeId: size.id
          },
          defaults: {
            productId: nikeShoes.id,
            sizeId: size.id,
            stock: 25
          }
        });
        console.log('📏 Size Item created for Nike Air Max');
      } else {
        console.warn('⚠️ Size or Nike Air Max missing — skipping Size Item');
      }

      // ========================
      // 29. Create User Package
      // ========================
      pkg.id = pkg.dataValues.id;
      if (pkg && sampleAdmin) {
        await db.UserPackage.findOrCreate({
          where: {
            userId: sampleAdmin.id,
            packageId: pkg.id
          },
          defaults: {
            userId: sampleAdmin.id,
            packageId: pkg.id,
            purchaseDate: new Date(),
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
        console.log('📦 User Package assigned to Admin');
      } else {
        console.warn('⚠️ Package or Admin missing — skipping User Package');
      }

      // ========================
      // 30. Create Return Request
      // ========================
      if (order && sampleCustomer) {
        await db.ReturnRequest.findOrCreate({
          where: {
            orderId: order.id,
            userId: sampleCustomer.id
          },
          defaults: {
            orderId: order.id,
            userId: sampleCustomer.id,
            reason: 'Product not as described',
            status: 'PENDING',
            refundAmount: 999.99
          }
        });
        console.log('↩️ Return Request created');
      } else {
        console.warn('⚠️ Order or Customer missing — skipping Return Request');
      }

      // ========================
      // 31. Create Order Shipping
      // ========================
      order.id = order.dataValues.id;
      if (shippingMethod && order) {
        await db.OrderShipping.findOrCreate({
          where: { OrderId: order.id },
          defaults: {
            OrderId: order.id,
            ShippingMethodId: shippingMethod.id,
            trackingNumber: 'TRK' + Date.now(),
            carrier: 'UPS',
            status: 'SHIPPED'
          }
        });
        console.log('🚚 Order Shipping created');
      } else {
        console.warn('⚠️ Shipping Method or Order missing — skipping Order Shipping');
      }

      // ========================
      // 32. Create Additional Analytics
      // ========================
      const analyticsEvents = [
        {
          eventType: 'product_view',
          eventData: { productId: iphone?.id, productName: 'iPhone 15' },
          userId: sampleCustomer.id,
          sessionId: 'session-123'
        },
        {
          eventType: 'add_to_cart',
          eventData: { productId: samsungPhone?.id, productName: 'Samsung Galaxy S24' },
          userId: sampleCustomer.id,
          sessionId: 'session-123'
        },
        {
          eventType: 'purchase',
          eventData: { orderId: order.id, totalAmount: 999.99 },
          userId: sampleCustomer.id,
          sessionId: 'session-123'
        }
      ];

      for (const event of analyticsEvents) {
        if (event.eventData.productId || event.eventData.orderId) {
          await db.Analytics.findOrCreate({
            where: {
              eventType: event.eventType,
              userId: event.userId,
          
            },
            defaults: event
          });
          console.log(`📊 Analytics event "${event.eventType}" created`);
        } else {
          console.warn(`⚠️ Skipping analytics event "${event.eventType}" — missing productId/orderId`);
        }
      }

      // ========================
      // 33. Create Additional Translations
      // ========================
      const translations = [
        { model: 'Product', recordId: '00000000-0000-0000-0000-000000000001', language: 'en', field: 'name', translation: 'Welcome to our amazing store!' },
        { model: 'Product', recordId: '00000000-0000-0000-0000-000000000001', language: 'fr', field: 'name', translation: 'Bienvenue dans notre magasin incroyable!' },
        { model: 'Product', recordId: '00000000-0000-0000-0000-000000000001', language: 'es', field: 'name', translation: '¡Bienvenido a nuestra tienda increíble!' },
        { model: 'Product', recordId: '00000000-0000-0000-0000-000000000002', language: 'en', field: 'name', translation: 'Add to Cart' },
        { model: 'Product', recordId: '00000000-0000-0000-0000-000000000002', language: 'fr', field: 'name', translation: 'Ajouter au panier' },
        { model: 'Product', recordId: '00000000-0000-0000-0000-000000000002', language: 'es', field: 'name', translation: 'Añadir al carrito' }
      ];

      for (const t of translations) {
        await db.Translation.findOrCreate({
          where: { model: t.model, recordId: t.recordId, language: t.language, field: t.field },
          defaults: t
        });
      }
      console.log('🌐 Additional Translations created');

      // ========================
      // 34. Create Additional Audit Logs
      // ========================
      const auditLogs = [
        {
          action: 'product_created',
          entity: 'Product',
          entityId: iphone?.id,
          performedById: sampleAdmin.id,
          snapshot: { name: 'iPhone 15', price: 999.99 }
        },
        {
          action: 'order_created',
          entity: 'Order',
          entityId: order.id,
          performedById: sampleCustomer.id,
          snapshot: { totalAmount: 999.99, currency: 'USD' }
        },
        {
          action: 'role_assigned',
          entity: 'User',
          entityId: sampleAdmin.id,
          performedById: superAdmin.id,
          snapshot: { role: 'admin' }
        }
      ];

      for (const log of auditLogs) {
        if (log.entityId) {
          await db.AuditLog.findOrCreate({
            where: {
              action: log.action,
              entity: log.entity,
              entityId: log.entityId,
              performedById: log.performedById
            },
            defaults: log
          });
          console.log(`📋 Audit Log "${log.action}" created`);
        } else {
          console.warn(`⚠️ Skipping audit log "${log.action}" — missing entityId`);
        }
      }
    } // End of if (electronicsCategory && clothingCategory)

    console.log('✅✅✅ Data seeding completed successfully!');
    console.log('📊 Created:');
    console.log('  - 1 Super Admin (admin@admin.com / admin)');
    console.log('  - 1 Admin (admin@store.com / admin123)');
    console.log('  - 1 Customer (customer@example.com / customer123)');
    console.log('  - 3 Roles (super_admin, admin, customer) with proper permissions');
    console.log('  - 50+ Comprehensive Permissions');
    console.log('  - 4 Categories');
    console.log('  - 4 Subcategories');
    console.log('  - 1 Store');
    console.log('  - 5 Products (iPhone 15, MacBook Pro, Samsung Galaxy S24, Dell XPS 13, Nike Air Max)');
    console.log('  - 1 Cart with Cart Items');
    console.log('  - 1 Order with Order Items');
    console.log('  - 1 Order Shipping with tracking');
    console.log('  - 1 Favorites with Favorite Items');
    console.log('  - 1 Comment with rating');
    console.log('  - 2 Product Images');
    console.log('  - 1 Size Item');
    console.log('  - 1 User Package subscription');
    console.log('  - 1 Return Request');
    console.log('  - 1 Promotion');
    console.log('  - 1 Article');
    console.log('  - 1 Package');
    console.log('  - 1 Shipping Method');
    console.log('  - 1 Size');
    console.log('  - 1 Tax Rule');
    console.log('  - 1 User Session');
    console.log('  - 4 Analytics Events');
    console.log('  - 6 Translations (EN, FR, ES)');
    console.log('  - 4 Audit Logs');
    console.log('  - Complete role-permission assignments');
    console.log('  - Multi-language support data');
    console.log('  - Comprehensive e-commerce test data');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 Data seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Data seeding failed:', error);
      process.exit(1);
    });
}