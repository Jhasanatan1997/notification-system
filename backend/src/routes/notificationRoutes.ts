import { Router } from "express";
import {
  getNotificationLogs,
  getNotifications,
  postBatch,
  postNotification,
} from "../controllers/notificationController.js";
import { requireAdmin } from "../middlewares/auth.js";

export const notificationRoutes = Router();

notificationRoutes.post("/", postNotification);
notificationRoutes.post("/batch", postBatch);

// Admin-only reads
notificationRoutes.get("/", requireAdmin, getNotifications);
notificationRoutes.get("/:notificationId/logs", requireAdmin, getNotificationLogs);

