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

// src/api/routes/userRoutes.ts
var userRoutes_exports = {};
__export(userRoutes_exports, {
  usersRoutes: () => usersRoutes
});
module.exports = __toCommonJS(userRoutes_exports);
var import_express = require("express");

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

// src/database/index.ts
var import_knex = __toESM(require("knex"));

// src/database/knexfile.ts
var import_config = require("dotenv/config");
var import_path = __toESM(require("path"));
var knexConfig = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "admin",
      password: process.env.DB_PWD || "admin",
      database: process.env.DB_NAME || "speakers-report"
    },
    pool: {
      min: 2,
      // Mínimo de conexões no pool
      max: 10,
      // Máximo de conexões no pool
      acquireTimeoutMillis: 3e4,
      // Tempo limite para adquirir uma conexão (em milissegundos)
      idleTimeoutMillis: 6e4,
      // Tempo limite de inatividade para uma conexão (em milissegundos)
      reapIntervalMillis: 1e3
      // Intervalo para tentativas de reconexão (em milissegundos)
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
      directory: import_path.default.join(process.cwd(), "migrations")
    },
    seeds: {
      directory: import_path.default.join(process.cwd(), "seeds"),
      extension: "ts",
      timestampFilenamePrefix: true
    }
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.CONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
      directory: import_path.default.join(process.cwd(), "migrations")
    },
    seeds: {
      directory: import_path.default.join(process.cwd(), "seeds"),
      extension: "ts",
      timestampFilenamePrefix: true
    }
  }
};
var knexfile_default = knexConfig;

// src/database/index.ts
var import_config2 = require("dotenv/config");
var environment = process.env.NODE_ENV || "development";
var knexConfig2 = knexfile_default[environment];
var db = (0, import_knex.default)(knexConfig2);
var database_default = db;

// src/services/userService.ts
var import_bcrypt = require("bcrypt");
var import_pdf_parse2 = __toESM(require("pdf-parse"));
var UserService = class {
  async create(wardData, userData) {
    const trx = await database_default.transaction();
    try {
      const existingUser = await trx("users").where({ email: userData.email }).first();
      if (existingUser) throw new Error("O email informado j\xE1 est\xE1 em uso");
      const [wardIdObj] = await trx("wards").insert(wardData).returning("id");
      const passwordHash = await (0, import_bcrypt.hash)(userData.password, 8);
      const user = {
        ...userData,
        ward_id: wardIdObj.id
      };
      await trx("users").insert({
        ...user,
        password: passwordHash,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      });
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      if (error instanceof Error)
        throw new Error("Erro ao criar ward e usu\xE1rio: " + error.message);
      else console.log("\u{1F41B} Erro desconhecido:", error);
    }
  }
  async getAllUsers() {
    const user = await database_default("users").select("*");
    return user;
  }
  async extractNamesFromPDF(wardId, buffer) {
    const data = await (0, import_pdf_parse2.default)(buffer);
    const text = data.text;
    const lines = text.split("\n");
    const names = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.includes("Somente para Uso da Igreja")) {
        continue;
      }
      if (trimmedLine.includes(",") && trimmedLine.length > 3) {
        names.push(trimmedLine);
      }
    }
    if (names.length === 0) {
      throw new Error("Nenhum nome encontrado no PDF.");
    }
    const members = names.map((name) => ({
      name: name.trim(),
      ward_id: wardId
      // Gera um número aleatório para ward_id
    }));
    return members;
  }
  async createChurchMembers(wardId, members) {
    try {
      const existingMembers = await database_default("church_members").where({ ward_id: wardId }).select("id", "name");
      const existingNamesSet = new Set(
        existingMembers.map((member) => member.name)
      );
      const newNamesSet = new Set(members.map((member) => member.name));
      const membersToAdd = members.filter(
        (member) => !existingNamesSet.has(member.name)
      );
      const membersToRemove = existingMembers.filter((member) => !newNamesSet.has(member.name)).map((member) => member.id);
      if (membersToAdd.length > 0) {
        await database_default("church_members").insert(membersToAdd);
      }
      if (membersToRemove.length > 0) {
        await database_default("church_members").whereIn("id", membersToRemove).del();
      }
    } catch (error) {
      console.error("\u274C Erro ao inserir usu\xE1rios:", error);
    }
  }
};

// src/utils.ts/jwt.ts
var import_jsonwebtoken = require("jsonwebtoken");
var TokenErrorMessages = {
  EXPIRED: "Token expired",
  INVALID_SIGNATURE: "Invalid token signature",
  UNKNOWN: "Unknown token error"
};
var TokenVerificationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenVerificationError";
  }
};
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }
  try {
    return (0, import_jsonwebtoken.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof import_jsonwebtoken.TokenExpiredError) {
      throw new TokenVerificationError(TokenErrorMessages.EXPIRED);
    } else if (error instanceof import_jsonwebtoken.JsonWebTokenError) {
      throw new TokenVerificationError(TokenErrorMessages.INVALID_SIGNATURE);
    } else {
      throw new TokenVerificationError(TokenErrorMessages.UNKNOWN);
    }
  }
}

// src/middlewares/auth.ts
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token not provided" });
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenVerificationError) {
      return res.status(401).json({ error: error.message });
    }
    console.error("Unexpected authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// src/api/routes/userRoutes.ts
var import_multer = __toESM(require("multer"));
var upload = (0, import_multer.default)({ storage: import_multer.default.memoryStorage() });
var usersRoutes = (0, import_express.Router)();
var userController = new UserController(new UserService());
usersRoutes.post("/", userController.createUser.bind(userController));
usersRoutes.get(
  "/",
  authMiddleware,
  userController.getAllUsers.bind(userController)
);
usersRoutes.post(
  "/church-members/upload",
  authMiddleware,
  upload.single("pdf"),
  userController.upload.bind(userController)
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersRoutes
});
//!DEPOIS QUE EXTRAIR OS NOMES, PRECISA SALVAR
//!AVALIAR SE É BOM FAZER ESSA PARTE DENTRO DE UMA TRANSACTION
//!QUANDO NÃO INSERIR, LANÇAR ERRO
