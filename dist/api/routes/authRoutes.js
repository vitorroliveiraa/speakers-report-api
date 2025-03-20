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

// src/api/routes/authRoutes.ts
var authRoutes_exports = {};
__export(authRoutes_exports, {
  authRoutes: () => authRoutes
});
module.exports = __toCommonJS(authRoutes_exports);

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

// src/api/controllers/authController.ts
var import_zod2 = __toESM(require("zod"));
var AuthController = class {
  constructor(authService) {
    this.authService = authService;
  }
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await this.authService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      console.error("\u{1F41B}", error);
      res.status(500).json({ message: "Erro ao fazer login do usu\xE1rio" });
    }
  }
  async changePassword(req, res) {
    const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
    const { id: userId } = requestUserSchema.parse(req.user);
    try {
      await this.authService.changePassword({
        oldPassword,
        newPassword,
        userId
      });
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof import_zod2.default.ZodError) {
        return res.status(400).json({
          error: "Erro de valida\xE7\xE3o",
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message
          }))
        });
      }
      console.error("\u{1F41B} UserController - changePassword: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async forgotPassword(req, res) {
    const { memberNumber } = req.body;
    try {
      await this.authService.forgotPassword(memberNumber);
      res.status(200).json({ message: "Verifique seu e-mail para redefinir sua senha." });
    } catch (error) {
      console.error("\u{1F41B}", error);
      res.status(500).json({ message: "" });
    }
  }
  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      await this.authService.resetPassword(token, newPassword);
      res.status(200).json({ message: "Senha redefinida com sucesso." }).send();
    } catch (error) {
      console.error("\u{1F41B}", error);
      res.status(500).json({ message: "" });
    }
  }
};

// src/api/routes/authRoutes.ts
var import_express = require("express");

// src/utils.ts/jwt.ts
var import_jsonwebtoken = require("jsonwebtoken");
function generateToken(payload) {
  return (0, import_jsonwebtoken.sign)(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
}
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

// src/utils.ts/verifyPassword.ts
var import_bcrypt = require("bcrypt");
async function verifyPassword(password, hash2) {
  return await (0, import_bcrypt.compare)(password, hash2);
}

// src/services/authService.ts
var import_bcrypt2 = require("bcrypt");
var import_crypto = __toESM(require("crypto"));
var import_nodemailer = __toESM(require("nodemailer"));
var import_config3 = require("dotenv/config");
var AuthService = class {
  async login(data) {
    const user = await database_default("users").where("email", data.email).first();
    if (!user) throw new Error("O email informado n\xE3o existe");
    const samePasswords = await verifyPassword(data.password, user.password);
    if (!samePasswords) throw new Error("Usu\xE1rio ou senha inv\xE1lido");
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      ward_id: user.ward_id,
      nrm: user.member_number,
      role: user.role
    });
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward_id: user.ward_id,
        member_number: user.member_number
      },
      expiresIn: process.env.JWT_EXPIRE_IN
    };
  }
  async changePassword({
    oldPassword,
    newPassword,
    userId
  }) {
    const user = await database_default("users").where("id", userId).first();
    if (!user || !await verifyPassword(user.password, oldPassword)) {
      throw new Error("Invalid current password");
    }
    const hashedNewPassword = await (0, import_bcrypt2.hash)(newPassword, 8);
    await database_default("users").where("id", userId).update({ password: hashedNewPassword });
  }
  async forgotPassword(memberNumber) {
    const user = await database_default.select("*").from("users").where("member_number", "=", memberNumber).first();
    if (!user?.id) {
      throw new Error("Usu\xE1rio n\xE3o encontrado.");
    }
    const token = import_crypto.default.randomBytes(32).toString("hex");
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await database_default("password_reset_tokens").insert({
      user_id: user?.id,
      token,
      expires_at: expiresAt
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const transporter = import_nodemailer.default.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: `"Suporte" <${process.env.EMAIL_USER}>`,
      to: user?.email,
      subject: "Redefini\xE7\xE3o de senha",
      html: `
        <p>Ol\xE1, ${user?.name}!</p>
        <p>Voc\xEA solicitou a redefini\xE7\xE3o de senha. Clique no link abaixo para continuar:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se voc\xEA n\xE3o solicitou essa altera\xE7\xE3o, ignore este e-mail.</p>
      `
    });
  }
  async resetPassword(token, newPassword) {
    const resetToken = await database_default("password_reset_tokens").where("token", token).first();
    if (!resetToken) {
      throw new Error("Token inv\xE1lido.");
    }
    const now = /* @__PURE__ */ new Date();
    if (new Date(resetToken.expires_at) < now) {
      throw new Error("Token expirado.");
    }
    const hashedPassword = await (0, import_bcrypt2.hash)(newPassword, 8);
    await database_default("users").where("id", resetToken.user_id).update({ password: hashedPassword });
    await database_default("password_reset_tokens").where("user_id", resetToken.user_id).delete();
  }
};

// src/api/routes/authRoutes.ts
var authRoutes = (0, import_express.Router)();
var authController = new AuthController(new AuthService());
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.put(
  "/change-password",
  authMiddleware,
  authController.changePassword.bind(authController)
);
authRoutes.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
authRoutes.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authRoutes
});
