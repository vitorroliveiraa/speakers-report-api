import { Router } from "express";
import { UserController } from "../controllers/userController.ts";
import { UserService } from "../../services/userService.ts";

const usersRoutes = Router();

const userController = new UserController(new UserService());

usersRoutes.post("/", userController.createUser.bind(userController));
usersRoutes.get("/", userController.getAllUsers.bind(userController));

export { usersRoutes };
