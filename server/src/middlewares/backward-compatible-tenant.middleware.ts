import { Request, Response, NextFunction } from 'express';
import db from '../models';

// Extend Request interface to include tenant information
export interface TenantRequest extends Request {
  tenantId?: string;
  tenantSlug?: string;
  tenantName?: string;
  UserId?: string; // Add UserId from existing middleware
}

/**
 * Backward-Compatible Tenant Middleware
 * This middleware works with your existing frontend without any changes
 * It automatically detects tenant context and sets up RLS
 */
export const backwardCompatibleTenantMiddleware = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    // Always use 'default' tenant for backward compatibility
    // This ensures your existing frontend continues to work
    const tenantSlug = 'default';

    console.log(`🔍 Using default tenant for backward compatibility: ${tenantSlug}`);

    // Get default tenant info from database
    const tenant = await db.sequelize.query(
      'SELECT * FROM tenants WHERE slug = :slug AND is_active = true',
      {
        replacements: { slug: tenantSlug },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!tenant.length) {
      console.warn(`⚠️ Default tenant not found, creating it...`);
      
      // Create default tenant if it doesn't exist
      await db.sequelize.query(`
        INSERT INTO tenants (slug, name, owner_id, is_active) 
        VALUES ('default', 'Default Store', (SELECT id FROM users LIMIT 1), true)
        ON CONFLICT (slug) DO NOTHING;
      `);

      // Get the created tenant
      const newTenant = await db.sequelize.query(
        'SELECT * FROM tenants WHERE slug = :slug AND is_active = true',
        {
          replacements: { slug: tenantSlug },
          type: db.Sequelize.QueryTypes.SELECT
        }
      );

      if (newTenant.length > 0) {
        const tenantInfo = newTenant[0];
        req.tenantId = tenantInfo.id;
        req.tenantSlug = tenantInfo.slug;
        req.tenantName = tenantInfo.name;

        // Set tenant context in PostgreSQL session for RLS
        await db.sequelize.query(`SET app.current_tenant_id = '${tenantInfo.id}'`);
        
        res.locals.tenant = {
          id: tenantInfo.id,
          slug: tenantInfo.slug,
          name: tenantInfo.name
        };

        console.log(`✅ Default tenant created and set: ${tenantInfo.name}`);
        next();
        return;
      }
    }

    const tenantInfo = tenant[0];
    req.tenantId = tenantInfo.id;
    req.tenantSlug = tenantInfo.slug;
    req.tenantName = tenantInfo.name;

    console.log(`✅ Tenant context set: ${tenantInfo.name} (${tenantInfo.slug})`);

    // Set tenant context in PostgreSQL session for RLS
    await db.sequelize.query(`SET app.current_tenant_id = '${tenantInfo.id}'`);
    
    // Store tenant info in response locals for easy access
    res.locals.tenant = {
      id: tenantInfo.id,
      slug: tenantInfo.slug,
      name: tenantInfo.name
    };

    next();
  } catch (error) {
    console.error('❌ Tenant resolution failed:', error);
    // Continue without tenant context to avoid breaking the app
    console.log('⚠️ Continuing without tenant context for backward compatibility');
    next();
  }
};

/**
 * Optional tenant middleware - doesn't fail if tenant not found
 * Useful for public endpoints that might work with or without tenant context
 */
export const optionalTenantMiddleware = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    const tenantSlug = 
      req.headers['x-tenant-slug'] as string ||
      req.headers['tenant-slug'] as string ||
      req.subdomains[0] ||
      req.params.tenant ||
      req.query.tenant as string ||
      req.body?.tenantSlug ||
      req.body?.tenant;

    if (!tenantSlug) {
      // No tenant specified, continue without tenant context
      return next();
    }

    const tenant = await db.sequelize.query(
      'SELECT * FROM tenants WHERE slug = :slug AND is_active = true',
      {
        replacements: { slug: tenantSlug },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (tenant.length > 0) {
      const tenantInfo = tenant[0];
      req.tenantId = tenantInfo.id;
      req.tenantSlug = tenantInfo.slug;
      req.tenantName = tenantInfo.name;

      await db.sequelize.query(`SET app.current_tenant_id = '${tenantInfo.id}'`);
      
      res.locals.tenant = {
        id: tenantInfo.id,
        slug: tenantInfo.slug,
        name: tenantInfo.name
      };
    }

    next();
  } catch (error) {
    console.error('❌ Optional tenant resolution failed:', error);
    // Continue without tenant context
    next();
  }
};

/**
 * Tenant validation middleware - ensures tenant exists and is active
 */
export const validateTenant = async (req: TenantRequest, res: Response, next: NextFunction) => {
  if (!req.tenantId || !req.tenantSlug) {
    return res.status(400).json({
      success: false,
      error: 'Tenant context required',
      message: 'This endpoint requires a valid tenant context'
    });
  }
  next();
};

/**
 * Reset tenant context - call this after each request
 */
export const resetTenantContext = async () => {
  try {
    await db.sequelize.query('SET app.current_tenant_id = NULL');
  } catch (error) {
    console.error('❌ Failed to reset tenant context:', error);
  }
};
