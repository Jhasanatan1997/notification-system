import { Router } from "express";
import { listUserPreferences, upsertUserPreference } from "../controllers/preferenceController.js";
import { requireAdmin } from "../middlewares/auth.js";

export const preferenceRoutes = Router();

preferenceRoutes.use(requireAdmin);
preferenceRoutes.get("/users/:userId/preferences", listUserPreferences);
preferenceRoutes.put("/users/:userId/preferences", upsertUserPreference);

