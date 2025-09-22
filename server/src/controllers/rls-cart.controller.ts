import { Response, NextFunction } from 'express';
import {
  getCart as getCartService,
  addToCart as addToCartService,
  decreaseCart as decreaseCartService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from '../services/cart.service';
import { TenantRequest } from '../middlewares/rls-tenant.middleware';

/**
 * RLS-Based Cart Controller
 * Handles cart operations with automatic tenant isolation via RLS
 */

// Get the user's cart
export const getCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.tenantId) {
      return res.status(400).json({ 
        success: false,
        error: 'Tenant context required' 
      });
    }

    const userId = req.UserId ?? "";
    // RLS automatically filters to tenant's cart data
    const cart = await getCartService(userId);
    res.status(200).json({
      success: true,
      cart: cart,
      tenant: {
        id: req.tenantId,
        slug: req.tenantSlug
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add/update item in the cart
export const addToCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.tenantId) {
      return res.status(400).json({ 
        success: false,
        error: 'Tenant context required' 
      });
    }

    const userId = req.UserId ?? "";
    const { productId, quantity, sizeId } = req.body;
    
    // RLS automatically ensures user can only add products from their tenant
    const cartItem = await addToCartService(userId, productId, quantity, sizeId);
    res.status(200).json({
      success: true,
      cartItem: cartItem,
      tenant: {
        id: req.tenantId,
        slug: req.tenantSlug
      }
    });
  } catch (error) {
    next(error);
  }
};

// Decrease item quantity in the cart
export const decreaseCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.tenantId) {
      return res.status(400).json({ 
        success: false,
        error: 'Tenant context required' 
      });
    }

    const userId = req.UserId ?? "";
    const { productId, quantity, sizeId } = req.body;
    
    // RLS automatically ensures user can only modify their tenant's cart
    const cartItem = await decreaseCartService(userId, productId, quantity, sizeId);
    res.status(200).json({
      success: true,
      cartItem: cartItem,
      tenant: {
        id: req.tenantId,
        slug: req.tenantSlug
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from the cart
export const removeFromCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.tenantId) {
      return res.status(400).json({ 
        success: false,
        error: 'Tenant context required' 
      });
    }

    const userId = req.UserId ?? "";
    const { productId, sizeId } = req.body;
    
    // RLS automatically ensures user can only remove items from their tenant's cart
    const result = await removeFromCartService(userId, productId, sizeId);
    res.status(200).json({
      success: true,
      result: result,
      tenant: {
        id: req.tenantId,
        slug: req.tenantSlug
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear the entire cart
export const clearCart = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.tenantId) {
      return res.status(400).json({ 
        success: false,
        error: 'Tenant context required' 
      });
    }

    const userId = req.UserId ?? "";
    
    // RLS automatically ensures user can only clear their tenant's cart
    const result = await clearCartService(userId);
    res.status(200).json({
      success: true,
      result: result,
      tenant: {
        id: req.tenantId,
        slug: req.tenantSlug
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart
};
