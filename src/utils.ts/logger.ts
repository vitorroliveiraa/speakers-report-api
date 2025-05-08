import { getRequestId } from "lib/requestContext.ts";
import pino from "pino";

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
  mixin() {
    const requestId = getRequestId();
    return requestId ? { requestId } : {};
  },
});

export const authControllerLogger = logger.child({ module: "AuthController" });
export const authServiceLogger = logger.child({ module: "AuthService" });

export const userControllerLogger = logger.child({ module: "UserController" });
export const userServiceLogger = logger.child({ module: "UserService" });

export const speakersControllerLogger = logger.child({
  module: "SpeakersController",
});
export const speakersServiceLogger = logger.child({
  module: "SpeakersService",
});

export const wardsControllerLogger = logger.child({
  module: "WardsController",
});
export const wardsServiceLogger = logger.child({
  module: "WardsService",
});

export const utilsLogger = logger.child({ module: "Utils" });

export default logger;
