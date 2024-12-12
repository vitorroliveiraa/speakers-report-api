import {
  sign,
  verify,
  JwtPayload,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";
import { CustomJwtPayload } from "types/IUserDTO.ts";

export function generateToken(payload: object): string {
  return sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
}

const TokenErrorMessages = {
  EXPIRED: "Token expired",
  INVALID_SIGNATURE: "Invalid token signature",
  UNKNOWN: "Unknown token error",
} as const;

export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenVerificationError";
  }
}

export function verifyToken(token: string): string | JwtPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  try {
    return verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new TokenVerificationError(TokenErrorMessages.EXPIRED);
    } else if (error instanceof JsonWebTokenError) {
      throw new TokenVerificationError(TokenErrorMessages.INVALID_SIGNATURE);
    } else {
      throw new TokenVerificationError(TokenErrorMessages.UNKNOWN);
    }
  }
}
