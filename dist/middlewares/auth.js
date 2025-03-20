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

// src/middlewares/auth.ts
var auth_exports = {};
__export(auth_exports, {
  authMiddleware: () => authMiddleware
});
module.exports = __toCommonJS(auth_exports);

// src/utils.ts/jwt.ts
var import_jsonwebtoken = require("jsonwebtoken");
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

// src/middlewares/auth.ts
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token not provided" });
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenVerificationError) {
      return res.status(401).json({ error: error.message });
    }
    console.error("Unexpected authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authMiddleware
});
