"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database/index.ts
var database_exports = {};
__export(database_exports, {
  default: () => database_default
});
module.exports = __toCommonJS(database_exports);
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
