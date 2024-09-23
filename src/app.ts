import axios from "axios";
import express, { json, urlencoded, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import knex from "./database";
import path from "path";

const dotenvFilepath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: dotenvFilepath });
//Tredsdfn8- senha ubuntu
const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/speakers/insert", async (req: Request, res: Response) => {
  const speakers = req.body;
  //   console.log("data", data);

  try {
    await knex.transaction(async (trx) => {
      for (const speaker of speakers) {
        await trx("speakers").insert({
          sacrament_meeting_date: speaker.sacrament_meeting_date,
          member_id: speaker.member_id,
          speaker_position: speaker.speaker_position,
        });
      }
    });
    // const sql = `
    //   INSERT INTO speakers (sacrament_meeting_date, first_speaker, second_speaker, third_speaker)
    //   VALUES (?, ?, ?, ?)
    // `;

    // await knex.raw(sql, [
    //   sacramentMeetingDate,
    //   firstSpeaker,
    //   secondSpeaker,
    //   thirdSpeaker,
    // ]);

    res.status(201).json({ message: "Registro inserido com sucesso." });
  } catch (error) {
    console.log("Erro ao inserir registro:", error);
    res.status(500).json({ error: "Erro ao inserir registro" });
  }
});

app.get("/speakers", async (req: Request, res: Response) => {
  try {
    const sql = `
      WITH LastSpeech AS (
        SELECT
          cm.name,
          TO_CHAR(s.sacrament_meeting_date, 'YYYY/MM/DD') AS last_speech_date,
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
        last_speech_date,
        speaker_position,
        (SELECT COUNT(*)
         FROM generate_series(
           last_speech_date::date, -- Último discurso
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
