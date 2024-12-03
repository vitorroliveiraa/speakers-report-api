import axios from "axios";
import express, { json, urlencoded, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import knex from "./database";
import path from "path";

const dotenvFilepath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: dotenvFilepath });

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

type Speakers = {
  member_id: number;
  speaker_position: number;
};
interface ISpeakersReq {
  sacrament_meeting_date: Date;
  speakers: Speakers[];
}

app.post(
  "/speakers/insert",
  async (req: Request<{}, {}, ISpeakersReq>, res: Response) => {
    const { sacrament_meeting_date, speakers } = req.body;

    const sacramentMeetingDate = sacrament_meeting_date;

    try {
      const exists = await knex.raw(
        "SELECT 1 FROM speakers WHERE sacrament_meeting_date = ? LIMIT 1",
        [sacramentMeetingDate]
      );

      if (exists.rowCount > 0) {
        return res
          .status(409)
          .json({ error: "Já existe um registro nessa data." });
      }

      await knex.transaction(async (trx) => {
        const insertValues = speakers
          .map((speaker) => {
            return `('${sacrament_meeting_date}', '${speaker.member_id}', '${speaker.speaker_position}')`;
          })
          .join(", ");

        const insertQuery = `
        INSERT INTO speakers (sacrament_meeting_date, member_id, speaker_position)
        VALUES ${insertValues}
      `;

        await trx.raw(insertQuery);
      });

      res.status(201).json({ message: "Registro inserido com sucesso." });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Erro ao inserir registro:", error.message);
        res.status(500).json({ error: "Erro ao inserir registro" });
      }
    }
  }
);

app.get("/speakers", async (req: Request, res: Response) => {
  try {
    const sql = `
      WITH LastSpeech AS (
        SELECT
          cm.name,
          s.sacrament_meeting_date AS last_speech_date,
          s.speaker_position
        FROM
          church_members cm
        JOIN
          speakers s ON s.member_id = cm.id
        WHERE
          s.sacrament_meeting_date = (
            SELECT MAX(sacrament_meeting_date)
            FROM speakers
            WHERE member_id = cm.id
          )
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
        LastSpeech;
    `;

    const result = await knex.raw(sql);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Erro ao retornar os registros:", error);
    res.status(500).json({ error: "Erro ao retornar os registros" });
  }
});

app.get("/church_members", async (req: Request, res: Response) => {
  try {
    const result = await knex.select().from("church_members");

    res.status(200).json(result);
  } catch (error) {
    console.log("Erro ao retornar os membros:", error);
    res.status(500).json({ error: "Erro ao retornar os membros" });
  }
});

export default app;
