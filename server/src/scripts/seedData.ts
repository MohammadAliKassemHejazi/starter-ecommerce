import db from '../models';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PERMISSIONS, ROLES } from './permissions';

/**
 * COMPREHENSIVE DATA SEEDING SCRIPT
 *
 * Covers:
 * - Roles & Permissions (full sidebar coverage)
 * - 4 Users (Super Admin, 2 Store Admins, 2 Customers)
 * - 5 Categories with 12 SubCategories
 * - 3 Stores (owned by store admins, using real images from /compressed)
 * - 8 Sizes (XS, S, M, L, XL, Standard, Small, Large)
 * - 15 Products with images, inventory (SizeItems), and multiple ProductImages
 * - 2 Carts with items
 * - 3 Orders with payments, items, shipping
 * - Tax rules, Shipping methods, Promotions
 * - Comments, Favorites, FavoriteItems
 * - Articles, Analytics events, AuditLogs
 * - Packages (Free, Starter, Pro, Enterprise) + UserPackages
 * - UserSessions, Translations
 *
 * All image filenames reference actual files in server/compressed/
 * Fully idempotent via findOrCreate — safe to re-run.
 */

export const seedData = async (): Promise<void> => {
  const transaction = await db.sequelize.transaction();

  try {
    console.log('🚀 Starting Comprehensive Data Seeding...');

    // =========================================================================
    // 1. PERMISSIONS & ROLES
    // =========================================================================
    console.log('🔐 1. Setting up Permissions & Roles...');

    const allPermissions = Object.values(PERMISSIONS);
    const extraPermissions = ['my-store', 'orders-admin', 'analytics'];
    const permissionsList = [...new Set([...allPermissions, ...extraPermissions])];

    const permissionMap: Record<string, any> = {};
    for (const name of permissionsList) {
      const [perm] = await db.Permission.findOrCreate({
        where: { name },
        defaults: { id: uuidv4(), name },
        transaction,
      });
      permissionMap[name] = perm;
    }

    const rolesConfig = [{ name: ROLES.SUPER_ADMIN }, { name: ROLES.ADMIN }, { name: ROLES.CUSTOMER }];
    const roleMap: Record<string, any> = {};
    for (const config of rolesConfig) {
      const [role] = await db.Role.findOrCreate({
        where: { name: config.name },
        defaults: { id: uuidv4(), name: config.name },
        transaction,
      });
      roleMap[config.name] = role;
    }

    const superAdminRole = roleMap[ROLES.SUPER_ADMIN];
    const superAdminRoleId = superAdminRole.dataValues?.id || superAdminRole.id;
    const adminRole = roleMap[ROLES.ADMIN];
    const adminRoleId = adminRole.dataValues?.id || adminRole.id;
    const customerRole = roleMap[ROLES.CUSTOMER];
    const customerRoleId = customerRole.dataValues?.id || customerRole.id;

    // Super Admin → all permissions
    for (const permName in permissionMap) {
      const perm = permissionMap[permName];
      const permId = perm.dataValues?.id || perm.id;
      await db.RolePermission.findOrCreate({
        where: { roleId: superAdminRoleId, permissionId: permId },
        defaults: { id: uuidv4(), roleId: superAdminRoleId, permissionId: permId },
        transaction,
      });
    }

    // Admin → all except package/translation management
    const adminExclude: string[] = [PERMISSIONS.MANAGE_PACKAGES, PERMISSIONS.MANAGE_TRANSLATIONS];
    for (const permName in permissionMap) {
      if (!adminExclude.includes(permName)) {
        const perm = permissionMap[permName];
        const permId = perm.dataValues?.id || perm.id;
        await db.RolePermission.findOrCreate({
          where: { roleId: adminRoleId, permissionId: permId },
          defaults: { id: uuidv4(), roleId: adminRoleId, permissionId: permId },
          transaction,
        });
      }
    }

    // Customer → read/create basics
    const customerPerms = [
      PERMISSIONS.READ_PRODUCTS,
      PERMISSIONS.READ_CATEGORIES,
      PERMISSIONS.READ_SUBCATEGORIES,
      PERMISSIONS.CREATE_ORDERS,
      PERMISSIONS.READ_ORDERS,
      PERMISSIONS.CREATE_CARTS,
      PERMISSIONS.READ_CARTS,
      PERMISSIONS.UPDATE_CARTS,
      PERMISSIONS.CREATE_FAVORITES,
      PERMISSIONS.READ_FAVORITES,
      PERMISSIONS.DELETE_FAVORITES,
      PERMISSIONS.CREATE_COMMENTS,
      PERMISSIONS.READ_COMMENTS,
      PERMISSIONS.CREATE_RETURNS,
      PERMISSIONS.READ_RETURNS,
    ];
    for (const permName of customerPerms) {
      if (permissionMap[permName]) {
        const perm = permissionMap[permName];
        const permId = perm.dataValues?.id || perm.id;
        await db.RolePermission.findOrCreate({
          where: { roleId: customerRoleId, permissionId: permId },
          defaults: { id: uuidv4(), roleId: customerRoleId, permissionId: permId },
          transaction,
        });
      }
    }

    // =========================================================================
    // 2. USERS
    // =========================================================================
    console.log('👤 2. Creating Users...');

    const passwordHash = await bcrypt.hash('123456', 10);

    // Super Admin
    const [superAdminUser] = await db.User.findOrCreate({
      where: { email: 'admin@admin.com' },
      defaults: {
        id: uuidv4(),
        email: 'admin@admin.com',
        name: 'Super Admin',
        password: passwordHash,
        phone: '+1-800-000-0001',
        address: '1 HQ Plaza, New York, NY 10001',
        bio: 'Platform super administrator.',
      },
      transaction,
    });
    const superAdminUserId = superAdminUser.dataValues?.id || superAdminUser.id;

    // Store Admin 1 (Tech store)
    const [storeAdmin1] = await db.User.findOrCreate({
      where: { email: 'admin@store.com' },
      defaults: {
        id: uuidv4(),
        email: 'admin@store.com',
        name: 'Alex Tech',
        password: passwordHash,
        phone: '+1-800-000-0002',
        address: '42 Tech Street, San Francisco, CA 94105',
        bio: 'Running the best tech store in the city.',
        createdById: superAdminUserId,
      },
      transaction,
    });
    const storeAdmin1Id = storeAdmin1.dataValues?.id || storeAdmin1.id;

    // Store Admin 2 (Fashion store)
    const [storeAdmin2] = await db.User.findOrCreate({
      where: { email: 'fashion@store.com' },
      defaults: {
        id: uuidv4(),
        email: 'fashion@store.com',
        name: 'Sara Fashion',
        password: passwordHash,
        phone: '+1-800-000-0003',
        address: '88 Fashion Ave, New York, NY 10018',
        bio: 'Curating the finest fashion collections.',
        createdById: superAdminUserId,
      },
      transaction,
    });
    const storeAdmin2Id = storeAdmin2.dataValues?.id || storeAdmin2.id;

    // Customer 1
    const [customer1] = await db.User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        id: uuidv4(),
        email: 'customer@example.com',
        name: 'John Doe',
        password: passwordHash,
        phone: '+1-555-100-1001',
        address: '10 Main St, Chicago, IL 60601',
        createdById: storeAdmin1Id,
      },
      transaction,
    });
    const customer1Id = customer1.dataValues?.id || customer1.id;

    // Customer 2
    const [customer2] = await db.User.findOrCreate({
      where: { email: 'jane@example.com' },
      defaults: {
        id: uuidv4(),
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: passwordHash,
        phone: '+1-555-200-2002',
        address: '20 Oak Ave, Los Angeles, CA 90001',
        createdById: storeAdmin1Id,
      },
      transaction,
    });
    const customer2Id = customer2.dataValues?.id || customer2.id;

    // Assign Roles
    await db.RoleUser.findOrCreate({
      where: { userId: superAdminUserId, roleId: superAdminRoleId },
      defaults: { id: uuidv4(), userId: superAdminUserId, roleId: superAdminRoleId },
      transaction,
    });
    await db.RoleUser.findOrCreate({
      where: { userId: storeAdmin1Id, roleId: adminRoleId },
      defaults: { id: uuidv4(), userId: storeAdmin1Id, roleId: adminRoleId },
      transaction,
    });
    await db.RoleUser.findOrCreate({
      where: { userId: storeAdmin2Id, roleId: adminRoleId },
      defaults: { id: uuidv4(), userId: storeAdmin2Id, roleId: adminRoleId },
      transaction,
    });
    await db.RoleUser.findOrCreate({
      where: { userId: customer1Id, roleId: customerRoleId },
      defaults: { id: uuidv4(), userId: customer1Id, roleId: customerRoleId },
      transaction,
    });
    await db.RoleUser.findOrCreate({
      where: { userId: customer2Id, roleId: customerRoleId },
      defaults: { id: uuidv4(), userId: customer2Id, roleId: customerRoleId },
      transaction,
    });

    // =========================================================================
    // 3. PACKAGES
    // =========================================================================
    console.log('📦 3. Creating Packages...');

    const [freePkg] = await db.Package.findOrCreate({
      where: { name: 'Free Plan' },
      defaults: {
        id: uuidv4(),
        name: 'Free Plan',
        description: 'Get started for free.',
        storeLimit: 1,
        categoryLimit: 3,
        productLimit: 10,
        userLimit: 1,
        price: 0.0,
        isActive: true,
        isSuperAdminPackage: false,
      },
      transaction,
    });
    const freePkgId = freePkg.dataValues?.id || freePkg.id;

    const [starterPkg] = await db.Package.findOrCreate({
      where: { name: 'Starter Plan' },
      defaults: {
        id: uuidv4(),
        name: 'Starter Plan',
        description: 'Perfect for small businesses.',
        storeLimit: 2,
        categoryLimit: 10,
        productLimit: 50,
        userLimit: 5,
        price: 19.99,
        isActive: true,
        isSuperAdminPackage: false,
      },
      transaction,
    });
    const starterPkgId = starterPkg.dataValues?.id || starterPkg.id;

    const [proPkg] = await db.Package.findOrCreate({
      where: { name: 'Pro Plan' },
      defaults: {
        id: uuidv4(),
        name: 'Pro Plan',
        description: 'For growing businesses.',
        storeLimit: 10,
        categoryLimit: 50,
        productLimit: 500,
        userLimit: 20,
        price: 49.99,
        isActive: true,
        isSuperAdminPackage: false,
      },
      transaction,
    });
    const proPkgId = proPkg.dataValues?.id || proPkg.id;

    const [enterprisePkg] = await db.Package.findOrCreate({
      where: { name: 'Enterprise Plan' },
      defaults: {
        id: uuidv4(),
        name: 'Enterprise Plan',
        description: 'Unlimited power for large enterprises.',
        storeLimit: 999,
        categoryLimit: 999,
        productLimit: 9999,
        userLimit: 999,
        price: 199.99,
        isActive: true,
        isSuperAdminPackage: true,
      },
      transaction,
    });
    const enterprisePkgId = enterprisePkg.dataValues?.id || enterprisePkg.id;

    // Assign packages to users
    await db.UserPackage.findOrCreate({
      where: { userId: superAdminUserId, packageId: enterprisePkgId },
      defaults: { id: uuidv4(), userId: superAdminUserId, packageId: enterprisePkgId, startDate: new Date(), isActive: true, createdById: superAdminUserId },
      transaction,
    });
    await db.UserPackage.findOrCreate({
      where: { userId: storeAdmin1Id, packageId: proPkgId },
      defaults: { id: uuidv4(), userId: storeAdmin1Id, packageId: proPkgId, startDate: new Date(), isActive: true, createdById: superAdminUserId },
      transaction,
    });
    await db.UserPackage.findOrCreate({
      where: { userId: storeAdmin2Id, packageId: starterPkgId },
      defaults: { id: uuidv4(), userId: storeAdmin2Id, packageId: starterPkgId, startDate: new Date(), isActive: true, createdById: superAdminUserId },
      transaction,
    });
    await db.UserPackage.findOrCreate({
      where: { userId: customer1Id, packageId: freePkgId },
      defaults: { id: uuidv4(), userId: customer1Id, packageId: freePkgId, startDate: new Date(), isActive: true, createdById: storeAdmin1Id },
      transaction,
    });
    await db.UserPackage.findOrCreate({
      where: { userId: customer2Id, packageId: freePkgId },
      defaults: { id: uuidv4(), userId: customer2Id, packageId: freePkgId, startDate: new Date(), isActive: true, createdById: storeAdmin1Id },
      transaction,
    });

    // =========================================================================
    // 4. CATEGORIES & SUBCATEGORIES
    // =========================================================================
    console.log('📂 4. Creating Categories & SubCategories...');

    const [catElec] = await db.Category.findOrCreate({
      where: { name: 'Electronics' },
      defaults: { id: uuidv4(), name: 'Electronics', description: 'Latest gadgets and devices', userId: storeAdmin1Id },
      transaction,
    });
    const catElecId = catElec.dataValues?.id || catElec.id;

    const [catCloth] = await db.Category.findOrCreate({
      where: { name: 'Clothing' },
      defaults: { id: uuidv4(), name: 'Clothing', description: 'Apparel for every occasion', userId: storeAdmin2Id },
      transaction,
    });
    const catClothId = catCloth.dataValues?.id || catCloth.id;

    const [catSports] = await db.Category.findOrCreate({
      where: { name: 'Sports & Outdoors' },
      defaults: { id: uuidv4(), name: 'Sports & Outdoors', description: 'Gear for active lifestyles', userId: storeAdmin1Id },
      transaction,
    });
    const catSportsId = catSports.dataValues?.id || catSports.id;

    const [catHome] = await db.Category.findOrCreate({
      where: { name: 'Home & Living' },
      defaults: { id: uuidv4(), name: 'Home & Living', description: 'Everything for your home', userId: storeAdmin2Id },
      transaction,
    });
    const catHomeId = catHome.dataValues?.id || catHome.id;

    const [catBeauty] = await db.Category.findOrCreate({
      where: { name: 'Beauty & Health' },
      defaults: { id: uuidv4(), name: 'Beauty & Health', description: 'Personal care and wellness', userId: storeAdmin2Id },
      transaction,
    });
    const catBeautyId = catBeauty.dataValues?.id || catBeauty.id;

    // SubCategories — Electronics
    const [subSmartphones] = await db.SubCategory.findOrCreate({
      where: { name: 'Smartphones', categoryId: catElecId },
      defaults: { id: uuidv4(), name: 'Smartphones', categoryId: catElecId, userId: storeAdmin1Id },
      transaction,
    });
    const subSmartphonesId = subSmartphones.dataValues?.id || subSmartphones.id;

    const [subLaptops] = await db.SubCategory.findOrCreate({
      where: { name: 'Laptops', categoryId: catElecId },
      defaults: { id: uuidv4(), name: 'Laptops', categoryId: catElecId, userId: storeAdmin1Id },
      transaction,
    });
    const subLaptopsId = subLaptops.dataValues?.id || subLaptops.id;

    const [subAccessories] = await db.SubCategory.findOrCreate({
      where: { name: 'Accessories', categoryId: catElecId },
      defaults: { id: uuidv4(), name: 'Accessories', categoryId: catElecId, userId: storeAdmin1Id },
      transaction,
    });
    const subAccessoriesId = subAccessories.dataValues?.id || subAccessories.id;

    // SubCategories — Clothing
    const [subMens] = await db.SubCategory.findOrCreate({
      where: { name: "Men's Clothing", categoryId: catClothId },
      defaults: { id: uuidv4(), name: "Men's Clothing", categoryId: catClothId, userId: storeAdmin2Id },
      transaction,
    });
    const subMensId = subMens.dataValues?.id || subMens.id;

    const [subWomens] = await db.SubCategory.findOrCreate({
      where: { name: "Women's Clothing", categoryId: catClothId },
      defaults: { id: uuidv4(), name: "Women's Clothing", categoryId: catClothId, userId: storeAdmin2Id },
      transaction,
    });
    const subWomensId = subWomens.dataValues?.id || subWomens.id;

    const [subShoes] = await db.SubCategory.findOrCreate({
      where: { name: 'Shoes', categoryId: catClothId },
      defaults: { id: uuidv4(), name: 'Shoes', categoryId: catClothId, userId: storeAdmin2Id },
      transaction,
    });
    const subShoesId = subShoes.dataValues?.id || subShoes.id;

    // SubCategories — Sports
    const [subGym] = await db.SubCategory.findOrCreate({
      where: { name: 'Gym & Fitness', categoryId: catSportsId },
      defaults: { id: uuidv4(), name: 'Gym & Fitness', categoryId: catSportsId, userId: storeAdmin1Id },
      transaction,
    });
    const subGymId = subGym.dataValues?.id || subGym.id;

    const [subOutdoor] = await db.SubCategory.findOrCreate({
      where: { name: 'Outdoor Gear', categoryId: catSportsId },
      defaults: { id: uuidv4(), name: 'Outdoor Gear', categoryId: catSportsId, userId: storeAdmin1Id },
      transaction,
    });
    const subOutdoorId = subOutdoor.dataValues?.id || subOutdoor.id;

    // SubCategories — Home
    const [subFurniture] = await db.SubCategory.findOrCreate({
      where: { name: 'Furniture', categoryId: catHomeId },
      defaults: { id: uuidv4(), name: 'Furniture', categoryId: catHomeId, userId: storeAdmin2Id },
      transaction,
    });
    const subFurnitureId = subFurniture.dataValues?.id || subFurniture.id;

    const [subKitchen] = await db.SubCategory.findOrCreate({
      where: { name: 'Kitchen & Dining', categoryId: catHomeId },
      defaults: { id: uuidv4(), name: 'Kitchen & Dining', categoryId: catHomeId, userId: storeAdmin2Id },
      transaction,
    });
    const subKitchenId = subKitchen.dataValues?.id || subKitchen.id;

    // SubCategories — Beauty
    const [subSkincare] = await db.SubCategory.findOrCreate({
      where: { name: 'Skincare', categoryId: catBeautyId },
      defaults: { id: uuidv4(), name: 'Skincare', categoryId: catBeautyId, userId: storeAdmin2Id },
      transaction,
    });
    const subSkincareId = subSkincare.dataValues?.id || subSkincare.id;

    const [subFragrance] = await db.SubCategory.findOrCreate({
      where: { name: 'Fragrance', categoryId: catBeautyId },
      defaults: { id: uuidv4(), name: 'Fragrance', categoryId: catBeautyId, userId: storeAdmin2Id },
      transaction,
    });
    const subFragranceId = subFragrance.dataValues?.id || subFragrance.id;

    // =========================================================================
    // 5. STORES
    // =========================================================================
    console.log('🏪 5. Creating Stores...');

    // Store 1 — Tech store owned by storeAdmin1
    const [store1] = await db.Store.findOrCreate({
      where: { name: 'Tech & Gadget Hub' },
      defaults: {
        id: uuidv4(),
        name: 'Tech & Gadget Hub',
        description: 'Your one-stop shop for the latest electronics and accessories.',
        imgUrl: 'f1.png',
        userId: storeAdmin1Id,
        categoryId: catElecId,
      },
      transaction,
    });
    const store1Id = store1.dataValues?.id || store1.id;

    // Store 2 — Fashion store owned by storeAdmin2
    const [store2] = await db.Store.findOrCreate({
      where: { name: 'Fashion Forward' },
      defaults: {
        id: uuidv4(),
        name: 'Fashion Forward',
        description: 'Trendy clothing and footwear for every style.',
        imgUrl: 'shoes.jpg',
        userId: storeAdmin2Id,
        categoryId: catClothId,
      },
      transaction,
    });
    const store2Id = store2.dataValues?.id || store2.id;

    // Store 3 — Lifestyle store owned by storeAdmin1
    const [store3] = await db.Store.findOrCreate({
      where: { name: 'Active Life Store' },
      defaults: {
        id: uuidv4(),
        name: 'Active Life Store',
        description: 'Sports gear, home goods, and wellness products.',
        imgUrl: 'f3.png',
        userId: storeAdmin1Id,
        categoryId: catSportsId,
      },
      transaction,
    });
    const store3Id = store3.dataValues?.id || store3.id;

    // =========================================================================
    // 6. SIZES
    // =========================================================================
    console.log('📏 6. Creating Sizes...');

    const sizeDefs = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Standard', 'One Size'];
    const sizeMap: Record<string, any> = {};
    for (const s of sizeDefs) {
      const [sizeRec] = await db.Size.findOrCreate({
        where: { size: s },
        defaults: { id: uuidv4(), size: s },
        transaction,
      });
      sizeMap[s] = sizeRec;
    }

    // =========================================================================
    // 7. PRODUCTS & INVENTORY
    // =========================================================================
    console.log('🛍️ 7. Creating Products & Inventory...');

    // Each entry: name, description, price, discount, ownerId, storeId, categoryId, subcategoryId, sizes, images[]
    const productsData = [
      // ── Electronics ──────────────────────────────────────────────────────────
      {
        name: 'iPhone 15 Pro',
        description: 'The most powerful iPhone ever. A17 Pro chip, titanium design, 48MP ProRAW camera system.',
        price: 999.99,
        discount: 0,
        ownerId: storeAdmin1Id,
        storeId: store1Id,
        categoryId: catElecId,
        subcategoryId: subSmartphonesId,
        sizes: ['Standard'],
        images: ['f1.png', '1750342915469-6600-1.jpg'],
        metaTitle: 'iPhone 15 Pro - Buy Online',
        slug: 'iphone-15-pro',
        tags: 'apple,iphone,smartphone',
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Titanium Galaxy with 200MP camera and built-in S Pen. Galaxy AI on every shot.',
        price: 1299.99,
        discount: 5,
        ownerId: storeAdmin1Id,
        storeId: store1Id,
        categoryId: catElecId,
        subcategoryId: subSmartphonesId,
        sizes: ['Standard'],
        images: ['f2.png', '1750342937559-2773-3.jpg'],
        metaTitle: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        tags: 'samsung,galaxy,android,smartphone',
      },
      {
        name: 'MacBook Air M3',
        description: 'Supercharged by M3. Thin, light, up to 18-hour battery. Perfect for work and creativity.',
        price: 1299.99,
        discount: 0,
        ownerId: storeAdmin1Id,
        storeId: store1Id,
        categoryId: catElecId,
        subcategoryId: subLaptopsId,
        sizes: ['Standard'],
        images: ['f3.png', '1750343412995-9612-2.jpg'],
        metaTitle: 'MacBook Air M3 - Buy Online',
        slug: 'macbook-air-m3',
        tags: 'apple,macbook,laptop',
      },
      {
        name: 'Dell XPS 15',
        description: 'Power meets precision. Intel Core i9, OLED display, NVIDIA RTX 4070. Built for professionals.',
        price: 1799.99,
        discount: 10,
        ownerId: storeAdmin1Id,
        storeId: store1Id,
        categoryId: catElecId,
        subcategoryId: subLaptopsId,
        sizes: ['Standard'],
        images: ['1750343447661-8186-3.jpg', '1750343661668-4314-1.jpg'],
        metaTitle: 'Dell XPS 15 Laptop',
        slug: 'dell-xps-15',
        tags: 'dell,laptop,windows',
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise cancelling with two processors and 8 microphones. 30-hour battery.',
        price: 349.99,
        discount: 15,
        ownerId: storeAdmin1Id,
        storeId: store1Id,
        categoryId: catElecId,
        subcategoryId: subAccessoriesId,
        sizes: ['One Size'],
        images: ['1750343695545-5687-4.jpg'],
        metaTitle: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5',
        tags: 'sony,headphones,audio,noise-cancelling',
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Advanced health sensors, brighter display, faster S9 chip. Carbon neutral.',
        price: 399.99,
        discount: 0,
        ownerId: storeAdmin1Id,
        storeId: store1Id,
        categoryId: catElecId,
        subcategoryId: subAccessoriesId,
        sizes: ['S', 'M', 'L'],
        images: ['1750343833987-5799-1.jpg'],
        metaTitle: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        tags: 'apple,watch,wearable',
      },
      // ── Clothing ─────────────────────────────────────────────────────────────
      {
        name: 'Classic White T-Shirt',
        description: '100% premium cotton. Soft, breathable, and perfect for everyday wear. Pre-shrunk.',
        price: 29.99,
        discount: 0,
        ownerId: storeAdmin2Id,
        storeId: store2Id,
        categoryId: catClothId,
        subcategoryId: subMensId,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ['1750343860738-6291-4.jpg'],
        metaTitle: 'Classic White T-Shirt',
        slug: 'classic-white-t-shirt',
        tags: 'tshirt,cotton,mens,casual',
      },
      {
        name: 'Slim Fit Chino Trousers',
        description: 'Modern slim-fit cut in stretch-cotton blend. Machine washable. Available in multiple colors.',
        price: 59.99,
        discount: 20,
        ownerId: storeAdmin2Id,
        storeId: store2Id,
        categoryId: catClothId,
        subcategoryId: subMensId,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['1758056574168-8405-med_scan.jpg'],
        metaTitle: 'Slim Fit Chino Trousers',
        slug: 'slim-fit-chino-trousers',
        tags: 'trousers,chinos,mens',
      },
      {
        name: 'Floral Summer Dress',
        description: 'Light and airy floral print dress. Perfect for warm weather. 100% rayon fabric.',
        price: 79.99,
        discount: 10,
        ownerId: storeAdmin2Id,
        storeId: store2Id,
        categoryId: catClothId,
        subcategoryId: subWomensId,
        sizes: ['XS', 'S', 'M', 'L'],
        images: ['1758667081954-4958-med_scan.jpg'],
        metaTitle: 'Floral Summer Dress',
        slug: 'floral-summer-dress',
        tags: 'dress,womens,summer,floral',
      },
      {
        name: 'Air Cushion Running Shoes',
        description: 'Lightweight air-cushioned running shoes with breathable mesh upper. Ideal for long-distance runs.',
        price: 129.99,
        discount: 0,
        ownerId: storeAdmin2Id,
        storeId: store2Id,
        categoryId: catClothId,
        subcategoryId: subShoesId,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['shoes.jpg', '1760230028649-9450-Capture.PNG'],
        metaTitle: 'Air Cushion Running Shoes',
        slug: 'air-cushion-running-shoes',
        tags: 'shoes,running,sport',
      },
      // ── Sports ───────────────────────────────────────────────────────────────
      {
        name: 'Premium Yoga Mat',
        description: 'Non-slip, eco-friendly 6mm thick yoga mat. Extra-wide design with alignment lines.',
        price: 49.99,
        discount: 0,
        ownerId: storeAdmin1Id,
        storeId: store3Id,
        categoryId: catSportsId,
        subcategoryId: subGymId,
        sizes: ['One Size'],
        images: ['1760230032089-60-Capture.PNG'],
        metaTitle: 'Premium Yoga Mat',
        slug: 'premium-yoga-mat',
        tags: 'yoga,mat,fitness,gym',
      },
      {
        name: 'Adjustable Dumbbell Set',
        description: 'All-in-one adjustable dumbbell set. Replace 15 dumbbells in one. 5-52.5 lbs per dumbbell.',
        price: 299.99,
        discount: 5,
        ownerId: storeAdmin1Id,
        storeId: store3Id,
        categoryId: catSportsId,
        subcategoryId: subGymId,
        sizes: ['Standard'],
        images: ['1760230454174-5425-Capture.PNG'],
        metaTitle: 'Adjustable Dumbbell Set',
        slug: 'adjustable-dumbbell-set',
        tags: 'dumbbells,weights,gym,fitness',
      },
      // ── Home ─────────────────────────────────────────────────────────────────
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. 12oz capacity.',
        price: 39.99,
        discount: 0,
        ownerId: storeAdmin2Id,
        storeId: store3Id,
        categoryId: catHomeId,
        subcategoryId: subKitchenId,
        sizes: ['One Size'],
        images: ['1760642766593-4320-20241027_163212.jpg'],
        metaTitle: 'Ceramic Coffee Mug Set',
        slug: 'ceramic-coffee-mug-set',
        tags: 'mug,coffee,kitchen,home',
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Adjustable lumbar support, armrests, and seat height. Breathable mesh back. 250lb capacity.',
        price: 449.99,
        discount: 15,
        ownerId: storeAdmin2Id,
        storeId: store3Id,
        categoryId: catHomeId,
        subcategoryId: subFurnitureId,
        sizes: ['Standard'],
        images: ['1760813268197-8530-20241027_163212.jpg'],
        metaTitle: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        tags: 'chair,office,furniture,ergonomic',
      },
      // ── Beauty ───────────────────────────────────────────────────────────────
      {
        name: 'Vitamin C Serum',
        description: '20% Vitamin C + Hyaluronic Acid + Vitamin E. Brightens skin, reduces fine lines. 1 fl oz.',
        price: 34.99,
        discount: 0,
        ownerId: storeAdmin2Id,
        storeId: store3Id,
        categoryId: catBeautyId,
        subcategoryId: subSkincareId,
        sizes: ['One Size'],
        images: ['1760813395181-8325-20241027_163212.jpg'],
        metaTitle: 'Vitamin C Serum',
        slug: 'vitamin-c-serum',
        tags: 'skincare,serum,vitamin-c,beauty',
      },
    ];

    const productMap: Record<string, any> = {};

    for (const pData of productsData) {
      const [product] = await db.Product.findOrCreate({
        where: { name: pData.name, storeId: pData.storeId },
        defaults: {
          id: uuidv4(),
          name: pData.name,
          description: pData.description,
          price: pData.price,
          discount: pData.discount,
          isActive: true,
          ownerId: pData.ownerId,
          storeId: pData.storeId,
          categoryId: pData.categoryId,
          subcategoryId: pData.subcategoryId,
          metaTitle: pData.metaTitle || pData.name,
          metaDescription: pData.description.substring(0, 160),
          slug: pData.slug,
          tags: pData.tags,
        },
        transaction,
      });

      const prodId = product.dataValues?.id || product.id;
      productMap[pData.name] = product;

      // Product images
      for (const imgFile of pData.images) {
        await db.ProductImage.findOrCreate({
          where: { productId: prodId, imageUrl: imgFile },
          defaults: { id: uuidv4(), productId: prodId, imageUrl: imgFile },
          transaction,
        });
      }

      // Size items (inventory)
      for (const sizeName of pData.sizes) {
        const sizeRec = sizeMap[sizeName];
        if (!sizeRec) continue;
        const sizeId = sizeRec.dataValues?.id || sizeRec.id;
        await db.SizeItem.findOrCreate({
          where: { productId: prodId, sizeId: sizeId },
          defaults: {
            id: uuidv4(),
            productId: prodId,
            sizeId: sizeId,
            quantity: 75,
          },
          transaction,
        });
      }
    }

    // =========================================================================
    // 8. TAX RULES & SHIPPING METHODS
    // =========================================================================
    console.log('🚚 8. Creating Tax Rules & Shipping Methods...');

    const [taxUS] = await db.TaxRule.findOrCreate({
      where: { region: 'US' },
      defaults: { region: 'US', rate: 0.08, taxType: 'SALES_TAX' },
      transaction,
    });
    const taxUSId = taxUS.dataValues?.id || taxUS.id;

    const [taxEU] = await db.TaxRule.findOrCreate({
      where: { region: 'EU' },
      defaults: { region: 'EU', rate: 0.20, taxType: 'VAT' },
      transaction,
    });

    const [shipStandard] = await db.ShippingMethod.findOrCreate({
      where: { name: 'Standard Shipping' },
      defaults: { name: 'Standard Shipping', cost: 5.99, deliveryEstimate: '5-7 Business Days' },
      transaction,
    });
    const shipStandardId = shipStandard.dataValues?.id || shipStandard.id;

    const [shipExpress] = await db.ShippingMethod.findOrCreate({
      where: { name: 'Express Shipping' },
      defaults: { name: 'Express Shipping', cost: 14.99, deliveryEstimate: '2-3 Business Days' },
      transaction,
    });
    const shipExpressId = shipExpress.dataValues?.id || shipExpress.id;

    const [shipOvernight] = await db.ShippingMethod.findOrCreate({
      where: { name: 'Overnight Shipping' },
      defaults: { name: 'Overnight Shipping', cost: 29.99, deliveryEstimate: 'Next Business Day' },
      transaction,
    });
    const shipOvernightId = shipOvernight.dataValues?.id || shipOvernight.id;

    // =========================================================================
    // 9. PROMOTIONS
    // =========================================================================
    console.log('🎁 9. Creating Promotions...');

    const [promo10] = await db.Promotion.findOrCreate({
      where: { code: 'SAVE10' },
      defaults: {
        code: 'SAVE10',
        type: 'PERCENTAGE',
        value: 10,
        minCartValue: 50,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2026-12-31'),
      },
      transaction,
    });

    const [promo20] = await db.Promotion.findOrCreate({
      where: { code: 'WELCOME20' },
      defaults: {
        code: 'WELCOME20',
        type: 'PERCENTAGE',
        value: 20,
        minCartValue: 100,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2026-12-31'),
      },
      transaction,
    });

    const [promoFixed] = await db.Promotion.findOrCreate({
      where: { code: 'FLAT15' },
      defaults: {
        code: 'FLAT15',
        type: 'FIXED',
        value: 15,
        minCartValue: 75,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2026-06-30'),
      },
      transaction,
    });

    // =========================================================================
    // 10. CARTS
    // =========================================================================
    console.log('🛒 10. Creating Carts...');

    const iphone = productMap['iPhone 15 Pro'];
    const iphoneId = iphone.dataValues?.id || iphone.id;
    const macbook = productMap['MacBook Air M3'];
    const macbookId = macbook.dataValues?.id || macbook.id;
    const tshirt = productMap['Classic White T-Shirt'];
    const tshirtId = tshirt.dataValues?.id || tshirt.id;
    const shoes = productMap['Air Cushion Running Shoes'];
    const shoesId = shoes.dataValues?.id || shoes.id;
    const yogaMat = productMap['Premium Yoga Mat'];
    const yogaMatId = yogaMat.dataValues?.id || yogaMat.id;

    // Cart for Customer 1
    const [cart1] = await db.Cart.findOrCreate({
      where: { userId: customer1Id },
      defaults: { id: uuidv4(), userId: customer1Id },
      transaction,
    });
    const cart1Id = cart1.dataValues?.id || cart1.id;

    const iphoneSizeItem = await db.SizeItem.findOne({ where: { productId: iphoneId }, transaction });
    const tshirtSizeItem = await db.SizeItem.findOne({ where: { productId: tshirtId }, transaction });

    if (iphoneSizeItem) {
      await db.CartItem.findOrCreate({
        where: { cartId: cart1Id, productId: iphoneId, sizeItemId: iphoneSizeItem.dataValues?.id || iphoneSizeItem.id },
        defaults: {
          id: uuidv4(),
          cartId: cart1Id,
          productId: iphoneId,
          sizeItemId: iphoneSizeItem.dataValues?.id || iphoneSizeItem.id,
          sizeId: iphoneSizeItem.dataValues?.sizeId || iphoneSizeItem.sizeId,
          quantity: 1,
        },
        transaction,
      });
    }

    if (tshirtSizeItem) {
      await db.CartItem.findOrCreate({
        where: { cartId: cart1Id, productId: tshirtId, sizeItemId: tshirtSizeItem.dataValues?.id || tshirtSizeItem.id },
        defaults: {
          id: uuidv4(),
          cartId: cart1Id,
          productId: tshirtId,
          sizeItemId: tshirtSizeItem.dataValues?.id || tshirtSizeItem.id,
          sizeId: tshirtSizeItem.dataValues?.sizeId || tshirtSizeItem.sizeId,
          quantity: 2,
        },
        transaction,
      });
    }

    // Cart for Customer 2
    const [cart2] = await db.Cart.findOrCreate({
      where: { userId: customer2Id },
      defaults: { id: uuidv4(), userId: customer2Id },
      transaction,
    });
    const cart2Id = cart2.dataValues?.id || cart2.id;

    const shoesSizeItem = await db.SizeItem.findOne({ where: { productId: shoesId }, transaction });
    const yogaSizeItem = await db.SizeItem.findOne({ where: { productId: yogaMatId }, transaction });

    if (shoesSizeItem) {
      await db.CartItem.findOrCreate({
        where: { cartId: cart2Id, productId: shoesId, sizeItemId: shoesSizeItem.dataValues?.id || shoesSizeItem.id },
        defaults: {
          id: uuidv4(),
          cartId: cart2Id,
          productId: shoesId,
          sizeItemId: shoesSizeItem.dataValues?.id || shoesSizeItem.id,
          sizeId: shoesSizeItem.dataValues?.sizeId || shoesSizeItem.sizeId,
          quantity: 1,
        },
        transaction,
      });
    }

    if (yogaSizeItem) {
      await db.CartItem.findOrCreate({
        where: { cartId: cart2Id, productId: yogaMatId, sizeItemId: yogaSizeItem.dataValues?.id || yogaSizeItem.id },
        defaults: {
          id: uuidv4(),
          cartId: cart2Id,
          productId: yogaMatId,
          sizeItemId: yogaSizeItem.dataValues?.id || yogaSizeItem.id,
          sizeId: yogaSizeItem.dataValues?.sizeId || yogaSizeItem.sizeId,
          quantity: 1,
        },
        transaction,
      });
    }

    // =========================================================================
    // 11. ORDERS (3 orders — delivered, processing, pending)
    // =========================================================================
    console.log('📋 11. Creating Orders...');

    const iphonePrice = iphone.dataValues?.price ?? iphone.price;
    const macbookPrice = macbook.dataValues?.price ?? macbook.price;
    const tshirtPrice = tshirt.dataValues?.price ?? tshirt.price;
    const shoesPrice = shoes.dataValues?.price ?? shoes.price;

    // ── Order 1: Customer1 — Delivered (iPhone + T-Shirt) ────────────────────
    const [pay1] = await db.Payment.findOrCreate({
      where: { paymentIntentId: 'pi_seed_001_delivered' },
      defaults: {
        id: uuidv4(),
        paymentIntentId: 'pi_seed_001_delivered',
        amount: iphonePrice + tshirtPrice * 2 + 5.99,
        currency: 'USD',
        status: 'succeeded',
      },
      transaction,
    });
    const pay1Id = pay1.dataValues?.id || pay1.id;

    const [order1] = await db.Order.findOrCreate({
      where: { paymentId: pay1Id },
      defaults: {
        id: uuidv4(),
        userId: customer1Id,
        paymentId: pay1Id,
        currency: 'USD',
        TaxRuleId: taxUSId,
      },
      transaction,
    });
    const order1Id = order1.dataValues?.id || order1.id;

    if (!pay1.dataValues?.orderId && !pay1.orderId) {
      await pay1.update({ orderId: order1Id }, { transaction });
    }

    await db.OrderItem.findOrCreate({
      where: { orderId: order1Id, productId: iphoneId },
      defaults: { id: uuidv4(), orderId: order1Id, productId: iphoneId, quantity: 1, price: iphonePrice },
      transaction,
    });
    await db.OrderItem.findOrCreate({
      where: { orderId: order1Id, productId: tshirtId },
      defaults: { id: uuidv4(), orderId: order1Id, productId: tshirtId, quantity: 2, price: tshirtPrice },
      transaction,
    });
    await db.OrderShipping.findOrCreate({
      where: { OrderId: order1Id },
      defaults: {
        OrderId: order1Id,
        orderId: order1Id,
        ShippingMethodId: shipStandardId,
        trackingNumber: 'TRK-001-FEDEX-2025',
        carrier: 'FedEx',
        status: 'DELIVERED',
      },
      transaction,
    });

    // ── Order 2: Customer1 — Shipped (MacBook) ───────────────────────────────
    const [pay2] = await db.Payment.findOrCreate({
      where: { paymentIntentId: 'pi_seed_002_shipped' },
      defaults: {
        id: uuidv4(),
        paymentIntentId: 'pi_seed_002_shipped',
        amount: macbookPrice + 14.99,
        currency: 'USD',
        status: 'succeeded',
      },
      transaction,
    });
    const pay2Id = pay2.dataValues?.id || pay2.id;

    const [order2] = await db.Order.findOrCreate({
      where: { paymentId: pay2Id },
      defaults: {
        id: uuidv4(),
        userId: customer1Id,
        paymentId: pay2Id,
        currency: 'USD',
        TaxRuleId: taxUSId,
      },
      transaction,
    });
    const order2Id = order2.dataValues?.id || order2.id;

    if (!pay2.dataValues?.orderId && !pay2.orderId) {
      await pay2.update({ orderId: order2Id }, { transaction });
    }

    const macbookSizeItem = await db.SizeItem.findOne({ where: { productId: macbookId }, transaction });
    await db.OrderItem.findOrCreate({
      where: { orderId: order2Id, productId: macbookId },
      defaults: { id: uuidv4(), orderId: order2Id, productId: macbookId, quantity: 1, price: macbookPrice },
      transaction,
    });
    await db.OrderShipping.findOrCreate({
      where: { OrderId: order2Id },
      defaults: {
        OrderId: order2Id,
        orderId: order2Id,
        ShippingMethodId: shipExpressId,
        trackingNumber: 'TRK-002-UPS-2025',
        carrier: 'UPS',
        status: 'SHIPPED',
      },
      transaction,
    });

    // ── Order 3: Customer2 — Pending (Shoes) ─────────────────────────────────
    const [pay3] = await db.Payment.findOrCreate({
      where: { paymentIntentId: 'pi_seed_003_pending' },
      defaults: {
        id: uuidv4(),
        paymentIntentId: 'pi_seed_003_pending',
        amount: shoesPrice + 29.99,
        currency: 'USD',
        status: 'pending',
      },
      transaction,
    });
    const pay3Id = pay3.dataValues?.id || pay3.id;

    const [order3] = await db.Order.findOrCreate({
      where: { paymentId: pay3Id },
      defaults: {
        id: uuidv4(),
        userId: customer2Id,
        paymentId: pay3Id,
        currency: 'USD',
        TaxRuleId: taxUSId,
      },
      transaction,
    });
    const order3Id = order3.dataValues?.id || order3.id;

    if (!pay3.dataValues?.orderId && !pay3.orderId) {
      await pay3.update({ orderId: order3Id }, { transaction });
    }

    await db.OrderItem.findOrCreate({
      where: { orderId: order3Id, productId: shoesId },
      defaults: { id: uuidv4(), orderId: order3Id, productId: shoesId, quantity: 1, price: shoesPrice },
      transaction,
    });
    await db.OrderShipping.findOrCreate({
      where: { OrderId: order3Id },
      defaults: {
        OrderId: order3Id,
        orderId: order3Id,
        ShippingMethodId: shipOvernightId,
        trackingNumber: 'TRK-003-DHL-2025',
        carrier: 'DHL',
        status: 'PENDING',
      },
      transaction,
    });

    // ── Promotion on Order 1 ─────────────────────────────────────────────────
    if (db.PromotionOrders) {
      await db.PromotionOrders.findOrCreate({
        where: { OrderId: order1Id, PromotionId: promo10.dataValues?.id || promo10.id },
        defaults: {
          OrderId: order1Id,
          PromotionId: promo10.dataValues?.id || promo10.id,
        },
        transaction,
      });
    }

    // =========================================================================
    // 12. RETURN REQUESTS
    // =========================================================================
    console.log('↩️ 12. Creating Return Requests...');

    await db.ReturnRequest.findOrCreate({
      where: { orderId: order1Id, userId: customer1Id },
      defaults: {
        orderId: order1Id,
        userId: customer1Id,
        reason: 'Product arrived damaged. Screen cracked on delivery.',
        status: 'PENDING',
        refundAmount: iphonePrice,
      },
      transaction,
    });

    await db.ReturnRequest.findOrCreate({
      where: { orderId: order2Id, userId: customer1Id },
      defaults: {
        orderId: order2Id,
        userId: customer1Id,
        reason: 'Received wrong model. Ordered 16GB but got 8GB.',
        status: 'APPROVED',
        refundAmount: macbookPrice,
        resolutionNote: 'Replacement unit dispatched. Full refund issued.',
      },
      transaction,
    });

    // =========================================================================
    // 13. COMMENTS (Reviews)
    // =========================================================================
    console.log('💬 13. Creating Comments...');

    const reviews = [
      { userId: customer1Id, productId: iphoneId, text: 'Incredible phone. The camera quality is unmatched. Best iPhone ever made.', rating: 5 },
      { userId: customer2Id, productId: iphoneId, text: 'Great performance but a bit pricey. Worth it if you can afford it.', rating: 4 },
      { userId: customer1Id, productId: macbookId, text: 'M3 chip is insanely fast. Battery lasts all day. Zero regrets.', rating: 5 },
      { userId: customer2Id, productId: tshirtId, text: 'Soft fabric and great fit. Washed it multiple times, still looks brand new.', rating: 5 },
      { userId: customer1Id, productId: tshirtId, text: 'Good quality for the price. True to size.', rating: 4 },
      { userId: customer2Id, productId: shoesId, text: 'Super comfortable for running. Great cushioning.', rating: 5 },
      { userId: customer1Id, productId: yogaMatId, text: 'Very grippy, does not slide during hot yoga. Good thickness.', rating: 4 },
    ];

    for (const r of reviews) {
      await db.Comment.findOrCreate({
        where: { userId: r.userId, productId: r.productId },
        defaults: { id: uuidv4(), ...r },
        transaction,
      });
    }

    // =========================================================================
    // 14. FAVORITES
    // =========================================================================
    console.log('❤️ 14. Creating Favorites...');

    const favData = [
      { userId: customer1Id, productId: macbookId },
      { userId: customer1Id, productId: shoesId },
      { userId: customer2Id, productId: iphoneId },
      { userId: customer2Id, productId: yogaMatId },
    ];

    for (const fav of favData) {
      const [favorite] = await db.Favorite.findOrCreate({
        where: { userId: fav.userId, productId: fav.productId },
        defaults: { id: uuidv4(), userId: fav.userId, productId: fav.productId },
        transaction,
      });
      const favId = favorite.dataValues?.id || favorite.id;
      await db.FavoriteItem.findOrCreate({
        where: { favoriteId: favId, productId: fav.productId },
        defaults: { id: uuidv4(), favoriteId: favId, productId: fav.productId },
        transaction,
      });
    }

    // =========================================================================
    // 15. ARTICLES
    // =========================================================================
    console.log('📰 15. Creating Articles...');

    const articles = [
      {
        title: 'Top 5 Smartphones of 2025',
        text: 'The smartphone market is more competitive than ever. Here are our top picks for 2025: iPhone 15 Pro, Samsung Galaxy S24, Google Pixel 8 Pro, OnePlus 12, and Xiaomi 14 Ultra.',
        type: 'blog',
        userId: storeAdmin1Id,
      },
      {
        title: 'How to Choose the Right Running Shoes',
        text: 'Choosing the right running shoes depends on your foot type, gait, and the terrain you run on. Consider getting a gait analysis at a specialist store. Key factors: cushioning, stability, and fit.',
        type: 'blog',
        userId: storeAdmin2Id,
      },
      {
        title: 'New Season Collection Arrived',
        text: 'Our new summer 2025 collection is now available. Fresh colors, breathable fabrics, and styles for every occasion. Shop now for up to 20% off launch prices.',
        type: 'announcement',
        userId: storeAdmin2Id,
      },
      {
        title: 'MacBook Air M3 Full Review',
        text: 'We have been using the MacBook Air M3 for 3 months now. Verdict: it is the best laptop for most people. Superb battery life, fanless design, and M3 chip handles everything effortlessly.',
        type: 'review',
        userId: storeAdmin1Id,
      },
    ];

    for (const art of articles) {
      await db.Article.findOrCreate({
        where: { title: art.title },
        defaults: { id: uuidv4(), ...art },
        transaction,
      });
    }

    // =========================================================================
    // 16. ANALYTICS EVENTS
    // =========================================================================
    console.log('📊 16. Creating Analytics Events...');

    const analyticsEvents = [
      { eventType: 'page_view', userId: customer1Id, sessionId: 'sess_001', pageUrl: '/products' },
      { eventType: 'product_view', userId: customer1Id, sessionId: 'sess_001', pageUrl: `/product/${iphoneId}`, eventData: { productId: iphoneId, productName: 'iPhone 15 Pro' } },
      { eventType: 'add_to_cart', userId: customer1Id, sessionId: 'sess_001', pageUrl: `/product/${iphoneId}`, eventData: { productId: iphoneId, quantity: 1 } },
      { eventType: 'purchase', userId: customer1Id, sessionId: 'sess_001', pageUrl: '/checkout', eventData: { orderId: order1Id, amount: iphonePrice + tshirtPrice * 2 } },
      { eventType: 'page_view', userId: customer2Id, sessionId: 'sess_002', pageUrl: '/store' },
      { eventType: 'product_view', userId: customer2Id, sessionId: 'sess_002', pageUrl: `/product/${shoesId}`, eventData: { productId: shoesId, productName: 'Air Cushion Running Shoes' } },
      { eventType: 'search', userId: customer2Id, sessionId: 'sess_002', pageUrl: '/search', eventData: { query: 'running shoes', results: 3 } },
      { eventType: 'purchase', userId: customer2Id, sessionId: 'sess_002', pageUrl: '/checkout', eventData: { orderId: order3Id, amount: shoesPrice } },
    ];

    for (const evt of analyticsEvents) {
      await db.Analytics.findOrCreate({
        where: { eventType: evt.eventType, userId: evt.userId, sessionId: evt.sessionId },
        defaults: {
          eventType: evt.eventType,
          userId: evt.userId,
          sessionId: evt.sessionId,
          pageUrl: evt.pageUrl,
          eventData: (evt as any).eventData || {},
        },
        transaction,
      });
    }

    // =========================================================================
    // 17. USER SESSIONS
    // =========================================================================
    console.log('🔑 17. Creating User Sessions...');

    const sessions = [
      { userId: customer1Id, ipAddress: '192.168.1.10', deviceType: 'Desktop' },
      { userId: customer2Id, ipAddress: '192.168.1.20', deviceType: 'Mobile' },
      { userId: storeAdmin1Id, ipAddress: '10.0.0.5', deviceType: 'Desktop' },
      { userId: storeAdmin2Id, ipAddress: '10.0.0.6', deviceType: 'Tablet' },
    ];

    for (const s of sessions) {
      await db.UserSession.findOrCreate({
        where: { userId: s.userId },
        defaults: {
          userId: s.userId,
          ipAddress: s.ipAddress,
          deviceType: s.deviceType,
          loginAt: new Date(),
        },
        transaction,
      });
    }

    // =========================================================================
    // 18. TRANSLATIONS
    // =========================================================================
    console.log('🌐 18. Creating Translations...');

    const translations = [
      { model: 'Product', recordId: iphoneId, language: 'es', field: 'name', translation: 'iPhone 15 Pro (Español)' },
      { model: 'Product', recordId: iphoneId, language: 'fr', field: 'name', translation: 'iPhone 15 Pro (Français)' },
      { model: 'Category', recordId: catElecId, language: 'es', field: 'name', translation: 'Electrónica' },
      { model: 'Category', recordId: catClothId, language: 'es', field: 'name', translation: 'Ropa' },
    ];

    for (const t of translations) {
      await db.Translation.findOrCreate({
        where: { model: t.model, recordId: t.recordId, language: t.language, field: t.field },
        defaults: t,
        transaction,
      });
    }

    // =========================================================================
    // 19. AUDIT LOGS
    // =========================================================================
    console.log('📝 19. Creating Audit Logs...');

    const auditLogs = [
      { action: 'create_product', entity: 'Product', entityId: iphoneId, performedById: storeAdmin1Id, snapshot: { name: 'iPhone 15 Pro', price: 999.99 } },
      { action: 'create_product', entity: 'Product', entityId: macbookId, performedById: storeAdmin1Id, snapshot: { name: 'MacBook Air M3', price: 1299.99 } },
      { action: 'create_store', entity: 'Store', entityId: store1Id, performedById: storeAdmin1Id, snapshot: { name: 'Tech & Gadget Hub' } },
      { action: 'create_order', entity: 'Order', entityId: order1Id, performedById: customer1Id, snapshot: { total: iphonePrice + tshirtPrice * 2 } },
      { action: 'assign_role', entity: 'User', entityId: storeAdmin1Id, performedById: superAdminUserId, snapshot: { role: 'ADMIN' } },
    ];

    for (const log of auditLogs) {
      await db.AuditLog.findOrCreate({
        where: { action: log.action, entityId: log.entityId },
        defaults: log,
        transaction,
      });
    }

    // =========================================================================
    // COMMIT
    // =========================================================================
    await transaction.commit();

    console.log('\n✅✅✅ Comprehensive Data Seeding Completed Successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Super Admin : admin@admin.com       / 123456');
    console.log('  Store Admin1: admin@store.com       / 123456');
    console.log('  Store Admin2: fashion@store.com     / 123456');
    console.log('  Customer 1  : customer@example.com  / 123456');
    console.log('  Customer 2  : jane@example.com      / 123456');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n  SEEDED DATA SUMMARY');
    console.log('  • 5 Users (1 super admin, 2 store admins, 2 customers)');
    console.log('  • 4 Packages (Free, Starter, Pro, Enterprise)');
    console.log('  • 5 Categories / 12 SubCategories');
    console.log('  • 3 Stores');
    console.log('  • 8 Sizes');
    console.log('  • 15 Products with images and inventory');
    console.log('  • 2 Carts with items');
    console.log('  • 3 Orders (delivered, shipped, pending)');
    console.log('  • 3 Shipping Methods / 2 Tax Rules / 3 Promotions');
    console.log('  • 7 Product Reviews / 4 Favorites');
    console.log('  • 4 Articles / 8 Analytics Events');
    console.log('  • Audit Logs, Sessions, Translations');
    console.log('═══════════════════════════════════════════════════════\n');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Data Seeding Failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}
