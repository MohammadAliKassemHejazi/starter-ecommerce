import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "@/store/slices/cartSlice";
import Link from "next/link";
import styles from "./cart.module.css"; // Import CSS module
import { AppDispatch, RootState } from "@/store/store"; // Importing your store types
import { IProductModel } from "@/models/product.model";
import { CartItem } from "@/models/cart.model";
import Layout from "@/components/Layouts/Layout";

const Cart = () => {
  // Type the useSelector hook to use RootState
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
         if (typeof window !== "undefined") {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        const cartItems = JSON.parse(storedCartItems);
        dispatch(addToCart(cartItems)); // Set items to Redux store
      }
      dispatch(getTotals());
    }
  }, [cart, dispatch]);

  // Type event handlers
  const handleAddToCart = (product: IProductModel) => {
    dispatch(addToCart(product));
  };

  const handleDecreaseCart = (product: IProductModel) => {
    dispatch(decreaseCart(product));
  };

  const handleRemoveFromCart = (product: IProductModel) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <Layout>
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>Shopping Cart</h2>
      {cart.cartItems.length === 0 ? (
        <div className={styles.cartEmpty}>
          <p>Your cart is currently empty</p>
          <div className={styles.startShopping}>
            <Link  href="/">
              
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className={styles.biArrowLeft}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
                <span>Start Shopping</span>
              
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.cartDetails}>
          <div className={styles.titles}>
            <h3 className={styles.productTitle}>Product</h3>
            <h3 className={styles.price}>Price</h3>
            <h3 className={styles.quantity}>Quantity</h3>
            <h3 className={styles.total}>Total</h3>
          </div>
          <div className={styles.cartItems}>
            {cart.cartItems.map((cartItem: CartItem) => (
              <div className={styles.cartItem} key={cartItem.id}>
                <div className={styles.cartProduct}>
                  {cartItem?.photos && cartItem.photos.length > 0 && (
                    <img
                      src={cartItem.photos[0]?.imageUrl ?? ""}
                      alt={cartItem.name}
                      className={styles.cartProductImage}
                    />
                  )}

                  <div>
                    <h3 className={styles.cartProductName}>{cartItem.name}</h3>
                    <p className={styles.cartProductDesc}>{cartItem.description}</p>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFromCart(cartItem)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className={styles.cartProductPrice}>${cartItem.price}</div>
                <div className={styles.cartProductQuantity}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => handleDecreaseCart(cartItem)}
                  >
                    -
                  </button>
                  <div className={styles.count}>{cartItem.cartQuantity}</div>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => handleAddToCart(cartItem)}
                  >
                    +
                  </button>
                </div>
                <div className={styles.cartProductTotalPrice}>
                  ${(cartItem?.price ?? 0) * cartItem.cartQuantity}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <button className={styles.clearBtn} onClick={handleClearCart}>
              Clear Cart
            </button>
            <div className={styles.cartCheckout}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.amount}>${cart.cartTotalAmount}</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              <button className={styles.checkoutBtn}>Check out</button>
              <div className={styles.continueShopping}>
                <Link href="/">
               
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className={styles.biArrowLeft}
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                      />
                    </svg>
                    <span>Continue Shopping</span>
              
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </Layout>
  );
};

export default Cart;
