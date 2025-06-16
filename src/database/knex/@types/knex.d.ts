import {
  Wards,
  ChurchMembers,
  Speakers,
  Users,
  PasswordResetTokens,
  ExternalChurchMembers,
} from "../../models";

declare module "knex/types/tables" {
  interface Tables {
    wards: Wards;
    church_members: ChurchMembers;
    speakers: Speakers;
    users: Users;
    password_reset_tokens: PasswordResetTokens;
    external_church_members: ExternalChurchMembers;
  }
}
