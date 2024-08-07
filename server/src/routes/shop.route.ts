import express from "express";

import { shopController } from "../controllers/index";

import { protectedRoutes } from "../middlewares";

const router = express.Router();

const Routes = [ "/create", "/update", "/getall"];

// function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)

protectedRoutes(router, Routes);

router.post("/create", shopController.handleCreateProduct);
router.post("/update", shopController.handleUpdate);
router.get("/get", shopController.handleGetSingleItem);
router.get("/getall", shopController.handelgetall);
router.get("/storeProducts/:storeId", shopController.getProductsByStore);
export default router;
