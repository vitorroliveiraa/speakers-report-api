import { Users } from "@database/models/users.ts";
import { AuthDTO } from "./IAuthDTO.ts";

type User = Omit<Users, "password" | "created_at" | "updated_at">;

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: string | undefined;
}

export interface IAuthService {
  login(data: AuthDTO): Promise<AuthResponse>;
}
