import { Router } from "express";
import { usersRoutes } from "./userRoutes.ts";
import { authRoutes } from "./authRoutes.ts";
import { speakersRoutes } from "./speakersRoutes.ts";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/speakers", speakersRoutes);

export { router };
