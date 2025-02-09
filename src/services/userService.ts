import { verifyPassword } from "utils.ts/verifyPassword.ts";
import knex from "../database/index.ts";
import { IChurchMembers, UserDTO, WardDTO } from "../types/IUserDTO.ts";
import { IUserService } from "../types/IUserService.ts";
import { hash } from "bcrypt";
import pdfParse from "pdf-parse";
import { ChurchMembers } from "@database/models/churchMembers.ts";

export class UserService implements IUserService {
  async create(
    wardData: Omit<WardDTO, "id" | "createdAt" | "updatedAt">,
    userData: Omit<UserDTO, "id" | "ward_id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    const trx = await knex.transaction();

    try {
      const existingUser = await trx("users")
        .where({ email: userData.email })
        .first();
      if (existingUser) throw new Error("O email informado já está em uso");

      const [wardIdObj] = await trx("wards").insert(wardData).returning("id");

      const passwordHash = await hash(userData.password, 8);

      const user = {
        ...userData,
        ward_id: wardIdObj.id,
      };

      await trx("users").insert({
        ...user,
        password: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      if (error instanceof Error)
        throw new Error("Erro ao criar ward e usuário: " + error.message);
      else console.log("🐛 Erro desconhecido:", error);
    }
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const user = await knex("users").select("*");
    return user;
  }

  async extractNamesFromPDF(
    wardId: string,
    buffer: Buffer
  ): Promise<IChurchMembers[]> {
    const data = await pdfParse(buffer);
    const text: string = data.text;

    const nameRegex =
      /([A-Z][a-zà-úÀ-Ú]+(?: [A-Z][a-zà-úÀ-Ú]+)*, [A-Z][a-zà-úÀ-Ú]+(?: [A-Z][a-zà-úÀ-Ú]+)*)/g;

    const matches = Array.from(text.matchAll(nameRegex));
    const names = matches.map((match: RegExpMatchArray) => ({
      name: match[0],
      ward_id: wardId,
    }));

    return names;
  }
}
