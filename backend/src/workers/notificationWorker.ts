import { Worker, QueueEvents, Job } from "bullmq";
import { JOB_DELIVER_NOTIFICATION, QUEUE_NOTIFICATIONS } from "../queues/names.js";
import { NotificationModel } from "../models/Notification.js";
import { logger } from "../config/logger.js";
import { deliverNotificationChannels } from "../services/deliveryService.js";
import { deadLetterQueue } from "../queues/deadLetterQueue.js";
import { env } from "../config/env.js";

export function startNotificationWorker() {
  const worker = new Worker(
    QUEUE_NOTIFICATIONS,
    async (job: Job) => {
      if (job.name !== JOB_DELIVER_NOTIFICATION) return;
      const { notificationId } = job.data as { notificationId: string };

      const notif = await NotificationModel.findById(notificationId);
      if (!notif) {
        logger.warn({ notificationId }, "Notification missing; skipping");
        return;
      }

      notif.status = "PROCESSING";
      await notif.save();

      await deliverNotificationChannels({
        notificationId: notif._id.toString(),
        userId: notif.userId.toString(),
        type: notif.type,
        channels: notif.channels,
        payload: notif.payload as any,
        attempt: job.attemptsMade + 1,
      });

      notif.status = "SENT";
      await notif.save();
    },
    { connection: { url: env.redisUrl }, concurrency: 50 }
  );

  worker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "Job completed");
  });
  worker.on("failed", (job, err) => {
    logger.warn({ jobId: job?.id, attemptsMade: job?.attemptsMade, err: err?.message }, "Job failed");
  });

  const events = new QueueEvents(QUEUE_NOTIFICATIONS, { connection: { url: env.redisUrl } });
  events.on("failed", async ({ jobId, failedReason }) => {
    const job = await worker.getJob(jobId);
    if (!job) return;
    const attemptsMade = job.attemptsMade;
    const total = job.opts.attempts ?? 1;
    if (attemptsMade >= total) {
      const { notificationId } = job.data as { notificationId: string };
      await deadLetterQueue.add("dead_letter", { notificationId, failedReason }, { jobId: `dlq:${notificationId}:${Date.now()}` });
      await NotificationModel.updateOne({ _id: notificationId }, { $set: { status: "FAILED" } });
      logger.error({ notificationId, failedReason }, "Moved to DLQ");
    }
  });

  logger.info("Notification worker started");
  return { worker, events };
}

