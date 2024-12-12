import { IAuthService } from "types/IAuthService.ts";
import { Request, Response } from "express";

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
}
