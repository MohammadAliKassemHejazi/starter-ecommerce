// controllers/cart.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  getCart as getCartService,
  addToCart as addToCartService,
  decreaseCart as decreaseCartService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from '../services/cart.service';
import { CustomRequest } from 'interfaces/types/middlewares/request.middleware.types';

// Get the user's cart
export const getCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.UserId) {
      return res.status(200).json({ message: '' });
    }
    const userId = req.UserId ?? "";
    const cart = await getCartService(userId);
    
    const responseData: any = cart;
    

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

// Add/update item in the cart

export const addToCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.UserId ?? "";
        const { productId, quantity ,sizeId} = req.body;
// Add item to cart
        const cartItem = await addToCartService(userId, productId, quantity,sizeId);
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
};


// Decrease item quantity in the cart
export const decreaseCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
    const userId = req.UserId ?? "";
    const {  productId, quantity,sizeId } = req.body;
    const cartItem = await decreaseCartService(userId, productId, quantity,sizeId);
    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

// Remove item from the cart
export const removeFromCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.UserId ?? "";
    const {  productId ,sizeId } = req.params;
    await removeFromCartService(userId, productId,sizeId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Clear the cart
export const clearCart = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.UserId ?? "";
    await clearCartService(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};