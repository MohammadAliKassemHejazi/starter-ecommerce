import express from 'express';

import { storeController } from "../controllers/index";

import { protectedRoutes } from "../middlewares";

const router = express.Router();

  const Routes = [
      "/categories",
  ];

// function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)

protectedRoutes(router, Routes); 


router.get("/categories", storeController.handelGetAllCategories);
export default router;
