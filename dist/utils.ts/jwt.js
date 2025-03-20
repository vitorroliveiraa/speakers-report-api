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

// src/utils.ts/jwt.ts
var jwt_exports = {};
__export(jwt_exports, {
  TokenVerificationError: () => TokenVerificationError,
  generateToken: () => generateToken,
  verifyToken: () => verifyToken
});
module.exports = __toCommonJS(jwt_exports);
var import_jsonwebtoken = require("jsonwebtoken");
function generateToken(payload) {
  return (0, import_jsonwebtoken.sign)(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
}
var TokenErrorMessages = {
  EXPIRED: "Token expired",
  INVALID_SIGNATURE: "Invalid token signature",
  UNKNOWN: "Unknown token error"
};
var TokenVerificationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenVerificationError";
  }
};
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }
  try {
    return (0, import_jsonwebtoken.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof import_jsonwebtoken.TokenExpiredError) {
      throw new TokenVerificationError(TokenErrorMessages.EXPIRED);
    } else if (error instanceof import_jsonwebtoken.JsonWebTokenError) {
      throw new TokenVerificationError(TokenErrorMessages.INVALID_SIGNATURE);
    } else {
      throw new TokenVerificationError(TokenErrorMessages.UNKNOWN);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TokenVerificationError,
  generateToken,
  verifyToken
});
