import { IAuthService } from "types/IAuthService.ts";
import { Request, Response } from "express";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  requestUserSchema,
} from "validators/userValidator.ts";
import z from "zod";

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
      res.status(500).json({ message: "" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    try {
      await this.authService.resetPassword(token, newPassword);

      res.status(200).json({ message: "Senha redefinida com sucesso." }).send();
    } catch (error) {
      console.error("🐛", error);
      res.status(500).json({ message: "" });
    }
  }
}
