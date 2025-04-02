import express, { json, urlencoded, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import dotenv from "dotenv";

import knex from "./database/index.ts";
import path from "path";
import { router } from "./api/routes/index.ts";
import { authMiddleware } from "middlewares/auth.ts";
import pinoHttp from "pino-http";
import logger from "utils.ts/logger.ts";
import { errorHandler } from "middlewares/errorMiddleware.ts";
import { RateLimitError } from "utils.ts/appError.ts";

const dotenvFilepath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: dotenvFilepath });

const corsOptions = {
  origin: [process.env.FRONTEND_URL!],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  handler: (req, res) => {
    const error = new RateLimitError(15 * 60);
    res.set("Retry-After", error.retryAfter.toString());
    throw error;
  },
});

const app = express();
app.use(cors(corsOptions));
app.use(limiter);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());

type Speakers = {
  member_id: number;
  speaker_position: number;
};
interface ISpeakersReq {
  sacrament_meeting_date: Date;
  ward_id: number;
  speakers: Speakers[];
}

app.use(router);
app.use(
  pinoHttp({
    logger,
    customSuccessMessage: (req, res) =>
      `Request ${req.method} ${req.url} - ${res.statusCode}`,
  })
);

app.post(
  "/speakers/insert",
  authMiddleware,
  async (req: Request<{}, {}, ISpeakersReq>, res: Response) => {
    const { sacrament_meeting_date, ward_id, speakers } = req.body;

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
            return `('${sacrament_meeting_date}', '${speaker.member_id}', '${speaker.speaker_position}', '${ward_id}')`;
          })
          .join(", ");

        const insertQuery = `
          INSERT INTO speakers (sacrament_meeting_date, member_id, speaker_position, ward_id)
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

app.get("/speakers", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ward_id: wardId } = req.user;

    if (!wardId) {
      return res
        .status(400)
        .json({ error: "O parâmetro wardId é obrigatório." });
    }

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

    const result = await knex.raw(sql, [wardId, wardId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Erro ao retornar os registros:", error);
    res.status(500).json({ error: "Erro ao retornar os registros" });
  }
});

app.get(
  "/church_members",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      console.log(req.user);

      const { ward_id: wardId } = req.user;

      if (!wardId) {
        return res
          .status(400)
          .json({ error: "O parâmetro wardId é obrigatório." });
      }

      const result = await knex
        .select()
        .from("church_members")
        .where("ward_id", wardId);

      res.status(200).json(result);
    } catch (error) {
      console.log("Erro ao retornar os membros:", error);
      res.status(500).json({ error: "Erro ao retornar os membros" });
    }
  }
);

app.use(errorHandler);

export default app;
