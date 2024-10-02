import knex from "knex";
import config from "./knexfile.ts";
import "dotenv/config";

// Definir o ambiente atual, sendo 'development' por padrão
const environment = process.env.NODE_ENV || "development";
console.log("environment", environment);

const knexConfig = config[environment];

// Criar a instância do Knex com a configuração adequada
const db = knex(knexConfig);

export default db;
