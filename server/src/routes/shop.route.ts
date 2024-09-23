import express from "express";

import { shopController } from "../controllers/index";

import { protectedRoutes } from "../middlewares";

const router = express.Router();

const Routes = [ "/create", "/update", "/getall","/get/storeProducts/:storeId", "/delete/:id"];

// function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)

protectedRoutes(router, Routes);

router.post("/create", shopController.handleCreateProduct);
router.post("/update", shopController.handleUpdate);
router.get("/get", shopController.handleGetSingleItem);
router.get("/getall", shopController.handelgetall);
router.get("/get/productListing", shopController.getProductsListing);

router.get("/get/storeProducts/:storeId", shopController.getProductsByStore);
router.delete("/delete/:id", shopController.handleDelete);
router.delete("/delete/image/:id", shopController.handleDeleteImage);
export default router;
