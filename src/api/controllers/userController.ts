import { Request, Response } from "express";
import { IUserService } from "../../types/IUserService.ts";
import {
  createWardAndUserSchema,
  externalChurchMembersSchema,
  pdfUploadSchema,
} from "../../validators/userValidator.ts";
import { validatePDFStructure } from "utils.ts/validatePDFStructure.ts";
import { userControllerLogger as logger } from "utils.ts/logger.ts";
import { extractNamesFromPDF } from "utils.ts/pdfNameExtractor.ts";

export class UserController {
  constructor(private userService: IUserService) {}

  async createUser(req: Request, res: Response) {
    const { wardData, userData } = createWardAndUserSchema.parse(req.body);
    logger.info(
      { user: userData.name, email: userData.email },
      "Tentativa de criação de usuário"
    );

    await this.userService.create(wardData, userData);
    logger.info(
      { user: userData.name, email: userData.email },
      "Usuário criado com sucesso"
    );

    res.status(201).json({ message: "Usuário criado com sucesso" });
  }

  async upload(req: Request, res: Response) {
    const validation = pdfUploadSchema.safeParse({ file: req.file });
    logger.info("Iniciando processamento do arquivo PDF");

    if (!validation.success) {
      logger.error("Arquivo não anexado ou com extensão inválida");
      return res.status(400).json({ error: validation.error.errors });
    }

    const { ward_id: wardId } = req.user;
    const pdfFile = req.file?.buffer!;

    const isValid = await validatePDFStructure(pdfFile);
    logger.info("Formato do PDF validado");

    if (!isValid) {
      logger.error("Formato do PDF inválido");
      return res
        .status(400)
        .send(
          'O arquivo PDF deve conter apenas uma coluna chamada "Nome" em cada página.'
        );
    }

    logger.info("Enviando PDF para extração de nomes");
    const names = await extractNamesFromPDF(wardId, pdfFile);
    logger.info("Nomes extraídos do PDF com sucesso");

    await this.userService.createChurchMembers(wardId, names);
    logger.info("Lista de nomes inserida no banco com sucesso");

    return res.status(200).json("Membros da igreja inseridos com sucesso.");
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    console.log("users", users);

    res.status(200).json(users);
  }

  async createExternalChurchMembers(req: Request, res: Response) {
    const { name, ward_id } = externalChurchMembersSchema.parse(req.body);
    logger.info({ wardId: ward_id }, "Iniciando criação de membro externo");

    const newExternalChurchMember =
      await this.userService.createExternalChurchMembers({ name, ward_id });
    logger.info({ wardId: ward_id }, "Finalizando criação de membro externo");

    res.status(201).json(newExternalChurchMember);
  }
}
