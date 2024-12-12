import { Users } from "../database/models/users.ts";
import { UserChangePasswordDTO, UserDTO, WardDTO } from "./IUserDTO.ts";

export interface IUserService {
  create(
    wardData: Omit<WardDTO, "id" | "created_at" | "updated_at">,
    userData: Omit<UserDTO, "id" | "ward_id" | "created_at" | "updated_at">
  ): Promise<void>;
  getAllUsers(): Promise<Users[]>;
  changePassword({
    oldPassword,
    newPassword,
    userId,
  }: UserChangePasswordDTO): Promise<void>;
}
