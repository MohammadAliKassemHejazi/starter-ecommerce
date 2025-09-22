import db from '../models';

/**
 * RLS-Based Multi-Tenant Setup
 * This implements Row Level Security for better performance and SSG compatibility
 */

export const setupRLSMultiTenant = async (): Promise<void> => {
  try {
    console.log('🚀 Setting up RLS-based multi-tenant system...');

    // 1. Create tenants table
    await createTenantsTable();
    console.log('✅ Tenants table created');

    // 2. Add tenant_id to all existing tables
    await addTenantIdToTables();
    console.log('✅ Added tenant_id to all tables');

    // 3. Enable RLS on all tables
    await enableRLSOnTables();
    console.log('✅ Enabled RLS on all tables');

    // 4. Create RLS policies
    await createRLSPolicies();
    console.log('✅ Created RLS policies');

    // 5. Create default tenant
    await createDefaultTenant();
    console.log('✅ Created default tenant');

    // 6. Update existing data
    await updateExistingData();
    console.log('✅ Updated existing data');

    console.log('🎉 RLS-based multi-tenant setup completed!');
    console.log('\n📚 How it works:');
    console.log('  - Each request sets current_tenant_id in PostgreSQL session');
    console.log('  - RLS automatically filters data to only show tenant\'s data');
    console.log('  - Perfect for SSG - no schema switching needed');
    console.log('  - Better performance than schema-per-tenant');

  } catch (error) {
    console.error('❌ RLS setup failed:', error);
    throw error;
  }
};

async function createTenantsTable() {
  await db.sequelize.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(200) NOT NULL,
      owner_id UUID NOT NULL REFERENCES users(id),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create index for performance
  await db.sequelize.query(`
    CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
    CREATE INDEX IF NOT EXISTS idx_tenants_owner ON tenants(owner_id);
  `);
}

async function addTenantIdToTables() {
  const tables = [
    'products', 'orders', 'carts', 'cartitems', 'favorites', 'favoriteitems',
    'comments', 'stores', 'categories', 'subcategories', 'payments',
    'promotions', 'articles', 'packages', 'shippingmethods', 'sizes',
    'taxrules', 'usersessions', 'analytics', 'translations', 'auditlogs',
    'returnrequests', 'ordershippings', 'orderitems', 'productimages',
    'sizeitems', 'userpackages'
  ];

  for (const table of tables) {
    try {
      // Add tenant_id column if it doesn't exist
      await db.sequelize.query(`
        ALTER TABLE ${table} 
        ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
      `);

      // Create index for performance
      await db.sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_${table}_tenant_id ON ${table}(tenant_id);
      `);
    } catch (error) {
      console.warn(`⚠️ Could not add tenant_id to ${table}:`, (error as Error).message);
    }
  }
}

async function enableRLSOnTables() {
  const tables = [
    'products', 'orders', 'carts', 'cartitems', 'favorites', 'favoriteitems',
    'comments', 'stores', 'categories', 'subcategories', 'payments',
    'promotions', 'articles', 'packages', 'shippingmethods', 'sizes',
    'taxrules', 'usersessions', 'analytics', 'translations', 'auditlogs',
    'returnrequests', 'ordershippings', 'orderitems', 'productimages',
    'sizeitems', 'userpackages'
  ];

  for (const table of tables) {
    try {
      await db.sequelize.query(`
        ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
      `);
    } catch (error) {
      console.warn(`⚠️ Could not enable RLS on ${table}:`, (error as Error).message);
    }
  }
}

async function createRLSPolicies() {
  const tables = [
    'products', 'orders', 'carts', 'cartitems', 'favorites', 'favoriteitems',
    'comments', 'stores', 'categories', 'subcategories', 'payments',
    'promotions', 'articles', 'packages', 'shippingmethods', 'sizes',
    'taxrules', 'usersessions', 'analytics', 'translations', 'auditlogs',
    'returnrequests', 'ordershippings', 'orderitems', 'productimages',
    'sizeitems', 'userpackages'
  ];

  for (const table of tables) {
    try {
      // Drop existing policy if it exists
      await db.sequelize.query(`
        DROP POLICY IF EXISTS tenant_isolation_policy ON ${table};
      `);

      // Create tenant isolation policy
      await db.sequelize.query(`
        CREATE POLICY tenant_isolation_policy ON ${table}
        FOR ALL TO PUBLIC
        USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
      `);
    } catch (error) {
      console.warn(`⚠️ Could not create RLS policy for ${table}:`, (error as Error).message);
    }
  }
}

async function createDefaultTenant() {
  // Create default tenant
  await db.sequelize.query(`
    INSERT INTO tenants (slug, name, owner_id) 
    VALUES ('default', 'Default Store', (SELECT id FROM users LIMIT 1))
    ON CONFLICT (slug) DO NOTHING;
  `);

  // Create demo tenant
  await db.sequelize.query(`
    INSERT INTO tenants (slug, name, owner_id) 
    VALUES ('demo', 'Demo Store', (SELECT id FROM users LIMIT 1))
    ON CONFLICT (slug) DO NOTHING;
  `);
}

async function updateExistingData() {
  // Get default tenant ID
  const defaultTenant = await db.sequelize.query(`
    SELECT id FROM tenants WHERE slug = 'default'
  `, { type: db.Sequelize.QueryTypes.SELECT });

  if (defaultTenant.length > 0) {
    const tenantId = defaultTenant[0].id;
    
    // Update existing data to belong to default tenant
    const tables = [
      'products', 'orders', 'carts', 'cartitems', 'favorites', 'favoriteitems',
      'comments', 'stores', 'categories', 'subcategories', 'payments',
      'promotions', 'articles', 'packages', 'shippingmethods', 'sizes',
      'taxrules', 'usersessions', 'analytics', 'translations', 'auditlogs',
      'returnrequests', 'ordershippings', 'orderitems', 'productimages',
      'sizeitems', 'userpackages'
    ];

    for (const table of tables) {
      try {
        await db.sequelize.query(`
          UPDATE ${table} 
          SET tenant_id = '${tenantId}' 
          WHERE tenant_id IS NULL;
        `);
      } catch (error) {
        console.warn(`⚠️ Could not update ${table}:`, (error as Error).message);
      }
    }
  }
}

// Run if called directly
if (require.main === module) {
  setupRLSMultiTenant()
    .then(() => {
      console.log('🎉 RLS setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 RLS setup failed:', error);
      process.exit(1);
    });
}
