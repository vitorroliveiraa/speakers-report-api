import { Request, Response, NextFunction } from "express";
import { CustomJwtPayload } from "types/IUserDTO.ts";
import { TokenVerificationError, verifyToken } from "utils.ts/jwt.ts";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token not provided" });

  try {
    const decoded = verifyToken(token);
    req.user = decoded as CustomJwtPayload;
    next();
  } catch (error) {
    if (error instanceof TokenVerificationError) {
      return res.status(401).json({ error: error.message });
    }

    console.error("Unexpected authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
