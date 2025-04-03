import { Request, Response } from "express";
import { IUserService } from "../../types/IUserService.ts";
import {
  createWardAndUserSchema,
  pdfUploadSchema,
} from "../../validators/userValidator.ts";
import { z } from "zod";
import { validatePDFStructure } from "utils.ts/validatePDFStructure.ts";

export class UserController {
  constructor(private userService: IUserService) {}

  async createUser(req: Request, res: Response) {
    const { wardData, userData } = createWardAndUserSchema.parse(req.body);

    await this.userService.create(wardData, userData);

    res.status(201).json({ message: "Usuário criado com sucesso" });
  }

  async upload(req: Request, res: Response) {
    const validation = pdfUploadSchema.safeParse({ file: req.file });

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { ward_id: wardId } = req.user;
    const pdfFile = req.file?.buffer!;

    const isValid = await validatePDFStructure(pdfFile);

    if (!isValid) {
      return res
        .status(400)
        .send(
          'O arquivo PDF deve conter apenas uma coluna chamada "Nome" em cada página.'
        );
    }

    const names = await this.userService.extractNamesFromPDF(wardId, pdfFile);

    await this.userService.createChurchMembers(wardId, names);

    return res.status(200).json("Membros da igreja inseridos com sucesso.");
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.json(users);
  }
}
