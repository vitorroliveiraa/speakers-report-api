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

// src/database/migrations/20240918164457_speakers.ts
var speakers_exports = {};
__export(speakers_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(speakers_exports);
async function up(knex) {
  return knex.schema.createTable("speakers", (table) => {
    table.increments("id").primary();
    table.date("sacrament_meeting_date");
    table.string("first_speaker_id", 100);
    table.string("second_speaker_id", 100);
    table.string("third_speaker_id", 100);
  }).then(() => {
    console.log("\u{1F6A9} Created table: speakers");
  });
}
async function down(knex) {
  return knex.schema.dropTable("speakers").then(() => {
    console.log("\u{1F6A9} Dropped table: speakers");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
