import express from 'express';
import { protectedRoutes } from '../middlewares';
import { usersController } from "../controllers";

const router = express.Router();

// Protected routes
const protectedRoutesList = ["/profile"];

// Apply protection to specified routes
protectedRoutes(router, protectedRoutesList);

// Protected routes
router.get("/profile", usersController.handleUserProfile);

export default router;

