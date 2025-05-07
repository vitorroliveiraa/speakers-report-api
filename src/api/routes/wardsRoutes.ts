import { WardsController } from "api/controllers/wardsController.ts";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.ts";
import { WardsService } from "services/wardsService.ts";

const wardsRoutes = Router();

const wardsController = new WardsController(new WardsService());

wardsRoutes.get(
  "/validate",
  wardsController.validateUnitNumber.bind(wardsController)
);

export { wardsRoutes };
