import db from "@database/index.ts";
import { IWardsService, WardsResponse } from "types/IWardsService.ts";
import { NotFoundError } from "utils.ts/appError.ts";
import { wardsServiceLogger as logger } from "utils.ts/logger.ts";

export class WardsService implements IWardsService {
  async validateUnitNumber(unitNumber: string): Promise<WardsResponse> {
    logger.info({ unitNumber }, "Consultar Ala no banco.");
    const ward = await db("wards").where({ unit_number: unitNumber }).first();

    if (!ward) {
      logger.warn({ unitNumber }, "Ala não encontrada na consulta.");

      throw new NotFoundError("Essa Ala não está cadastrada.");
    }

    logger.info({ unitNumber }, "Ala encontrada na consulta.");

    return ward;
  }
}
