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

// src/database/migrations/20240918182104_church_members.ts
var church_members_exports = {};
__export(church_members_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(church_members_exports);
async function up(knex) {
  return knex.schema.createTable("church_members", (table) => {
    table.increments("id").primary();
    table.string("name", 100);
  }).then(() => {
    console.log("\u{1F6A9} Created table: church_members");
  });
}
async function down(knex) {
  return knex.schema.dropTable("church_members").then(() => {
    console.log("\u{1F6A9} Dropped table: church_members");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
