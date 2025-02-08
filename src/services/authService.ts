import { AuthResponse, IAuthService } from "types/IAuthService.ts";
import knex from "../database";
import { verifyPassword } from "utils.ts/verifyPassword.ts";
import { generateToken } from "utils.ts/jwt.ts";
import { AuthDTO } from "types/IAuthDTO.ts";
import { UserChangePasswordDTO } from "types/IUserDTO.ts";
import { hash } from "bcrypt";
import db from "../database";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PasswordResetTokens } from "@database/models/passwordResetTokens.ts";
import { Users } from "@database/models/users.ts";
import "dotenv/config";

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
        member_number: user.member_number,
      },
      expiresIn: process.env.JWT_EXPIRE_IN,
    };
  }

  async changePassword({
    oldPassword,
    newPassword,
    userId,
  }: UserChangePasswordDTO): Promise<void> {
    const user = await knex("users").where("id", userId).first();

    if (!user || !(await verifyPassword(user.password, oldPassword))) {
      throw new Error("Invalid current password");
    }

    const hashedNewPassword = await hash(newPassword, 8);
    await knex("users")
      .where("id", userId)
      .update({ password: hashedNewPassword });
  }

  async forgotPassword(memberNumber: string): Promise<void> {
    const user = await db
      .select("*")
      .from("users")
      .where("member_number", "=", memberNumber)
      .first();

    if (!user?.id) {
      throw new Error("Usuário não encontrado.");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db("password_reset_tokens").insert({
      user_id: user?.id,
      token,
      expires_at: expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Suporte" <${process.env.EMAIL_USER}>`,
      to: user?.email,
      subject: "Redefinição de senha",
      html: `
        <p>Olá, ${user?.name}!</p>
        <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await db<PasswordResetTokens>("password_reset_tokens")
      .where("token", token)
      .first();

    if (!resetToken) {
      throw new Error("Token inválido.");
    }

    const now = new Date();
    if (new Date(resetToken.expires_at) < now) {
      throw new Error("Token expirado.");
    }

    const hashedPassword = await hash(newPassword, 8);

    await db<Users>("users")
      .where("id", resetToken.user_id)
      .update({ password: hashedPassword });

    await db("password_reset_tokens")
      .where("user_id", resetToken.user_id)
      .delete();
  }
}
