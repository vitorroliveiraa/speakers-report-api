import { AuthResponse, IAuthService } from "types/IAuthService.ts";
import knex from "../database";
import { verifyPassword } from "utils.ts/verifyPassword.ts";
import { generateToken } from "utils.ts/jwt.ts";
import { AuthDTO } from "types/IAuthDTO.ts";

export class AuthService implements IAuthService {
  async login(data: AuthDTO): Promise<AuthResponse> {
    const user = await knex("users").where("email", data.email).first();
    if (!user) throw new Error("O email informado não existe");

    const samePasswords = await verifyPassword(data.password, user.password);
    if (!samePasswords) throw new Error("Usuário ou senha inválido");

    const token = generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward_id: user.ward_id,
      },
      expiresIn: process.env.JWT_EXPIRE_IN,
    };
  }
}
