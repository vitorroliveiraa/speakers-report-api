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

// src/database/migrations/20241203191049_users.ts
var users_exports = {};
__export(users_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(users_exports);
async function up(knex) {
  return knex.schema.createTable("users" /* users */, (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("role", 50).notNullable();
    table.integer("ward_id").unsigned().notNullable();
    table.string("email", 150).notNullable();
    table.string("password").notNullable();
    table.string("member_number").notNullable();
    table.timestamps(false, true);
    table.foreign("ward_id").references("id").inTable("wards").onDelete("CASCADE").onUpdate("CASCADE");
  }).then(() => {
    console.log(`\u{1F6A9} Created table: ${"users" /* users */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("users" /* users */).then(() => {
    console.log("\u{1F6A9} Dropped table: users");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
