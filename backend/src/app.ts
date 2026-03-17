import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { templateRoutes } from "./routes/templateRoutes.js";
import { preferenceRoutes } from "./routes/preferenceRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { aiRoutes } from "./routes/aiRoutes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("combined"));

  app.get("/healthz", (_req, res) => res.json({ ok: true, env: env.nodeEnv }));

  // Global safety net (admin login isn't tied to userId)
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use("/auth", authRoutes);
  app.use("/notifications", notificationRoutes);
  app.use("/templates", templateRoutes);
  app.use("/", preferenceRoutes);
  app.use("/admin", adminRoutes);
  app.use("/ai", aiRoutes);

  app.use(errorHandler);

  return app;
}

