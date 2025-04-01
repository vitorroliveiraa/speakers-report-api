import { IAuthService } from "types/IAuthService.ts";
import { Request, Response } from "express";
import {
  changePasswordSchema,
  requestUserSchema,
  resetPasswordSchema,
} from "validators/userValidator.ts";
import z from "zod";
import { AppError } from "utils.ts/appError.ts";

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result = await this.authService.login({ email, password });

      res.status(200).json(result);
    } catch (error) {
      console.error("🐛", error);
      res.status(500).json({ message: "Erro ao fazer login do usuário" });
    }
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    const { id: userId } = requestUserSchema.parse(req.user);

    try {
      await this.authService.changePassword({
        oldPassword,
        newPassword,
        userId,
      });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Erro de validação",
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }

      console.error("🐛 UserController - changePassword: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { memberNumber } = req.body;

    try {
      await this.authService.forgotPassword(memberNumber);

      res
        .status(200)
        .json({ message: "Verifique seu e-mail para redefinir sua senha." });
    } catch (error) {
      console.error("🐛", error);
      res
        .status(400)
        .json({ error: (error as Error).message || "Falha ao enviar e-mail." });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      
      await this.authService.resetPassword(token, newPassword);

      res.status(200).json({ message: "Senha redefinida com sucesso." }).send();
    } catch (error) {
      console.log("Erro no reset de senha:", error);

      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          error: "ValidationError",
          message: "Erro de validação dos dados",
          details: errors,
        });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
          ...(process.env.NODE_ENV === "development" && {
            details: error.stack,
          }),
        });
      }

      return res.status(500).json({
        error: "InternalServerError",
        message: "Ocorreu um erro inesperado ao redefinir a senha",
        ...(process.env.NODE_ENV === "development" && {
          details: (error as Error).stack,
        }),
      });
    }
  }
}
