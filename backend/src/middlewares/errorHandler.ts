import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const e = err instanceof AppError ? err : new AppError("Internal server error", 500, "INTERNAL_ERROR");
  res.status(e.statusCode).json({ error: { code: e.code, message: e.message } });
}

