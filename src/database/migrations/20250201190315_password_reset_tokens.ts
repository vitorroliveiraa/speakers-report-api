import { ETableNames } from "@database/ETableNames.ts";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETableNames.passwordResetTokens, (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable().unique();
      table.string("token").notNullable();
      table.timestamp("expires_at").notNullable();
      table.timestamps(true, true);

      table
        .foreign("user_id")
        .references("id")
        .inTable(ETableNames.users)
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .then(() => {
      console.log(`🚩 Created table: ${ETableNames.passwordResetTokens}`);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETableNames.passwordResetTokens).then(() => {
    console.log(`🚩 Dropped table: ${ETableNames.passwordResetTokens}`);
  });
}
