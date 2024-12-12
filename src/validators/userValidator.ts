import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  role: z.string().min(1, "O papel é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const wardSchema = z.object({
  name: z.string({
    invalid_type_error: "O tipo do campo não é válido",
    required_error: "O nome da Ala é obrigatório",
  }),
  city: z.string({
    invalid_type_error: "O tipo do campo não é válido",
    required_error: "O nome da cidade é obrigatório",
  }),
  state: z.string({
    invalid_type_error: "O tipo do campo não é válido",
    required_error: "O nome do estado é obrigatório",
  }),
  country: z.string({
    invalid_type_error: "O tipo do campo não é válido",
    required_error: "O nome do país é obrigatório",
  }),
});

export const createWardAndUserSchema = z.object({
  wardData: wardSchema,
  userData: userSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string({
    required_error: "A senha é obrigatória",
    invalid_type_error: "A senha deve ser uma string válida",
  }),
  newPassword: z.string({
    required_error: "A senha é obrigatória",
    invalid_type_error: "A senha deve ser uma string válida",
  }),
});

export const requestUserSchema = z.object({
  id: z
    .number({
      required_error: "A senha é obrigatória",
      invalid_type_error: "A senha deve ser um number válido",
    })
    .min(1, "User ID is required"),
});
