import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "types/IUserDTO.ts";

declare global {
  namespace Express {
    export interface Request {
      user?: CustomJwtPayload;
    }
  }
}
