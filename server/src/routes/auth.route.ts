import express, { Express } from 'express';
import { verifyToken } from "../middlewares";
import authController from "../controllers/auth.controller";
import { loginRouteSchema, registerRouteSchema, isAuthenticatedRouteSchema } from "./swaggerSchema/auth.route.schema";


	const router = express.Router();
	router.post("/login", authController.handleLogin);
	router.post("/register",
	
		authController.handleRegister);

		router.get("/isauthenticated",
		authController.isAuthenticated
	)



export default router;
