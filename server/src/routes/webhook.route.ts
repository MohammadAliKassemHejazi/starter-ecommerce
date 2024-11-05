// backend/controllers/paymentController.js
const paymentService = require('../services/paymentService');



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
 

    // Step 1: Create a Payment Intent with the received payment method ID
  const { paymentMethodId } = req.body;
  
  try {
    const result = await paymentService.chargeCustomer(paymentMethodId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
    // Step 2: Send success response back to the frontend
   
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