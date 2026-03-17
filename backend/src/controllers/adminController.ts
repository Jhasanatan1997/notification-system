import type { Request, Response, NextFunction } from "express";
import { notificationQueue } from "../queues/notificationQueue.js";
import { NotificationModel } from "../models/Notification.js";
import { NotificationLogModel } from "../models/NotificationLog.js";

export async function getOverview(_req: Request, res: Response, next: NextFunction) {
  try {
    const [total, sent, failed, queued] = await Promise.all([
      NotificationModel.countDocuments({}),
      NotificationModel.countDocuments({ status: "SENT" }),
      NotificationModel.countDocuments({ status: "FAILED" }),
      NotificationModel.countDocuments({ status: "QUEUED" }),
    ]);

    const queueCounts = await notificationQueue.getJobCounts("waiting", "active", "delayed", "completed", "failed");
    res.json({ totals: { total, sent, failed, queued }, queue: queueCounts });
  } catch (e) {
    next(e);
  }
}

export async function searchLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { channel, status, notificationId, limit = "50", offset = "0" } = req.query as any;
    const q: any = {};
    if (channel) q.channel = channel;
    if (status) q.status = status;
    if (notificationId) q.notificationId = notificationId;

    const logs = await NotificationLogModel.find(q)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Math.min(Number(limit), 200))
      .lean();
    res.json({ logs });
  } catch (e) {
    next(e);
  }
}

export async function retryNotification(req: Request, res: Response, next: NextFunction) {
  try {
    const { notificationId } = req.params;
    const job = await notificationQueue.getJob(notificationId);
    if (job) {
      await job.retry();
      return res.json({ ok: true, message: "Retried existing job" });
    }
    // If no job exists (e.g. removed), re-enqueue by id
    await notificationQueue.add(
      "deliver_notification",
      { notificationId },
      { jobId: notificationId }
    );
    res.json({ ok: true, message: "Re-enqueued job" });
  } catch (e) {
    next(e);
  }
}

