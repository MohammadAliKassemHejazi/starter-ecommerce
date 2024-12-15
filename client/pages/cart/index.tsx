import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  loadCart,
  removeFromCart,
} from "@/store/slices/cartSlice";
import Link from "next/link";
import styles from "./cart.module.css"; // Import CSS module
import { AppDispatch, RootState } from "@/store/store"; // Importing your store types
import { IProductModel } from "@/models/product.model";
import { CartItem } from "@/models/cart.model";
import Layout from "@/components/Layouts/Layout";
import Image from "next/image";
import CheckoutForm from "../payment/checkoutwithstripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}`);
const Cart = () => {
  // Type the useSelector hook to use RootState
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

useEffect(() => {
  if (typeof window !== "undefined") {
    dispatch(loadCart()).then(() => {
    dispatch(getTotals());
    });
  }
}, [dispatch]);

  // Type event handlers
  const handleAddToCart = (product: IProductModel) => {
    dispatch(addToCart(product)).then(() => {
    dispatch(getTotals());
    });;
   
  };

  const handleDecreaseCart = (product: IProductModel) => {
    dispatch(decreaseCart(product)).then(() => {
    dispatch(getTotals());
    });;
  
  };

  const handleRemoveFromCart = (product: IProductModel) => {
    dispatch(removeFromCart(product)).then(() => {
    dispatch(getTotals());
    });;
 
  };

  const handleClearCart = () => {
    dispatch(clearCart()).then(() => {
    dispatch(getTotals());
    });;

  };

  return (
    <Layout>
      <div className={styles.cartContainer}>
        <h2 className={styles.cartTitle}>Shopping Cart</h2>
        {cart.cartItems.length === 0 ? (
          <div className={styles.cartEmpty}>
            <p>Your cart is currently empty</p>
            <div className={styles.startShopping}>
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
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.cartDetails}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {cart.cartItems.length > 0 && cart.cartItems.map((cartItem: CartItem) => (
                  
                 cartItem.id && <tr key={cartItem.id}>
                 
                    <td className={styles.cartProduct}>
                      {cartItem?.photos && cartItem.photos.length > 0 && (
                        <Image
                          src={process.env.NEXT_PUBLIC_BASE_URL_Images + cartItem.photos[0]?.imageUrl}
                          alt={cartItem.name ?? ""}
                          className={styles.cartProductImage}
                          width={100}
                          height={100}
                        />
                      )}
                      <div>
                        <h3 className={styles.cartProductName}>{cartItem.name}</h3>
                        <p className={styles.cartProductDesc}>{cartItem.description}</p>
                      </div>
                    </td>
                    <td className={styles.cartProductPrice}>${cartItem.price}</td>
                    <td className={styles.cartProductQuantity}>
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
                    </td>
                      <td className={styles.cartProductTotalPrice} >
                      ${(cartItem?.price ?? 0) * cartItem.cartQuantity}
                    </td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveFromCart(cartItem)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           {cart.cartItems.length > 0 && <div className={styles.cartSummary}>
              <button className={styles.clearBtn} onClick={handleClearCart}>
                Clear Cart
              </button>
              <div className={styles.cartCheckout}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <span className={styles.amount}>${cart.cartTotalAmount}</span>
                </div>
                <p>Taxes and shipping calculated at checkout</p>
                {/* <button className={styles.checkoutBtn}>Check out</button> */}
               <Elements stripe={stripePromise}>
                    <CheckoutForm></CheckoutForm>
                    </Elements>
              </div>
              </div>
                
              }
                <div className={styles.continueShopping}>
                  <Link href="/shop">
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
            
        )}
      </div>
    </Layout>
  );
};

export default Cart;
