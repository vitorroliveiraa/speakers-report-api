import { AuthController } from "api/controllers/authController.ts";
import { Router } from "express";
import { AuthService } from "services/authService.ts";

const authRoutes = Router();

const authController = new AuthController(new AuthService());

authRoutes.post("/login", authController.login.bind(authController));

export { authRoutes };
