import { userServiceLogger as logger } from "utils.ts/logger.ts";
import knex from "../database/index.ts";
import { IChurchMembers, UserDTO, WardDTO } from "../types/IUserDTO.ts";
import { IUserService } from "../types/IUserService.ts";
import { hash } from "bcrypt";

export class UserService implements IUserService {
  async create(
    wardData: Omit<WardDTO, "id" | "createdAt" | "updatedAt">,
    userData: Omit<UserDTO, "id" | "ward_id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    const trx = await knex.transaction();
    logger.info(
      { user: userData.name, email: userData.email },
      "Processando criação de usuário"
    );
    try {
      const existingUser = await trx("users")
        .where({ email: userData.email })
        .first();

      if (existingUser) {
        logger.warn(
          { user: userData.name, email: userData.email },
          "Já exite um usuário com esse e-mail"
        );
        throw new Error("O email informado já está em uso");
      }

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
      logger.info(
        { user: user.name, ward_id: user.ward_id },
        "Usuário criado com sucesso"
      );
    } catch (error) {
      await trx.rollback();
      logger.error(
        { user: userData.name, email: userData.email, error },
        "Erro ao criar usuário"
      );
      throw error;
    }
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const user = await knex("users").select("*");
    return user;
  }

  async createChurchMembers(wardId: number, members: IChurchMembers[]) {
    logger.info(
      { wardId, totalNomes: members.length },
      "Persistindo nomes no banco"
    );

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

      if (membersToAdd.length > 0) {
        await knex("church_members").insert(membersToAdd);
      }

      if (membersToRemove.length > 0) {
        await knex("church_members").whereIn("id", membersToRemove).del();
      }
    } catch (error) {
      logger.error({ error, wardId }, "Erro ao persistir membros");
      throw error;
    }

    logger.info("Persistência finalizada com sucesso");
  }
}
