import knex from "knex";
import config from "./knexfile.ts";
import "dotenv/config";

const environment = process.env.NODE_ENV || "development";

const knexConfig = config[environment];

const db = knex(knexConfig);

export default db;
