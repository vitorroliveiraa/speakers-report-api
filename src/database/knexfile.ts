import "dotenv/config";
import { Knex } from "knex";
import path from "path";

interface KnexConfig {
  [key: string]: Knex.Config;
}

const baseConfig: Partial<Knex.Config> = {
  client: "pg",
  migrations: {
    tableName: "knex_migrations",
    extension: process.env.NODE_ENV === "development" ? "ts" : "js",
    directory: path.join(
      process.cwd(),
      process.env.NODE_ENV === "development" ? "migrations" : "migrations"
    ),
  },
  seeds: {
    directory: path.join(
      process.cwd(),
      process.env.NODE_ENV === "development" ? "seeds" : "seeds"
    ),
    extension: process.env.NODE_ENV === "development" ? "ts" : "js",
    timestampFilenamePrefix: true,
  },
};

const readSecret = (path: string): string => {
  console.log("🚩 path", path);
  if (process.env.NODE_ENV !== "production") {
    return "";
  }

  try {
    return require("fs").readFileSync(path, "utf8").trim();
  } catch (e) {
    const envVarName = path.split("/").pop()?.toUpperCase() || "";
    return process.env[envVarName] || "";
  }
};

const connection =
  process.env.NODE_ENV === "production"
    ? {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        user: readSecret(process.env.DB_PROD_USER_FILE!),
        password: readSecret(process.env.DB_PROD_PWD_FILE!),
        database: process.env.DB_NAME,
        ssl:
          process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      }
    : {
        host: "localhost",
        port: 5432,
        user: "admin",
        password: "admin",
        database: "speakers-report-dev",
        ssl: false,
      };

const knexConfig: KnexConfig = {
  development: {
    ...baseConfig,
    connection,
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
      createTimeoutMillis: 30000,
    },
  },
  production: {
    ...baseConfig,
    connection,
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 30000, // Tempo máximo que uma conexão pode ficar inativa
      createRetryIntervalMillis: 1000, // Intervalo entre as tentativas de criar uma nova conexão
      createTimeoutMillis: 60000, // Tempo máximo para criar uma nova conexão
      propagateCreateError: false, // Não propaga erros de conexão para evitar quebrar a aplicação
      reapIntervalMillis: 1000, // Verifica conexões com mais frequência
    },
  },
};

export default knexConfig;
