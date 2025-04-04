import { Request, Response } from "express";
import { ISpeakersService } from "types/ISpeakersService.ts";
import { speakersControllerLogger as logger } from "utils.ts/logger.ts";

export class SpeakersController {
  constructor(private speakersService: ISpeakersService) {}

  async create(req: Request, res: Response) {
    const { sacrament_meeting_date, ward_id, speakers } = req.body;
    logger.info({ ward_id }, "Tentativa de criação de discursante.");

    await this.speakersService.create(
      sacrament_meeting_date,
      ward_id,
      speakers
    );

    logger.info({ ward_id }, "Discursantes cadastrados com sucesso.");
    res.status(201).json({ message: "Discursantes cadastrados com sucesso." });
  }
}
