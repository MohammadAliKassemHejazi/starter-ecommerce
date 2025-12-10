import express from 'express';

import paymentController from "../controllers/payment.controller";

import { protectedRoutes } from "../middlewares";

const router = express.Router();
  const Routes = [
      "/charge",
      "/charge/package",
  ];

  // function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)
protectedRoutes(router, Routes); 


router.post("/charge", paymentController.initiateCartPayment);

router.post("/charge/package", paymentController.initiatePackagePayment);



router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);





export default router;
