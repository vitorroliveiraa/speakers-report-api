import { ETableNames } from "@database/ETableNames.ts";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.church_members, (table) => {
      table.uuid("id").primary();
      table.string("name", 100).notNullable();
      table.string("type", 10).notNullable().defaultTo("internal");
      table.integer("ward_id").unsigned().notNullable();
      table
        .foreign("ward_id")
        .references("id")
        .inTable("wards")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .then(() => {
      console.log(`🚩 Created table: ${ETableNames.church_members}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.church_members).then(() => {
    console.log("🚩 Dropped table: church_members");
  });
}
