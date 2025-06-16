import { JwtPayload } from "jsonwebtoken";
import { Users } from "../database/models/users.ts";
import { Wards } from "../database/models/wards.ts";
import { ExternalChurchMembers } from "@database/models/externalChurchMembers.ts";

export interface UserDTO extends Users {}

export interface WardDTO extends Wards {}

export interface UserChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  userId: number;
}

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  name: string;
  email: string;
  ward_id: number;
  nrm: string;
  role: string;
}

export interface IChurchMembers {
  name: string;
  ward_id: number;
}

export interface IExternalChurchMembers
  extends Omit<ExternalChurchMembers, "id" | "type"> {}
