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
    wardId: number,
    buffer: Buffer
  ): Promise<IChurchMembers[]> {
    const data = await pdfParse(buffer);
    const text: string = data.text;

    // Divide o texto em linhas
    const lines = text.split("\n");

    // Filtra e limpa as linhas para extrair os nomes
    const names: string[] = [];
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Ignora linhas que contêm o texto de rodapé
      if (trimmedLine.includes("Somente para Uso da Igreja")) {
        continue; // Pula para a próxima linha
      }

      // Verifica se a linha parece ser um nome (contém uma vírgula e tem mais de 3 caracteres)
      if (trimmedLine.includes(",") && trimmedLine.length > 3) {
        names.push(trimmedLine);
      }
    }

    if (names.length === 0) {
      throw new Error("Nenhum nome encontrado no PDF.");
    }

    // Gera a lista de membros com um ward_id aleatório
    const members: IChurchMembers[] = names.map((name) => ({
      name: name.trim(),
      ward_id: wardId, // Gera um número aleatório para ward_id
    }));

    return members;
  }

  async createChurchMembers(wardId: number, members: IChurchMembers[]) {
    try {
      const existingMembers = await knex("church_members")
        .where({ ward_id: wardId })
        .select("id", "name");

      const existingNamesSet = new Set(
        existingMembers.map((member) => member.name)
      );

      const newNamesSet = new Set(members.map((member) => member.name));

      const membersToAdd = members.filter(
        (member) => !existingNamesSet.has(member.name)
      );

      const membersToRemove = existingMembers
        .filter((member) => !newNamesSet.has(member.name))
        .map((member) => member.id);

      //!QUANDO NÃO INSERIR, LANÇAR ERRO
      if (membersToAdd.length > 0) {
        await knex("church_members").insert(membersToAdd);
      }

      if (membersToRemove.length > 0) {
        await knex("church_members").whereIn("id", membersToRemove).del();
      }
    } catch (error) {
      console.error("❌ Erro ao inserir usuários:", error);
    }
  }
}
