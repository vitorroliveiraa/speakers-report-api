import { Knex } from "knex";
import { ETableNames } from "../ETableNames.ts";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.users, (table) => {
      table.increments("id").primary();
      table.string("name", 100).notNullable();
      table
        .enu("role", [
          "Bishop",
          "1st Counselor",
          "2nd Counselor",
          "Ward Clerk",
          "Assistant Ward Clerk",
          "Ward Executive Secretary",
        ])
        .notNullable();
      table.integer("ward_id").unsigned().notNullable();
      table.string("email", 150).notNullable();
      table.string("password").notNullable();
      table.string("member_number").notNullable();
      table.timestamps(true, true);

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
