import { Queue } from "bullmq";
import { JOB_DELIVER_NOTIFICATION, QUEUE_NOTIFICATIONS } from "./names.js";
import { env } from "../config/env.js";

export const notificationQueue =
  env.nodeEnv === "test"
    ? ({
        getJobCounts: async () => ({ waiting: 0, active: 0, delayed: 0, completed: 0, failed: 0 }),
        getJob: async () => null,
        add: async () => ({}),
      } as any)
    : new Queue(QUEUE_NOTIFICATIONS, {
        connection: { url: env.redisUrl },
        defaultJobOptions: {
          removeOnComplete: 1000,
          removeOnFail: 5000,
          attempts: env.deliveryMaxAttempts,
          backoff: { type: "exponential", delay: 5000 },
        },
      });

export async function enqueueNotificationJob(params: {
  notificationId: string;
  scheduledAt?: Date;
}) {
  const delay =
    params.scheduledAt && params.scheduledAt.getTime() > Date.now()
      ? params.scheduledAt.getTime() - Date.now()
      : 0;

  return notificationQueue.add(
    JOB_DELIVER_NOTIFICATION,
    { notificationId: params.notificationId },
    { delay, jobId: params.notificationId }
  );
}

