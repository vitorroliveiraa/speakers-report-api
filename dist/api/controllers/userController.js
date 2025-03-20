"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/controllers/userController.ts
var userController_exports = {};
__export(userController_exports, {
  UserController: () => UserController
});
module.exports = __toCommonJS(userController_exports);

// src/validators/userValidator.ts
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

// src/api/controllers/userController.ts
var import_zod2 = require("zod");

// src/utils.ts/validatePDFStructure.ts
var import_pdf_parse = __toESM(require("pdf-parse"));
async function validatePDFStructure(buffer) {
  const data = await (0, import_pdf_parse.default)(buffer);
  const pages = data.text.split(/\f/g);
  for (const page of pages) {
    const match = page.match(/\bNome\b/g);
    if (data.numpages !== match?.length) {
      return false;
    }
  }
  return true;
}

// src/api/controllers/userController.ts
var UserController = class {
  constructor(userService) {
    this.userService = userService;
  }
  async createUser(req, res) {
    const { wardData, userData } = createWardAndUserSchema.parse(req.body);
    try {
      await this.userService.create(wardData, userData);
      res.status(201).json({ message: "Usu\xE1rio criado com sucesso" });
    } catch (error) {
      if (error instanceof import_zod2.z.ZodError) {
        return res.status(400).json({
          error: "Erro de valida\xE7\xE3o",
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message
          }))
        });
      }
      console.error("\u{1F41B}", error);
      res.status(500).json({ message: "Erro ao criar usu\xE1rio" });
    }
  }
  async upload(req, res) {
    const validation = pdfUploadSchema.safeParse({ file: req.file });
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }
    const { ward_id: wardId } = req.user;
    const pdfFile = req.file?.buffer;
    try {
      const isValid = await validatePDFStructure(pdfFile);
      if (!isValid) {
        return res.status(400).send(
          'O arquivo PDF deve conter apenas uma coluna chamada "Nome" em cada p\xE1gina.'
        );
      }
      const names = await this.userService.extractNamesFromPDF(wardId, pdfFile);
      await this.userService.createChurchMembers(wardId, names);
      return res.status(200).json("Membros da igreja inseridos com sucesso.");
    } catch (error) {
      console.error("\u{1F41B}", error);
      res.status(500).json({ message: "Erro ao extrair nomes dos membros da igreja." });
    }
  }
  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("\u{1F41B}", error);
      res.status(500).json({ message: "Erro ao buscar usu\xE1rio" });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserController
});
//!DEPOIS QUE EXTRAIR OS NOMES, PRECISA SALVAR
//!AVALIAR SE É BOM FAZER ESSA PARTE DENTRO DE UMA TRANSACTION
