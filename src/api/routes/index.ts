import { Router } from "express";
import { usersRoutes } from "./userRoutes.ts";
import { authRoutes } from "./authRoutes.ts";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);

export { router };
