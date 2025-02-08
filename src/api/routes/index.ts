import { Router } from "express";
import { usersRoutes } from "./userRoutes.ts";
import { authRoutes } from "./authRoutes.ts";

const router = Router();

router.use("/api/v1/users", usersRoutes);
router.use("/api/v1/auth", authRoutes);

export { router };
