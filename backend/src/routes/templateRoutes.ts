import { Router } from "express";
import { deleteTemplate, listTemplates, upsertTemplate } from "../controllers/templateController.js";
import { requireAdmin } from "../middlewares/auth.js";

export const templateRoutes = Router();

templateRoutes.use(requireAdmin);
templateRoutes.get("/", listTemplates);
templateRoutes.put("/", upsertTemplate);
templateRoutes.delete("/:type/:channel", deleteTemplate);

