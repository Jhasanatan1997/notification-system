import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PreferenceModel } from "../models/Preference.js";
import { ValidationError } from "../utils/errors.js";

const UpsertPrefSchema = z.object({
  notificationType: z.string().min(1),
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
});

export async function listUserPreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const prefs = await PreferenceModel.find({ userId }).sort({ notificationType: 1 }).limit(1000).lean();
    res.json({ preferences: prefs });
  } catch (e) {
    next(e);
  }
}

export async function upsertUserPreference(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const parsed = UpsertPrefSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid preference payload");
    const pref = await PreferenceModel.findOneAndUpdate(
      { userId, notificationType: parsed.data.notificationType },
      {
        $set: {
          emailEnabled: parsed.data.emailEnabled,
          smsEnabled: parsed.data.smsEnabled,
          pushEnabled: parsed.data.pushEnabled,
          inAppEnabled: parsed.data.inAppEnabled,
        },
      },
      { upsert: true, new: true }
    ).lean();
    res.json({ preference: pref });
  } catch (e) {
    next(e);
  }
}

