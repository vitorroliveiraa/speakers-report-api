import { Users } from "../database/models/users.ts";
import { Wards } from "../database/models/wards.ts";

export interface UserDTO extends Users {}

export interface UserListDTO extends Users {}

export interface WardDTO extends Wards {}
