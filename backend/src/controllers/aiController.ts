import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../utils/errors.js";
import { detectSpam, generateMessage, predictBestSendTime, predictEngagement } from "../ai/aiService.js";

const GenerateSchema = z.object({
  input: z.string().min(1),
  channel: z.enum(["email", "sms", "push", "inapp"]).default("push"),
});

export async function postGenerateMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = GenerateSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid payload");
    res.json(await generateMessage(parsed.data));
  } catch (e) {
    next(e);
  }
}

const BestTimeSchema = z.object({
  userLocalHourHistogram: z.array(z.number().min(0)).length(24),
});

export async function postBestSendTime(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = BestTimeSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid payload");
    res.json(await predictBestSendTime(parsed.data));
  } catch (e) {
    next(e);
  }
}

const SpamSchema = z.object({
  message: z.string().min(1),
  recentPerMinute: z.number().min(0).default(0),
});

export async function postDetectSpam(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = SpamSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid payload");
    res.json(await detectSpam(parsed.data));
  } catch (e) {
    next(e);
  }
}

const EngagementSchema = z.object({
  message: z.string().min(1),
  channel: z.string().min(1),
  userSegment: z.string().optional(),
});

export async function postPredictEngagement(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = EngagementSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid payload");
    res.json(await predictEngagement(parsed.data));
  } catch (e) {
    next(e);
  }
}

