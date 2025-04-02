import { Request, Response, NextFunction } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
} from "utils.ts/appError.ts";
import logger from "utils.ts/logger.ts";
import { z } from "zod";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    error instanceof Error &&
    error.message === "Acesso não permitido por CORS"
  ) {
    logger.warn({ ip: req.ip }, "Tentativa de acesso bloqueada por CORS");
    return res.status(403).json({
      error: "Forbidden",
      message: "Acesso não permitido por CORS",
    });
  }

  if (error instanceof z.ZodError) {
    logger.warn({ path: req.path, errors: error.errors }, "Erro de validação");
    const badRequestError = new BadRequestError("Erro de validação dos dados");
    return res.status(badRequestError.statusCode).json({
      ...badRequestError.toJSON(),
      details: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  if (error instanceof AppError) {
    logger.error(
      {
        error: error.stack,
        path: req.path,
        statusCode: error.statusCode,
      },
      "Erro na aplicação"
    );
    return res.status(error.statusCode).json(error.toJSON());
  }

  const errorMessage =
    error instanceof Error ? error.message : "Erro desconhecido";
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(
    {
      error: errorStack,
      path: req.path,
      method: req.method,
      body: req.body,
    },
    "Erro não tratado na aplicação"
  );

  const internalError = new InternalServerError(
    "Ocorreu um erro inesperado",
    error
  );
  res.status(internalError.statusCode).json(internalError.toJSON());
}
