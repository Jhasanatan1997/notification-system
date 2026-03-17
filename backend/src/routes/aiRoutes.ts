import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.js";
import {
  postBestSendTime,
  postDetectSpam,
  postGenerateMessage,
  postPredictEngagement,
} from "../controllers/aiController.js";

export const aiRoutes = Router();
aiRoutes.use(requireAdmin);
aiRoutes.post("/generate-message", postGenerateMessage);
aiRoutes.post("/best-send-time", postBestSendTime);
aiRoutes.post("/detect-spam", postDetectSpam);
aiRoutes.post("/predict-engagement", postPredictEngagement);

