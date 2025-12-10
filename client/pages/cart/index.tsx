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
import ProtectedRoute from '@/components/protectedRoute';
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
  const { isAuthenticated } = usePermissions();

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
    <div className='cartEmpty'>
      <p>Your cart is currently empty</p>
      <div className='startShopping'>
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className='biArrowLeft'
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
    <div key={cartItem.id} className='productCard'>
      {cartItem?.photos && cartItem.photos.length > 0 && (
        <Image
          src={
            process.env.NEXT_PUBLIC_BASE_URL_Images +
            cartItem.photos[0]?.imageUrl
          }
          alt={cartItem.name ?? ""}
          className='productImage'
          width={100}
          height={100}
        />
      )}
      <div className='productDetails'>
        <h3 className='productName'>{cartItem.name}</h3>
        <p className='productPrice'>${cartItem.price}</p>
        <p className='productDesc'>{cartItem.description}</p>
      </div>
      <div className='productActions'>
        <button
          className='quantityBtn'
          onClick={() => handleDecreaseCart(cartItem)}
        >
          -
        </button>
        <div className='count'>{cartItem.cartQuantity}</div>
        <button
          className='quantityBtn'
          onClick={() => handleAddToCart(cartItem)}
        >
          +
        </button>
        <button
            className='removeBtn'
          
          onClick={() => handleRemoveFromCart(cartItem)}
        >
          Remove
        </button>
      </div>
    </div>
  );

  const CartSummary = () => (
    <div className='cartSummary'>
      <h3 className='summaryTitle'>Cart Summary</h3>
      <div className='subtotal'>
        <span>Subtotal</span>
        <span className='amount'>${cart.cartTotalAmount}</span>
      </div>
      <p>Taxes and shipping calculated at checkout</p>
      <button className='clearBtn'  onClick={handleClearCart}>
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
    <div className='continueShopping'>
      <Link href="/shop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className='biArrowLeft'
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
      <div className='cartContainer'>
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
export default function ProtectedCartPage() {
  return (
    <ProtectedRoute><Cart></Cart></ProtectedRoute>)
}
