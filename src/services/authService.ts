import { AuthResponse, IAuthService } from "types/IAuthService.ts";
import knex from "../database";
import { verifyPassword } from "utils.ts/verifyPassword.ts";
import { generateToken } from "utils.ts/jwt.ts";
import { AuthDTO } from "types/IAuthDTO.ts";
import { UserChangePasswordDTO } from "types/IUserDTO.ts";
import { hash } from "bcrypt";
import db from "../database";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PasswordResetTokens } from "@database/models/passwordResetTokens.ts";
import { Users } from "@database/models/users.ts";
import "dotenv/config";
import {
  GoneError,
  NotFoundError,
  UnauthorizedError,
} from "utils.ts/appError.ts";
import { authServiceLogger as logger } from "utils.ts/logger.ts";

export class AuthService implements IAuthService {
  async login(data: AuthDTO): Promise<AuthResponse> {
    logger.info({ email: data.email }, "Processando login");

    const user = await knex("users").where("email", data.email).first();
    if (!user) {
      logger.warn(
        { email: data.email },
        "Tentativa de login com e-mail inexistente"
      );
      throw new NotFoundError("O email informado não existe");
    }

    const samePasswords = await verifyPassword(data.password, user.password);
    if (!samePasswords) {
      logger.warn({ email: data.email, userId: user.id }, "Senha inválida");
      throw new UnauthorizedError("Usuário ou senha inválido");
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      ward_id: user.ward_id,
      nrm: user.member_number,
      role: user.role,
    });

    logger.info(
      { userId: user.id, email: user.email },
      "Token gerado com sucesso"
    );

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
    logger.info({ userId }, "Processando mudança de senha");

    const user = await knex("users").where("id", userId).first();

    if (!user || !(await verifyPassword(user.password, oldPassword))) {
      logger.warn({ userId }, "Tentativa de mudança com senha atual errada");
      throw new UnauthorizedError("Senha atual inválida");
    }

    const hashedNewPassword = await hash(newPassword, 8);
    await knex("users")
      .where("id", userId)
      .update({ password: hashedNewPassword });

    logger.info({ userId }, "Senha redefinida com sucesso");
  }

  async forgotPassword(memberNumber: string): Promise<void> {
    logger.info({ memberNumber }, "Processando recuperação de senha");

    const user = await db
      .select("*")
      .from("users")
      .where("member_number", "=", memberNumber)
      .first();

    if (!user?.id) {
      logger.warn(
        { memberNumber },
        "Tentativa de recuperação com número inválido"
      );
      throw new NotFoundError("Usuário não encontrado.");
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
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: {
        name: "Suporte - LDS Toolkit",
        address: process.env.SMTP_USER!,
      },
      to: user.email,
      subject: "Redefinição de senha",
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
      `,
    });

    logger.info(
      { userId: user.id, email: user.email },
      "E-mail de recuperação enviado"
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    logger.info({ token }, "Verificando token de redefinição");

    const resetToken = await db<PasswordResetTokens>("password_reset_tokens")
      .where("token", token)
      .first();

    if (!resetToken) {
      logger.warn({ token }, "Tentativa de redefinição com token inválido");
      throw new NotFoundError("Token de redefinição inválido ou já utilizado");
    }

    const now = new Date();
    if (new Date(resetToken.expires_at) < now) {
      logger.warn({ token }, "Tentativa de redefinição com token expirado");
      throw new GoneError("Token de redefinição expirado");
    }

    logger.info(
      { userId: resetToken.user_id },
      "Token válido, redefinindo senha"
    );

    const hashedPassword = await hash(newPassword, 8);

    await db.transaction(async (trx) => {
      await trx<Users>("users")
        .where("id", resetToken.user_id)
        .update({ password: hashedPassword });

      await trx("password_reset_tokens")
        .where("user_id", resetToken.user_id)
        .delete();
    });

    logger.info({ userId: resetToken.user_id }, "Senha redefinida com sucesso");
  }
}
