import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AdminModel } from "../models/Admin.js";

export async function ensureSeedAdmin() {
  if (!env.adminEmail || !env.adminPassword) {
    logger.warn("ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin seed");
    return;
  }

  const existing = await AdminModel.findOne({ email: env.adminEmail });
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await AdminModel.create({ email: env.adminEmail, passwordHash });
  logger.info({ email: env.adminEmail }, "Seeded admin user");
}

