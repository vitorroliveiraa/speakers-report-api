import { ETableNames } from "@database/ETableNames.ts";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.speakers, (table) => {
      table.increments("id").primary();
      table.date("sacrament_meeting_date");
      table.integer("member_id", 100).unsigned().notNullable();
      table.integer("speaker_position", 100);
      table.integer("ward_id").unsigned().notNullable();
      table
        .foreign("member_id")
        .references("id")
        .inTable("church_members")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .foreign("ward_id")
        .references("id")
        .inTable("wards")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .then(() => {
      console.log("🚩 Created table: speakers");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.speakers).then(() => {
    console.log("🚩 Dropped table: speakers");
  });
}
