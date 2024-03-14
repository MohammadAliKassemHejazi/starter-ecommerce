import express, { Express } from 'express';
import { verifyToken } from "../middlewares";
import authController from "../controllers/auth.controller";
import { loginRouteSchema, registerRouteSchema, isAuthenticatedRouteSchema } from "./swaggerSchema/auth.route.schema";

const authRouter = async (app: Express) => {
	app.post("/login", authController.handleLogin);
	app.post("/register",
	
		authController.handleRegister);

	app.get("/isauthenticated",
		authController.isAuthenticated
	)
}


export default authRouter;
