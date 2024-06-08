import express from 'express';

import { storeController } from "../controllers/index";

import { protectedRoutes } from "../middlewares";

const router = express.Router();

  const Routes = [
      "/create",
      "/update",
      "/get/:id",
      "/getall",
  ];

// function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)

protectedRoutes(router, Routes); 

router.post("/create",storeController.handleCreateStore);
router.post("/update",storeController.handleUpdate);
router.get("/get", storeController.handelGetSingleItem);
router.get("/getall", storeController.handelGetAllStores);

export default router;
