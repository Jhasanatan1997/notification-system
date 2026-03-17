import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthError } from "../utils/errors.js";

export type AdminJwtPayload = { sub: string; email: string; role: "admin" };

declare global {
  // eslint-disable-next-line no-var
  var __adminJwt: AdminJwtPayload | undefined;
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return next(new AuthError());
  const token = hdr.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as AdminJwtPayload;
    if (payload.role !== "admin") return next(new AuthError());
    (req as any).admin = payload;
    return next();
  } catch {
    return next(new AuthError());
  }
}

