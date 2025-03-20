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

// src/services/userService.ts
var userService_exports = {};
__export(userService_exports, {
  UserService: () => UserService
});
module.exports = __toCommonJS(userService_exports);

// src/database/index.ts
var import_knex = __toESM(require("knex"));

// src/database/knexfile.ts
var import_config = require("dotenv/config");
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
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false
      }
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
var import_config2 = require("dotenv/config");
var environment = process.env.NODE_ENV || "development";
var knexConfig2 = knexfile_default[environment];
var db = (0, import_knex.default)(knexConfig2);
var database_default = db;

// src/services/userService.ts
var import_bcrypt = require("bcrypt");
var import_pdf_parse = __toESM(require("pdf-parse"));
var UserService = class {
  async create(wardData, userData) {
    const trx = await database_default.transaction();
    try {
      const existingUser = await trx("users").where({ email: userData.email }).first();
      if (existingUser) throw new Error("O email informado j\xE1 est\xE1 em uso");
      const [wardIdObj] = await trx("wards").insert(wardData).returning("id");
      const passwordHash = await (0, import_bcrypt.hash)(userData.password, 8);
      const user = {
        ...userData,
        ward_id: wardIdObj.id
      };
      await trx("users").insert({
        ...user,
        password: passwordHash,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      });
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      if (error instanceof Error)
        throw new Error("Erro ao criar ward e usu\xE1rio: " + error.message);
      else console.log("\u{1F41B} Erro desconhecido:", error);
    }
  }
  async getAllUsers() {
    const user = await database_default("users").select("*");
    return user;
  }
  async extractNamesFromPDF(wardId, buffer) {
    const data = await (0, import_pdf_parse.default)(buffer);
    const text = data.text;
    const lines = text.split("\n");
    const names = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.includes("Somente para Uso da Igreja")) {
        continue;
      }
      if (trimmedLine.includes(",") && trimmedLine.length > 3) {
        names.push(trimmedLine);
      }
    }
    if (names.length === 0) {
      throw new Error("Nenhum nome encontrado no PDF.");
    }
    const members = names.map((name) => ({
      name: name.trim(),
      ward_id: wardId
      // Gera um número aleatório para ward_id
    }));
    return members;
  }
  async createChurchMembers(wardId, members) {
    try {
      const existingMembers = await database_default("church_members").where({ ward_id: wardId }).select("id", "name");
      const existingNamesSet = new Set(
        existingMembers.map((member) => member.name)
      );
      const newNamesSet = new Set(members.map((member) => member.name));
      const membersToAdd = members.filter(
        (member) => !existingNamesSet.has(member.name)
      );
      const membersToRemove = existingMembers.filter((member) => !newNamesSet.has(member.name)).map((member) => member.id);
      if (membersToAdd.length > 0) {
        await database_default("church_members").insert(membersToAdd);
      }
      if (membersToRemove.length > 0) {
        await database_default("church_members").whereIn("id", membersToRemove).del();
      }
    } catch (error) {
      console.error("\u274C Erro ao inserir usu\xE1rios:", error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserService
});
//!QUANDO NÃO INSERIR, LANÇAR ERRO
