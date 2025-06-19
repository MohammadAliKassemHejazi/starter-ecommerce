// services/cartService.ts
import db from "../models"; // Import your database models
import { ICartItemAttributes } from "../interfaces/types/models/cartitem.model.types";
import { ICartAttributes } from "../interfaces/types/models/cart.model.types";
import customError from "../utils/customError";
import cartErrors from "../utils/errors/cart.errors";

export const getCart = async (userId: string): Promise<ICartAttributes> => {
  try {
    // Fetch the cart from the database
    const cart = await db.Cart.findOne({
      where: { userId },
      include: [
        {
          model: db.CartItem,
          include: [
            {
              model: db.Product,
              include: [db.ProductImage], // Include product images
            },
            {
              model: db.SizeItem ,// Include size information
              include: [db.Size], // Include size details
            },
          ],
        },
      ],
    });

    // If the cart is not found, throw a custom error
    if (!cart) {
      throw customError(cartErrors.CartItemNotFound);
    }

    // Convert the Sequelize instance to a plain object
    const plainCart = cart.toJSON();

    // Filter out cart items where SizeItem quantity is 0 or SizeItem does not exist
    const validCartItems = plainCart.CartItems.filter((cartItem: any) => {
      if (!cartItem.SizeItem || cartItem.SizeItem.quantity === 0) {
        // Delete the cart item if SizeItem is invalid
        db.CartItem.destroy({ where: { id: cartItem.id } });
        return false; // Exclude this item from the response
      }
      return true; // Include this item in the response
    });

    // Transform the valid cart items to match the required structure
    const transformedCartItems = validCartItems.map((cartItem: any) => ({
      id: cartItem.Product.id,
      name: cartItem.Product.name,
      description: cartItem.Product.description,
      price: cartItem.Product.price,
      photos: cartItem.Product.ProductImages.map((image: any) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })), // Map product images
      cartQuantity: cartItem.quantity, // Assuming quantity is stored in CartItem
      sizeId: cartItem.sizeItemId, // Include sizeId
      size: cartItem.SizeItem.Size.size, // Include size
      totalPrice: cartItem.Product.price * cartItem.quantity, // Calculate total price
    }));

    // Return the transformed cart
    return {
      id: plainCart.id,
      userId: plainCart.userId,
      cartItems: transformedCartItems,
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in getCart:", error);

    // Re-throw the error or return a custom error response
    throw customError({
      message: "Failed to fetch cart",
      code: "CART_FETCH_FAILED",
      statusCode: 500,
    });
  }
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  sizeId: string,
): Promise<ICartItemAttributes> => {
  try {
    // Check if the product exists
    const product = await db.Product.findByPk(productId);
    if (!product) {
      throw customError({
        message: "Product not found",
        code: "PRODUCT_NOT_FOUND",
        statusCode: 404,
      });
    }

    // Check if the size exists and has sufficient quantity
    const sizeItem = await db.SizeItem.findOne({
      where: { productId, id: sizeId },
      raw:true
    });
    if (!sizeItem) {
      throw customError({
        message: "Size not found for this product",
        code: "SIZE_NOT_FOUND",
        statusCode: 404,
      });
    }

    if (sizeItem.quantity < quantity) {
      throw customError({
        message: "Insufficient stock for the selected size",
        code: "INSUFFICIENT_STOCK",
        statusCode: 400,
      });
    }

    // Find or create the user's cart
    let cart = await getCartByUserId(userId);
    if (!cart?.id) {
      throw customError({
        message: "Cart is missing an ID",
        code: "INVALID_CART",
        statusCode: 500,
      });
    }
    
    if (!cart) {
      cart = await createCartForUser(userId);
    }

    // Find or create the cart item
    const [cartItem, created] = await db.CartItem.findOrCreate({
      where: { cartId: cart.id, productId, sizeItemId:sizeId },
      defaults: { cartId: cart.id, productId, sizeItemId: sizeId, quantity },
  
    });
      const cartitemJson = cartItem.toJSON()
    // If the cart item already exists, update its quantity
    if (!created) {
      const newQuantity = cartitemJson.quantity + quantity;
      if (newQuantity > sizeItem.quantity) {
        throw customError({
          message: "Cannot add more than available stock",
          code: "EXCEEDS_STOCK",
          statusCode: 400,
        });
      }
      await cartItem.update({ quantity: newQuantity });
      await cartItem.reload(); 
    }

    return cartItem;
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw customError({
      message: "Failed to add product to cart",
      code: "CART_ADD_FAILED",
      statusCode: 500,
    });
  }
};

export const getCartByUserId = async (userId: string): Promise<any | null> => {
  return await db.Cart.findOne({ where: { userId } }); 
};


export const createCartForUser = async (userId: string): Promise<ICartAttributes> => {
  return await db.Cart.create({ userId }); 
};

export const decreaseCart = async (
  userId: string,
  productId: string,
  quantity: number,
    sizeId: string,
): Promise<ICartItemAttributes | null> => {
  try {
    // Find the user's cart
    const cart = await db.Cart.findOne({ where: { userId }, raw: true });
    if (!cart) {
      throw customError(cartErrors.CartNotFound);
    }

    // Find the cart item
    const cartItem = await db.CartItem.findOne({
      where: { cartId: cart.id, productId, sizeItemId:sizeId },
    });
    if (!cartItem) {
      throw customError(cartErrors.CartItemNotFound);
    }
const cartItemJson = cartItem.toJSON()
    // If quantity is greater than the requested decrease, decrement; otherwise, remove item
    if (cartItemJson.quantity > quantity) {
      await cartItem.update({ quantity: cartItemJson.quantity - quantity });
      await cartItem.reload(); // Ensure the updated value is returned
      return cartItem;
    } else {
      await cartItem.destroy();
      return null; // Indicating the item has been removed
    }
  } catch (error) {
    console.error("Error in decreaseCart:", error);
    throw customError({
      message: "Failed to decrease product quantity",
      code: "CART_DECREASE_FAILED",
      statusCode: 500,
    });
  }
};

export const removeFromCart = async (
  userId: string,
  productId: string,
  sizeId: string // Add sizeId parameter
): Promise<void> => {
  try {
    // Find the user's cart
    const cart = await db.Cart.findOne({ where: { userId }, raw: true });
    if (!cart) {
      throw customError(cartErrors.CartNotFound);
    }

    // Remove the item from the cart
    const deletedRows = await db.CartItem.destroy({
      where: { cartId: cart.id, productId, sizeItemId :sizeId },
    });

    // If no rows were deleted, the product was not in the cart
    if (deletedRows === 0) {
      throw customError({
        message: "Product not found in cart",
        code: "PRODUCT_NOT_IN_CART",
        statusCode: 404,
      });
    }
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw customError({
      message: "Failed to remove product from cart",
      code: "CART_REMOVE_FAILED",
      statusCode: 500,
    });
  }
};

export const clearCart = async (userId: string): Promise<void> => {
  try {
    // Find the user's cart
    const cart = await db.Cart.findOne({ where: { userId } ,raw:true});
    if (!cart) {
      throw customError(cartErrors.CartNotFound);
    }

    // Clear all items in the cart
    await db.CartItem.destroy({ where: { cartId: cart.id } });
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw customError({
      message: "Failed to clear cart",
      code: "CART_CLEAR_FAILED",
      statusCode: 500,
    });
  }
};

export default {
  getCart,
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
};