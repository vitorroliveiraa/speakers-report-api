import { Users } from "@database/models/users.ts";
import { AuthDTO } from "./IAuthDTO.ts";
import { UserChangePasswordDTO } from "./IUserDTO.ts";

type User = Omit<Users, "password" | "created_at" | "updated_at">;

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: string | undefined;
}

export interface IAuthService {
  login(data: AuthDTO): Promise<AuthResponse>;
  changePassword({
    oldPassword,
    newPassword,
    userId,
  }: UserChangePasswordDTO): Promise<void>;
  forgotPassword(memberNumber: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
