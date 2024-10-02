import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("speakers", (table) => {
      table.increments("id").primary();
      table.date("sacrament_meeting_date");
      table.integer("member_id", 100);
      table.integer("speaker_position", 100);
    })
    .then(() => {
      console.log("🚩 Created table: speakers");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("speakers").then(() => {
    console.log("🚩 Dropped table: speakers");
  });
}
