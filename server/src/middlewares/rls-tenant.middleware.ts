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
 * RLS-Based Tenant Middleware
 * Sets tenant context using PostgreSQL session variables for Row Level Security
 * This middleware is backward compatible with existing frontend
 */
export const tenantMiddleware = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    // Extract tenant from various sources (priority order)
    const tenantSlug = 
      req.headers['x-tenant-slug'] as string ||           // Header: X-Tenant-Slug
      req.headers['tenant-slug'] as string ||             // Header: tenant-slug
      req.subdomains[0] ||                                // Subdomain: tenant.domain.com
      req.params.tenant ||                                // Route param: /:tenant/...
      req.query.tenant as string ||                       // Query param: ?tenant=store1
      req.body?.tenantSlug ||                             // Body param
      req.body?.tenant ||                                 // Body param (alternative)
      'default';                                          // Default fallback

    console.log(`🔍 Resolving tenant: ${tenantSlug}`);

    // Get tenant info from database using proper model
    const tenant = await db.Tenant.findOne({
      where: { slug: tenantSlug, isActive: true }
    });

    if (!tenant) {
      console.error(`❌ Tenant not found: ${tenantSlug}`);
      return res.status(404).json({ 
        success: false,
        error: 'Tenant not found',
        tenantSlug 
      });
    }

    const tenantInfo = tenant.toJSON();
    req.tenantId = tenantInfo.id;
    req.tenantSlug = tenantInfo.slug;
    req.tenantName = tenantInfo.name;

    console.log(`✅ Tenant resolved: ${tenantInfo.name} (${tenantInfo.slug})`);

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
    res.status(500).json({ 
      success: false,
      error: 'Tenant resolution failed',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
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
      req.body?.tenantSlug;

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
