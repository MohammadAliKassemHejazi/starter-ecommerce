import express from 'express';

import { utileController } from "../controllers/index";

import { protectedRoutes } from "../middlewares";

const router = express.Router();

  const Routes = [
      "",
  ];

// function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)

protectedRoutes(router, Routes); 


router.get("/categories", utileController.handelGetAllCategories);
router.get("/getsubcategories", utileController.handelGetSubCategoriesByID);
router.get("/getsizes", utileController.handelGetSizes);
export default router;
