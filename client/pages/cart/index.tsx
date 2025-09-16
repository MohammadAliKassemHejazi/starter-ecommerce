import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decreaseCart,
  fetchCart,
  getTotals,
  removeFromCart,
} from "@/store/slices/cartSlice";
import Link from "next/link";
import styles from "./cart.module.css"; // Import CSS module
import { RootState, useAppDispatch } from "@/store/store";
import { IProductModel } from "@/models/product.model";
import { CartItem } from "@/models/cart.model";
import Layout from "@/components/Layouts/Layout";
import Image from "next/image";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";
import { usePermissions } from "@/hooks/usePermissions";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();
  const { isAuthenticated, canCheckout } = usePermissions();

  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch(fetchCart()).then(() => {
        dispatch(getTotals());
      });
    }
  }, [dispatch]);

  const handleAddToCart = (product: IProductModel) => {
    dispatch(addToCart(product)).then(() => {
      dispatch(getTotals());
    });
  };

  const handleDecreaseCart = (product: IProductModel) => {
    dispatch(decreaseCart(product)).then(() => {
      dispatch(getTotals());
    });
  };

  const handleRemoveFromCart = (product: IProductModel) => {
    dispatch(removeFromCart(product)).then(() => {
      dispatch(getTotals());
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart()).then(() => {
      dispatch(getTotals());
    });
  };

  const handlePaymentSuccess = (paymentId: string, method: string) => {
    console.log(`Payment successful with ${method}:`, paymentId);
    // Clear cart after successful payment
    dispatch(clearCart());
    // Redirect to success page or show success message
    alert(`Payment successful! Payment ID: ${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  return (
    <Layout>
      <div className={styles.cartContainer}>
        <h2 className={styles.cartTitle}>Shopping Cart</h2>
        {cart.status === "loading" ? (
          <div className={styles.cartEmpty}>
            <p>Loading cart...</p>
          </div>
        ) : cart.status === "failed" ? (
          <div className={styles.cartEmpty}>
            <p>error</p>
          </div>
        ) : cart.cartItems.length === 0 ? (
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
          <div>
            {/* Cart Items */}
            {cart.cartItems.map((cartItem: CartItem) => (
              <div key={cartItem.id} className={styles.productCard}>
                {cartItem?.photos && cartItem.photos.length > 0 && (
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_BASE_URL_Images +
                      cartItem.photos[0]?.imageUrl
                    }
                    alt={cartItem.name ?? ""}
                    className={styles.productImage}
                    width={100}
                    height={100}
                  />)}
                <div className={styles.productDetails}>
                  <h3 className={styles.productName}>{cartItem.name}</h3>
                  <p className={styles.productPrice}>${cartItem.price}</p>
                  <p className={styles.productDesc}>{cartItem.description}</p>
                </div>
                <div className={styles.productActions}>
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
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveFromCart(cartItem)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className={styles.cartSummary}>
              <h3 className={styles.summaryTitle}>Cart Summary</h3>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.amount}>${cart.cartTotalAmount}</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              <button className={styles.clearBtn} onClick={handleClearCart}>
                Clear Cart
              </button>
              
              {/* Payment Section */}
              {isAuthenticated ? (
                <div className="mt-4">
                  <PaymentMethodSelector
                    amount={cart.cartTotalAmount}
                    currency="USD"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <div className="alert alert-info">
                    <h5>Login Required for Checkout</h5>
                    <p>Please log in to complete your purchase.</p>
                    <div className="d-flex gap-2">
                      <a href="/auth/login" className="btn btn-primary">
                        Login
                      </a>
                      <a href="/auth/register" className="btn btn-outline-primary">
                        Register
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Continue Shopping */}
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