import { Router } from "express";
import { authMiddleware } from "middlewares/auth.ts";
import { SpeakersController } from "api/controllers/speakersControlle.ts";
import { SpeakersService } from "services/speakersService.ts";

const speakersRoutes = Router();

const speakersController = new SpeakersController(new SpeakersService());

speakersRoutes.post(
  "/insert",
  authMiddleware,
  speakersController.create.bind(speakersController)
);

export { speakersRoutes };
