import express from 'express';
import authController from "../controllers/auth.controller";
import { protectedRoutes } from "../middlewares";

const router = express.Router();

// Protected routes
const protectedRoutesList = [
  "/isauthenticated",
  "/session",
  "/sessions",
  "/logout",
];

// Apply protection to specified routes
protectedRoutes(router, protectedRoutesList);

// Public routes
router.post("/login", authController.handleLogin);
router.post("/register", authController.handleRegister);
router.get("/session/public", authController.getPublicSession); // Public session endpoint for guest users

// Protected routes
router.get("/isauthenticated", authController.isAuthenticated);
router.get("/session", authController.isAuthenticated); // Alias for frontend compatibility
router.get("/sessions", authController.getUserSessions);
router.post("/logout", authController.loggedOut);

export default router;
