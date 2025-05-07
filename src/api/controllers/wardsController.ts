import { Request, Response } from "express";
import { IUserService } from "../../types/IUserService.ts";
import { userControllerLogger as logger } from "utils.ts/logger.ts";
import { validateUnitNumberSchema } from "validators/wardsValidator.ts";
import { IWardsService } from "types/IWardsService.ts";
import { requestUserSchema } from "validators/userValidator.ts";

export class WardsController {
  constructor(private wardsService: IWardsService) {}

  async validateUnitNumber(req: Request, res: Response) {
    const { unitNumber } = validateUnitNumberSchema.parse({
      unitNumber: req.query.unitNumber,
    });

    logger.info({ unitNumber }, "Verifcar existência da Ala.");

    const ward = await this.wardsService.validateUnitNumber(unitNumber);
    logger.info({ unitNumber }, "Ala retornada com sucesso.");

    res.status(200).json({ ward });
  }
}
