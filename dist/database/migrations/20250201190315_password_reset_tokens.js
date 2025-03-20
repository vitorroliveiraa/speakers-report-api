"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database/migrations/20250201190315_password_reset_tokens.ts
var password_reset_tokens_exports = {};
__export(password_reset_tokens_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(password_reset_tokens_exports);
async function up(knex) {
  return knex.schema.createTable("password_reset_tokens" /* passwordResetTokens */, (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("token").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamps(false, true);
    table.foreign("user_id").references("id").inTable("users" /* users */).onDelete("CASCADE").onUpdate("CASCADE");
  }).then(() => {
    console.log(`\u{1F6A9} Created table: ${"password_reset_tokens" /* passwordResetTokens */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("password_reset_tokens" /* passwordResetTokens */).then(() => {
    console.log(`\u{1F6A9} Dropped table: ${"password_reset_tokens" /* passwordResetTokens */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
