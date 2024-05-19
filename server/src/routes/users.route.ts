import express from 'express';

import { protectedRoutes } from '../middlewares';

import { usersController } from "../controllers";




  const router = express.Router()
  router.get(
    "/profile",
    usersController.handleUserProfile
  );

  // routes want to protect
  const Routes = [
    "/api/users/profile",
  ];

  // function add hook onRequest -> protectedRoutes(appInstance, Routes you want to protect)
protectedRoutes(router, Routes);
export  default router;

