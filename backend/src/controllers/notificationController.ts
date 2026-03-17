import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateNotificationSchema, createBatchNotifications, createNotification } from "../services/notificationService.js";
import { NotificationModel } from "../models/Notification.js";
import { NotificationLogModel } from "../models/NotificationLog.js";
import { ValidationError } from "../utils/errors.js";

export async function postNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = CreateNotificationSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues.map((i) => i.message).join("; "));
    const created = await createNotification(parsed.data);
    res.status(201).json({ notification: created });
  } catch (e) {
    next(e);
  }
}

const BatchSchema = z.object({
  notifications: z.array(CreateNotificationSchema).min(1),
});

export async function postBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = BatchSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError("Invalid batch payload");
    const created = await createBatchNotifications(parsed.data.notifications);
    res.status(201).json({ notifications: created });
  } catch (e) {
    next(e);
  }
}

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, status, type, limit = "50", offset = "0" } = req.query as any;
    const q: any = {};
    if (userId) q.userId = userId;
    if (status) q.status = status;
    if (type) q.type = type;

    const docs = await NotificationModel.find(q)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Math.min(Number(limit), 200))
      .lean();
    res.json({ notifications: docs });
  } catch (e) {
    next(e);
  }
}

export async function getNotificationLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { notificationId } = req.params;
    const logs = await NotificationLogModel.find({ notificationId }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ logs });
  } catch (e) {
    next(e);
  }
}

