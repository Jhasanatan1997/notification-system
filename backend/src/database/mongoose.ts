import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export async function connectMongo(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  logger.info({ mongoUri: env.mongoUri }, "Mongo connected");
}

