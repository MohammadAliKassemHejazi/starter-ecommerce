import express from 'express';

import paymentController from "../controllers/auth.controller";

import { protectedRoutes } from "../middlewares";
const router = express.Router();
  const Routes = [
      "/charge",
      "/webhook"
  ];

  // function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)
protectedRoutes(router, Routes); 

router.post('/charge', async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    // Step 1: Create a Payment Intent with the received payment method ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // e.g., $50.00 in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });

    // Step 2: Send success response back to the frontend
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment processing failed:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send('Webhook Error');
  }

  // Process the webhook event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id} was successful.`);
      // Handle order fulfillment, email confirmation, etc.
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});



export default router;