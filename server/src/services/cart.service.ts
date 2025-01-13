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
          ],
        },
      ],
    });

    // If the cart is not found, throw a custom error
    if (!cart) {
      throw customError(cartErrors.CartNotFound);
    }

    // Convert the Sequelize instance to a plain object
    const plainCart = cart.toJSON();

    // Transform the cart items to match the required structure
    const transformedCartItems = plainCart.CartItems.map((cartItem: any) => ({
      id: cartItem.Product.id,
      name: cartItem.Product.name,
      description: cartItem.Product.description,
      price: cartItem.Product.price,
      photos: cartItem.Product.ProductImages.map((image: any) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })), // Map product images
      cartQuantity: cartItem.quantity, // Assuming quantity is stored in CartItem
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
// Add/update item in the cart
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
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

    // Find or create the user's cart
    let cart = await getCartByUserId(userId);
    if (!cart) {
      cart = await createCartForUser(userId);
    }

    // Find or create the cart item
    const [cartItem, created] = await db.CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { cartId: cart.id, productId, quantity },
    });

    // If the cart item already exists, update its quantity
if (!created) {
  await cartItem.update({ quantity:  quantity });

    await cartItem.reload(); // Ensure the updated value is returned
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


export const getCartByUserId = async (userId: string): Promise<ICartAttributes | null> => {
  return await db.Cart.findOne({ where: { userId }, raw: true  });
};

export const createCartForUser = async (userId: string): Promise<ICartAttributes> => {
  return await db.Cart.create({ userId } );
};

// Decrease item quantity in the cart
export const decreaseCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICartItemAttributes | null> => {
  try {
    // Find the user's cart
    const cart = await db.Cart.findOne({ where: { userId } ,raw:true});
    if (!cart) {
      throw customError(cartErrors.CartNotFound);
    }

    // Find the cart item
    const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!cartItem) {
      throw customError(cartErrors.CartItemNotFound);
    }

    // If quantity is greater than 1, decrement; otherwise, remove item
    if (cartItem.dataValues.quantity > quantity) {
 await cartItem.update({ quantity:  quantity });

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


// Remove item from the cart
export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<void> => {
  try {
    // Find the user's cart
    const cart = await db.Cart.findOne({ where: { userId },raw:true });
    if (!cart) {
      throw customError(cartErrors.CartNotFound);
    }

    // Remove the item from the cart
    const deletedRows = await db.CartItem.destroy({
      where: { cartId: cart.id, productId },
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

// Clear the cart
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