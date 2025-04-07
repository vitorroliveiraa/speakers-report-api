import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { requestContext } from "lib/requestContext.ts";

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const store = { requestId: uuidv4() };
  requestContext.run(store, () => {
    next();
  });
}
