import { JwtPayload } from "jsonwebtoken";
import { Users } from "../database/models/users.ts";
import { Wards } from "../database/models/wards.ts";

export interface UserDTO extends Users {}

export interface WardDTO extends Wards {}

export interface UserChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  userId: number;
}

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
}
