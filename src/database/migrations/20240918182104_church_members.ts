import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("church_members", (table) => {
      table.increments("id").primary();
      table.string("name", 100);
    })
    .then(() => {
      console.log("🚩 Created table: church_members");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("church_members").then(() => {
    console.log("🚩 Dropped table: church_members");
  });
}
