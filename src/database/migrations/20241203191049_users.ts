import { Knex } from "knex";
import { ETableNames } from "../ETableNames.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.users, (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable();
      table
        .enu("role", [
          "bishop",
          "first_counselor",
          "second_counselor",
          "ward_clerk",
          "assistant_ward_clerk",
        ])
        .notNullable();
      table.integer("ward_id").unsigned().notNullable();
      table.string("email", 150).notNullable();
      table.string("password").notNullable();
      table.string("member_number").notNullable();
      table.timestamps(false, true);

      table
        .foreign("ward_id")
        .references("id")
        .inTable("wards")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .then(() => {
      console.log(`🚩 Created table: ${ETableNames.users}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.users).then(() => {
    console.log("🚩 Dropped table: users");
  });
}
