import { Router } from "express";
import { UserController } from "../controllers/userController.ts";
import { UserService } from "../../services/userService.ts";
import { authMiddleware } from "middlewares/auth.ts";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const usersRoutes = Router();

const userController = new UserController(new UserService());

usersRoutes.post("/", userController.createUser.bind(userController));
usersRoutes.get(
  "/",
  authMiddleware,
  userController.getAllUsers.bind(userController)
);
usersRoutes.post(
  '/church-members/upload',
  authMiddleware,
  upload.single("pdf"),
  userController.upload.bind(userController)
);

export { usersRoutes };
