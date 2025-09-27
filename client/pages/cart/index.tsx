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
import styles from "./cart.module.css";
import { RootState, useAppDispatch } from "@/store/store";
import { IProductModel } from "@/models/product.model";
import { CartItem } from "@/models/cart.model";
import Image from "next/image";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";
import { usePermissions } from "@/hooks/usePermissions";
import { PageLayout } from "@/components/UI/PageComponents";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

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
    showToast.success("Cart cleared successfully");
  };

  const handlePaymentSuccess = (paymentId: string, method: string) => {
    console.log(`Payment successful with ${method}:`, paymentId);
    dispatch(clearCart());
    showToast.success(`Payment successful! Payment ID: ${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    showToast.error(`Payment failed: ${error}`);
  };

  const CartEmpty = () => (
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
  );

  const CartItem = ({ cartItem }: { cartItem: CartItem }) => (
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
        />
      )}
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
  );

  const CartSummary = () => (
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
  );

  const ContinueShopping = () => (
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
  );

  if (cart.status === "loading") {
    return (
      <PageLayout title="Shopping Cart" protected={false}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading cart...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (cart.status === "failed") {
    return (
      <PageLayout title="Shopping Cart" protected={false}>
        <div className="alert alert-danger">
          <h5>Error Loading Cart</h5>
          <p>There was an error loading your cart. Please try again.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Shopping Cart" protected={false}>
      <div className={styles.cartContainer}>
        {cart.cartItems.length === 0 ? (
          <CartEmpty />
        ) : (
          <div>
            {/* Cart Items */}
            {cart.cartItems.map((cartItem: CartItem) => (
              <CartItem key={cartItem.id} cartItem={cartItem} />
            ))}

            {/* Cart Summary */}
            <CartSummary />

            {/* Continue Shopping */}
            <ContinueShopping />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Cart;