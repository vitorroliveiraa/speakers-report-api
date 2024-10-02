"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express_async_errors = require("express-async-errors");

// src/app.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_dotenv = __toESM(require("dotenv"));

// src/database/index.ts
var import_knex = __toESM(require("knex"));

// src/database/knexfile.ts
var import_path = __toESM(require("path"));
var knexConfig = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "admin",
      password: process.env.DB_PWD || "admin",
      database: process.env.DB_NAME || "speakers-report"
    },
    pool: {
      min: 2,
      // Mínimo de conexões no pool
      max: 10,
      // Máximo de conexões no pool
      acquireTimeoutMillis: 3e4,
      // Tempo limite para adquirir uma conexão (em milissegundos)
      idleTimeoutMillis: 6e4,
      // Tempo limite de inatividade para uma conexão (em milissegundos)
      reapIntervalMillis: 1e3
      // Intervalo para tentativas de reconexão (em milissegundos)
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
      directory: import_path.default.join(process.cwd(), "migrations")
    },
    seeds: {
      directory: import_path.default.join(process.cwd(), "seeds"),
      extension: "ts",
      timestampFilenamePrefix: true
    }
  }
};
var knexfile_default = knexConfig;

// src/database/index.ts
var environment = process.env.NODE_ENV || "development";
var knexConfig2 = knexfile_default[environment];
var db = (0, import_knex.default)(knexConfig2);
var database_default = db;

// src/app.ts
var import_path2 = __toESM(require("path"));
var dotenvFilepath = import_path2.default.resolve(process.cwd(), ".env");
import_dotenv.default.config({ path: dotenvFilepath });
var app = (0, import_express.default)();
app.use((0, import_cors.default)());
app.use((0, import_express.json)());
app.use((0, import_express.urlencoded)({ extended: true }));
app.post("/speakers/insert", async (req, res) => {
  const speakers = req.body;
  try {
    await database_default.transaction(async (trx) => {
      for (const speaker of speakers) {
        await trx("speakers").insert({
          sacrament_meeting_date: speaker.sacrament_meeting_date,
          member_id: speaker.member_id,
          speaker_position: speaker.speaker_position
        });
      }
    });
    res.status(201).json({ message: "Registro inserido com sucesso." });
  } catch (error) {
    console.log("Erro ao inserir registro:", error);
    res.status(500).json({ error: "Erro ao inserir registro" });
  }
});
app.get("/speakers", async (req, res) => {
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
           last_speech_date::date, -- \xDAltimo discurso
           NOW(), 
           interval '1 week'
         ) gs
         WHERE EXTRACT(DOW FROM gs) = 0 -- Somente domingos
        ) AS sundays_since_last_speech
      FROM
        LastSpeech;
    `;
    const result = await database_default.raw(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Erro ao retornar os registros:", error);
    res.status(500).json({ error: "Erro ao retornar os registros" });
  }
});
app.get("/church_members", async (req, res) => {
  try {
    const result = await database_default.select().from("church_members");
    res.status(200).json(result);
  } catch (error) {
    console.log("Erro ao retornar os membros:", error);
    res.status(500).json({ error: "Erro ao retornar os membros" });
  }
});
var app_default = app;

// src/server.ts
var import_config = require("dotenv/config");
app_default.listen(process.env.API_PORT, () => {
  console.log("\u{1F680} App is running at http://localhost:" + process.env.API_PORT);
});
