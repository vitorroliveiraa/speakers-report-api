import { AuthController } from "api/controllers/authController.ts";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.ts";
import { AuthService } from "services/authService.ts";

const authRoutes = Router();

const authController = new AuthController(new AuthService());

authRoutes.post("/login", authController.login.bind(authController));
authRoutes.put(
  "/change-password",
  authMiddleware,
  authController.changePassword.bind(authController)
);
authRoutes.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
authRoutes.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);

export { authRoutes };
