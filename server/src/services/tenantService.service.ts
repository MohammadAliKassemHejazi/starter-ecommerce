import db from '../models';

/**
 * Tenant Service - Handles schema creation and management
 * This service creates new schemas for stores and manages the mapping
 */
export class TenantService {
  
  /**
   * Create a new store with its own schema
   */
  async createStoreWithSchema(storeData: {
    slug: string;
    storeName: string;
    ownerId: string;
  }) {
    try {
      // Generate unique schema name
      const schemaName = `store_${storeData.slug}_${Date.now()}`;
      
      // Create the schema
      await this.createSchema(schemaName);
      
      // Create tables in the new schema
      await this.createTablesInSchema(schemaName);
      
      // Create store mapping record
      const storeMapping = await db.StoreMapping.create({
        slug: storeData.slug,
        schemaName: schemaName,
        storeName: storeData.storeName,
        ownerId: storeData.ownerId,
        isActive: true
      });

      // Copy owner to the new schema
      await this.copyUserToSchema(schemaName, storeData.ownerId);
      
      // Set up default data
      await this.setupDefaultStoreData(schemaName);

      console.log(`✅ Store created: ${storeData.slug} -> ${schemaName}`);
      return storeMapping;
    } catch (error) {
      console.error('❌ Failed to create store with schema:', error);
      throw error;
    }
  }

  /**
   * Create a new PostgreSQL schema
   */
  private async createSchema(schemaName: string) {
    await db.sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  }

  /**
   * Create all necessary tables in the schema
   */
  private async createTablesInSchema(schemaName: string) {
    // Get all table names from public schema
    const tables = await db.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name NOT LIKE 'pg_%'
      AND table_name != 'store_mappings'
    `, { type: db.Sequelize.QueryTypes.SELECT });

    // Create each table in the new schema
    for (const table of tables) {
      await db.sequelize.query(`
        CREATE TABLE "${schemaName}"."${table.table_name}" 
        (LIKE public."${table.table_name}" INCLUDING ALL)
      `);
    }

    // Create sequences for the new tables
    const sequences = await db.sequelize.query(`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `, { type: db.Sequelize.QueryTypes.SELECT });

    for (const seq of sequences) {
      await db.sequelize.query(`
        CREATE SEQUENCE "${schemaName}"."${seq.sequence_name}" 
        OWNED BY "${schemaName}"."${seq.sequence_name}"
      `);
    }
  }

  /**
   * Copy user data to the new schema
   */
  private async copyUserToSchema(schemaName: string, userId: string) {
    // Copy user
    await db.sequelize.query(`
      INSERT INTO "${schemaName}".users 
      SELECT * FROM public.users WHERE id = '${userId}'
    `);

    // Copy user roles
    await db.sequelize.query(`
      INSERT INTO "${schemaName}".roleusers 
      SELECT * FROM public.roleusers WHERE userid = '${userId}'
    `);
  }

  /**
   * Set up default data for the store
   */
  private async setupDefaultStoreData(schemaName: string) {
    // Copy roles and permissions
    await db.sequelize.query(`
      INSERT INTO "${schemaName}".roles 
      SELECT * FROM public.roles
    `);

    await db.sequelize.query(`
      INSERT INTO "${schemaName}".permissions 
      SELECT * FROM public.permissions
    `);

    await db.sequelize.query(`
      INSERT INTO "${schemaName}".rolepermissions 
      SELECT * FROM public.rolepermissions
    `);

    // Copy categories
    await db.sequelize.query(`
      INSERT INTO "${schemaName}".categories 
      SELECT * FROM public.categories
    `);

    await db.sequelize.query(`
      INSERT INTO "${schemaName}".subcategories 
      SELECT * FROM public.subcategories
    `);
  }

  /**
   * Get store mapping by slug
   */
  async getStoreBySlug(slug: string) {
    return await db.StoreMapping.findOne({
      where: { slug, isActive: true },
      include: [{ model: db.User, as: 'Owner' }]
    });
  }

  /**
   * Set search path to store schema
   */
  async setStoreContext(schemaName: string) {
    await db.sequelize.query(`SET search_path TO "${schemaName}", public`);
  }

  /**
   * Reset search path to default
   */
  async resetContext() {
    await db.sequelize.query('SET search_path TO public');
  }

  /**
   * Get all stores for a user
   */
  async getUserStores(userId: string) {
    return await db.StoreMapping.findAll({
      where: { ownerId: userId, isActive: true },
      include: [{ model: db.User, as: 'Owner' }]
    });
  }

  /**
   * Delete a store and its schema
   */
  async deleteStore(slug: string) {
    const store = await this.getStoreBySlug(slug);
    if (!store) {
      throw new Error('Store not found');
    }

    // Drop the schema
    await db.sequelize.query(`DROP SCHEMA IF EXISTS "${store.schemaName}" CASCADE`);

    // Mark as inactive
    await store.update({ isActive: false });

    return true;
  }
}

export const tenantService = new TenantService();
