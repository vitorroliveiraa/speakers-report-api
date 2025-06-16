import {
  ChurchMembers,
  IExternalSpeakerData,
  IInternalSpeakerData,
  ISpeakersService,
  ListSpeakers,
  SpeakerData,
  Speakers,
} from "types/ISpeakersService.ts";
import db from "../database/index.ts";
import { ConflictError } from "utils.ts/appError.ts";
import { speakersServiceLogger as logger } from "utils.ts/logger.ts";
import { ExternalChurchMembers } from "@database/models/externalChurchMembers.ts";

export class SpeakersService implements ISpeakersService {
  async create(
    sacrament_meeting_date: string,
    ward_id: number,
    speakers: Speakers[]
  ): Promise<void> {
    logger.info({ ward_id }, "Criando discursante");
    const sacramentMeetingDate = sacrament_meeting_date;

    try {
      const exists = await db.raw(
        "SELECT 1 FROM speakers WHERE sacrament_meeting_date = ? LIMIT 1",
        [sacramentMeetingDate]
      );

      if (exists.rowCount > 0) {
        logger.error("Já tem discursante cadastrado nessa data.");
        throw new ConflictError("Já existe um registro nessa data.");
      }

      await db.transaction(async (trx) => {
        for (const speaker of speakers) {
          let speakerData: SpeakerData;

          if (speaker.type === "internal") {
            speakerData = {
              sacrament_meeting_date: sacramentMeetingDate,
              ward_id: ward_id,
              speaker_position: speaker.speaker_position,
              member_id: speaker.id,
            };
          } else {
            speakerData = {
              sacrament_meeting_date: sacramentMeetingDate,
              ward_id: ward_id,
              speaker_position: speaker.speaker_position,
              external_member_id: speaker.id,
            };
          }

          await trx("speakers").insert(speakerData);
        }
      });

      logger.info("Discursantes cadastrados com sucesso.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error({ error }, "Erro cadastrar discursantes.");
        throw error;
      }
    }
  }

  async listAllSpeakers(wardId: number): Promise<ListSpeakers[]> {
    logger.info({ wardId }, "Consultando discursantes no banco.");
    const sql = `
      WITH LastSpeech AS (
      SELECT
          cm.name,
          s.sacrament_meeting_date AS last_speech_date,
          s.speaker_position,
          cm.ward_id
        FROM
          church_members cm
        JOIN
          speakers s ON s.member_id = cm.id
        WHERE
          s.sacrament_meeting_date = (
            SELECT MAX(sacrament_meeting_date)
            FROM speakers
            WHERE member_id = cm.id
            AND ward_id = cm.ward_id
          )
          AND cm.ward_id = ?
      )
      SELECT
        name,
        TO_CHAR(last_speech_date, 'DD/MM/YYYY') AS last_speech_date,
        speaker_position,
        (SELECT COUNT(*)
          FROM generate_series(
            last_speech_date,
            NOW(), 
            interval '1 week'
          ) gs
          WHERE EXTRACT(DOW FROM gs) = 0 -- Somente domingos
        ) AS sundays_since_last_speech
      FROM
        LastSpeech
      WHERE
        ward_id = ?;
    `;

    const { rows } = await db.raw(sql, [wardId, wardId]);
    logger.info(
      { wardId, total: rows.length },
      "Consulta de discursantes concluída."
    );

    return rows;
  }

  async listChurchMembers(wardId: number): Promise<ChurchMembers[]> {
    logger.info({ wardId }, "Consultando membros da igreja no banco.");

    const church_members = await db
      .select()
      .from("church_members")
      .where("ward_id", wardId);

    const external_church_members = await db<ExternalChurchMembers>(
      "external_church_members"
    )
      .select()
      .where("ward_id", wardId);

    const allMembers = church_members.concat(external_church_members);
    // console.log("allMembers 🐛", allMembers);

    logger.info(
      { wardId, total: church_members.length },
      "Consulta de membros da igreja concluída."
    );
    return allMembers;
  }
}
