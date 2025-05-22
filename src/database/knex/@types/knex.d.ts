import {
  Wards,
  ChurchMembers,
  Speakers,
  Users,
  PasswordResetTokens,
} from "../../models";

declare module "knex/types/tables" {
  interface Tables {
    wards: Wards;
    church_members: ChurchMembers;
    speakers: Speakers;
    users: Users;
    password_reset_tokens: PasswordResetTokens;
  }
}
