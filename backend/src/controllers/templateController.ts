import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TemplateModel } from "../models/Template.js";
import { ValidationError } from "../utils/errors.js";

const TemplateUpsertSchema = z.object({
  type: z.string().min(1),
  channel: z.enum(["email", "sms", "push", "inapp"]),
  templateBody: z.string().min(1),
});

export async function listTemplates(_req: Request, res: Response, next: NextFunction) {
  try {
    const templates = await TemplateModel.find({}).sort({ updatedAt: -1 }).limit(500).lean();
    res.json({ templates });
  } catch (e) {
    next(e);
  }
}

export async function upsertTemplate(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = TemplateUpsertSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid template payload");
    const doc = await TemplateModel.findOneAndUpdate(
      { type: parsed.data.type, channel: parsed.data.channel },
      { $set: { templateBody: parsed.data.templateBody } },
      { upsert: true, new: true }
    ).lean();
    res.json({ template: doc });
  } catch (e) {
    next(e);
  }
}

export async function deleteTemplate(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, channel } = req.params as any;
    if (!type || !channel) throw new ValidationError("Missing type/channel");
    await TemplateModel.deleteOne({ type, channel });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

