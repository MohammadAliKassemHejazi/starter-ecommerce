import express from 'express';

import {shopController} from "../controllers/index";

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

router.post("/create",shopController.handleCreateProduct);
router.post("/update",shopController.handleUpdate);
router.get("/get/:id", shopController.handelgetsingleitem);
router.get("/getall", shopController.handelgetall);

export default router;
