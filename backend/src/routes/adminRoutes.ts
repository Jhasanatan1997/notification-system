import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.js";
import { getOverview, retryNotification, searchLogs } from "../controllers/adminController.js";

export const adminRoutes = Router();

adminRoutes.use(requireAdmin);
adminRoutes.get("/overview", getOverview);
adminRoutes.get("/logs", searchLogs);
adminRoutes.post("/notifications/:notificationId/retry", retryNotification);

