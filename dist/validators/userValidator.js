"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/validators/userValidator.ts
var userValidator_exports = {};
__export(userValidator_exports, {
  changePasswordSchema: () => changePasswordSchema,
  createWardAndUserSchema: () => createWardAndUserSchema,
  forgotPasswordSchema: () => forgotPasswordSchema,
  pdfUploadSchema: () => pdfUploadSchema,
  requestUserSchema: () => requestUserSchema,
  resetPasswordSchema: () => resetPasswordSchema
});
module.exports = __toCommonJS(userValidator_exports);
var import_zod = require("zod");
var userSchema = import_zod.z.object({
  name: import_zod.z.string().min(1, "O nome \xE9 obrigat\xF3rio"),
  role: import_zod.z.string().min(1, "O papel \xE9 obrigat\xF3rio"),
  email: import_zod.z.string().email("Email inv\xE1lido"),
  password: import_zod.z.string().min(6, "A senha deve ter pelo menos 6 caracteres").refine((password) => /[a-zA-Z]/.test(password), {
    message: "A senha deve conter pelo menos uma letra."
  }),
  member_number: import_zod.z.string().min(6)
});
var wardSchema = import_zod.z.object({
  name: import_zod.z.string({
    invalid_type_error: "O tipo do campo n\xE3o \xE9 v\xE1lido",
    required_error: "O nome da Ala \xE9 obrigat\xF3rio"
  }),
  city: import_zod.z.string({
    invalid_type_error: "O tipo do campo n\xE3o \xE9 v\xE1lido",
    required_error: "O nome da cidade \xE9 obrigat\xF3rio"
  }),
  state: import_zod.z.string({
    invalid_type_error: "O tipo do campo n\xE3o \xE9 v\xE1lido",
    required_error: "O nome do estado \xE9 obrigat\xF3rio"
  }),
  country: import_zod.z.string({
    invalid_type_error: "O tipo do campo n\xE3o \xE9 v\xE1lido",
    required_error: "O nome do pa\xEDs \xE9 obrigat\xF3rio"
  })
});
var createWardAndUserSchema = import_zod.z.object({
  wardData: wardSchema,
  userData: userSchema
});
var changePasswordSchema = import_zod.z.object({
  oldPassword: import_zod.z.string({
    required_error: "A senha \xE9 obrigat\xF3ria",
    invalid_type_error: "A senha deve ser uma string v\xE1lida"
  }),
  newPassword: import_zod.z.string({
    required_error: "A senha \xE9 obrigat\xF3ria",
    invalid_type_error: "A senha deve ser uma string v\xE1lida"
  }).min(6, "\xC9 necess\xE1rio no m\xEDnimo 6 caracteres.").refine((password) => /[a-zA-Z]/.test(password), {
    message: "A senha deve conter pelo menos uma letra."
  })
});
var requestUserSchema = import_zod.z.object({
  id: import_zod.z.number({
    required_error: "A senha \xE9 obrigat\xF3ria",
    invalid_type_error: "A senha deve ser um number v\xE1lido"
  }).min(1, "User ID is required")
});
var forgotPasswordSchema = import_zod.z.object({
  email: import_zod.z.string().email("Endere\xE7o de email inv\xE1lido")
});
var resetPasswordSchema = import_zod.z.object({
  token: import_zod.z.string({
    required_error: "O token \xE9 obrigat\xF3rio",
    invalid_type_error: "O token deve ser uma string v\xE1lida"
  }).min(1, { message: "O token \xE9 obrigat\xF3rio" }),
  newPassword: import_zod.z.string().min(6, "A senha deve ter pelo menos 6 caracteres").regex(
    /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
    "A senha deve conter pelo menos uma letra e um n\xFAmero"
  )
});
var pdfUploadSchema = import_zod.z.object({
  file: import_zod.z.custom((file) => !!file, "O arquivo \xE9 obrigat\xF3rio.").refine(
    (file) => file.mimetype === "application/pdf",
    "O arquivo deve ser um PDF."
  )
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  changePasswordSchema,
  createWardAndUserSchema,
  forgotPasswordSchema,
  pdfUploadSchema,
  requestUserSchema,
  resetPasswordSchema
});
