import { Request, Response } from "express";
import { IUserService } from "../../types/IUserService.ts";
import { createWardAndUserSchema } from "../../validators/userValidator.ts";
import { z } from "zod";

export class UserController {
  constructor(private userService: IUserService) {}

  async createUser(req: Request, res: Response) {
    try {
      const { wardData, userData } = createWardAndUserSchema.parse(req.body);
      await this.userService.create(wardData, userData);
      res.status(201).json({ message: "Usuário criado com sucesso" });
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

      console.error("🐛", error);
      res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("🐛", error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  }
}
