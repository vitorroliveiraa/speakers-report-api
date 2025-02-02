export interface PasswordResetTokens {
  id: number;
  user_id: string;
  token: string;
  expires_at: number;
  created_at: Date;
  updated_at: Date;
}
