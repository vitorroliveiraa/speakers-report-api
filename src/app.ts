import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import dotenv from "dotenv";

import path from "path";
import { router } from "./api/routes/index.ts";
import pinoHttp from "pino-http";
import logger from "utils.ts/logger.ts";
import { errorHandler } from "middlewares/errorMiddleware.ts";
import { RateLimitError } from "utils.ts/appError.ts";
import { requestContextMiddleware } from "middlewares/requestContext.ts";
import db from "@database/index.ts";
import { Request, Response } from "express";

const dotenvFilepath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: dotenvFilepath });

const corsOptions = {
  origin: [process.env.FRONTEND_URL!],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  handler: (req, res) => {
    const error = new RateLimitError(15 * 60);
    res.set("Retry-After", error.retryAfter.toString());
    throw error;
  },
});

const app = express();

app.use(requestContextMiddleware);
app.use(cors(corsOptions));
app.use(limiter);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(router);
app.use(
  pinoHttp({
    logger,
    customSuccessMessage: (req, res) =>
      `Request ${req.method} ${req.url} - ${res.statusCode}`,
  })
);

app.get("/health", async (req: Request, res: Response) => {
  try {
    await db.raw("SELECT 1+1");
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});

app.use(errorHandler);

export default app;
