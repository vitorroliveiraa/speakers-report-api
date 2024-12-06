import { Router } from "express";
import { usersRoutes } from "./userRoutes.ts";

const router = Router();

router.use("/users", usersRoutes);

export { router };
