import { ISpeakersService, Speakers } from "types/ISpeakersService.ts";
import knex from "../database/index.ts";
import { ConflictError } from "utils.ts/appError.ts";
import { speakersServiceLogger as logger } from "utils.ts/logger.ts";

export class SpeakersService implements ISpeakersService {
  async create(
    sacrament_meeting_date: Date,
    ward_id: number,
    speakers: Speakers[]
  ): Promise<void> {
    logger.info({ ward_id }, "Criando discursante");
    const sacramentMeetingDate = sacrament_meeting_date;

    try {
      const exists = await knex.raw(
        "SELECT 1 FROM speakers WHERE sacrament_meeting_date = ? LIMIT 1",
        [sacramentMeetingDate]
      );

      if (exists.rowCount > 0) {
        logger.error("Já tem discursante cadastrado nessa data.");
        throw new ConflictError("Já existe um registro nessa data.");
      }

      await knex.transaction(async (trx) => {
        const insertValues = speakers
          .map((speaker) => {
            return `('${sacrament_meeting_date}', '${speaker.member_id}', '${speaker.speaker_position}', '${ward_id}')`;
          })
          .join(", ");

        const insertQuery = `
          INSERT INTO speakers (sacrament_meeting_date, member_id, speaker_position, ward_id)
          VALUES ${insertValues}
        `;

        await trx.raw(insertQuery);
      });

      logger.info("Discursantes cadastrados com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error({ error }, "Erro cadastrar discursantes.");
        throw error;
      }
    }
  }
}
