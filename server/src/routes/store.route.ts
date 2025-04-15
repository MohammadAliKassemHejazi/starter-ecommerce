import express from 'express';

import { storeController } from "../controllers/index";

import { protectedRoutes } from "../middlewares";

const router = express.Router();

const Routes = [
     "/delete/:id",
      "/create",
      "/update",
     "/getall/user",
  ];

// function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)

protectedRoutes(router, Routes); 

router.post("/create",storeController.handleCreateStore);
router.post("/update",storeController.handleUpdate);
router.get("/get", storeController.handelGetSingleItem);
router.get("/getall/user", storeController.handelGetAllStoresForUser);
router.get("/getall", storeController.handelGetAllStores);
router.patch("/update/image", storeController.handleUpdateImages);

// Delete Product (with validation)
router.delete(
  "/delete/:id",
  storeController.handleDelete
);
export default router;
