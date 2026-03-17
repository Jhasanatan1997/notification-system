import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ValidationError } from "../utils/errors.js";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ValidationError(parsed.error.issues.map((i) => i.message).join("; ")));
    }
    req.body = parsed.data;
    return next();
  };
}

