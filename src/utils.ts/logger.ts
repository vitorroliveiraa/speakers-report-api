import pino from "pino";
import { colorizerFactory } from "pino-pretty";

const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true, // Torna os logs mais legíveis no terminal
            translateTime: "dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname", // Remove informações desnecessárias
          },
        }
      : undefined,
});

export const authControllerLogger = logger.child({ module: "AuthController" });
export const authServiceLogger = logger.child({ module: "AuthService" });

export const userControllerLogger = logger.child({ module: "UserController" });
export const userServiceLogger = logger.child({ module: "UserService" });

export const utilsLogger = logger.child({ module: "Utils" });

export default logger;
