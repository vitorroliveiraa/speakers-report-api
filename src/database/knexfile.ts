import dotenv from "dotenv";
import { Knex } from "knex";
import path from "path";

interface KnexConfig {
  [key: string]: Knex.Config;
}

const knexConfig: KnexConfig = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "admin",
      password: process.env.DB_PWD || "admin",
      database: process.env.DB_NAME || "speakers-report",
    },
    pool: {
      min: 2, // Mínimo de conexões no pool
      max: 10, // Máximo de conexões no pool
      acquireTimeoutMillis: 30000, // Tempo limite para adquirir uma conexão (em milissegundos)
      idleTimeoutMillis: 60000, // Tempo limite de inatividade para uma conexão (em milissegundos)
      reapIntervalMillis: 1000, // Intervalo para tentativas de reconexão (em milissegundos)
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
      directory: path.join(process.cwd(), "migrations"),
    },
    seeds: {
      directory: path.join(process.cwd(), "seeds"),
      extension: "ts",
      timestampFilenamePrefix: true,
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
      directory: path.join(process.cwd(), "migrations"),
    },
    seeds: {
      directory: path.join(process.cwd(), "seeds"),
      extension: "ts",
      timestampFilenamePrefix: true,
    },
  },
};

export default knexConfig;
