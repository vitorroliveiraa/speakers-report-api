import { Users, Wards } from "../../models";

declare module "knex/types/tables" {
  interface Tables {
    users: Users;
    wards: Wards;
    password_reset_tokens: PasswordResetTokens;
  }
}
