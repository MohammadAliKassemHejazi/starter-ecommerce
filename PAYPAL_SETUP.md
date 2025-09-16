# PayPal Payment Integration Setup

## Environment Variables Required

### Frontend (.env.local)
```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Stripe Configuration (existing)
NEXT_PUBLIC_Stripe_Key=your_stripe_publishable_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### Backend (.env)
```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_ENVIRONMENT=sandbox  # or 'live' for production

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000
```

## PayPal Developer Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a new application
3. Choose "Web" as the platform
4. Copy the Client ID and Client Secret
5. Add the Client ID to your frontend environment variables
6. Add both Client ID and Secret to your backend environment variables

## Features Implemented

### Frontend
- ✅ Payment method selector (Stripe vs PayPal)
- ✅ PayPal payment component with Redux integration
- ✅ Anonymous shopping with login required only at checkout
- ✅ Cart page with payment options

### Backend
- ✅ PayPal service with order creation and capture
- ✅ PayPal API routes (`/api/paypal/*`)
- ✅ Payment method validation and error handling

## API Endpoints

- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture PayPal payment
- `GET /api/paypal/order/:orderId` - Get order details

## Testing

1. Use PayPal sandbox accounts for testing
2. Create test buyer and seller accounts in PayPal Developer Dashboard
3. Test both Stripe and PayPal payment flows
4. Verify cart functionality for anonymous users

## Production Deployment

1. Change `PAYPAL_ENVIRONMENT` to `live`
2. Use live PayPal credentials
3. Update `FRONTEND_URL` to production domain
4. Test thoroughly before going live
