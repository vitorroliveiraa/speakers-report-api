import { Knex } from "knex";
import { ETableNames } from "../ETableNames.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.wards, (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable();
      table.string("city", 50).notNullable();
      table.string("state").unsigned().notNullable();
      table.string("country", 150).notNullable();
      table.string("unit_number", 150).notNullable();
      table.timestamps(false, true);
    })
    .then(() => {
      console.log(`🚩 Created table: ${ETableNames.wards}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.wards).then(() => {
    console.log("🚩 Dropped table: wards");
  });
}
