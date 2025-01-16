import express from 'express';


import { protectedRoutes } from "../middlewares";
const router = express.Router();
  const Routes = [
      "/get",
      "/update",
      "/decrease",
      "/delete/:productId/:sizeId",
      "/delete"
  ];

  // function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)
protectedRoutes(router, Routes); 
import {
  getCart,
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller';



// Get the user's cart
router.get('/get', getCart);

// Add/update item in the cart
router.post('/update', addToCart);

// Decrease item quantity in the cart
router.put('/decrease', decreaseCart);

// Remove item from the cart
router.delete('/delete/:productId/:sizeId', removeFromCart);

// Clear the cart
router.delete('/delete', clearCart);

export default router;