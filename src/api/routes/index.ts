import { Router } from "express";
import { usersRoutes } from "./userRoutes.ts";
import { authRoutes } from "./authRoutes.ts";
import { speakersRoutes } from "./speakersRoutes.ts";

const router = Router();

router.use("/api/v1/users", usersRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/speakers", speakersRoutes);

export { router };
