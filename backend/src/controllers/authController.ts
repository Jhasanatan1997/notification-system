import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { AdminModel } from "../models/Admin.js";
import { AuthError, ValidationError } from "../utils/errors.js";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid login payload");

    const admin = await AdminModel.findOne({ email: parsed.data.email });
    if (!admin) throw new AuthError("Invalid credentials");
    const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!ok) throw new AuthError("Invalid credentials");

    const signOpts: SignOptions = { expiresIn: env.jwtExpiresIn as any };
    const token = jwt.sign(
      { sub: admin._id.toString(), email: admin.email, role: "admin" },
      env.jwtSecret,
      signOpts
    );

    res.json({ token });
  } catch (e) {
    next(e);
  }
}

