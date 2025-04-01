import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  role: z.string().min(1, "O papel é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .refine((password) => /[a-zA-Z]/.test(password), {
      message: "A senha deve conter pelo menos uma letra.",
    }),
  member_number: z
    .string()
    .min(6, "O número de membro deve ter pelo menos 6 caracteres."),
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
  oldPassword: z
    .string({
      required_error: "A senha é obrigatória",
      invalid_type_error: "A senha deve ser uma string válida",
    })
    .refine((password) => /[a-zA-Z]/.test(password), {
      message: "A senha deve conter pelo menos uma letra.",
    }),
  newPassword: z
    .string({
      required_error: "A senha é obrigatória",
      invalid_type_error: "A senha deve ser uma string válida",
    })
    .min(6, "É necessário no mínimo 6 caracteres.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "A senha deve conter pelo menos uma letra e um número"
    ),
});

export const requestUserSchema = z.object({
  id: z
    .number({
      required_error: "A senha é obrigatória",
      invalid_type_error: "A senha deve ser um number válido",
    })
    .min(1, "O ID do usuário é obrigatório."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "O email é obrigatório.",
      invalid_type_error: "O email deve ser uma string válida.",
    })
    .email("Endereço de email inválido."),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({
      required_error: "O token é obrigatório",
      invalid_type_error: "O token deve ser uma string válida",
    })
    .length(64, { message: "O token deve ter exatamente 64 caracteres" })
    .regex(/^[0-9a-fA-F]+$/, {
      message: "O token deve conter apenas caracteres hexadecimais",
    }),
  newPassword: z
    .string({
      required_error: "A nova senha é obrigatório.",
      invalid_type_error: "A nova senha deve ser uma string válida.",
    })
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "A senha deve conter pelo menos uma letra e um número"
    ),
});

export const pdfUploadSchema = z.object({
  file: z
    .custom<Express.Multer.File>((file) => !!file, "O arquivo é obrigatório.")
    .refine(
      (file) => file.mimetype === "application/pdf",
      "O arquivo deve ser um PDF."
    ),
});
