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

// src/database/migrations/20240918164457_wards.ts
var wards_exports = {};
__export(wards_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(wards_exports);
async function up(knex) {
  return knex.schema.createTable("wards" /* wards */, (table) => {
    table.increments("id").primary(), table.string("name", 100).notNullable(), table.string("city", 50).notNullable(), table.string("state").unsigned().notNullable(), table.string("country", 150).notNullable(), table.timestamps(false, true);
  }).then(() => {
    console.log(`\u{1F6A9} Created table: ${"wards" /* wards */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("wards" /* wards */).then(() => {
    console.log("\u{1F6A9} Dropped table: wards");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
